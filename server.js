// import  packages express voor de server en liqjs voor de templates
import express from 'express'
import { Liquid } from 'liquidjs'

//app configureren

// maak nieuwe express applicatie aan
const app = express()

//formdata lezen via req.body
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public')) //maakt de public map toegankelijk voor de browser

//maak een nieuwe liquid engine aan
const engine = new Liquid()
app.engine('liquid', engine.express())
app.set('views', './views') // vertelt express waar liquid templates staan


//------------------------------GET route nieuwsoverzicht----------------------------------
app.get('/nieuws', async function (req, res) {
    //haal nieuwsartikelen uit directus op inclusief hero afbeelding afmetingen
    const newsRes = await fetch('https://fdnd-agency.directus.app/items/adconnect_news?fields=*,hero.*')
    const newsData = await newsRes.json()
    res.render('nieuws.liquid', { news: newsData.data })
})

// -------------------nieuws detail pagina GET--------------------------------
app.get('/nieuws/:uuid', async function (req, res) {
    const uuid = req.params.uuid
    // filter juiste artikel op basis van de uuid, inclusief hero afmetingen en comments
    const newsRes = await fetch(`https://fdnd-agency.directus.app/items/adconnect_news?filter[uuid][_eq]=${uuid}&fields=*,comments.*,hero.*`)
    const newsData = await newsRes.json()
    res.render('nieuws-detail.liquid', {
        article: newsData.data[0],
        succes: req.query.succes === 'true',
        error: req.query.error === 'true'
    })
})

// --------------post route reactie opslaan----------------------
// Sla de reactie op in Directus via een POST request
// Content-Type: application/json vertelt de server dat we JSON sturen
app.post('/nieuws/:uuid', async function (req, res) {
    const uuid = req.params.uuid
    // enhancement var checkt als enhanced in url staat
    const enhanced = req.query.enhanced || ''

    try {
        await fetch('https://fdnd-agency.directus.app/items/adconnect_news_comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: req.body.name,
                comment: req.body.comment,
                news: uuid
            })
        })

        // nieuwe comments ophalen na posten inclusief hero afmetingen
        const newsRes = await fetch(`https://fdnd-agency.directus.app/items/adconnect_news?filter[uuid][_eq]=${uuid}&fields=*,comments.*,hero.*`)
        const newsData = await newsRes.json()

        if (enhanced) {
            // render alleen partial voor JS fetch
            res.render('partials/reacties.liquid', {
                article: newsData.data[0],
                succes: true,
                error: false
            })
        } else {
            // normale redirect
            res.redirect(303, `/nieuws/${uuid}?succes=true`)
        }

    } catch (error) {
        if (enhanced) {
            res.render('partials/reacties.liquid', {
                article: newsData.data[0],
                succes: false,
                error: true
            })
        } else {
            res.redirect(303, `/nieuws/${uuid}?error=true`)
        }
    }
})

// -------------404 error-----------------------
// moet altijd als laatste staan
app.use((req, res) => {
    res.status(404).render('error.liquid', {
        statusCode: 404,
        message: "Sorry, we kunnen deze pagina niet vinden!"
    })
})

// ------------server starten----------
// process.env.PORT is voor als de app gehost wordt
// || 8000 is de fallback voor lokaal ontwikkelen
app.set('port', process.env.PORT || 8000)
app.listen(app.get('port'), function () {
    console.log(`Application started on http://localhost:${app.get('port')}`)
})
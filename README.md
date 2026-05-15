
# Enhanced website
Ontwerp en maak een interactieve website die snel laadt en prettig te gebruiken is.

De instructie vind je in: [INSTRUCTIONS.md](https://github.com/fdnd-task/enhanced-website/blob/main/docs/INSTRUCTIONS.md)


# Ad Connect — Nieuws met reacties

Ontwerp en maak een interactieve website die snel laadt en prettig te gebruiken is.

## Inhoudsopgave

- [Beschrijving](#beschrijving)
- [Gebruik](#gebruik)
- [Kenmerken](#kenmerken)
- [Bronnen](#bronnen)
- [Licentie](#licentie)

## Beschrijving

Dit project is een nieuwspagina voor het Overlegplatform Ad's. Bezoekers kunnen nieuwsartikelen lezen en reacties achterlaten op een artikel. De website is gebouwd met Progressive Enhancement en de website werkt voor iedereen, op elk apparaat, in elke browser.

 Live website: https://user-experience-enhanced-website-b19g.onrender.com/nieuws


<img width="1896" height="924" alt="image" src="https://github.com/user-attachments/assets/0ad4420b-19f7-422b-b36b-0316ab049b23" />




https://github.com/user-attachments/assets/a7a97c55-73c1-4d4f-a7e1-1942f286204a



## Gebruik

De website heeft de volgende pagina's:

**Nieuwsoverzicht** `/nieuws`: overzicht van alle nieuwsartikelen met afbeelding, titel en beschrijving.

**Nieuwsdetail** `/nieuws/:uuid`: het volledige artikel met reacties en een formulier om een reactie achter te laten.

**User Story:**
- Als bezoeker wil ik een reactie kunnen plaatsen op een nieuwsbericht, zodat ik mijn mening kan delen over een nieuwsbericht.

De interactie werkt als volgt:
1. Bezoeker gaat naar een nieuwsartikel
2. Bezoeker vult naam en reactie in
3. Bezoeker klikt op "Verstuur reactie"
4. Reactie wordt opgeslagen in Directus
5. Bezoeker ziet de nieuwe reactie direct zonder pagina reload

UI states:
<img width="699" height="870" alt="image" src="https://github.com/user-attachments/assets/2891d191-7d2e-4ddd-b5d3-f0c697e02764" />


https://github.com/user-attachments/assets/da320050-d2ae-4f2c-b6ab-c0a98d229dd0




## Kenmerken

### Technieken

Deze website is gebouwd met:
- **NodeJS** - server-side JavaScript runtime
- **Express** - web framework voor de routes en server
- **Liquid** - templating engine voor de HTML pagina's
- **Directus** - REST API voor het ophalen en opslaan van data
- **Client-side JavaScript** - enhancement voor het formulier

### Progressive Enhancement

De website is gebouwd in drie lagen:

**Laag 1 — HTML**
Het formulier werkt volledig zonder CSS en JavaScript via een normale HTML POST dus als de Progressive enhancement niet werkt, werken de corefunctionalities nog steeds. De server vangt dit op en slaat de data op in Directus via de REST API, waarna de gebruiker wordt doorgestuurd met een 303 redirect.

```js
// POST route in server.js
app.post('/nieuws/:uuid', async function (req, res) {
  // data opslaan in Directus
  res.redirect(303, `/nieuws/${uuid}?succes=true`)
})
```

**Laag 2 — CSS**
Styling met de huisstijl van de opdrachtgever. Responsive images met het `<picture>` element zorgen voor betere performance. Er wordt naar User preferences gekeken m.b.v. `prefers-reduced-motion` en `prefers-color-scheme`.

```css
@media (prefers-reduced-motion: reduce) {
  .nieuws-kaart, #reacties button {
    transition: none;
    animation: none;
  }
}
```

**Laag 3 — Client-side JavaScript**
Als enhancement verstuurt JavaScript het formulier via `fetch` zonder pagina refresh. `type="module"` is de feature detection, browsers die dit niet kennen voeren het script niet uit en vallen terug op laag 1 dus de html.

```js
// Event delegation luistert op het hele document
document.addEventListener('submit', async function(event) {
  const form = event.target
  if (!form.hasAttribute('data-enhanced')) return
  event.preventDefault()
  // loading state tonen
  button.textContent = 'Laden...'
  button.disabled = true
  // data versturen via fetch
  const response = await fetch(form.action + '?' + params.toString(), {
    method: form.method,
    body: new URLSearchParams(formData)
  })
  // DOM updaten met nieuwe reacties
  form.closest('[data-enhanced]').outerHTML = responseText
})
```

### UI States

De detailpagina heeft vier states:

**Ideal state**: reacties worden getoond
```liquid
{% for comment in article.comments %}
  <li class="reactie">
    <strong>{{ comment.name }}</strong>
    <p>{{ comment.comment }}</p>
  </li>
{% endfor %}
```

**Empty state**: nog geen reacties
```liquid
{% else %}
  <p>Wees de eerste die reageert!</p>
{% endif %}
```

**Success state**: reactie geplaatst zonder pagina reload
```liquid
{% if succes %}
  <p class="success-melding">Je reactie is geplaatst!</p>
{% endif %}
```

**Error state**: iets ging fout
```liquid
{% if error %}
  <p class="error-melding">Er ging iets fout, probeer het opnieuw.</p>
{% endif %}
```

### Performance

De website scoort **100/100** op Lighthouse Performance voor zowel de overzichtspagina als de detailpagina.

Toegepaste performance technieken:
- Responsive images met `<picture>`, WebP en AVIF formaten
- Echte `width` en `height` van afbeeldingen uit Directus om layout shifts te voorkomen
- `loading="lazy"` voor afbeeldingen onderaan de pagina
- `loading="eager"` voor de hero afbeelding bovenaan

```html
<picture>
  <source type="image/avif" srcset="...?format=avif&width=800">
  <source type="image/webp" srcset="...?format=webp&width=800">
  <img src="...?width=800" 
       width="{{ article.hero.width }}" 
       height="{{ article.hero.height }}"
       loading="lazy">
</picture>
```



## Bronnen


- [Fetch API @ MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [FormData @ MDN](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [Event Delegation @ MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling)
- [DOMParser @ MDN](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser)
- [View Transition API @ MDN](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using)
- [prefers-reduced-motion @ MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [prefers-color-scheme @ MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [Responsive Images @ MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images)
- [scrollIntoView @ MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)
- [setTimeout @ MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout)
- [type="module" @ MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Lighthouse performance scoring](https://developer.chrome.com/docs/lighthouse/performance/)


## Licentie

This project is licensed under the terms of the [MIT license](./LICENSE).
## Bronnen

## Licentie

This project is licensed under the terms of the [MIT license](./LICENSE).

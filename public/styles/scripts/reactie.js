// Luister op het hele document in plaats van het formulier zelf
document.addEventListener('submit', async function(event) {

  const form = event.target

  // Alleen enhancen als het formulier data-enhanced heeft
  if (!form.hasAttribute('data-enhanced')) {
    return
  }

  // Voorkom standaard browser submit
  event.preventDefault()

  const button = form.querySelector('button[type="submit"]')

  // loading state
  button.textContent = 'Laden...'
  button.disabled = true
  button.classList.add('loading')

  // verzamel formdata
  const formData = new FormData(form)
  const params = new URLSearchParams(formData)

  // voeg enhanced toe aan URL
  params.set('enhanced', 'true')

  // stuur data naar server
  const response = await fetch(form.action + '?' + params.toString(), {
    method: form.method,
    body: new URLSearchParams(formData)
  })

  // haal HTML response op
  const responseText = await response.text()

  // check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // update DOM
  if (document.startViewTransition && !prefersReducedMotion) {
    document.startViewTransition(function() {
      form.closest('[data-enhanced]').outerHTML = responseText
    })
  } else {
    form.closest('[data-enhanced]').outerHTML = responseText
  }

  // scroll naar success melding
  setTimeout(function() {
    const melding = document.querySelector('.success-melding')
    if (melding) {
      melding.scrollIntoView({ behavior: 'smooth' })
    }
  }, 100)

  // success melding weghalen na 3 seconden
  setTimeout(function() {
    const melding = document.querySelector('.success-melding')
    if (melding) {
      melding.remove()
    }
  }, 3000)

})
export function successPage() {
  const email = new URLSearchParams(window.location.search).get("email")

  if (!email) {
    return console.warn("No email address provided")
  }
  
  const emailRenderTarget = document.querySelector<HTMLElement>("[data-js-target='emailConfirmation']")
  if (emailRenderTarget) {
    emailRenderTarget.innerText = email
  }
}

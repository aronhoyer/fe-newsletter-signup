function validateEmail(input: HTMLInputElement) {
  if (!input.value.trim() || !input.validity.valid || input.validity.typeMismatch) {
    input.setCustomValidity("Valid email required");

    const parent = input.parentNode as HTMLDivElement | null
    if (parent) {
      parent.dataset.invalid = ""
    }

    if (!parent?.querySelector("[data-js-target='inputError']")) {
      const errorMessage = document.createElement("span")
      errorMessage.innerText = input.validationMessage
      errorMessage.className = "input__error"
      errorMessage.dataset.jsTarget = "inputError"

      input.parentNode?.querySelector(".input__header")?.appendChild(errorMessage)
    }

    return false
  }

  return true
}

export function homePage() {
  const form = document.querySelector<HTMLFormElement>("[data-js-target='signupForm']")

  if (!form) {
    return console.warn("No signup form found")
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault()
    const target = e.target as HTMLFormElement
    const emailInput = target.querySelector<HTMLInputElement>("input[type='email']")

    if (!emailInput) {
      return console.warn("No email input found")
    }

    if (validateEmail(emailInput)) {
      const url = new URL("/success", window.location.href)
      url.search = new URLSearchParams({ email: emailInput.value }).toString()
      window.location.replace(url)
    } else {
      emailInput.addEventListener("input", (_e) => {
        const parent = emailInput.parentNode as HTMLDivElement | null

        if (!parent) {
          return console.warn("Input field", emailInput, "has no parent item")
        }

        delete parent.dataset.invalid

        const errorMessage = parent.querySelector("[data-js-target='inputError']")

        if (errorMessage) {
          parent.querySelector(".input__header")?.removeChild(errorMessage)
          emailInput.setCustomValidity("")
        }
      })
    }
  })
}

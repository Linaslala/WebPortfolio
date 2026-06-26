// GLOBAL TOGGLE MENU

class ResponsiveNav {
    constructor(root) {
        this.root = root;
        this.toggle = root.querySelector('[data-nav-toggle]');
        this.menu = root.querySelector('[data-nav-menu]');
        this.links = root.querySelectorAll('.site-nav__link');

        if (!this.toggle || !this.menu) return;
        
        this.handleToggle = this.handleToggle.bind(this);
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleLinkClick = this.handleLinkClick.bind(this);

        this.toggle.addEventListener('click', this.handleToggle);
        document.addEventListener('click', this.handleDocumentClick);
        window.addEventListener('resize', this.handleResize);

        this.links.forEach(link => {
        link.addEventListener('click', this.handleLinkClick);
        });
    }
  
    isDesktop() {
        return window.matchMedia('(min-width: 48rem)').matches;
    }

    open() {
        this.root.classList.add('is-open');
        this.toggle.setAttribute('aria-expanded', 'true');
    }

    close() {
        this.root.classList.remove('is-open');
        this.toggle.setAttribute('aria-expanded', 'false');
    }

    handleToggle(event) {
        event.stopPropagation();
        const isOpen = this.root.classList.contains('is-open');
        isOpen ? this.close() : this.open();
    }

    handleDocumentClick(event) {
        if (!this.root.contains(event.target)) {
        this.close();
        }
    }

    handleResize() {
        if (this.isDesktop()) {
        this.close();
        }
    }

    handleLinkClick() {
        if (!this.isDesktop()) {
        this.close();
        }
    }
    }

    document.querySelectorAll('[data-nav]').forEach(nav => {
    new ResponsiveNav(nav);
});


// CONTACT FORM VALIDATION + WEB3FORMS SUBMIT

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  const successMessage = document.getElementById("formSuccess");
  const submitError = document.getElementById("formSubmitError");
  const submitButton = document.getElementById("contactSubmitButton");

  const fields = {
    name: contactForm.elements["name"],
    email: contactForm.elements["email"],
    message: contactForm.elements["message"]
  };

  const errorEls = {
    name: contactForm.querySelector('[data-error-for="name"]'),
    email: contactForm.querySelector('[data-error-for="email"]'),
    message: contactForm.querySelector('[data-error-for="message"]')
  };

  function setError(fieldName, message) {
    const field = fields[fieldName];
    const errorEl = errorEls[fieldName];

    field.setAttribute("aria-invalid", "true");
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function clearError(fieldName) {
    const field = fields[fieldName];
    const errorEl = errorEls[fieldName];

    field.removeAttribute("aria-invalid");
    errorEl.textContent = "";
    errorEl.hidden = true;
  }

  function validateName() {
    const value = fields.name.value.trim();

    if (!value) {
      setError("name", "Ange ditt namn.");
      return false;
    }

    if (value.length < 2) {
      setError("name", "Namnet måste vara minst 2 tecken.");
      return false;
    }

    clearError("name");
    return true;
  }

  function validateEmail() {
    const value = fields.email.value.trim();

    if (!value) {
      setError("email", "Ange din e-postadress.");
      return false;
    }

    if (!fields.email.checkValidity()) {
      setError("email", "Ange en giltig e-postadress.");
      return false;
    }

    clearError("email");
    return true;
  }

  function validateMessage() {
    const value = fields.message.value.trim();

    if (!value) {
      setError("message", "Skriv ett meddelande.");
      return false;
    }

    if (value.length < 10) {
      setError("message", "Meddelandet måste vara minst 10 tecken.");
      return false;
    }

    clearError("message");
    return true;
  }

  fields.name.addEventListener("input", validateName);
  fields.email.addEventListener("input", validateEmail);
  fields.message.addEventListener("input", validateMessage);

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    successMessage.hidden = true;
    submitError.hidden = true;
    submitError.textContent = "";

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      return;
    }

    const formData = new FormData(contactForm);
    const json = JSON.stringify(Object.fromEntries(formData));

    submitButton.disabled = true;
    submitButton.textContent = "Skickar...";

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: json
      });

      const result = await response.json();

      if (response.status === 200 && result.success) {
        successMessage.hidden = false;
        contactForm.reset();

        clearError("name");
        clearError("email");
        clearError("message");
      } else {
        submitError.textContent = result.message || "Något gick fel. Försök igen.";
        submitError.hidden = false;
      }
    } catch (error) {
      submitError.textContent = "Något gick fel vid skickning. Försök igen.";
      submitError.hidden = false;
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Skicka";
    }
  });
}





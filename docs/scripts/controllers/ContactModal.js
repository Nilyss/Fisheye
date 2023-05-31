class ContactModal {
  constructor() {
    this.body = document.querySelector('main');
    this.contactButton = null;
    this.closeButton = null;
    this.closeSVG = '../public/assets/icons/close.svg';
    // Regex with 2 to 20 characters, only letters
    this.nameRegex = /^[a-zA-Z]{2,20}$/;
    // Regex for email validation (RFC 5322 Official Standard)
    this.emailRegex =
      /^((\w\w+)[.\-]?)+@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // Regex with 2 to 300 characters, letters, numbers, punctuation, spaces, line breaks
    this.messageRegex = /^[\p{L}\p{N}\p{P}\p{Z}\n\r]*$/u;

    this.errorMessages = {
      'first-name':
        'Prénom invalide: 2 à 20 caractères, uniquement des lettres.',
      'last-name': 'Nom invalide : 2 à 20 caractères, uniquement des lettres.',
      email: 'Veuillez entrer une adresse email valide.',
      message: 'Message invalide : 2 à 300 characters maximum.',
    };
  }

  // Display the contact modal
  displayContactModal() {
    const photographerName = sessionStorage.getItem('photographerName');
    const contactModal = document.createElement('section');
    contactModal.classList.add('contactModal', 'hidden');
    contactModal.setAttribute('role', 'dialog');
    contactModal.setAttribute('aria-modal', 'true');
    contactModal.setAttribute('aria-label', 'Contactez-moi');

    // Create modal elements
    const headerDiv = document.createElement('div');
    headerDiv.classList.add('contactModal__header');

    const titleWrapperDiv = document.createElement('div');
    titleWrapperDiv.classList.add('contactModal__header__titleWrapper');

    const h1 = document.createElement('h1');
    h1.classList.add('contactModal__header__title');
    h1.textContent = 'Contactez-moi';

    const closeButton = document.createElement('button');
    closeButton.classList.add(
      'contactModal__header__titleWrapper__closeButtonWrapper'
    );

    const img = document.createElement('img');
    img.classList.add(
      'contactModal__header__titleWrapper__closeButtonWrapper__icon'
    );
    img.src = this.closeSVG;
    img.alt = 'Fermer la fenêtre de contact';

    const p = document.createElement('p');
    p.classList.add('contactModal__header__photographerName');
    p.textContent = photographerName; // This is now safe from XSS

    // Append child elements
    closeButton.appendChild(img);
    titleWrapperDiv.appendChild(h1);
    titleWrapperDiv.appendChild(closeButton);
    headerDiv.appendChild(titleWrapperDiv);
    headerDiv.appendChild(p);

    const bodyDiv = document.createElement('div');
    bodyDiv.classList.add('contactModal__body');

    const form = document.createElement('form');
    form.classList.add('contactModal__body__form');

    // create all inputs and labels
    const fields = ['first-name', 'last-name', 'email', 'message'];
    const labels = ['Prénom', 'Nom', 'Email', 'Votre message'];
    const types = ['text', 'text', 'email', 'textarea'];

    // Store the form inputs for later retrieval
    this.formInputs = {};

    // Create all the form inputs from the fields array
    for (let i = 0; i < fields.length; i++) {
      const label = document.createElement('label');
      label.classList.add('contactModal__body__form__label');
      label.htmlFor = fields[i];
      label.textContent = labels[i];

      let input;
      if (types[i] !== 'textarea') {
        input = document.createElement('input');
        input.type = types[i];
      } else {
        input = document.createElement('textarea');
        input.classList.add('contactModal__body__form__textarea');
      }
      input.classList.add('contactModal__body__form__input');
      input.id = fields[i];
      input.name = fields[i];
      input.required = true;

      // Create error message element and hide it by default
      const errorSpan = document.createElement('span');
      errorSpan.classList.add('contactModal__body__form__error');
      errorSpan.style.color = 'red';
      errorSpan.style.display = 'none';

      // Save a reference to the input element
      this.formInputs[fields[i]] = { input, errorSpan };
      form.appendChild(label);
      form.appendChild(input);
      form.appendChild(errorSpan);
    }

    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('contactModal__body__form__buttonWrapper');

    const button = document.createElement('button');
    button.classList.add('contactModal__body__form__buttonWrapper__button');
    button.type = 'submit';
    button.textContent = 'Envoyer';

    buttonWrapper.appendChild(button);

    form.appendChild(buttonWrapper);

    bodyDiv.appendChild(form);

    contactModal.appendChild(headerDiv);
    contactModal.appendChild(bodyDiv);

    this.body.appendChild(contactModal);

    // Add a submit event listener to the form
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      //  Input validation before creating the message content
      let isValid = true;
      for (let field in this.formInputs) {
        isValid = this.validateInput(field) && isValid;
      }

      if (!isValid) {
        return;
      }

      const messageContent = {
        firstName: this.formInputs['first-name'].input.value,
        lastName: this.formInputs['last-name'].input.value,
        email: this.formInputs['email'].input.value,
        message: this.formInputs['message'].input.value,
      };

      // TODO: Send the message content to the API
      console.log(messageContent);
    });

    this.closeButton = closeButton;

    // Close the contact modal when the user click on the close icon
    this.closeButton.addEventListener('click', () => {
      this.closeContactModal();
    });

    // timeout to remove the modal (avoid transition bug)
    setTimeout(() => {
      contactModal.classList.remove('hidden');
      contactModal.classList.add('visible');
    }, 50);
  }

  // Validate input and display/hide error message
  validateInput(field) {
    let isValid;
    switch (field) {
      case 'first-name':
      case 'last-name':
        isValid = this.nameRegex.test(this.formInputs[field].input.value);
        break;
      case 'email':
        isValid = this.emailRegex.test(this.formInputs[field].input.value);
        break;
      case 'message':
        isValid = this.formInputs[field].input.value.trim() !== '';
        break;
    }

    if (!isValid) {
      this.formInputs[field].input.classList.add('error');
      this.formInputs[field].errorSpan.textContent = this.errorMessages[field];
      this.formInputs[field].errorSpan.style.display = 'block';
    } else {
      this.formInputs[field].input.classList.remove('error');
      this.formInputs[field].input.classList.add('valid');
      this.formInputs[field].errorSpan.textContent = '';
      this.formInputs[field].errorSpan.style.display = 'none';
    }

    return isValid;
  }

  // Close the contact modal
  closeContactModal() {
    const contactModal = document.querySelector('.contactModal');
    contactModal.classList.add('hidden');
    contactModal.classList.remove('visible');

    setTimeout(() => {
      this.body.removeChild(contactModal);
    }, 500);
  }

  // event listeners
  initEventListeners() {
    // Display the contact modal when the user click on the contact button
    this.contactButton.addEventListener('click', () => {
      this.displayContactModal();
    });
  }

  async initApp() {
    try {
      this.contactButton = document.querySelector(
        '.photographerBanner__contactWrapper__contactBtn'
      );
      if (this.contactButton) {
        this.initEventListeners();
      }
    } catch (error) {
      console.error(
        'An error occurred while initializing the contact Modal: ',
        error
      );
    }
  }
}

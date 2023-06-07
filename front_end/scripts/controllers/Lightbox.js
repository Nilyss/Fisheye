class Lightbox {
  constructor() {
    this.body = document.querySelector('main');
    this.lightbox = null;
    this.mediasLinks = null;
    this.closeButton = null;
    this.closeSVG = '../public/assets/icons/close--alt.svg';
    this.leftArrowSVG = '../public/assets/icons/arrowLeft.svg';
    this.rightArrowSVG = '../public/assets/icons/arrowRight.svg';
    this.medias = null;
  }

  displayLightbox(mediaId) {
    this.medias = JSON.parse(sessionStorage.getItem('medias'));
    const currentMedia = this.medias.find((media) => media.id === mediaId);

    this.lightbox = document.createElement('section');
    this.lightbox.classList.add('lightbox', 'hidden');

    const leftWrapper = document.createElement('div');
    leftWrapper.classList.add('lightbox__leftWrapper');

    const goPreviousButton = document.createElement('button');
    goPreviousButton.classList.add('lightbox__leftWrapper__goPreviousButton');

    const goPreviousButtonImg = document.createElement('img');
    goPreviousButtonImg.classList.add('lightbox__leftWrapper__goPreviousButton__img');
    goPreviousButtonImg.src = this.leftArrowSVG;
    goPreviousButtonImg.alt = 'Previous';

    goPreviousButton.appendChild(goPreviousButtonImg);
    leftWrapper.appendChild(goPreviousButton);

    const middleWrapper = document.createElement('div');
    middleWrapper.classList.add('lightbox__middleWrapper');

    const mediaWrapper = document.createElement('figure');
    mediaWrapper.classList.add('lightbox__middleWrapper__mediaWrapper');

    const mediaImg = document.createElement('img');
    mediaImg.classList.add('lightbox__middleWrapper__mediaWrapper__media');
    mediaImg.src = `../public/assets/usersMedias/${currentMedia.photographerId}/${currentMedia.image}`;
    mediaImg.alt = `photographer media ${currentMedia.name}`;

    mediaWrapper.appendChild(mediaImg);
    middleWrapper.appendChild(mediaWrapper);

    const rightWrapper = document.createElement('div');
    rightWrapper.classList.add('lightbox__rightWrapper');

    this.closeButton = document.createElement('button');
    this.closeButton.classList.add('lightbox__rightWrapper__closeButton');

    const closeButtonImg = document.createElement('img');
    closeButtonImg.classList.add('lightbox__rightWrapper__closeButton__img');
    closeButtonImg.src = this.closeSVG;
    closeButtonImg.alt = 'Close Lightbox';

    this.closeButton.appendChild(closeButtonImg);
    rightWrapper.appendChild(this.closeButton);

    const goNextButton = document.createElement('button');
    goNextButton.classList.add('lightbox__rightWrapper__goNextButton');

    const goNextButtonImg = document.createElement('img');
    goNextButtonImg.classList.add('lightbox__rightWrapper__goNextButton__img');
    goNextButtonImg.src = this.rightArrowSVG;
    goNextButtonImg.alt = 'Next';

    goNextButton.appendChild(goNextButtonImg);
    rightWrapper.appendChild(goNextButton);

    this.lightbox.appendChild(leftWrapper);
    this.lightbox.appendChild(middleWrapper);
    this.lightbox.appendChild(rightWrapper);

    this.body.appendChild(this.lightbox);

    // timeout to remove the modal (avoid transition bug)
    setTimeout(() => {
      this.lightbox.classList.remove('hidden');
      this.lightbox.classList.add('visible');
    }, 50);

    this.closeButton.addEventListener('click', () => {
      this.closeLightbox();
    });
  }

  // Close the lightbox
  closeLightbox() {
    if (this.lightbox) {
      this.lightbox.classList.add('hidden');
      this.lightbox.classList.remove('visible');

      setTimeout(() => {
        this.lightbox.remove();
        this.lightbox = null;
      }, 500);
    }
  }

  initEventListeners() {
    this.mediasLinks = document.querySelectorAll('.photographerWork__mediaWrapper__container__link');
    this.mediasLinks.forEach((mediaLink) => {
      mediaLink.addEventListener('click', (event) => {
        event.preventDefault();
        const id = parseInt(event.currentTarget.getAttribute('data-index'));
        this.displayLightbox(id);
      });
    });
  }

  async initApp() {
    try {
      this.mediasLinks = document.querySelectorAll('.photographerWork__mediaWrapper__container__link');
      if (this.mediasLinks) {
        await this.initEventListeners();
      }
    } catch (error) {
      console.error('An error occurred while initializing the lightbox: ', error);
    }
  }
}

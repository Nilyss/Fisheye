class Lightbox {
  constructor() {
    this.main = document.querySelector('main');
    this.lightbox = null;
    this.lightboxWrapper = null;
    this.mediasLinks = null;
    this.closeButton = null;
    this.closeSVG = '../public/assets/icons/close--alt.svg';
    this.leftArrowSVG = '../public/assets/icons/arrowLeft.svg';
    this.rightArrowSVG = '../public/assets/icons/arrowRight.svg';
    this.medias = null;
    this.goNextButton = null;
    this.goPreviousButton = null;
    this.currentIndex = 0;
  }

  displayLightbox(mediaId) {
    this.medias = JSON.parse(sessionStorage.getItem('medias'));
    const currentMedia = this.medias.find((media) => media.id === mediaId);

    this.lightbox = document.createElement('section');
    this.lightbox.classList.add('lightbox', 'hidden');

    this.lightboxWrapper = document.createElement('div');
    this.lightboxWrapper.classList.add('lightboxWrapper');

    const leftWrapper = document.createElement('div');
    leftWrapper.classList.add('lightbox__leftWrapper');

    const goPreviousButton = document.createElement('button');
    goPreviousButton.classList.add('lightbox__leftWrapper__goPreviousButton');

    const goPreviousButtonImg = document.createElement('img');
    goPreviousButtonImg.classList.add(
      'lightbox__leftWrapper__goPreviousButton__img'
    );
    goPreviousButtonImg.src = this.leftArrowSVG;
    goPreviousButtonImg.alt = 'Previous';

    goPreviousButton.appendChild(goPreviousButtonImg);
    leftWrapper.appendChild(goPreviousButton);

    const middleWrapper = document.createElement('div');
    middleWrapper.classList.add('lightbox__middleWrapper');

    const mediaWrapper = document.createElement('figure');
    mediaWrapper.classList.add('lightbox__middleWrapper__mediaWrapper');

    let mediaElement;
    if (currentMedia.image) {
      const img = document.createElement('img');
      img.classList.add('lightbox__middleWrapper__mediaWrapper__media');
      img.src = `../public/assets/usersMedias/${currentMedia.photographerId}/${currentMedia.image}`;
      img.alt = `photographer media ${currentMedia.name}`;
      mediaElement = img;
    } else if (currentMedia.video) {
      const video = document.createElement('video');
      video.classList.add('lightbox__middleWrapper__mediaWrapper__media');
      video.controls = true;
      const source = document.createElement('source');
      source.src = `../public/assets/usersMedias/${currentMedia.photographerId}/${currentMedia.video}`;
      source.type = 'video/mp4';
      video.appendChild(source);
      mediaElement = video;
    }

    mediaWrapper.appendChild(mediaElement);
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

    this.lightbox.appendChild(this.lightboxWrapper);
    this.lightboxWrapper.appendChild(leftWrapper);
    this.lightboxWrapper.appendChild(middleWrapper);
    this.lightboxWrapper.appendChild(rightWrapper);

    this.main.appendChild(this.lightbox);

    // timeout to remove the modal (avoid transition bug)
    setTimeout(() => {
      this.lightbox.classList.remove('hidden');
      this.lightbox.classList.add('visible');
    }, 50);

    this.closeButton.addEventListener('click', () => {
      this.closeLightbox();
    });

    this.goPreviousButton = document.querySelector('.lightbox__leftWrapper__goPreviousButton');
    this.goNextButton = document.querySelector('.lightbox__rightWrapper__goNextButton');

    this.goPreviousButton.addEventListener('click', () => {
      this.currentIndex = (this.currentIndex - 1 + this.medias.length) % this.medias.length;
      this.updateMedia();
    });

    this.goNextButton.addEventListener('click', () => {
      this.currentIndex = (this.currentIndex + 1) % this.medias.length;
      this.updateMedia();
    });
  }

  updateMedia() {
    const currentMedia = this.medias[this.currentIndex];
    const mediaWrapper = document.querySelector('.lightbox__middleWrapper__mediaWrapper');
    const existingMediaElement = mediaWrapper.querySelector('.lightbox__middleWrapper__mediaWrapper__media');

    if (existingMediaElement) {
      // Delete existing media element if there is one
      mediaWrapper.removeChild(existingMediaElement);
    }

    if (currentMedia.image) {
      const img = document.createElement('img');
      img.classList.add('lightbox__middleWrapper__mediaWrapper__media');
      img.src = `../public/assets/usersMedias/${currentMedia.photographerId}/${currentMedia.image}`;
      img.alt = `photographer media ${currentMedia.name}`;
      mediaWrapper.appendChild(img);
    } else if (currentMedia.video) {
      const video = document.createElement('video');
      video.classList.add('lightbox__middleWrapper__mediaWrapper__media');
      video.controls = true;
      const source = document.createElement('source');
      source.src = `../public/assets/usersMedias/${currentMedia.photographerId}/${currentMedia.video}`;
      source.type = 'video/mp4';
      video.appendChild(source);
      mediaWrapper.appendChild(video);
      video.load();
      video.play();
    }
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
    this.mediasLinks = document.querySelectorAll(
      '.photographerWork__mediaWrapper__container__link'
    );
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
      this.mediasLinks = document.querySelectorAll(
        '.photographerWork__mediaWrapper__container__link'
      );
      if (this.mediasLinks) {
        await this.initEventListeners();
      }
    } catch (error) {
      console.error(
        'An error occurred while initializing the lightbox: ',
        error
      );
    }
  }
}

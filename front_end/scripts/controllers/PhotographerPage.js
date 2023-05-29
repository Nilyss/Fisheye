class PhotographerPage {
  constructor() {
    this.photographersService = new PhotographersService();
    this.mediaService = new MediaService();
    this.photographer = null;
    this.medias = null;
    this.photographerWork = document.querySelector('.photographerWork');
    this.photographersBanner = document.querySelector('.photographersBanner');
    this.arrowUp = '../public/assets/icons/arrowUp.svg';
  }

  async getPhotographerData() {
    const urlParams = new URLSearchParams(window.location.search);
    const photographerId = urlParams.get('id');
    const photographers = await this.photographersService.getPhotographers();
    this.photographer = photographers.find(
      (photographer) => photographer.id === parseInt(photographerId)
    );
    this.medias = await this.mediaService.getMedia();
  }

  displayPhotographerBanner() {
    // Adding specific class for some photographers profile picture
    let additionalClass = '';
    if (this.photographer.id === 243) {
      additionalClass = 'firstPhotographer';
    }
    if (
      this.photographer.id === 930 ||
      this.photographer.id === 925 ||
      this.photographer.id === 195
    ) {
      additionalClass = 'portraitPicture';
    }

    this.photographersBanner.innerHTML += `
      <div class="photographerBanner__overviewWrapper">
        <h1 class="photographerBanner__overviewWrapper__name">${this.photographer.name}</h1>
        <p class="photographerBanner__overviewWrapper__location">${this.photographer.city}, ${this.photographer.country}</p>
        <p class="photographerBanner__overviewWrapper__tagline">${this.photographer.tagline}</p>
      </div>
      <div class="photographerBanner__contactWrapper">
        <button class="photographerBanner__contactWrapper__contactBtn" aria-label='Contact Me'>Contactez-moi</button>
      </div>
      <figure class="photographerBanner__pictureWrapper">
        <img
          class="photographerBanner__pictureWrapper__picture ${additionalClass}"
          src="../public/assets/usersPictures/${this.photographer.portrait}"
          alt="${this.photographer.name}"
        />
      </figure>
    `;
  }

  displayFilterButton() {
    let buttonName = 'Popularité';
    this.photographerWork.innerHTML += `
      <div class='photographerWork__filtersWrapper'>
        <p class='photographerWork__filtersWrapper__message'>Trier par</p>
        <div class='photographerWork__filtersWrapper__ButtonWrapper'>        
          <button 
          class='photographerWork__filtersWrapper__ButtonWrapper__button'
          role='button'
          aria-haspopup='listbox' 
          aria-expanded='true'>
          ${buttonName}
            <img src='${this.arrowUp}' alt='fleche haut' />
          </button>
          <ul class='photographerWork__filtersWrapper__ButtonWrapper__elementWrapper'>
            <li class='photographerWork__filtersWrapper__ButtonWrapper__elementWrapper__filters'>Popularité               
              <img src='${this.arrowUp}' alt='fleche haut' />
            </li>
            <li class='photographerWork__filtersWrapper__ButtonWrapper__elementWrapper__filters middleFilter'>Date</li>
            <li class='photographerWork__filtersWrapper__ButtonWrapper__elementWrapper__filters'>Titre</li>   
          </ul>     
        </div>
      </div>
    `;
  }

  displayPhotographerWork() {
    // Display photographer work
    this.photographerWork.innerHTML += `
      <article class='photographerWork__mediaWrapper'></article>
  `;
    const mediaWrapper = document.querySelector(
      '.photographerWork__mediaWrapper'
    );

    const allMedias = [...this.medias.images, ...this.medias.videos];
    const filteredMedias = allMedias.filter(
      (media) => media.photographerId === this.photographer.id
    );

    let html = '';

    filteredMedias.forEach((media) => {
      const mediaType = media.image ? 'image' : 'video';
      const mediaTag =
        mediaType === 'image'
          ? `<img
              class='photographerWork__mediaWrapper__container__media'
              src='../public/assets/usersMedias/${this.photographer.name}/${media[mediaType]}'
              alt=''
           />`
          : `<video
             class='photographerWork__mediaWrapper__container__media'
           >
             <source src='../public/assets/usersMedias/${this.photographer.name}/${media[mediaType]}' type='video/mp4' />
           </video>`;

      html += `
      <figure class='photographerWork__mediaWrapper__container'>
        ${mediaTag}
        <figcaption class='photographerWork__mediaWrapper__container__description'>
          <p class='photographerWork__mediaWrapper__container__description__title'>${media.title}</p>
          <div class='photographerWork__mediaWrapper__container__description__likeWrapper'>
            <p class='photographerWork__mediaWrapper__container__description__likeWrapper__like'>${media.likes}</p>
            <p class='photographerWork__mediaWrapper__container__description__likeWrapper__icon'>
              <span class='material-symbols-outlined' aria-label='likes' >favorite</span>
            </p>
          </div>              
        </figcaption>
      </figure>
    `;
    });

    mediaWrapper.innerHTML = html;
  }

  displayPhotographerDailyPrice() {
    const totalImagesLikes = this.medias.images.reduce(
      (acc, image) => acc + image.likes,
      0
    );
    const totalVideosLikes = this.medias.videos.reduce(
      (acc, video) => acc + video.likes,
      0
    );
    const totalLikes = totalImagesLikes + totalVideosLikes;

    const photographerDailyPrice = document.querySelector('.main');
    photographerDailyPrice.innerHTML += `
      <section class='photographer__TJM'>
        <div class='photographer__TJM__likesWrapper'>
          <p class='photographer__TJM__likesWrapper__likes'>${totalLikes}</p>
          <p class='material-symbols-outlined TJMIcon'>favorite</></p>
        </div>
        <p class='photographer__TJM__price'>${this.photographer.price}€ / jour</p>
      </section>
    `;
  }

  addEventListenersToFilters() {
    const filterButton = document.querySelector(
      '.photographerWork__filtersWrapper__ButtonWrapper__button'
    );
    const filterElements = document.querySelectorAll(
      '.photographerWork__filtersWrapper__ButtonWrapper__elementWrapper__filters'
    );

    const toggleFilterList = () => {
      const filterList = document.querySelector(
        '.photographerWork__filtersWrapper__ButtonWrapper__elementWrapper'
      );
      // get curent style from css
      const currentDisplay = window
        .getComputedStyle(filterList)
        .getPropertyValue('display');
      if (currentDisplay === 'none') {
        filterList.style.display = 'block';
      } else {
        filterList.style.display = 'none';
      }
    };

    filterButton.addEventListener('click', toggleFilterList);

    // Add event listener to each filter element
    filterElements.forEach((filterElement) =>
      filterElement.addEventListener('click', toggleFilterList)
    );
  }

  async initApp() {
    try {
      await this.getPhotographerData();
      this.displayPhotographerBanner();
      this.displayFilterButton();
      this.displayPhotographerWork();
      this.displayPhotographerDailyPrice();
      this.addEventListenersToFilters();
    } catch (error) {
      console.error('An error occurred while initializing the app: ', error);
    }
  }
}

const photographerPage = new PhotographerPage();
photographerPage.initApp();

class PhotographerPage {
  constructor() {
    this.utils = new Utils();
    this.photographersService = new PhotographersService();
    this.mediaService = new MediaService();
    this.photographer = null;
    this.medias = null;
    this.photographerWork = document.querySelector('.photographerWork');
    this.photographersBanner = document.querySelector('.photographersBanner');
    this.arrowUp = '../public/assets/icons/arrowUp.svg';
    this.arrowDown = '../public/assets/icons/arrowDown.svg';
  }

  // Get photographer data from the API with the id from the url
  async getPhotographerData() {
    this.photographer = await this.photographersService.getPhotographer(
      this.utils.getPhotographerId()
    );

    this.medias = await this.mediaService.getMedia(
      parseInt(this.utils.getPhotographerId())
    );

  }

  // Display the photographer banner
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

    // Update sessionStorage with the photographer name for the contact modal
    sessionStorage.setItem('photographerName', this.photographer.name);
  }

  // Display the filter button menu list
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
            <img src='${this.arrowDown}' alt='fleche bas' />
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

  // Display all medias from the photographer with the MediaFactory method
  displayPhotographerWork() {
    const mediaWrapper = document.createElement('div');
    mediaWrapper.classList.add('photographerWork__mediaWrapper');
    this.photographerWork.appendChild(mediaWrapper);

    const allMedias = [...this.medias.images, ...this.medias.videos];
    sessionStorage.setItem('medias', JSON.stringify(allMedias));

    allMedias.forEach((media) => {
      const mediaElement = MediaFactory.createMediaElement(media);
      mediaElement.querySelector('.photographerWork__mediaWrapper__container__link')
        .setAttribute('data-index', media.id);
      mediaWrapper.appendChild(mediaElement);
    });
  }

  displayPhotographerDailyPrice() {
    // Get total likes (images likes + videos likes)
    const totalLikes = this.utils.getTotalLike(
      this.medias.images,
      this.medias.videos
    );

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

  // Add event listener to the filter button
  addEventListenersPhotographerPage() {
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
    return new Promise(async (resolve, reject) => {
      try {
        await this.getPhotographerData();
        this.displayPhotographerBanner();
        this.displayFilterButton();
        this.displayPhotographerWork();
        this.displayPhotographerDailyPrice();
        this.addEventListenersPhotographerPage();
        resolve();
      } catch (error) {
        console.error('An error occurred while initializing the app: ', error);
        reject(error);
      }
    });
  }
}

// Initialise controllers
const photographerPage = new PhotographerPage();
const contactModal = new ContactModal();
const lightbox = new Lightbox();

photographerPage
  .initApp()
  .then(() => {
    contactModal.initApp();
    lightbox.initApp();
  })
  .catch((error) => {
    console.error(
      'An error occurred while initializing the component: ',
      error
    );
  });

class PhotographerPage {
  constructor() {
    this.utils = new Utils();
    this.photographersService = new PhotographersService();
    this.mediaService = new MediaService();
    this.photographer = null;
    this.medias = null;
    this.mediaWrapper = null;
    this.mediaElement = null;
    this.photographerWork = document.querySelector('.photographerWork');
    this.photographersBanner = document.querySelector('.photographersBanner');
    this.arrowUp = '../public/assets/icons/arrowUp.svg';
    this.arrowDown = '../public/assets/icons/arrowDown.svg';
    this.activeFilter = 'Popularité';
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
            <li class='photographerWork__filtersWrapper__ButtonWrapper__elementWrapper__filters'>${this.activeFilter}               
              <img src='${this.arrowUp}' alt='fleche haut' />
            </li>
            <li class='photographerWork__filtersWrapper__ButtonWrapper__elementWrapper__filters' data-filter='Popularité'>Popularité</li>   
            <li class='photographerWork__filtersWrapper__ButtonWrapper__elementWrapper__filters middleFilter' data-filter='Date'>Date</li>
            <li class='photographerWork__filtersWrapper__ButtonWrapper__elementWrapper__filters' data-filter='Titre'>Titre</li>   
          </ul>     
        </div>
      </div>
    `;
  }


  // Display all medias from the photographer with the MediaFactory method after sorting them
  displayPhotographerWork(isOnLoad) {

    // check if is it the first time we load the page. If not, we remove the medias from the DOM for refresh it with the new filter
    if (isOnLoad === false) {

     const wrapper = [...document.getElementsByClassName('photographerWork__mediaWrapper')]
      wrapper.map((n) => {
        n && n.removeChild(n.firstChild);
      });
    } else {
      // Create a tag where to display the medias
      this.mediaWrapper = document.createElement('div');
      this.mediaWrapper.classList.add('photographerWork__mediaWrapper');
      this.mediaWrapper.setAttribute('id', 'test');
      this.photographerWork.appendChild(this.mediaWrapper);
    }

    let selectedFilter = this.activeFilter;

    let allMedias = [...this.medias.images, ...this.medias.videos];
    sessionStorage.setItem('medias', JSON.stringify(allMedias));

    // Filter and sort medias based on the selected filter
    let filteredMedias = null;

    switch (selectedFilter) {

      case 'Popularité':
        filteredMedias = allMedias.sort((a, b) => b.likes - a.likes);
        this.activeFilter = 'Popularité';
        break;

      case 'Date':
        filteredMedias = allMedias.sort(
          (a, b) => a.date.split('-') - b.date.split('-')
        );
        this.activeFilter = 'Date';
        break;

      case 'Titre':
        filteredMedias = allMedias.sort((a, b) => a.title.localeCompare(b.title));
        this.activeFilter = 'Titre';
        break;

      default: {
        filteredMedias = allMedias.sort((a, b) => b.likes - a.likes);
        this.activeFilter = 'Popularité';
      }
    }


    // Display filtered medias
    filteredMedias.forEach((media) => {
      this.mediaElement = MediaFactory.createMediaElement(media);
      this.mediaElement
        .querySelector('.photographerWork__mediaWrapper__container__link')
        .setAttribute('data-index', media.id);
      this.mediaWrapper.appendChild(this.mediaElement);
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
    filterElements.forEach((filterElement) => {
      filterElement.addEventListener('click', () => {
        this.activeFilter = filterElement.getAttribute('data-filter');
        toggleFilterList();
        this.displayPhotographerWork(false);
      });
    });
  }

  async initApp() {
    return new Promise(async (resolve, reject) => {
      try {
        await this.getPhotographerData();
        this.displayPhotographerBanner();
        this.displayFilterButton();
        this.displayPhotographerWork(true);
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

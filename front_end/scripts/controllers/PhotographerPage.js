class PhotographerPage {
  constructor() {
    this.utils = new Utils();
    this.photographersService = new PhotographersService();
    this.mediaService = new MediaService();
    this.mediaFactory = new MediaFactory();
    this.photographer = null;
    this.medias = null;
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
  displayFilterButton(isOnLoad) {
    if (!isOnLoad) {
      const filterWrapper = document.querySelector(
        '.photographerWork__filtersWrapper'
      );
      filterWrapper.innerHTML = '';
    }

    if (isOnLoad) {
      const filterWrapper = document.createElement('div');
      filterWrapper.classList.add('photographerWork__filtersWrapper');
      this.photographerWork.appendChild(filterWrapper);
    }

    const filterWrapper = document.querySelector(
      '.photographerWork__filtersWrapper'
    );

    let buttonName;
    switch (this.activeFilter) {
      case 'Popularité':
        buttonName = 'Popularité';
        break;
      case 'Date':
        buttonName = 'Date';
        break;
      case 'Titre':
        buttonName = 'Titre';
        break;
      default:
        buttonName = 'Popularité';
        break;
    }

    filterWrapper.innerHTML += `
        <p class='photographerWork__filtersWrapper__message'>Trier par</p>
        <div class='photographerWork__filtersWrapper__ButtonWrapper'>        
          <button 
            class='photographerWork__filtersWrapper__ButtonWrapper__button'
            role='button'
            aria-haspopup='listbox' 
            aria-expanded='true'
          >
          ${buttonName}
            <img class='btnIconDown' src='${this.arrowDown}' alt='fleche bas' />
          </button>
          <ul class='photographerWork__filtersWrapper__ButtonWrapper__elementWrapper'>
            <div class='subNav'>
              <li tabindex='0' 
                  class='photographerWork__filtersWrapper__ButtonWrapper__elementWrapper__filters' 
                  data-filter='Popularité'
                >
                  Popularité
                  <img class='btnIconUp' src='${this.arrowUp}' alt='fleche haut' />
              </li>   
              <li tabindex='0' 
                  class='photographerWork__filtersWrapper__ButtonWrapper__elementWrapper__filters middleFilter' 
                  data-filter='Date'
                >
                  Date
              </li>
              <li tabindex='0' 
                  class='photographerWork__filtersWrapper__ButtonWrapper__elementWrapper__filters' 
                  data-filter='Titre'
                >
                  Titre
              </li>   
            </div>
          </ul>     
        </div>
      `;
    this.addEventListenersPhotographerPage();
  }

  // Display all medias from the photographer with the MediaFactory method after sorting them
  displayPhotographerWork(isOnLoad) {
    if (!isOnLoad) {
      // clear the mediaWrapper before displaying the new medias
      const wrapper = document.querySelector('.photographerWork__mediaWrapper');
      wrapper.innerHTML = '';
    }

    if (isOnLoad) {
      // Create a tag where to display the medias
      const mediaWrapper = document.createElement('div');
      mediaWrapper.classList.add('photographerWork__mediaWrapper');
      this.photographerWork.appendChild(mediaWrapper);
    }

    let selectedFilter = this.activeFilter;

    let allMedias = [...this.medias.images, ...this.medias.videos];
    sessionStorage.setItem('medias', JSON.stringify(allMedias));

    // Filter and sort medias based on the selected filter
    let filteredMedias;

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
        filteredMedias = allMedias.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        this.activeFilter = 'Titre';
        break;

      default: {
        filteredMedias = allMedias.sort((a, b) => b.likes - a.likes);
        this.activeFilter = 'Popularité';
      }
    }

    // Display filtered medias
    filteredMedias.forEach(async (media) => {
      this.mediaElement = await this.mediaFactory.createMediaElement(media);
      this.mediaElement
        .querySelector('.photographerWork__mediaWrapper__container__link')
        .setAttribute('data-index', media.id);
      const mediaWrapper = document.querySelector(
        '.photographerWork__mediaWrapper'
      );
      mediaWrapper.appendChild(this.mediaElement);
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
      console.log('toggleFilterList')
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

    const handleKeyPress = (event) => {
      // if user press enter key
      if (event.key === 'enter') {
        toggleFilterList();
      }
    };

    filterButton.addEventListener('click', toggleFilterList);
    filterButton.addEventListener('keydown', handleKeyPress);

    // Add event listener to each filter element
    filterElements.forEach((filterElement) => {

      filterElement.addEventListener('click', () => {
        this.activeFilter = filterElement.getAttribute('data-filter');
        toggleFilterList();
        this.displayPhotographerWork(false);
        this.displayFilterButton(false);
      });
      filterElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          this.activeFilter = filterElement.getAttribute('data-filter');
          toggleFilterList();
          this.displayPhotographerWork(false);
          this.displayFilterButton(false);
        }
      });
    });
  }

  async initApp() {
    return new Promise(async (resolve, reject) => {
      try {
        await this.getPhotographerData();
        await this.displayPhotographerBanner();
        await this.displayFilterButton(true);
        await this.displayPhotographerWork(true);
        await this.displayPhotographerDailyPrice();
        await this.addEventListenersPhotographerPage();
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

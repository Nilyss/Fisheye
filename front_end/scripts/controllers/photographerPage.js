class PhotographerPage {
  constructor() {
    this.arrowUp = '../public/assets/icons/arrowUp.svg';
    this.photographersBanner = document.querySelector('.photographersBanner');
    this.photographers = JSON.parse(localStorage.getItem('photographers'));
    this.urlParams = new URLSearchParams(window.location.search);
    this.photographerId = this.urlParams.get('id');
    this.photographer = this.photographers.find(
      (photographer) => photographer.id === parseInt(this.photographerId)
    );
    this.isPhotographerBannerDisplayed = false;
    this.photographerWork = document.querySelector('.photographerWork');
    this.medias = JSON.parse(localStorage.getItem('medias'));
    this.isPhotographerWorkDisplayed = false;
    this.isFilterDisplayed = false;
  }

  async initApp() {
    // Redirect to index.html if the photographer doesn't exist, or if the id is not provided in localStorage
    if (!this.photographer) {
      window.location.href = '../index.html';
    }

    // Display photographer banner
    const displayPhotographerBanner = async () => {
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

      if (!this.isPhotographerBannerDisplayed) {
        this.photographersBanner.innerHTML += `
        <div class="photographerBanner__overviewWrapper">
          <h1 class="photographerBanner__overviewWrapper__name">${this.photographer.name}</h1>
          <p class="photographerBanner__overviewWrapper__location">${this.photographer.city}, ${this.photographer.country}</p>
          <p class="photographerBanner__overviewWrapper__tagline">${this.photographer.tagline}</p>
        </div>
        <div class="photographerBanner__contactWrapper">
          <button class="photographerBanner__contactWrapper__contactBtn">Contactez-moi</button>
        </div>
        <figure class="photographerBanner__pictureWrapper">
          <img
            class="photographerBanner__pictureWrapper__picture ${additionalClass}"
            src="../public/assets/usersPictures/${this.photographer.portrait}"
            alt=""
          />
        </figure>
        `;

        this.isPhotographerBannerDisplayed = true;
      }
    };

    // Display filter button in DOM
    const displayFilterButton = async () => {
      let buttonName = 'Popularité';
      if (!this.isFilterDisplayed) {
        this.photographerWork.innerHTML += `
        <div class="photographerWork__filtersWrapper">
          <p class='photographerWork__filtersWrapper__message'>Trier par</p>
          <div class='photographerWork__filtersWrapper__ButtonWrapper'>        
            <button class='photographerWork__filtersWrapper__ButtonWrapper__button'>${buttonName}
              <img src="${this.arrowUp}" alt="fleche haut" />
            </button>
            <ul class="photographerWork__filtersWrapper__ButtonWrapper__elementWrapper">
              <li class="photographerWork__filtersWrapper__ButtonWrapper__elementWrapper__filters">Popularité               
                <img src="${this.arrowUp}" alt="fleche haut" />
              </li>
              <li class="photographerWork__filtersWrapper__ButtonWrapper__elementWrapper__filters middleFilter">Date</li>
              <li class="photographerWork__filtersWrapper__ButtonWrapper__elementWrapper__filters">Titre</li>   
            </ul>     
          </div>
        </div>
        `;

        const filterButton = document.querySelector(
          '.photographerWork__filtersWrapper__ButtonWrapper__button'
        );
        const filterList = document.querySelector(
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
        filterList.addEventListener('click', toggleFilterList);
      }

      this.isFilterDisplayed = true;
    };

    const displayPhotographerWork = () => {
      const pictures = this.medias.images;
      const videos = this.medias.videos;
    };

    await displayPhotographerWork();
    await displayPhotographerBanner();
    await displayFilterButton();
  }
}

const photographerPage = new PhotographerPage();
photographerPage.initApp();

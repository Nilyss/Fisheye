class PhotographerPage {
  constructor() {
    this.utils = new Utils();
    this.photographers = this.utils.getDataFromSessionStorage('photographers');
    this.medias = this.utils.getDataFromSessionStorage('medias');
    this.isPhotographerBannerDisplayed = false;
    this.isFilterDisplayed = false;
    this.isPhotographerWorkDisplayed = false;
  }

  async initApp() {
    // Check if datas are already in sessionStorage. If not, fetch them from the API and store them
    if (!this.photographers && !this.medias) {
      const apiSessionStorage = new ApiSessionStorage();
      await apiSessionStorage.initApp();

      this.photographers =
        this.utils.getDataFromSessionStorage('photographers');
      this.medias = this.utils.getDataFromSessionStorage('medias');
    }

    const photographersBanner = document.querySelector('.photographersBanner');
    const urlParams = new URLSearchParams(window.location.search);
    const photographerId = urlParams.get('id');
    const photographer = this.photographers.find(
      (photographer) => photographer.id === parseInt(photographerId)
    );
    const photographerWork = document.querySelector('.photographerWork');

    const arrowUp = '../public/assets/icons/arrowUp.svg';

    // Display photographer banner
    const displayPhotographerBanner = async () => {
      // Adding specific class for some photographers profile picture
      let additionalClass = '';
      if (photographer.id === 243) {
        additionalClass = 'firstPhotographer';
      }
      if (
        photographer.id === 930 ||
        photographer.id === 925 ||
        photographer.id === 195
      ) {
        additionalClass = 'portraitPicture';
      }

      if (!this.isPhotographerBannerDisplayed) {
        photographersBanner.innerHTML += `
        <div class="photographerBanner__overviewWrapper">
          <h1 class="photographerBanner__overviewWrapper__name">${photographer.name}</h1>
          <p class="photographerBanner__overviewWrapper__location">${photographer.city}, ${photographer.country}</p>
          <p class="photographerBanner__overviewWrapper__tagline">${photographer.tagline}</p>
        </div>
        <div class="photographerBanner__contactWrapper">
          <button class="photographerBanner__contactWrapper__contactBtn">Contactez-moi</button>
        </div>
        <figure class="photographerBanner__pictureWrapper">
          <img
            class="photographerBanner__pictureWrapper__picture ${additionalClass}"
            src="../public/assets/usersPictures/${photographer.portrait}"
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
        photographerWork.innerHTML += `
        <div class="photographerWork__filtersWrapper">
          <p class='photographerWork__filtersWrapper__message'>Trier par</p>
          <div class='photographerWork__filtersWrapper__ButtonWrapper'>        
            <button class='photographerWork__filtersWrapper__ButtonWrapper__button'>${buttonName}
              <img src="${arrowUp}" alt="fleche haut" />
            </button>
            <ul class="photographerWork__filtersWrapper__ButtonWrapper__elementWrapper">
              <li class="photographerWork__filtersWrapper__ButtonWrapper__elementWrapper__filters">Popularité               
                <img src="${arrowUp}" alt="fleche haut" />
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

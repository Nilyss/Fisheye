class PhotographerPage {
  constructor() {
    this.utils = new Utils();
    this.photographers = this.utils.getDataFromSessionStorage('photographers');
    this.medias = this.utils.getDataFromSessionStorage('medias');
    this.isPhotographerBannerDisplayed = false;
    this.isFilterDisplayed = false;
    this.isPhotographerWorkDisplayed = false;
    this.isPhotographerTJMDisplayed = false;
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
    // variables
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
          <button class="photographerBanner__contactWrapper__contactBtn" aria-label='Contact Me'>Contactez-moi</button>
        </div>
        <figure class="photographerBanner__pictureWrapper">
          <img
            class="photographerBanner__pictureWrapper__picture ${additionalClass}"
            src="../public/assets/usersPictures/${photographer.portrait}"
            alt="${photographer.name}"
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
            <button 
            class='photographerWork__filtersWrapper__ButtonWrapper__button'
            role='button'
            aria-haspopup='listbox' 
            aria-expanded='true'>
            ${buttonName}
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
      }

      this.isFilterDisplayed = true;
    };

    const displayPhotographerWork = () => {
      // Get all pictures and videos from photographer
      const pictures = this.medias.images;
      const videos = this.medias.videos;

      const photographerPictures = pictures
        .filter(
          (picture) => picture.photographerId === parseInt(photographerId)
        )
        .sort((a, b) => b.likes - a.likes);

      console.log(photographerPictures);

      const photographerVideos = videos.filter(
        (video) => video.photographerId === parseInt(photographerId)
      );

      // Display photographer work
      if (!this.isPhotographerWorkDisplayed) {
        photographerWork.innerHTML += `
        <article class='photographerWork__mediaWrapper'></article>
        `;
        const mediaWrapper = document.querySelector(
          '.photographerWork__mediaWrapper'
        );

        photographerPictures.forEach((picture) => {
          mediaWrapper.innerHTML += `
          <figure class="photographerWork__mediaWrapper__container">
            <img
              class="photographerWork__mediaWrapper__container__media"
              src="../public/assets/usersMedias/${photographer.name}/${picture.image}"
              alt=""
            />
            <figcaption class="photographerWork__mediaWrapper__container__description">
              <p class="photographerWork__mediaWrapper__container__description__title">${picture.title}</p>
              <div class='photographerWork__mediaWrapper__container__description__likeWrapper'>
                <p class="photographerWork__mediaWrapper__container__description__likeWrapper__like">${picture.likes}</p>
                <p class="photographerWork__mediaWrapper__container__description__likeWrapper__icon">
                  <span class="material-symbols-outlined" aria-label='likes' >favorite</span>
                </p>
              </div>              
            </figcaption>
          </figure>
          `;
        });

        this.isPhotographerWorkDisplayed = true;
      }
    };

    const displayPhotographerTJM = () => {
      const totalImagesLikes = this.medias.images.reduce(
        (acc, image) => acc + image.likes,
        0
      );
      const totalVideosLikes = this.medias.videos.reduce(
        (acc, video) => acc + video.likes,
        0
      );
      const totalLikes = totalImagesLikes + totalVideosLikes;

      const photographerTJM = document.querySelector('.main');
      if (!this.isPhotographerTJMDisplayed) {
        photographerTJM.innerHTML += `
          <section class='photographer__TJM'>
            <div class='photographer__TJM__likesWrapper'>
              <p class="photographer__TJM__likesWrapper__likes">${totalLikes}</p>
              <p class="material-symbols-outlined TJMIcon">favorite</></p>
            </div>
            <p class="photographer__TJM__price">${photographer.price}€ / jour</p>
          </section>
        `;
        this.isPhotographerTJMDisplayed = true;
      }
    };

    const addEventListenersToFilters = () => {
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
    };

    await displayPhotographerBanner();
    await displayFilterButton();
    await displayPhotographerWork();
    await displayPhotographerTJM();
    await addEventListenersToFilters();
  }
}

const photographerPage = new PhotographerPage();
photographerPage.initApp();

class PhotographerPage {
  constructor() {
    this.photographersBanner = document.querySelector('.photographersBanner');
    this.photographerWork = document.querySelector('.photographerWork');
    this.isPhotographerDetailsDisplayed = false;
  }

  async initApp() {
    const displayPhotographerDetails = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const photographerId = urlParams.get('id');
      const photographers = JSON.parse(localStorage.getItem('photographers'));
      const photographer = photographers.find(
        (photographer) => photographer.id === parseInt(photographerId)
      );

      if (!photographer) {
        window.location.href = '../index.html';
      }

      // Adding specific class for some photographers
      let additionalClass = '';
      if (photographer.id === 243) {
          additionalClass = 'firstPhotographer';
      }
      if (photographer.id === 930 || photographer.id === 925 || photographer.id === 195) {
          additionalClass = 'portraitPicture';
      }

      if (!this.isPhotographerDetailsDisplayed) {
        this.photographersBanner.innerHTML += `
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
      }
    };
    await displayPhotographerDetails();
  }
}

const photographerPage = new PhotographerPage();
photographerPage.initApp();

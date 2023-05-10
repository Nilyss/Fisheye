class Index {
  constructor() {
    this.isPhotographerDisplayed = false;
  }

  async initApp() {
    const displayPhotographers = () => {
      if (!this.isPhotographerDisplayed) {
        // Get the photographers from the localStorage
        const photographers = JSON.parse(localStorage.getItem('photographers'));

        // Get the DOM element where the photographers will be displayed
        const photographersContainer = document.querySelector(
          '.photographersContainer'
        );

        // Split photographers array into chunks of 3 before displaying them
        const photographerGroups = [];
        for (let i = 0; i < photographers.length; i += 3) {
          photographerGroups.push(photographers.slice(i, i + 3));
        }

        photographerGroups.forEach((group, index) => {
          let groupContainer = document.createElement('div');
          groupContainer.className = `photographersGroup group${index + 1}`;

          group.forEach((photographer) => {
            groupContainer.innerHTML += `
          <div class="photographer">
            <a class='photographer__link' href="photographer.html?id=${photographer.id}">
            <figure class='photographer__link__card'>
              <img 
              class='photographer__link__card__img'
              src="./public/assets/usersPictures/${photographer.portrait}" alt="" />
              <figcaption class='photographer__link__card__caption'>
                <h2 class='photographer__link__card__caption__name'>${photographer.name}</h2>
              </figcaption>
            </figure>
            </a>
            <p class='photographer__city'>${photographer.city}, ${photographer.country}</p>
            <blockquote class='photographer__tagline'>${photographer.tagline}</blockquote>
            <p class='photographer__price'>${photographer.price}€/jour</p>
          </div>
          `;
          });

          photographersContainer.appendChild(groupContainer);
        });

        this.isPhotographerDisplayed = true;
      }
    };

    await displayPhotographers();
  }

}

const index = new Index();
index.initApp();

class Index {
  constructor() {
    this.utils = new Utils();
  }

  async initApp() {
    const apiSessionStorage = new ApiSessionStorage();
    await apiSessionStorage.initApp();
    const photographers = this.utils.getDataFromSessionStorage('photographers');



    const displayPhotographers = async () => {
      if (!this.isPhotographerDisplayed && photographers) {
        // Get the DOM element where the photographers will be displayed
        const photographersContainer = document.querySelector(
          '.photographersContainer'
        );

        // Split photographers array into chunks of 3 before displaying them
        const photographerGroups = [];
        for (let i = 0; i < photographers.length; i += 3) {
          photographerGroups.push(photographers.slice(i, i + 3));
        }

        photographerGroups.forEach((group, groupIndex) => {
          let groupContainer = document.createElement('div');
          groupContainer.className = `photographersGroup group${
            groupIndex + 1
          }`;

          group.forEach((photographer, photographerIndex) => {
            console.log(photographer.name)
            // Adding specific class for some photographers
            let additionalClass = '';
            switch (groupIndex) {
              case 0:
                if (photographerIndex === 0) {
                  additionalClass = 'firstPhotographer';
                } else if (photographerIndex === 1) {
                  additionalClass = 'portraitPicture';
                }
                break;
              case 1:
                if (photographerIndex === 1 || photographerIndex === 2) {
                  additionalClass = 'portraitPicture';
                }
                break;
            }

            groupContainer.innerHTML += `
              <div class="photographer">
                <a class='photographer__link' href="./views/photographerPage.html?id=${photographer.id}">
                <figure class='photographer__link__imgWrapper'>
                <img
                    class="photographer__link__imgWrapper__img ${additionalClass}"
                    src="./public/assets/usersPictures/${photographer.portrait}"
                    alt=""
                  />
                </figure>
                <div class='photographer__link__nameWrapper'>
                  <h2 class='photographer__link__nameWrapper__name'>${photographer.name}</h2>
                </div>
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

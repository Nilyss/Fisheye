class Index {
  constructor() {
    this.photographersService = new PhotographersService();
    this.isPhotographerDisplayed = false;
    this.photographerFactory = new PhotographerFactory;
  }

  async initApp() {

    // Get photographers from API
    const photographers = await this.photographersService.getPhotographers();

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
          const groupContainer = document.createElement('div');
          groupContainer.className = `photographersGroup group${
            groupIndex + 1
          }`;

          group.forEach(async (photographer, photographerIndex) => {
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

            // Create photographer DOM element with the factory
            const photographerElement =
              this.photographerFactory.createPhotographerElement(
                photographer,
                additionalClass
              );
            groupContainer.appendChild(await photographerElement);
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

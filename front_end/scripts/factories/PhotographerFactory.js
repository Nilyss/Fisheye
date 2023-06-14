class PhotographerFactory {
  constructor() {}

  static createPhotographer = (photographerData) => {
    return new Photographer(photographerData);
  };
  static createPhotographerElement(photographerData, additionalClass = '') {
    const photographer = this.createPhotographer(photographerData);

    // Create elements
    const photographerDiv = document.createElement('div');
    photographerDiv.classList.add('photographer');

    const link = document.createElement('a');
    link.classList.add('photographer__link');
    link.href = `./views/photographerPage.html?id=${photographer.id}`;

    const figure = document.createElement('figure');
    figure.classList.add('photographer__link__imgWrapper');

    const img = document.createElement('img');
    img.classList.add('photographer__link__imgWrapper__img');
    if (additionalClass !== '') {
      img.classList.add(additionalClass);
    }
    img.src = `./public/assets/usersPictures/${photographer.portrait}`;

    const nameWrapper = document.createElement('div');
    nameWrapper.classList.add('photographer__link__nameWrapper');

    const name = document.createElement('h2');
    name.classList.add('photographer__link__nameWrapper__name');
    name.textContent = photographer.name;

    const city = document.createElement('p');
    city.classList.add('photographer__city');
    city.textContent = `${photographer.city}, ${photographer.country}`;

    const tagline = document.createElement('blockquote');
    tagline.classList.add('photographer__tagline');
    tagline.textContent = photographer.tagline;

    const price = document.createElement('p');
    price.classList.add('photographer__price');
    price.textContent = `${photographer.price}€/jour`;

    // Render elements in the DOM
    figure.appendChild(img);
    nameWrapper.appendChild(name);

    link.appendChild(figure);
    link.appendChild(nameWrapper);

    photographerDiv.appendChild(link);
    photographerDiv.appendChild(city);
    photographerDiv.appendChild(tagline);
    photographerDiv.appendChild(price);

    return photographerDiv;
  }
}

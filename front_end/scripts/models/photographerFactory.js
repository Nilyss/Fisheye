const PhotographerFactory = () => {};

PhotographerFactory.createPhotographer = function (photographerData) {
  return Photographer(photographerData);
};

const Photographer = (data) => ({
  id: data.id,
  name: data.name,
  portrait: data.portrait,
  city: data.city,
  country: data.country,
  tagline: data.tagline,
  price: data.price,
  tags: data.tags,
});

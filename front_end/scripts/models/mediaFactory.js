const MediaFactory = () => {};

MediaFactory.createMedia = (media) => {
  if (media.image) {
    return ImageMedia(media);
  } else if (media.video) {
    return VideoMedia(media);
  }
};

const ImageMedia = (media) => ({
  id: media.id,
  photographerId: media.photographerId,
  title: media.title,
  image: media.image,
  likes: media.likes,
  date: media.date,
  price: media.price,
});

const VideoMedia = (media) => ({
  id: media.id,
  photographerId: media.photographerId,
  title: media.title,
  video: media.video,
  likes: media.likes,
  date: media.date,
  price: media.price,
});

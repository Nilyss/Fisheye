class Utils {
  constructor() {}

  getPhotographerId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
  };

  findPhotographer = (photographers, id) => {
    return photographers.find((photographer) => photographer.id === parseInt(id));
  };

  getTotalLike = (images, videos) => {
    const totalImagesLikes = images.reduce(
      (acc, image) => acc + image.likes,
      0
    );
    const totalVideosLikes = videos.reduce(
      (acc, video) => acc + video.likes,
      0
    );
    return totalImagesLikes + totalVideosLikes;
  };
}

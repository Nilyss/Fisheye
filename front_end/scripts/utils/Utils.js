class Utils {
  constructor() {}

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

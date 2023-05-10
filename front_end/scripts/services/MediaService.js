class MediaService extends ApiCalls {
  constructor() {
    super();
  }

  // ********** GET REQUEST **********
  async getMedia() {
    const req = await this.fetch('/photographers.json');
    const getImage = req.media.filter((media) => media.image);
    const getVideo = req.media.filter((media) => media.video);

    const images = getImage.map((media) => {
      return new Image(
        media.id,
        media.photographerId,
        media.title,
        media.image,
        media.likes,
        media.date,
        media.price
      );
    });

    const videos = getVideo.map((media) => {
      return new Video(
        media.id,
        media.photographerId,
        media.title,
        media.video,
        media.likes,
        media.date,
        media.price
      );
    });

    return { images, videos };
  }
}

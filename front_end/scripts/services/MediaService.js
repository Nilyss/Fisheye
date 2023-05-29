class MediaService extends ApiCalls {
  constructor() {
    super();
    this.media = null;
  }

  // ********** GET REQUEST **********
  async getMedia(photographerId) {
    if (this.media) return this.media;

    const req = await this.fetch('/photographers.json');
    const getImage = req.media.filter((media) => media.image && media.photographerId === photographerId);
    const getVideo = req.media.filter((media) => media.video && media.photographerId === photographerId);

    const images = getImage.map((image) => MediaFactory.createMedia(image));
    const videos = getVideo.map((video) => MediaFactory.createMedia(video));

    this.media = { images, videos };
    return this.media;
  }
}

class ApiSessionStorage {
  constructor() {
    this.photographerService = new PhotographersService();
    this.mediaService = new MediaService();
  }
  async initApp() {
    const getData = async () => {
      const photographers = JSON.parse(sessionStorage.getItem('photographers'));
      const media = JSON.parse(sessionStorage.getItem('medias'));

      if (!photographers || !media) {
        const getPhotographers =
          await this.photographerService.getPhotographers();

        const getMedia = await this.mediaService.getMedia();

        if (getPhotographers)
          sessionStorage.setItem(
            'photographers',
            JSON.stringify(getPhotographers)
          );
        if (getMedia)
          sessionStorage.setItem('medias', JSON.stringify(getMedia));
      }
    };

    await getData();
  }
}

const apiSessionStorage = new ApiSessionStorage();
apiSessionStorage.initApp();

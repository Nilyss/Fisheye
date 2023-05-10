class ApiLocalStorage {
  constructor() {
    this.photographerService = new PhotographersService();
    this.mediaService = new MediaService();
  }

  async initApp() {

    // Store photographers and media datas in localStorage
    const storePhotographers = async () => {
      const getPhotographers =
        await this.photographerService.getPhotographers();

      if (getPhotographers)
        localStorage.setItem(
          'photographers',
          JSON.stringify(getPhotographers)
        );
    };
    const storeMedia = async () => {
      const getMedia = await this.mediaService.getMedia();

      if (getMedia) localStorage.setItem('medias', JSON.stringify(getMedia));
    };

    await storePhotographers();
    await storeMedia();
  }
}

const apiSessionStorage = new ApiLocalStorage();
apiSessionStorage.initApp();

class PhotographersService extends ApiCalls {
  constructor() {
    super();
    this.photographers = null;
    this.utils = new Utils();
  }

  // ********** GET REQUEST **********
  async getPhotographers() {
    if (this.photographers) return this.photographers;

    const req = await this.fetch('/photographers.json');
    this.photographers = req.photographers.map((photographer) =>
      PhotographerFactory.createPhotographer(photographer)
    );

    return this.photographers;
  }

  async getPhotographer(id) {
    const photographers = await this.getPhotographers();
    return this.utils.findPhotographer(photographers, id);
  }
}

class PhotographersService extends ApiCalls {
  constructor() {
    super();
    this.photographers = null;
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
}

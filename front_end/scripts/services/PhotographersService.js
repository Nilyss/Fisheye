class PhotographersService extends ApiCalls {
  constructor() {
    super();
  }

  // ********** GET REQUEST **********
  async getPhotographers() {
    const req = await this.fetch('/photographers.json');
    return  req.photographers.map((photographer) => new Photographer(photographer));
  }
}

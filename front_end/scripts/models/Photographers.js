class Photographer {
  constructor(data) {
    this.name = data.name;
    this.id = data.id;
    this.city = data.city;
    this.country = data.country;
    this.tagline = data.tagline;
    this.price = data.price;
    this.portrait = data.portrait;
  }

  Photographer() {
    return {
      name: this.name,
      id: this.id,
      city: this.city,
      country: this.country,
      tagline: this.tagline,
      price: this.price,
      portrait: this.portrait,
    };
  }
}
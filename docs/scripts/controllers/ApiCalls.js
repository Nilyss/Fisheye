class ApiCalls {
  constructor() {
    this.apiURL = "https://nilyss.github.io/photographers.JSON";
    this.errorMessage =
      "Une erreur est survenue lors de la récupération des données.";
  }

  // ********** GET REQUEST **********
  async fetch(val) {
    return fetch(this.apiURL + val)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error(this.errorMessage);
        }
      })
      .then((data) => data)
      .catch((error) => console.error(error));
  }
}
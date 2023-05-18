class Utils {
  constructor() {}
  getDataFromSessionStorage(key) {
    return JSON.parse(sessionStorage.getItem(key));
  }
}

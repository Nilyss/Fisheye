class Utils {
  constructor() {}

  getPhotographerId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
  };

  findPhotographer = (photographers, id) => {
    return photographers.find(
      (photographer) => photographer.id === parseInt(id)
    );
  };

  getTotalLike = (images, videos) => {
    const totalImagesLikes = images.reduce(
      (acc, image) => acc + image.likes,
      0
    );
    const totalVideosLikes = videos.reduce(
      (acc, video) => acc + video.likes,
      0
    );
    return totalImagesLikes + totalVideosLikes;
  };

  trapFocus = (el) => {
    // add all the elements inside modal which you want to make focusable
    const focusableElements =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const firstFocusableElement = el.querySelectorAll(focusableElements)[0];
    const focusableContent = el.querySelectorAll(focusableElements);
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    document.addEventListener('keydown', function (e) {
      let isTabPressed = e.key === 'Tab' || e.keyCode === 9;

      if (!isTabPressed) {
        return;
      }

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        // if tab key is pressed
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    });

    firstFocusableElement.focus();
  };
}

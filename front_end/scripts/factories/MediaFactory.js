class MediaFactory {
  constructor() {}

  static createMedia = (media) => {
    if (media.image) {
      return new ImageMedia(media);
    } else if (media.video) {
      return new VideoMedia(media);
    }
  };

  static createMediaElement(mediaData, additionalClass = '') {
    const media = this.createMedia(mediaData);

    const mediaElement = document.createElement('figure');
    mediaElement.classList.add('photographerWork__mediaWrapper__container');

    let mediaTag;
    if (media.image) {
      const img = document.createElement('img');
      img.classList.add('photographerWork__mediaWrapper__container__media');
      if (additionalClass) {
        img.classList.add(additionalClass);
      }
      img.src = `../public/assets/usersMedias/${media.photographerId}/${media.image}`;
      img.alt = media.title;
      mediaTag = img;
    } else if (media.video) {
      const video = document.createElement('video');
      video.classList.add('photographerWork__mediaWrapper__container__media');
      if (additionalClass) {
        video.classList.add(additionalClass);
      }
      const source = document.createElement('source');
      source.src = `../public/assets/usersMedias/${media.photographerId}/${media.video}`;
      source.type = 'video/mp4';
      video.appendChild(source);
      mediaTag = video;
    }

    const figcaption = document.createElement('figcaption');
    figcaption.classList.add(
      'photographerWork__mediaWrapper__container__description'
    );

    const title = document.createElement('p');
    title.classList.add(
      'photographerWork__mediaWrapper__container__description__title'
    );
    title.textContent = media.title;

    const likeWrapper = document.createElement('div');
    likeWrapper.classList.add(
      'photographerWork__mediaWrapper__container__description__likeWrapper'
    );

    const likes = document.createElement('p');
    likes.classList.add(
      'photographerWork__mediaWrapper__container__description__likeWrapper__like'
    );
    likes.textContent = media.likes;

    const icon = document.createElement('p');
    icon.classList.add(
      'photographerWork__mediaWrapper__container__description__likeWrapper__icon'
    );

    const iconSpan = document.createElement('span');
    iconSpan.classList.add('material-symbols-outlined');
    iconSpan.setAttribute('aria-label', 'likes');
    iconSpan.textContent = 'favorite';
    icon.appendChild(iconSpan);

    // Render elements in the DOM
    likeWrapper.appendChild(likes);
    likeWrapper.appendChild(icon);

    figcaption.appendChild(title);
    figcaption.appendChild(likeWrapper);

    mediaElement.appendChild(mediaTag);
    mediaElement.appendChild(figcaption);

    return mediaElement;
  }
}

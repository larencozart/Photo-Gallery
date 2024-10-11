
class PhotoGallery {
  constructor() {
    this.slidesContainer = document.getElementById('slides');
    this.photoInfoContainer = document.querySelector('section > header');

    this.displayPhotos();
  }

  // Render the photos template, and write it to the #slides div

  // Render the photo_information template using the first photo's data, 
  // and write it to section > header element that needs to contain the photo information

  async fetchPhotos() {
    let response = await fetch(`http://localhost:3000/photos`);
    let photos = await response.json();

    consolelog(photos);
  }

  async fetchPhotoInfo() {

  }

  async displayPhotos() {
    let photos = await this.fetchPhotos();

    // let photosHandlebar = document.getElementById('photos');
    // let photosTemplate = Handlebars.compile(photosHandlebar.innerHTML);

    // this.slidesContainer.innerHTML = photosTemplate(); // add fetched photos

    // let photoInfoHandlebar = document.getElementById('photo_information');
    // let photoInfoTemplate = Handlebars.compile(photoInfoHandlebar);

    // this.photoInfoContainer.innerHTML = photoInfoTemplate(); // add fetched photo info
  }

}

document.addEventListener("DOMContentLoaded", () => {
  let gallery = new PhotoGallery();
});
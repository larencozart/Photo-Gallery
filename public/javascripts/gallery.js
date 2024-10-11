
class PhotoGallery {
  constructor() {
    this.templates = {};
    this.photos;
    this.currentPhoto;
    this.photoInfo;
    this.comments;

    this.slides = document.getElementById('slides');
    this.photoHeader = document.querySelector('section > header');
    this.commentsList = document.querySelector('#comments ul');
    this.prev = document.querySelector('.prev');
    this.next = document.querySelector('.next');

    this.compileHandlebarTemplates();
    this.displaySlideShow();
    this.attachListeners();
  }

  compileHandlebarTemplates() {
    document.querySelectorAll("script[type='text/x-handlebars']").forEach(tmpl => {
      this.templates[tmpl.id] = Handlebars.compile(tmpl.innerHTML);
    });

    document.querySelectorAll("[data-type=partial]").forEach(partial => {
      Handlebars.registerPartial(partial.id, partial.innerHTML);
    });
  }

  attachListeners() {
    this.prev.addEventListener("click", this.handlePrevLink.bind(this));
    this.next.addEventListener("click", this.handleNextLink.bind(this));
  }

  async fetchPhotos() {
    let response = await fetch(`/photos`);
    this.photos = await response.json();
  }

  async fetchComments() {
    let response = await fetch(`/comments?photo_id=${this.currentPhoto.id}`);
    this.comments = await response.json();
  }

  async displaySlideShow() {
    await this.fetchPhotos();
    this.currentPhoto = this.photos[0]; // set this the first time

    await this.displayPhoto();
  }

  resetPhotoVisibility() {
    let imgs = Array.from(this.slides.querySelectorAll('img'));
    let currentImg = imgs.find(img => {
      console.log("IMG element src:", img.src);
      return img.src === this.currentPhoto.src
    });

    currentImg.parentNode.classList.remove("hide");
    currentImg.parentNode.classList.add("show");
  }

  async displayPhoto() {
    await this.fetchComments();

    this.slides.innerHTML = this.templates.photos({photos: this.photos});

    this.resetPhotoVisibility();
    this.photoHeader.innerHTML = this.templates.photo_information(this.currentPhoto);
    this.commentsList.innerHTML = this.templates.photo_comments({comments: this.comments});
  }

  handlePrevLink(e) {
    e.preventDefault();

    let index = this.photos.findIndex(photo => photo.id === this.currentPhoto.id);
    let prevPhoto = this.photos[index - 1] || this.photos[this.photos.length - 1];

    this.currentPhoto = prevPhoto;
    this.displayPhoto();
  }

  handleNextLink(e) {
    e.preventDefault();

    let index = this.photos.findIndex(photo => photo.id === this.currentPhoto.id);
    let nextPhoto = this.photos[index + 1] || this.photos[0];

    this.currentPhoto = nextPhoto;
    this.displayPhoto();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let gallery = new PhotoGallery();
});
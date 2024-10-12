
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
    this.commentForm = document.querySelector('form');

    this.compileHandlebarTemplates();
    this.createPhotoGallery();
  }

  // view functions
  compileHandlebarTemplates() {
    document.querySelectorAll("script[type='text/x-handlebars']").forEach(tmpl => {
      this.templates[tmpl.id] = Handlebars.compile(tmpl.innerHTML);
    });

    document.querySelectorAll("[data-type=partial]").forEach(partial => {
      Handlebars.registerPartial(partial.id, partial.innerHTML);
    });
  }

  resetPhotoVisibility() {
    let imgs = Array.from(this.slides.querySelectorAll('img'));
    let currentImg = imgs.find(img => img.src === this.currentPhoto.src);

    currentImg.parentNode.classList.remove("hide");
    currentImg.parentNode.classList.add("show");
  }

  async createPhotoGallery() {
    await this.fetchPhotos();
    this.currentPhoto = this.photos[0]; // set this the first time

    await this.displayPhoto();
    this.attachListeners();
  }

  async displayPhoto() {
    await this.fetchComments();

    this.slides.innerHTML = this.templates.photos({photos: this.photos});

    this.resetPhotoVisibility();
    this.photoHeader.innerHTML = this.templates.photo_information(this.currentPhoto);
    this.commentsList.innerHTML = this.templates.photo_comments({comments: this.comments});
  }

  // model functions
  async fetchPhotos() {
    let response = await fetch(`/photos`);
    this.photos = await response.json();
  }

  async fetchComments() {
    let response = await fetch(`/comments?photo_id=${this.currentPhoto.id}`);
    this.comments = await response.json();
  }

  async likeOrFavPhoto(path, id) {
    try {
      let response = await fetch(path, {
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: `photo_id=${id}`
      });
  
      let json = await response.json();

      return json.total;

    } catch (error) {
      console.error(error.message);
    }
  }

  async addNewComment(data) {
      let response = await fetch(this.commentForm.action, {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: new URLSearchParams([...data])
    });

    let commentJSON = await response.json();
    return commentJSON;
  }
 
  // controller functions
  attachListeners() {
    this.prev.addEventListener("click", this.handlePrevButton.bind(this));
    this.next.addEventListener("click", this.handleNextButton.bind(this));
    this.photoHeader.addEventListener("click", this.handleLikeOrFav.bind(this));
    this.commentForm.addEventListener("submit", this.handleCommentSubmit.bind(this));
  }

  handlePrevButton(e) {
    e.preventDefault();

    let index = this.photos.findIndex(photo => photo.id === this.currentPhoto.id);
    let prevPhoto = this.photos[index - 1] || this.photos[this.photos.length - 1];

    this.currentPhoto = prevPhoto;
    this.displayPhoto();
  }

  handleNextButton(e) {
    e.preventDefault();

    let index = this.photos.findIndex(photo => photo.id === this.currentPhoto.id);
    let nextPhoto = this.photos[index + 1] || this.photos[0];

    this.currentPhoto = nextPhoto;
    this.displayPhoto();
  }

  async handleLikeOrFav(e) {
    e.preventDefault()
    let button = e.target;
    let path = e.target.href;
    let id = e.target.getAttribute("data-id");
    let newTotal = await this.likeOrFavPhoto(path, id);

    if (newTotal) {
      button.innerText = button.innerText.replace(/\d+/, newTotal);
    } else {
      console.log("Failed to like or fave");
    }
  }

  async handleCommentSubmit(e) {
    e.preventDefault();

    let data = new FormData(this.commentForm);
    let newComment = await this.addNewComment(data);
    
    if (newComment) {
      this.commentsList.insertAdjacentHTML("beforeend", this.templates.photo_comment(newComment));
    } else {
      console.log("Comment failed to add");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let gallery = new PhotoGallery();
});
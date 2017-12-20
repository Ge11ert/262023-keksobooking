'use strict';

(function () {
  /**
   * @const {Array.<string>}
   */
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  /**
   * @const {string}
   */
  var PHOTO_MAX_WIDTH = '250';

  var fileInputs = document.querySelectorAll('input[type="file"]');
  var avatarPreview = document.querySelector('.notice__preview img');
  var photoPreview = document.querySelector('.form__photo-container');

  var imageInserting = {
    'avatar': function (imageSource) {
      avatarPreview.src = imageSource;
    },
    'images': function (imageSource) {
      var image = document.createElement('img');
      image.src = imageSource;
      image.width = PHOTO_MAX_WIDTH;
      photoPreview.appendChild(image);
    }
  };

  /**
   * Gets a file, selected by user. Checks, if the file meets type requirements.
   * If selected file is an image, invokes corresponding function to insert this image
   * in the right place.
   * @param {Event} evt
   */
  var inputChangeHandler = function (evt) {
    var file = evt.target.files[0];
    var fileName = file.name;

    // check, if selected file is an image
    var isTypeCorrect = FILE_TYPES.some(function (type) {
      var regex = new RegExp('.+\\.' + type);
      return regex.test(fileName.toLowerCase());
    });

    if (isTypeCorrect) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        imageInserting[evt.target.id](reader.result);
      });

      reader.readAsDataURL(file);
    }
  };

  fileInputs.forEach(function (input) {
    input.accept = '.gif, .jpg, .jpeg, .png';
    input.addEventListener('change', inputChangeHandler);
  });
})();

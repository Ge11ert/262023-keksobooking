'use strict';

(function () {
  /**
   * @const {string}
   */
  var BASE_BORDER_COLOR = '#d9d9d3';

  /**
   * @enum {Array} FormFieldsParams
   */
  var FormFieldsParams = {
    TIME_OPTIONS: ['12:00', '13:00', '14:00'],
    ROOMS_OPTIONS: ['1', '2', '3', '100'],
    GUESTS_OPTIONS: ['1', '2', '3', '0'],
    APARTMENTS_OPTIONS: ['bungalo', 'flat', 'house', 'palace'],
    PRICE_OPTIONS: [0, 1000, 5000, 10000]
  };

  var bodyElement = document.querySelector('body');
  var form = document.querySelector('.notice__form');
  var resetButton = form.querySelector('.form__reset');
  var checkInSelect = form.querySelector('#timein');
  var checkOutSelect = form.querySelector('#timeout');

  var roomsSelect = form.querySelector('#room_number');
  var guestsSelect = form.querySelector('#capacity');

  var typeSelect = form.querySelector('#type');
  var titleInput = form.querySelector('#title');
  var priceInput = form.querySelector('#price');
  var addressInput = form.querySelector('#address');

  var avatarPreview = form.querySelector('.notice__preview img');
  var imagesContainer = form.querySelector('.form__photo-container');

  /**
   * Fills in the address input with position of the main pin
   */
  var setAddress = function () {
    var currentAddress = window.map.getMainPinPosition();
    addressInput.value = currentAddress.x + ' ' + currentAddress.y;
  };

  /**
   * Sets 'value' attribute of an element according to the provided value
   * @param {HTMLElement} element
   * @param {string|number} value
   */
  var syncValues = function (element, value) {
    element.value = value;
  };

  /**
   * Sets 'min' attribute of an element according to the provided value
   * Indicates min value in elements placeholder, if the element has it
   * @param {HTMLElement} element
   * @param {number} value
   */
  var syncValueWithMin = function (element, value) {
    element.min = value;
    if (element.placeholder) {
      element.placeholder = value;
    }
  };

  /**
   * Resets user avatar to the default value and removes
   * images, loaded by a user, from the page.
   */
  var removeImages = function () {
    var images = imagesContainer.querySelectorAll('img');
    avatarPreview.src = 'img/muffin.png';
    images.forEach(function (image) {
      imagesContainer.removeChild(image);
    });
  };

  /**
   * Disables all inappropriate select options
   * @param {string} currentGuests
   */
  var disableGuestsOptions = function (currentGuests) {
    Array.prototype.forEach.call(guestsSelect.options, function (option) {
      if (guestsSelect.value === '0') {
        option.disabled = (option.value !== currentGuests);
      } else {
        option.disabled = (option.value > currentGuests || option.value === '0');
      }
    });
  };

  /**
   * Sets all values to valid form after form enabling
   */
  var initializeForm = function () {
    window.synchronizeFields(roomsSelect, guestsSelect, FormFieldsParams.ROOMS_OPTIONS, FormFieldsParams.GUESTS_OPTIONS, syncValues);
    window.synchronizeFields(checkInSelect, checkOutSelect, FormFieldsParams.TIME_OPTIONS, FormFieldsParams.TIME_OPTIONS, syncValues);
    window.synchronizeFields(typeSelect, priceInput, FormFieldsParams.APARTMENTS_OPTIONS, FormFieldsParams.PRICE_OPTIONS, syncValueWithMin);
    disableGuestsOptions(guestsSelect.value);
    setAddress();
  };

  /**
   * If data sending is successful, shows message about that
   * and resets the form
   */
  var successHandler = function () {
    var successPopup = window.popup.createSuccess();
    bodyElement.appendChild(successPopup);
    form.reset();
    removeImages();
    initializeForm();
  };

  /**
   * If there are errors during data sending, shows a createWarning popup
   * @param {string} errorMessage
   */
  var errorHandler = function (errorMessage) {
    var warning = window.popup.createWarning('К сожалению, форма не была отправлена. ' + errorMessage);
    bodyElement.appendChild(warning);
  };

  /**
   * Creates a custom message in case of entering an incorrect title
   * @param {Node} title - Input[type='text'] for a title
   */
  var handleTitleInvalidity = function (title) {
    if (title.validity.tooShort || title.validity.patternMismatch) {
      var message = 'Заголовок должен содержать не менее 30 символов. Символов сейчас: ' + title.value.length;
      title.setCustomValidity(message);
    } else if (title.validity.tooLong) {
      title.setCustomValidity('Длина заголовка не должна превышать 100 символов');
    } else if (title.validity.valueMissing) {
      title.setCustomValidity('Пожалуйста, добавьте заголовок');
    } else {
      title.setCustomValidity('');
      title.style.borderColor = BASE_BORDER_COLOR;
    }
  };

  /**
   * Creates a custom message in case of entering an incorrect price
   * @param {Node} price - Input[type='text'] for a price
   */
  var handlePriceInvalidity = function (price) {
    var minValue = price.min;
    if (price.validity.rangeUnderflow) {
      var housingType = typeSelect.options[typeSelect.selectedIndex].text;
      var message = housingType + ' не может стоить менее ' + minValue;
      price.setCustomValidity(message);
    } else if (price.validity.rangeOverflow) {
      price.setCustomValidity('Цена не должна превышать 1 000 000');
    } else if (price.validity.valueMissing) {
      price.setCustomValidity('Пожалуйста, введите цену');
    } else {
      price.setCustomValidity('');
      price.style.borderColor = BASE_BORDER_COLOR;
    }
  };

  var validationTargets = {
    'title': handleTitleInvalidity,
    'price': handlePriceInvalidity
  };

  /**
   * Subscribes fields of the form to events
   */
  var bindEvents = function () {
    checkInSelect.addEventListener('change', function () {
      window.synchronizeFields(checkInSelect, checkOutSelect, FormFieldsParams.TIME_OPTIONS, FormFieldsParams.TIME_OPTIONS, syncValues);
    });

    checkOutSelect.addEventListener('change', function () {
      window.synchronizeFields(checkOutSelect, checkInSelect, FormFieldsParams.TIME_OPTIONS, FormFieldsParams.TIME_OPTIONS, syncValues);
    });

    roomsSelect.addEventListener('change', function () {
      window.synchronizeFields(roomsSelect, guestsSelect, FormFieldsParams.ROOMS_OPTIONS, FormFieldsParams.GUESTS_OPTIONS, syncValues);
      disableGuestsOptions(guestsSelect.value);
    });

    typeSelect.addEventListener('change', function () {
      window.synchronizeFields(typeSelect, priceInput, FormFieldsParams.APARTMENTS_OPTIONS, FormFieldsParams.PRICE_OPTIONS, syncValueWithMin);
      handlePriceInvalidity(priceInput);
    });

    titleInput.addEventListener('blur', function (evt) {
      handleTitleInvalidity(evt.target);
    });

    priceInput.addEventListener('blur', function (evt) {
      handlePriceInvalidity(evt.target);
    });

    form.addEventListener('invalid', function (evt) {
      evt.target.style.borderColor = 'red';
      evt.target.focus();
      validationTargets[evt.target.id](evt.target);
    }, true);

    form.addEventListener('submit', function (event) {
      window.backend.save(new FormData(form), successHandler, errorHandler);
      event.preventDefault();
    });

    resetButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      form.reset();
      removeImages();
      initializeForm();
    });
  };

  initializeForm();
  bindEvents();

  window.setAddress = setAddress;
})();

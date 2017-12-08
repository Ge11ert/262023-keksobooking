'use strict';

(function () {
  var initialAddress = {
    x: 600,
    y: 429
  };

  var form = document.querySelector('.notice__form');
  var checkInSelect = form.querySelector('#timein');
  var checkOutSelect = form.querySelector('#timeout');

  var roomsSelect = form.querySelector('#room_number');
  var guestsSelect = form.querySelector('#capacity');

  var typeSelect = form.querySelector('#type');
  var priceInput = form.querySelector('#price');
  var addressInput = form.querySelector('#address');

  /**
   * Fills in the address input with position of the main pin
   * @param {number} x
   * @param {number} y
   */
  var setAddress = function (x, y) {
    addressInput.value = x + ' ' + y;
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
   * Sets all values to valid form after form enabling
   */
  var initializeForm = function () {
    window.synchronizeFields(roomsSelect, guestsSelect, ['1', '2', '3', '100'], ['1', '2', '3', '0'], syncValues);
    window.synchronizeFields(checkInSelect, checkOutSelect, ['12:00', '13:00', '14:00'], ['12:00', '13:00', '14:00'], syncValues);
    window.synchronizeFields(typeSelect, priceInput, ['bungalo', 'flat', 'house', 'palace'], [0, 1000, 5000, 10000], syncValueWithMin);
    disableGuestsOptions(guestsSelect.value);
    setAddress(initialAddress.x, initialAddress.y);
  };

  /**
   * Subscribes fields of the form to events
   */
  var bindEvents = function () {
    checkInSelect.addEventListener('change', function () {
      window.synchronizeFields(checkInSelect, checkOutSelect, ['12:00', '13:00', '14:00'], ['12:00', '13:00', '14:00'], syncValues);
    });

    checkOutSelect.addEventListener('change', function () {
      window.synchronizeFields(checkOutSelect, checkInSelect, ['12:00', '13:00', '14:00'], ['12:00', '13:00', '14:00'], syncValues);
    });

    roomsSelect.addEventListener('change', function () {
      window.synchronizeFields(roomsSelect, guestsSelect, ['1', '2', '3', '100'], ['1', '2', '3', '0'], syncValues);
      disableGuestsOptions(guestsSelect.value);
    });

    typeSelect.addEventListener('change', function () {
      window.synchronizeFields(typeSelect, priceInput, ['bungalo', 'flat', 'house', 'palace'], [0, 1000, 5000, 10000], syncValueWithMin);
    });

    form.addEventListener('invalid', function (evt) {
      ValidationTargets[evt.target.id](evt.target);
      evt.target.style.borderColor = 'red';
    }, true);
  };

  /**
   * Creates a custom message in case of entering an incorrect title
   * @param {Node} title - Input[type='text'] for a title
   */
  var handleTitleInvalidity = function (title) {
    if (title.validity.tooShort) {
      var message = 'Заголовок должен содержать не менее 30 символов. Символов сейчас: ' + title.value.length;
      title.setCustomValidity(message);
    } else if (title.validity.tooLong) {
      title.setCustomValidity('Длина заголовка не должна превышать 100 символов');
    } else if (title.validity.valueMissing) {
      title.setCustomValidity('Пожалуйста, добавьте заголовок');
    } else {
      title.setCustomValidity('');
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
    }
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
   * @enum {Object.<string, function>} ValidationTargets
   */
  var ValidationTargets = {
    'title': handleTitleInvalidity,
    'price': handlePriceInvalidity
  };

  initializeForm();
  bindEvents();

  window.setAddress = setAddress;
})();

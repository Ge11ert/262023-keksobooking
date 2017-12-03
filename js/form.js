'use strict';

(function () {
  /**
   * @enum {number} HousingMinPrices
   */
  var HousingMinPrices = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  var form = document.querySelector('.notice__form');
  var checkInSelect = form.querySelector('#timein');
  var checkOutSelect = form.querySelector('#timeout');

  var roomsSelect = form.querySelector('#room_number');
  var guestsSelect = form.querySelector('#capacity');

  var typeSelect = form.querySelector('#type');
  var priceInput = form.querySelector('#price');
  var addressInput = form.querySelector('#address');
  var mainPin = document.querySelector('.map__pin--main');

  var guestsValue = null;

  /**
   * Sets the minimum acceptable value of price, according to
   * the selected type of accommodation
   */
  var typeSelectChangeHandler = function () {
    priceInput.min = HousingMinPrices[typeSelect.value];
    priceInput.placeholder = priceInput.min;
  };

  /**
   * Fills in the address input with initial position of the main pin
   */
  var showAddress = function () {
    var left = parseInt(getComputedStyle(mainPin).getPropertyValue('left'), 10);
    var top = parseInt(getComputedStyle(mainPin).getPropertyValue('top'), 10);
    addressInput.value = left + ' ' + top;
  };

  /**
   * Gets an index of the selected option from 'select1' and selects the option
   * from 'select2' with the same index
   * @param {Node} select1
   * @param {Node} select2
   */
  var synchronizeByIndex = function (select1, select2) {
    select2.options[select1.selectedIndex].selected = 'selected';
  };

  /**
   * Sets a value of the select2 the same, as a current value of select1
   * @param {Node} select1
   * @param {Node} select2
   * @return {string}
   */
  var synchronizeByValue = function (select1, select2) {
    var value = select1.value;
    select2.value = (value === '100') ? '0' : value;
    return select2.value;
  };

  /**
   *
   */
  var initializeForm = function () {
    guestsValue = synchronizeByValue(roomsSelect, guestsSelect);
    disableGuestsOptions(guestsValue);
    synchronizeByIndex(checkInSelect, checkOutSelect);
    showAddress();
    typeSelectChangeHandler();
  };

  /**
   * Subscribes fields of the form to events
   */
  var bindEvents = function () {
    checkInSelect.addEventListener('change', function () {
      synchronizeByIndex(checkInSelect, checkOutSelect);
    });

    checkOutSelect.addEventListener('change', function () {
      synchronizeByIndex(checkOutSelect, checkInSelect);
    });

    roomsSelect.addEventListener('change', function () {
      guestsValue = synchronizeByValue(roomsSelect, guestsSelect);
      disableGuestsOptions(guestsValue);
    });

    // guestsSelect.addEventListener('change', function (evt) {
    //   evt.target.value = guestsValue;
    // });

    typeSelect.addEventListener('change', typeSelectChangeHandler);

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
      if (guestsValue === '0') {
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
})();

'use strict';

window.mapEvents = (function () {

  /** @enum {number} KeyCodes */
  var KeyCodes = {
    ENTER: 13,
    ESC: 27
  };

  var mapPinsFragment = window.mapView.mapPinsFragment;
  var advCard = null;

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');

  var filtersContainer = document.querySelector('map__filters-container');
  var noticeForm = document.querySelector('.notice__form');
  var noticeFieldsets = noticeForm.querySelectorAll('.notice__form fieldset');

  /**
   * Sets the active state of the selected pin and shows related advert card
   * @param {Event} evt
   * @param {Advert} advert
   */
  var pinClickHandler = function (evt, advert) {
    closePinInfo();

    evt.currentTarget.classList.add('map__pin--active');
    advCard = window.mapView.fillAdvertCard(advert);
    map.insertBefore(advCard, filtersContainer);

    advCard.querySelector('.popup__close').addEventListener('click', function () {
      closePinInfo();
    });
    mapPins.addEventListener('keydown', mapKeydownHandler);
  };

  /**
   * Calls a function after pressing down the ESC key
   * @param {Event} evt
   */
  var mapKeydownHandler = function (evt) {
    if (evt.keyCode === KeyCodes.ESC) {
      closePinInfo();
    }
  };

  /**
   * Enables fields of the form and removes fading overlay from the map
   */
  var enableMap = function () {
    mapPins.appendChild(mapPinsFragment);
    map.classList.remove('map--faded');
    noticeForm.classList.remove('notice__form--disabled');
    setDisableProperty(noticeFieldsets, false);
  };

  /**
   * Adds or removes 'disabled' attribute for each element of NodeList
   * @param {NodeList} nodeList
   * @param {boolean} isDisabled
   */
  var setDisableProperty = function (nodeList, isDisabled) {
    nodeList.forEach(function (node) {
      node.disabled = isDisabled;
    });
  };

  /**
   * Removes the active state of currently active pin and hides its advert card
   */
  var closePinInfo = function () {
    removeActiveState();
    hideAdvertCard();
    mapPins.removeEventListener('keydown', mapKeydownHandler);
  };

  /**
   * Removes the 'active' modifier from class list of a pin
   */
  var removeActiveState = function () {
    var activePin = document.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
  };

  /**
   * Deletes advert card form DOM, when a pin has no 'active' state
   */
  var hideAdvertCard = function () {
    if (advCard) {
      map.removeChild(advCard);
      advCard = null;
    }
  };

  setDisableProperty(noticeFieldsets, true);

  mainPin.addEventListener('mouseup', function (evt) {
    evt.target.classList.add('map__pin--active');
    enableMap();
  });

  mainPin.addEventListener('keydown', function (evt) {
    if (evt.keyCode === KeyCodes.ENTER) {
      enableMap();
    }
  });

  return {
    pinClickHandler: pinClickHandler
  };
})();

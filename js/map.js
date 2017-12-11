'use strict';

(function () {
  /**
   * @typedef {Object} Advert
   * @property {Object} author
   * @property {Object} offer
   * @property {Object} location
   */

  /** @enum {number} KeyCodes */
  var KeyCodes = {
    ENTER: 13,
    ESC: 27
  };

  /** @enum {number} MainPinParams */
  var MainPinParams = {
    WIDTH: 64,
    HEIGHT: 64,
    ARROW_HEIGHT: 22
  };

  var MAX_ADVERTS_AMOUNT = 5;

  var pinOffsetY = MainPinParams.HEIGHT / 2 + MainPinParams.ARROW_HEIGHT;

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');
  var filtersContainer = document.querySelector('map__filters-container');

  var noticeForm = document.querySelector('.notice__form');
  var noticeFieldsets = noticeForm.querySelectorAll('.notice__form fieldset');
  var adverts = null;
  var mapPinsArray = null;
  var mapPinsFragment = null;

  /** @enum {number} MapConstraints */
  var MapConstraints = {
    TOP: 100 - pinOffsetY,
    BOTTOM: 500 - pinOffsetY,
    LEFT: 0,
    RIGHT: map.clientWidth
  };

  var successLoadHandler = function (loadedData) {
    adverts = createAdvertsArray(loadedData);
    mapPinsArray = createPinsFromData(adverts);
    mapPinsFragment = renderAllPins(mapPinsArray);
  };

  var loadErrorHandler = function (errorMessage) {
    var warning = window.createWarningPopup('Не удалось загрузить объявления. ' + errorMessage);
    document.querySelector('body').appendChild(warning);
  };

  /**
   * Fills up an array with generated adverts
   * @param {Object} data
   * @return {Array.<Advert>}
   */
  var createAdvertsArray = function (data) {
    var advertsArray = [];
    for (var i = 0; i < data.length; i++) {

      advertsArray.push(data[i]);
    }
    return window.utils.getRandomArrayCopy(MAX_ADVERTS_AMOUNT, advertsArray, true);
  };

  /**
   * Creates an array of DOM elements 'Map pin'
   * @param {Array.<Advert>} advertsArray
   * @return {Array.<Element>} - Array of DOM elements
   */
  var createPinsFromData = function (advertsArray) {
    var pinsArray = [];

    advertsArray.forEach(function (item) {
      pinsArray.push(window.pin.render(item));
    });

    return pinsArray;
  };

  /**
   * Creates a DOM fragment, filled with rendered map pins
   * @param {Array.<Element>} pinsArray
   * @return {DocumentFragment}
   */
  var renderAllPins = function (pinsArray) {
    var fragment = document.createDocumentFragment();

    pinsArray.forEach(function (pin) {
      fragment.appendChild(pin);
    });

    return fragment;
  };

  var insertExternalNode = function (node) {
    map.insertBefore(node, filtersContainer);
  };

  /**
   * Enables fields of the form and removes fading overlay from the map
   */
  var enableMap = function () {
    if (mapPinsFragment) {
      mapPins.appendChild(mapPinsFragment);
    }
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

  mainPin.addEventListener('mousedown', function (evt) {
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    mainPin.style.cursor = 'none';
    document.documentElement.style.cursor = 'none';

    /**
     * Manages a 'drag' action of the main pin of the map.
     * Movement of the pin is bound to position of the cursor
     * @param {Event} moveEvt
     */
    var pinMouseMoveHandler = function (moveEvt) {
      var shift = {
        x: moveEvt.clientX - startCoords.x,
        y: moveEvt.clientY - startCoords.y
      };

      var currentCoords = {
        x: mainPin.offsetLeft + shift.x,
        y: mainPin.offsetTop + shift.y
      };

      if (currentCoords.x < MapConstraints.LEFT) {
        currentCoords.x = MapConstraints.LEFT;
      }

      if (currentCoords.x > MapConstraints.RIGHT) {
        currentCoords.x = MapConstraints.RIGHT;
      }

      if (currentCoords.y < MapConstraints.TOP) {
        currentCoords.y = MapConstraints.TOP;
      }

      if (currentCoords.y > MapConstraints.BOTTOM) {
        currentCoords.y = MapConstraints.BOTTOM;
      }

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      mainPin.style.top = (currentCoords.y) + 'px';
      mainPin.style.left = (currentCoords.x) + 'px';

      window.setAddress(currentCoords.x, currentCoords.y + pinOffsetY);
    };

    var pinMouseUpHandler = function () {
      mainPin.classList.remove('map__pin--active');
      enableMap();

      mainPin.style.cursor = 'move';
      document.documentElement.style.cursor = 'auto';
      document.removeEventListener('mousemove', pinMouseMoveHandler);
      document.removeEventListener('mouseup', pinMouseUpHandler);
    };

    mainPin.classList.add('map__pin--active');
    document.addEventListener('mousemove', pinMouseMoveHandler);
    document.addEventListener('mouseup', pinMouseUpHandler);
  });

  mainPin.addEventListener('keydown', function (evt) {
    if (evt.keyCode === KeyCodes.ENTER) {
      enableMap();
    }
  });

  window.backend.load(successLoadHandler, loadErrorHandler);
  setDisableProperty(noticeFieldsets, true);

  window.insertExternalNode = insertExternalNode;
})();

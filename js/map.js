'use strict';

(function () {
  /**
   * @typedef {Object} Advert
   * @property {Object} author
   * @property {Object} offer
   * @property {Object} location
   */

  /** @const {number} */
  var MAX_ADVERTS_AMOUNT = 5;

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

  /** @enum {number} LocationBorders */
  var LocationBorders = {
    Y_MIN: 100,
    Y_MAX: 500
  };

  var pinOffsetY = MainPinParams.HEIGHT / 2 + MainPinParams.ARROW_HEIGHT;

  var map = document.querySelector('.map');
  var mapPinsContainer = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');

  var noticeForm = document.querySelector('.notice__form');
  var noticeFieldsets = noticeForm.querySelectorAll('.notice__form fieldset');
  var adverts = [];
  var mapPinsFragment = null;

  /** @enum {number} MapConstraints */
  var MapConstraints = {
    TOP: LocationBorders.Y_MIN - pinOffsetY,
    BOTTOM: LocationBorders.Y_MAX - pinOffsetY,
    LEFT: 0,
    RIGHT: map.clientWidth
  };

  /**
   * In case of successful downloading from a server, invokes a chain of functions
   * to render loaded adverts in the map
   * @param {Object.<Advert>} loadedData
   */
  var successHandler = function (loadedData) {
    adverts = createAdvertsArray(loadedData);
    var mapPins = createPinsArray(window.utils.getRandomArrayCopy(MAX_ADVERTS_AMOUNT, adverts, true));
    mapPinsFragment = renderPins(mapPins);
  };

  /**
   * In case of failed downloading from a sever, shows createWarning message
   * with error details
   * @param {string} errorMessage
   */
  var errorHandler = function (errorMessage) {
    var warning = window.popup.createWarning('Не удалось загрузить объявления. ' + errorMessage);
    document.querySelector('body').appendChild(warning);
  };

  /**
   * Fills up an array with loaded adverts
   * @param {Object} data
   * @return {Array.<Advert>}
   */
  var createAdvertsArray = function (data) {
    var advertsArray = [];
    for (var i = 0; i < data.length; i++) {

      advertsArray.push(data[i]);
    }
    return advertsArray;
  };

  /**
   * Creates an array of DOM elements 'Map pin'
   * @param {Array.<Advert>} advertsArray
   * @return {Array.<Element>} - Array of DOM elements
   */
  var createPinsArray = function (advertsArray) {
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
  var renderPins = function (pinsArray) {
    var fragment = document.createDocumentFragment();

    pinsArray.forEach(function (pin) {
      fragment.appendChild(pin);
    });

    return fragment;
  };

  /**
   * Returns position of the main pin, relative to the map
   * This position indicates 'address' point, so that pin vertical size is considered
   * @return {{x: number, y: number}}
   */
  var getMainPinPosition = function () {
    return {
      x: mainPin.offsetLeft,
      y: mainPin.offsetTop + pinOffsetY
    };
  };

  var insertExternalNode = function (node) {
    map.insertBefore(node, mapPinsContainer.nextSibling);
  };

  /**
   * Enables fields of the form and removes fading overlay from the map
   */
  var enableMap = function () {
    var initAddress = getMainPinPosition();
    if (mapPinsFragment) {
      mapPinsContainer.appendChild(mapPinsFragment);
    }

    window.setAddress(initAddress.x, initAddress.y);
    map.classList.remove('map--faded');
    noticeForm.classList.remove('notice__form--disabled');
    setDisableProperty(noticeFieldsets, false);
  };


  /**
   * Creates an array of filtered adverts, using 'filter.js' module.
   * Clears the map from previously rendered pins and renders only acceptable pins
   */
  var updateMap = function () {
    var filteredAdverts = window.filterAdverts(adverts);
    var filteredPins = createPinsArray(window.utils.getRandomArrayCopy(MAX_ADVERTS_AMOUNT, filteredAdverts, true));

    window.utils.clearDOMNode(mapPinsContainer);
    mapPinsContainer.appendChild(mainPin);
    window.card.hide();
    mapPinsContainer.appendChild(renderPins(filteredPins));
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
   * Enables the ability to drag the main pin
   */
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

      window.setAddress();
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

  window.backend.load(successHandler, errorHandler);
  setDisableProperty(noticeFieldsets, true);

  window.map = {
    insertExternalNode: insertExternalNode,
    getMainPinPosition: getMainPinPosition,
    update: updateMap
  };
})();

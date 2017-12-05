'use strict';

(function () {
  /**
   * @typedef {Object} Advert
   * @property {Object} author
   * @property {Object} offer
   * @property {Object} location
   */

  /**
   * @enum {Array.<string>|Object|number} AdvertParams
   */
  var AdvertParams = {
    TITLES: [
      'Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
      'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
      'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],

    TYPES: ['flat', 'house', 'bungalo'],

    CHECKINOUT_TIMES: ['12:00', '13:00', '14:00'],

    FEATURES_LIST: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],

    LOCATION_BORDERS: {
      X_MIN: 300,
      Y_MIN: 100,
      X_MAX: 900,
      Y_MAX: 500
    },

    ROOMS_AMOUNT: {
      MIN: 1,
      MAX: 5
    },

    PRICES: {
      MIN: 1000,
      MAX: 1000000
    },

    ADVERTS_AMOUNT: 8,

    MAX_GUESTS: 7
  };

  /** @enum {number} KeyCodes */
  var KeyCodes = {
    ENTER: 13,
    ESC: 27
  };

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');
  var filtersContainer = document.querySelector('map__filters-container');

  var noticeForm = document.querySelector('.notice__form');
  var noticeFieldsets = noticeForm.querySelectorAll('.notice__form fieldset');

  // -------------------------------------------------------------------
  // ------------------- Functions of MODEL component ------------------

  /**
   * Fills up an array with generated adverts
   * @return {Array.<Advert>}
   */
  var createAdvertsArray = function () {
    var advertsArray = [];
    for (var i = 0; i < AdvertParams.ADVERTS_AMOUNT; i++) {
      advertsArray.push(generateAdvert(i));
    }

    return advertsArray;
  };

  /**
   * Creates an object of type Advert
   * @param {number} advertIndex
   * @return {Advert}
   */
  var generateAdvert = function (advertIndex) {
    var locX = Math.floor(window.utils.getRandomFromRange(AdvertParams.LOCATION_BORDERS.X_MIN, AdvertParams.LOCATION_BORDERS.X_MAX));
    var locY = Math.floor(window.utils.getRandomFromRange(AdvertParams.LOCATION_BORDERS.Y_MIN, AdvertParams.LOCATION_BORDERS.Y_MAX));
    var title = getOfferTitle(advertIndex);
    var houseType = getHouseType(title);

    return {
      author: {
        avatar: getUserAvatar(advertIndex)
      },

      offer: {
        title: title,
        address: locX + ' ' + locY,
        price: Math.floor(window.utils.getRandomFromRange(AdvertParams.PRICES.MIN, AdvertParams.PRICES.MAX)),
        type: houseType,
        rooms: getRoomsQuantity(),
        guests: Math.floor(window.utils.getRandomFromRange(1, AdvertParams.MAX_GUESTS)),
        checkin: getCheckInOutTime(AdvertParams.CHECKINOUT_TIMES),
        checkout: getCheckInOutTime(AdvertParams.CHECKINOUT_TIMES),
        features: getFeaturesList(),
        description: '',
        photos: []
      },

      location: {
        x: locX,
        y: locY
      }
    };
  };

  /**
   * Generates relative path to a user image
   * @param {number} userIndex
   * @return {string} - Path to user image
   */
  var getUserAvatar = function (userIndex) {
    var pathBase = 'img/avatars/user';
    userIndex++;
    pathBase = (userIndex < 10) ? pathBase + '0' : pathBase;

    return pathBase + userIndex + '.png';
  };

  /**
   * Takes a title for an advert
   * @param {number} index - Current advert index
   * @return {string} - A title for a new advert
   */
  var getOfferTitle = function (index) {
    return AdvertParams.TITLES[index];
  };

  /**
   * Returns a title of an advert according to its house type
   * @param {string} advertTitle
   * @return {string}
   */
  var getHouseType = function (advertTitle) {
    var typeIndex = 0;
    if (/квартира/.test(advertTitle.toLowerCase())) {
      typeIndex = 0;
    } else if (/дворец/.test(advertTitle.toLowerCase())) {
      typeIndex = 1;
    } else {
      typeIndex = 2;
    }

    return AdvertParams.TYPES[typeIndex];
  };

  /**
   * Returns a random number of rooms for each advert
   * @return {number}
   */
  var getRoomsQuantity = function () {
    return Math.floor(window.utils.getRandomFromRange(AdvertParams.ROOMS_AMOUNT.MIN, AdvertParams.ROOMS_AMOUNT.MAX));
  };

  /**
   * Selects one of the time options from array for 'check in' time or 'check out' time
   * @param {Array.<string>} checkTimeArray
   * @return {string}
   */
  var getCheckInOutTime = function (checkTimeArray) {
    var timeIndex = window.utils.getRandomFromRange(0, checkTimeArray.length - 1).toFixed();

    return checkTimeArray[timeIndex];
  };

  /**
   * Generates a random set of advert features.
   * @return {Array} - Array of random chosen features
   */
  var getFeaturesList = function () {
    var featuresArrayLength = Math.floor(window.utils.getRandomFromRange(1, AdvertParams.FEATURES_LIST.length));

    return window.utils.getRandomArrayCopy(featuresArrayLength, AdvertParams.FEATURES_LIST, true);
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

  var insertExternalNode = function (card) {
    map.insertBefore(card, filtersContainer);
  };

  var removeNode = function (card) {
    map.removeChild(card);
  };

  var Actions = {
    'insert': insertExternalNode,
    'remove': removeNode
  };

  var toggleNodePresence = function (node, action) {
    Actions[action](node);
  };

  var adverts = createAdvertsArray();
  var mapPinsArray = createPinsFromData(adverts);
  var mapPinsFragment = renderAllPins(mapPinsArray);

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

  window.toggleNodePresence = toggleNodePresence;
})();

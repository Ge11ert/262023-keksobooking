'use strict';

(function () {
  /**
   * @typedef {Object} Advert
   * @property {Object} author
   * @property {Object} offer
   * @property {Object} location
   */

  /** @const {number} */
  var ADVERTS_AMOUNT = 8;

  /** @const {Array.<string>} */
  var TITLES = [
    'Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
    'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

  /** @const {Array.<string>} */
  var TYPES = ['flat', 'house', 'bungalo'];

  /** @const {Array.<string>} */
  var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];

  /** @const {Array.<string>} */
  var CHECKOUT_TIMES = ['12:00', '13:00', '14:00'];

  /** @const {Array.<string>} */
  var FEATURES_LIST = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  /** @enum {number} Prices */
  var Prices = {
    MIN: 1000,
    MAX: 1000000
  };

  /** @enum {number} RoomsAmount */
  var RoomsAmount = {
    MIN: 1,
    MAX: 5
  };

  /** @enum {number} LocationBorders */
  var LocationBorders = {
    X_MIN: 300,
    Y_MIN: 100,
    X_MAX: 900,
    Y_MAX: 500
  };

  var MAX_GUESTS = 10;

  var userIndex = 0;
  var lastUsedTitle = 0;
  var adverts = createAdvertsArray();
  console.log(adverts);

  /**
   *
   * @return {Array.<Advert>}
   */
  function createAdvertsArray() {
    var advertsArray = [];
    for (var i = 0; i < ADVERTS_AMOUNT; i++) {
      advertsArray.push(generateAdvert());
    }
    return advertsArray;
  }

  /**
   * Creates an object of type Advert
   * @return {Advert}
  */
  function generateAdvert() {
    var advert = {
      author: {
        avatar: getUserAvatar()
      },

      offer: {
        title: getOfferTitle(),
        address: '',
        price: Math.floor(getRandomFromRange(Prices.MIN, Prices.MAX)),
        type: getHouseType(),
        rooms: getRoomsQuantity(),
        guests: Math.floor(getRandomFromRange(1, MAX_GUESTS)),
        checkin: getCheckinTime(),
        checkout: getCheckoutTime(),
        features: getFeaturesList(),
        description: '',
        photos: []
      },

      location: {
        x: Math.floor(getRandomFromRange(LocationBorders.X_MIN, LocationBorders.X_MAX)),
        y: Math.floor(getRandomFromRange(LocationBorders.Y_MIN, LocationBorders.Y_MAX))
      }
    };
    advert.offer.address = advert.location.x + ' ' + advert.location.y;
    return advert;
  }

  function getUserAvatar() {
    var pathBase = 'img/avatars/user0';
    if (userIndex < ADVERTS_AMOUNT) {
      userIndex++;
      return pathBase + userIndex + '.png';
    } else {
      return 'img/avatars/default.png';
    }
  }

  function getOfferTitle() {
    var title = TITLES[lastUsedTitle];
    lastUsedTitle++;
    return title;
  }

  function getHouseType() {
    var typeIndex = getRandomFromRange(0, TYPES.length - 1).toFixed();
    return TYPES[typeIndex];
  }

  function getRoomsQuantity() {
    return Math.floor(getRandomFromRange(RoomsAmount.MIN, RoomsAmount.MAX));
  }

  function getCheckinTime() {
    var timeIndex = getRandomFromRange(0, CHECKIN_TIMES.length - 1).toFixed();
    return CHECKIN_TIMES[timeIndex];
  }

  function getCheckoutTime() {
    var timeIndex = getRandomFromRange(0, CHECKOUT_TIMES.length - 1).toFixed();
    return CHECKOUT_TIMES[timeIndex];
  }

  function getFeaturesList() {
    var featuresArrayLength = getRandomFromRange(1, FEATURES_LIST.length).toFixed();
    var featuresArray = [];
    var arrayOfIndexes = [];

    for (var k = 0; k < FEATURES_LIST.length; k++) {
      arrayOfIndexes.push(k);
    }

    for (var i = 0; i < featuresArrayLength; i++) {
      var randomIndex = arrayOfIndexes[getRandomFromRange(0, arrayOfIndexes.length - 1).toFixed()];
      featuresArray.push(FEATURES_LIST[randomIndex]);
      arrayOfIndexes.splice(arrayOfIndexes.indexOf(randomIndex), 1);
    }
    return featuresArray;
  }

  /**
   * Returns a random number between min and max
   * @param {number} min
   * @param {number} max
   * @return {number}
   */
  function getRandomFromRange(min, max) {
    return Math.random() * (max - min) + min;
  }

})();

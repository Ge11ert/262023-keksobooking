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

  /** @const {number} */
  var MAX_GUESTS = 7;

  var userIndex = 0;
  var lastUsedTitle = 0;
  var adverts = createAdvertsArray();

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mapPinsArray = createPinsFromData(adverts);
  var mapPinsFragment = renderAllPins(mapPinsArray);

  var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');
  var filtersContainer = document.querySelector('map__filters-container');

  /** -------------------------------------------------------------------
   *  ------------------- Functions of MODEL component ------------------- */

  /**
   * Fills up an array with generated adverts
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
        type: '',
        rooms: getRoomsQuantity(),
        guests: Math.floor(getRandomFromRange(1, MAX_GUESTS)),
        checkin: getCheckInOutTime(CHECKIN_TIMES),
        checkout: getCheckInOutTime(CHECKOUT_TIMES),
        features: getFeaturesList(),
        description: '',
        photos: []
      },

      location: {
        x: Math.floor(getRandomFromRange(LocationBorders.X_MIN, LocationBorders.X_MAX)),
        y: Math.floor(getRandomFromRange(LocationBorders.Y_MIN, LocationBorders.Y_MAX))
      }
    };
    advert.offer.type = getHouseType(advert.offer.title);
    advert.offer.address = advert.location.x + ' ' + advert.location.y;
    return advert;
  }

  /**
   * @return {string} - Path to user image
   */
  function getUserAvatar() {
    var pathBase = 'img/avatars/user0';
    if (userIndex < ADVERTS_AMOUNT) {
      userIndex++;
      return pathBase + userIndex + '.png';
    } else {
      return 'img/avatars/default.png';
    }
  }

  /**
   * @return {string} - A title for a new advert
   */
  function getOfferTitle() {
    var title = TITLES[lastUsedTitle];
    lastUsedTitle++;
    return title;
  }

  /**
   *
   * @param {string} advertTitle
   * @return {string}
   */
  function getHouseType(advertTitle) {
    var typeIndex = 0;
    switch (true) {
      case (advertTitle.search(/[Кк]вартира/) > -1):
        typeIndex = 0;
        break;
      case (advertTitle.search(/[Дд]ворец|[Дд]ом/) > -1):
        typeIndex = 1;
        break;
      case (advertTitle.search(/[Бб]унгало/) > -1):
        typeIndex = 2;
        break;
    }
    return TYPES[typeIndex];
  }

  /**
   * @return {number}
   */
  function getRoomsQuantity() {
    return Math.floor(getRandomFromRange(RoomsAmount.MIN, RoomsAmount.MAX));
  }

  /**
   * @param {Array.<String>} checkTimeArray
   * @return {String}
   */
  function getCheckInOutTime(checkTimeArray) {
    var timeIndex = getRandomFromRange(0, checkTimeArray.length - 1).toFixed();
    return checkTimeArray[timeIndex];
  }

  /**
   * Generates a random set of advert features. In each iteration of 'for loop',
   * arrayOfIndexes indicates the features, which weren't already used.
   * @return {Array} - Array of random chosen features
   */
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


  /** -------------------------------------------------------------------
   *  ------------------- Functions of VIEW component ------------------- */

  /**
   * Creates a DOM Element 'Map Pin' using data from a single advert
   * @param {Advert} advert
   * @return {Element}
   */
  function renderMapPin(advert) {
    var pinWidth = 40;
    var pinHeight = 40;
    var offset = {
      x: pinWidth / 2,
      y: pinHeight
    };

    var pin = document.createElement('button');
    var avatar = document.createElement('img');

    pin.classList.add('map__pin');
    pin.style.left = advert.location.x - offset.x + 'px';
    pin.style.top = advert.location.y - offset.y + 'px';

    avatar.src = advert.author.avatar;
    avatar.width = pinWidth;
    avatar.height = pinHeight;
    avatar.draggable = false;

    pin.appendChild(avatar);
    return pin;
  }

  /**
   * Creates an array of DOM elements 'Map pin'
   * @param {Array.<Advert>} advertsArray
   * @return {Array.<Element>} - Array of DOM elements
   */
  function createPinsFromData(advertsArray) {
    var pinsArray = [];
    advertsArray.forEach(function (item) {
      pinsArray.push(renderMapPin(item));
    });
    return pinsArray;
  }

  /**
   * Creates a DOM fragment, filled with rendered map pins
   * @param {Array.<Element>} pinsArray
   * @return {DocumentFragment}
   */
  function renderAllPins(pinsArray) {
    var fragment = document.createDocumentFragment();

    pinsArray.forEach(function (pin) {
      fragment.appendChild(pin);
    });
    return fragment;
  }

  /**
   * Fills a DOM Node 'Advert card' with data from a single advert object
   * @param {Advert} advert
   * @return {Node}
   */
  function fillAdvertCard(advert) {
    var card = mapCardTemplate.cloneNode(true);

    var cardTitle = card.querySelector('h3');
    var cardAddress = card.querySelector('small');
    var cardPrice = card.querySelector('.popup__price');
    var cardType = card.querySelector('h4');
    var cardRooms = card.querySelector('p:nth-of-type(3)');
    var cardTime = card.querySelector('p:nth-of-type(4)');
    var cardFeatures = card.querySelector('.popup__features');
    var cardDescription = card.querySelector('p:nth-of-type(5)');
    var userAvatar = card.querySelector('.popup__avatar');

    /**
     * @param {string} type
     * @return {string}
     */
    function getType(type) {
      switch (type) {
        case 'flat':
          return 'Квартира';
        case 'house':
          return 'Дом';
        case 'bungalo':
          return 'Бунгало';
      }
      return '';
    }

    /** @return {string} */
    function getRoomsAndGuests() {
      var guestsEnding = '';
      var roomsEnding = '';

      if (advert.offer.guests === 1) {
        guestsEnding = 'гостя';
      } else {
        guestsEnding = 'гостей';
      }

      switch (advert.offer.rooms) {
        case 1:
          roomsEnding = 'комната';
          break;
        case 5:
          roomsEnding = 'комнат';
          break;
        default:
          roomsEnding = 'комнаты';
          break;
      }
      return advert.offer.rooms + ' ' + roomsEnding + ' для ' + advert.offer.guests + ' ' + guestsEnding;
    }

    /**
     * @param {Node} featureList
     * @return {Node}
     */
    function checkFeatures(featureList) {
      while (featureList.hasChildNodes()) {
        featureList.removeChild(featureList.lastChild); // clear UL element
      }
      advert.offer.features.forEach(function (feature) {
        var li = document.createElement('li');
        li.className = 'feature feature--' + feature;
        featureList.appendChild(li);
      });
      return featureList;
    }

    cardTitle.textContent = advert.offer.title;
    cardAddress.textContent = advert.offer.address;
    cardPrice.textContent = advert.offer.price + '\t\u20BD/ночь';
    cardType.textContent = getType(advert.offer.type);
    cardRooms.textContent = getRoomsAndGuests();
    cardTime.textContent = 'Заезд после ' + advert.offer.checkin + ', ' + 'выезд до ' + advert.offer.checkout;
    checkFeatures(cardFeatures);
    cardDescription.textContent = advert.offer.description;
    userAvatar.src = advert.author.avatar;
    return card;
  }

  map.classList.remove('map--faded');
  mapPins.appendChild(mapPinsFragment);
  var advCard = fillAdvertCard(adverts[0]);
  map.insertBefore(advCard, filtersContainer);
})();

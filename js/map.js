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

    ACCOMMODATION_TYPES: {
      'flat': 'Квартира',
      'house': 'Дом',
      'bungalo': 'Бунгало'
    },

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

  /** @enum {number} PinImageParams */
  var PinImageParams = {
    WIDTH: 40,
    HEIGHT: 40,
    ARROW_HEIGHT: 18
  };

  var pinOffsetY = PinImageParams.HEIGHT / 2 + PinImageParams.ARROW_HEIGHT;

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');
  var filtersContainer = document.querySelector('map__filters-container');

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
    var locX = Math.floor(getRandomFromRange(AdvertParams.LOCATION_BORDERS.X_MIN, AdvertParams.LOCATION_BORDERS.X_MAX));
    var locY = Math.floor(getRandomFromRange(AdvertParams.LOCATION_BORDERS.Y_MIN, AdvertParams.LOCATION_BORDERS.Y_MAX));
    var title = getOfferTitle(advertIndex);
    var houseType = getHouseType(title);

    return {
      author: {
        avatar: getUserAvatar(advertIndex)
      },

      offer: {
        title: title,
        address: locX + ' ' + locY,
        price: Math.floor(getRandomFromRange(AdvertParams.PRICES.MIN, AdvertParams.PRICES.MAX)),
        type: houseType,
        rooms: getRoomsQuantity(),
        guests: Math.floor(getRandomFromRange(1, AdvertParams.MAX_GUESTS)),
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
    return Math.floor(getRandomFromRange(AdvertParams.ROOMS_AMOUNT.MIN, AdvertParams.ROOMS_AMOUNT.MAX));
  };

  /**
   * Selects one of the time options from array for 'check in' time or 'check out' time
   * @param {Array.<string>} checkTimeArray
   * @return {string}
   */
  var getCheckInOutTime = function (checkTimeArray) {
    var timeIndex = getRandomFromRange(0, checkTimeArray.length - 1).toFixed();

    return checkTimeArray[timeIndex];
  };

  /**
   * Generates a random set of advert features.
   * @return {Array} - Array of random chosen features
   */
  var getFeaturesList = function () {
    var featuresArrayLength = Math.floor(getRandomFromRange(1, AdvertParams.FEATURES_LIST.length));

    return getRandomArrayCopy(featuresArrayLength, AdvertParams.FEATURES_LIST, true);
  };

  /**
   * Creates an array of defined size. This array is filled with elements from the base array.
   * Elements of the new array can be repeating or not. Elements order is random.
   * @param {number} arrLen - Length of an array to be returned
   * @param {Array} baseArray - Initial array, from which elements will be copied
   * @param {boolean} unique - Defines, if array elements should be non-repeatable
   * @return {Array}
   */
  var getRandomArrayCopy = function (arrLen, baseArray, unique) {
    var baseArrCopy = baseArray.slice();
    var newArray = [];
    var newItem;

    if (arrLen > baseArray.length) {
      arrLen = baseArray.length;
    }

    while (newArray.length < arrLen) {
      newItem = baseArray[Math.floor(getRandomFromRange(0, baseArrCopy.length - 1))];
      if (unique && newArray.indexOf(newItem) !== -1) {
        continue;
      } else {
        newArray.push(newItem);
      }
    }

    return newArray;
  };

  /**
   * Returns a random number between min and max
   * @param {number} min
   * @param {number} max
   * @return {number}
   */
  var getRandomFromRange = function (min, max) {
    return Math.random() * (max - min) + min;
  };


  // -------------------------------------------------------------------
  // ------------------- Functions of VIEW component -------------------

  /**
   * Creates a DOM Element 'Map Pin' using data from a single advert
   * @param {Advert} advert
   * @return {Element}
   */
  var renderMapPin = function (advert) {
    var pin = document.createElement('button');
    var avatar = document.createElement('img');

    avatar.src = advert.author.avatar;
    avatar.width = PinImageParams.WIDTH;
    avatar.height = PinImageParams.HEIGHT;
    avatar.draggable = false;

    pin.appendChild(avatar);

    pin.classList.add('map__pin');
    pin.style.left = advert.location.x + 'px';
    pin.style.top = advert.location.y - pinOffsetY + 'px';

    return pin;
  };

  /**
   * Creates an array of DOM elements 'Map pin'
   * @param {Array.<Advert>} advertsArray
   * @return {Array.<Element>} - Array of DOM elements
   */
  var createPinsFromData = function (advertsArray) {
    var pinsArray = [];

    advertsArray.forEach(function (item) {
      pinsArray.push(renderMapPin(item));
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

  /**
   * Fills a DOM Node 'Advert card' with data from a single advert object
   * @param {Advert} advert
   * @return {Node}
   */
  var fillAdvertCard = function (advert) {
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
     * Returns a string with house type to be rendered
     * @param {string} type
     * @return {string}
     */
    var getType = function (type) {

      return (AdvertParams.ACCOMMODATION_TYPES[type] || '');
    };

    /** @return {string} */
    var getRoomsAndGuests = function () {
      var guestsEnding = getEnding(advert.offer.guests, ['гостя', 'гостей', 'гостей']);
      var roomsEnding = getEnding(advert.offer.rooms, ['комната', 'комнаты', 'комнат']);

      return advert.offer.rooms + ' ' + roomsEnding + ' для ' + advert.offer.guests + ' ' + guestsEnding;
    };

    /**
     * Creates an unsorted list of features (UL) with LI children
     * @param {Node} featureList
     * @return {Node}
     */
    var fillFeaturesList = function (featureList) {
      clearList(featureList);
      advert.offer.features.forEach(function (feature) {
        var li = document.createElement('li');
        li.className = 'feature feature--' + feature;
        featureList.appendChild(li);
      });

      return featureList;
    };

    /**
     * Accepts a DOM node and removes its child nodes
     * @param {Node} node
     */
    var clearList = function (node) {
      while (node.hasChildNodes()) {
        node.removeChild(node.lastChild); // clear UL element
      }
    };

    cardTitle.textContent = advert.offer.title;
    cardAddress.textContent = advert.offer.address;
    cardPrice.textContent = advert.offer.price + '\t\u20BD/ночь';
    cardType.textContent = getType(advert.offer.type);
    cardRooms.textContent = getRoomsAndGuests();
    cardTime.textContent = 'Заезд после ' + advert.offer.checkin + ', ' + 'выезд до ' + advert.offer.checkout;
    fillFeaturesList(cardFeatures);
    cardDescription.textContent = advert.offer.description;
    userAvatar.src = advert.author.avatar;

    return card;
  };

  /**
   * Returns corresponding form of a word, depending on number before the word
   * @param {number} num - Integer
   * @param {Array.<string>} endingForms - [For one, for 2 - 4, more than 4]
   * @return {string}
   */
  var getEnding = function (num, endingForms) {
    var num10 = num % 10;
    var num100 = num % 100;

    if (num10 === 1) {
      return endingForms[0];
    }
    if (num10 > 1 && num10 < 5) {
      return endingForms[1];
    }
    if (num100 > 5 && num100 < 20) {
      return endingForms[2];
    }

    return endingForms[2];
  };

  var adverts = createAdvertsArray();
  var mapPinsArray = createPinsFromData(adverts);
  var mapPinsFragment = renderAllPins(mapPinsArray);
  var advCard = fillAdvertCard(adverts[0]);

  mapPins.appendChild(mapPinsFragment);
  map.insertBefore(advCard, filtersContainer);
  map.classList.remove('map--faded');
})();

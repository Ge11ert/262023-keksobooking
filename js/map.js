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

  /** @enum {number} KeyCodes */
  var KeyCodes = {
    ENTER: 13,
    ESC: 27
  };

  var pinOffsetY = PinImageParams.HEIGHT / 2 + PinImageParams.ARROW_HEIGHT;

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');
  var currentPin = null;
  var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');
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

    cardTitle.textContent = advert.offer.title;
    cardAddress.textContent = advert.offer.address;
    cardPrice.textContent = advert.offer.price + '\t\u20BD/ночь';
    cardType.textContent = AdvertParams.ACCOMMODATION_TYPES[advert.offer.type] || '';
    cardRooms.textContent = getRoomsAndGuests(advert.offer.guests, advert.offer.rooms);
    cardTime.textContent = 'Заезд после ' + advert.offer.checkin + ', ' + 'выезд до ' + advert.offer.checkout;
    fillFeaturesList(advert.offer.features, cardFeatures);
    cardDescription.textContent = advert.offer.description;
    userAvatar.src = advert.author.avatar;

    return card;
  };

  /**
   * Creates a string, indicating quantity of available rooms and
   * possible amount of guests
   * @param {number} guests
   * @param {number} rooms
   * @return {string}
   */
  var getRoomsAndGuests = function (guests, rooms) {
    var guestsEnding = getEnding(guests, ['гостя', 'гостей', 'гостей']);
    var roomsEnding = getEnding(rooms, ['комната', 'комнаты', 'комнат']);

    return rooms + ' ' + roomsEnding + ' для ' + guests + ' ' + guestsEnding;
  };

  /**
   * Creates an unsorted list of features (UL) with LI children
   * @param {Array.<string>} advertFeatures
   * @param {Node} featureList
   * @return {Node}
   */
  var fillFeaturesList = function (advertFeatures, featureList) {
    clearList(featureList);
    advertFeatures.forEach(function (feature) {
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
  var advCard = null;

  // -------------------------------------------------------------------
  // ------------------------ EVENTS -----------------------------------

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
    for (var i = 0; i < nodeList.length; i++) {
      nodeList[i].disabled = isDisabled;
    }
  };

  /**
   * Shows an info popup of the selected pin on the map
   * @param {Event} evt
   */
  var pinClickHandler = function (evt) {
    if (currentPin) {
      closePinInfo();
    }

    currentPin = (evt.target.tagName === 'IMG') ? evt.target.parentNode : evt.target;

    if (currentPin.classList.contains('map__pin')) {
      currentPin.classList.add('map__pin--active');
      if (mapPinsArray.indexOf(currentPin) !== -1) {
        advCard = fillAdvertCard(adverts[mapPinsArray.indexOf(currentPin)]);
        map.insertBefore(advCard, filtersContainer);
        advCard.addEventListener('click', popupClickHandler);
      }
    }
  };

  /**
   * Calls a function, when popup close-button is clicked
   * @param {Event} evt
   */
  var popupClickHandler = function (evt) {
    if (evt.target.classList.contains('popup__close')) {
      closePinInfo();
    }
  };

  /**
   * Removes 'active' status of the selected pin and hides its popup card.
   */
  var closePinInfo = function () {
    currentPin.classList.remove('map__pin--active');
    if (advCard) {
      map.removeChild(advCard);
      advCard.removeEventListener('click', popupClickHandler);
      advCard = null;
    }
  };

  setDisableProperty(noticeFieldsets, true);

  mainPin.addEventListener('mouseup', function () {
    enableMap();
  });
  mainPin.addEventListener('keydown', function (evt) {
    if (evt.keyCode === KeyCodes.ENTER) {
      enableMap();
    }
  });

  mapPins.addEventListener('click', pinClickHandler);
  mapPins.addEventListener('keydown', function (evt) {
    if (evt.keyCode === KeyCodes.ESC) {
      closePinInfo();
    }
  });
})();

'use strict';

window.mapView = (function () {
  /**
   * Receives an array of generated adverts from js/map-model.js
   * @type {Array.<Advert>}
   */
  var adverts = window.mapModel.createAdvertsArray();

  /**
   * @enum {string} AccommodationTypes
   */
  var AccommodationTypes = {
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };

  /** @enum {number} PinImageParams */
  var PinImageParams = {
    WIDTH: 40,
    HEIGHT: 40,
    ARROW_HEIGHT: 18
  };

  var pinOffsetY = PinImageParams.HEIGHT / 2 + PinImageParams.ARROW_HEIGHT;
  var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');

  /**
   * Creates a DOM Element 'Map Pin' using data from a single advert
   * and subscribes the pin to 'click' event
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

    pin.addEventListener('click', function (evt) {
      window.mapEvents.pinClickHandler(evt, advert);
    });

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
    cardType.textContent = AccommodationTypes[advert.offer.type] || '';
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

  var mapPinsArray = createPinsFromData(adverts);
  var mapPinsFragment = renderAllPins(mapPinsArray);

  return {
    mapPinsFragment: mapPinsFragment,

    fillAdvertCard: fillAdvertCard
  };

})();

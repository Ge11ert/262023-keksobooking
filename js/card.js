'use strict';

(function () {
  /** @enum {number} KeyCodes */
  var KeyCodes = {
    ENTER: 13,
    ESC: 27
  };

  var accommodationTypes = {
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };

  var cardTemplate = document.querySelector('template').content.querySelector('article.map__card');
  var advCard = null;

  /**
   * Fills a DOM Node 'Advert card' with data from a single advert object
   * @param {Advert} advert
   * @return {Node}
   */
  var fillAdvertCard = function (advert) {
    var card = cardTemplate.cloneNode(true);

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
    cardType.textContent = accommodationTypes[advert.offer.type] || '';
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
    var guestsEnding = window.utils.getWordEnding(guests, ['гостя', 'гостей', 'гостей']);
    var roomsEnding = window.utils.getWordEnding(rooms, ['комната', 'комнаты', 'комнат']);

    return rooms + ' ' + roomsEnding + ' для ' + guests + ' ' + guestsEnding;
  };

  /**
   * Creates an unsorted list of features (UL) with LI children
   * @param {Array.<string>} advertFeatures
   * @param {Node} featureList
   * @return {Node}
   */
  var fillFeaturesList = function (advertFeatures, featureList) {
    window.utils.clearDOMNode(featureList);
    advertFeatures.forEach(function (feature) {
      var li = document.createElement('li');
      li.className = 'feature feature--' + feature;
      featureList.appendChild(li);
    });

    return featureList;
  };

  /**
   * Creates a DOM Node, filled with data from an advert,
   * and sends it to map module
   * @param {Advert} advert
   */
  var createCard = function (advert) {
    hideCard();

    advCard = fillAdvertCard(advert);
    advCard.querySelector('.popup__close').addEventListener('click', function () {
      hideCard();
      window.pin.deactivate();
    });

    document.addEventListener('keydown', cardKeydownHandler);
    window.map.insertExternalNode(advCard);
  };

  /**
   * Deletes a card of an advert from DOM-tree
   */
  var hideCard = function () {
    if (advCard) {
      advCard.parentNode.removeChild(advCard);
      advCard = null;
      document.removeEventListener('keydown', cardKeydownHandler);
    }
  };

  /**
   * Calls a function after pressing down the ESC key
   * @param {Event} evt
   */
  var cardKeydownHandler = function (evt) {
    if (evt.keyCode === KeyCodes.ESC) {
      hideCard();
      window.pin.deactivate();
    }
  };

  // window.createCard = createCard;
  window.card = {
    create: createCard,
    hide: hideCard
  };
})();

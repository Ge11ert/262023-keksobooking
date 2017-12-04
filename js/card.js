'use strict';

(function () {

  /**
   * @enum {string} AccommodationTypes
   */
  var AccommodationTypes = {
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };

  var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');

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

  window.fillAdvertCard = fillAdvertCard;
})();

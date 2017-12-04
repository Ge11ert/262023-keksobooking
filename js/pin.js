'use strict';

(function () {
  /** @enum {number} PinImageParams */
  var PinImageParams = {
    WIDTH: 40,
    HEIGHT: 40,
    ARROW_HEIGHT: 18
  };

  var pinOffsetY = PinImageParams.HEIGHT / 2 + PinImageParams.ARROW_HEIGHT;
  var advCard = null;

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var filtersContainer = document.querySelector('map__filters-container');

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
      pinClickHandler(evt, advert);
    });

    return pin;
  };

  /**
   * Calls a function after pressing down the ESC key
   * @param {Event} evt
   */
  var mapKeydownHandler = function (evt) {
    if (evt.keyCode === window.utils.KeyCodes.ESC) {
      closePinInfo();
    }
  };

  /**
   * Sets the active state of the selected pin and shows related advert card
   * @param {Event} evt
   * @param {Advert} advert
   */
  var pinClickHandler = function (evt, advert) {
    closePinInfo();

    evt.currentTarget.classList.add('map__pin--active');
    advCard = window.fillAdvertCard(advert);
    map.insertBefore(advCard, filtersContainer);

    advCard.querySelector('.popup__close').addEventListener('click', function () {
      closePinInfo();
    });
    mapPins.addEventListener('keydown', mapKeydownHandler);
  };

  /**
   * Removes the active state of currently active pin and hides its advert card
   */
  var closePinInfo = function () {
    removeActiveState();
    hideAdvertCard();
    mapPins.removeEventListener('keydown', mapKeydownHandler);
  };

  /**
   * Removes the 'active' modifier from class list of a pin
   */
  var removeActiveState = function () {
    var activePin = document.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
  };

  /**
   * Deletes advert card form DOM, when a pin has no 'active' state
   */
  var hideAdvertCard = function () {
    if (advCard) {
      map.removeChild(advCard);
      advCard = null;
    }
  };

  window.renderMapPin = renderMapPin;
})();

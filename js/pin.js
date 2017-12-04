'use strict';

(function () {
  /** @enum {number} PinImageParams */
  var PinImageParams = {
    WIDTH: 40,
    HEIGHT: 40,
    ARROW_HEIGHT: 18
  };

  var pinOffsetY = PinImageParams.HEIGHT / 2 + PinImageParams.ARROW_HEIGHT;

  /**
   * Creates a DOM Element 'Map Pin' using data from a single advert
   * and subscribes the pin to 'click' event
   * @param {Advert} advert
   * @return {Element}
   */
  var renderPin = function (advert) {
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
   * Sets the active state of the selected pin and shows related advert card
   * @param {Event} evt
   * @param {Advert} advert
   */
  var pinClickHandler = function (evt, advert) {
    closePinInfo();

    evt.currentTarget.classList.add('map__pin--active');
    window.card.showCard(advert);
    window.map.bindKeydownEvent();
  };

  /**
   * Removes the active state of currently active pin and hides its advert card
   */
  var closePinInfo = function () {
    removeActiveState();
    window.card.hideCard();
    window.map.removeKeydownEvent();
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

  window.pin = {
    renderPin: renderPin,
    closePinInfo: closePinInfo
  };
})();

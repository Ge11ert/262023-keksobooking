'use strict';

(function () {
  /**
   * @const {number}
   */
  var POPUP_FADEOUT_TIME = 4000; // in ms

  /**
   * @enum {string} BaseColor
   */
  var BaseColor = {
    ERROR: '#e46b15',
    SUCCESS: '#8bc34a'
  };

  var template = document.querySelector('template').content;

  /**
   * Defines basic style for a new popup and inserts
   * provided message text into the created popup
   * @param {string} baseColor - Defines color of the border and the title
   * @param {string} title - Text, that will be shown as a title
   * @param {string} text - Text, that will be shown as a information message
   * @return {Element}
   */
  var createTemplatePopup = function (baseColor, title, text) {
    var closeButton = template.querySelector('.popup__close').cloneNode(true);
    var popup = document.createElement('div');
    popup.className = 'info-popup';
    popup.style.position = 'fixed';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.width = '340px';
    popup.style.padding = '15px 10px';
    popup.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    popup.style.border = '4px solid #e46b15';
    popup.style.borderColor = baseColor;
    popup.style.borderRadius = '10px';
    popup.style.textAlign = 'center';
    popup.style.zIndex = '1';

    var popupTitle = document.createElement('p');
    popupTitle.textContent = title;
    popupTitle.style.margin = '0';
    popupTitle.style.marginBottom = '10px';
    popupTitle.style.color = baseColor;
    popupTitle.style.fontSize = '18px';
    popupTitle.style.fontWeight = 'bold';

    var popupText = document.createElement('p');
    popupText.textContent = text;
    popupText.style.margin = '0';
    popupText.style.lineHeight = '1.5';

    closeButton.style.height = '40px';
    closeButton.style.top = '-5px';
    closeButton.style.bottom = '';
    closeButton.style.right = '-40px';

    closeButton.addEventListener('click', function () {
      popup.parentNode.removeChild(popup);
      popup = null;
    });

    popup.appendChild(popupTitle);
    popup.appendChild(popupText);
    popup.appendChild(closeButton);

    setTimeout(function () {
      if (popup) {
        popup.parentNode.removeChild(popup);
      }
    }, POPUP_FADEOUT_TIME);

    return popup;
  };

  var createWarningPopup = function (errorText) {
    var warningPopup = createTemplatePopup(BaseColor.ERROR, 'Что-то пошло не так =(', errorText);
    warningPopup.style.top = '90px';

    return warningPopup;
  };

  var createSuccessPopup = function () {
    var successPopup = createTemplatePopup(BaseColor.SUCCESS, 'Всё отлично! =)', 'Ваши данные успешно отправлены');
    successPopup.style.top = '50%';

    return successPopup;
  };

  window.popup = {
    createWarning: createWarningPopup,
    createSuccess: createSuccessPopup
  };

})();

'use strict';

(function () {
  var template = document.querySelector('template').content;
  var closeButton = template.querySelector('.popup__close').cloneNode(true);
  var popupFadeoutTIme = 4000; // in ms
  var errorColor = '#e46b15';
  var successColor = '#8bc34a';

  var popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.width = '340px';
  popup.style.padding = '15px 10px';
  popup.style.backgroundColor = 'rgba(255, 255, 255, 1)';
  popup.style.border = '4px solid #e46b15';
  popup.style.borderRadius = '10px';
  popup.style.textAlign = 'center';
  popup.style.zIndex = '1';

  var popupTitle = document.createElement('p');
  popupTitle.style.margin = '0';
  popupTitle.style.marginBottom = '10px';
  popupTitle.style.fontSize = '18px';
  popupTitle.style.fontWeight = 'bold';

  var popupText = document.createElement('p');
  popupText.style.margin = '0';
  popupText.style.lineHeight = '1.5';

  closeButton.style.top = '-5px';
  closeButton.style.bottom = '';
  closeButton.style.right = '-40px';

  closeButton.addEventListener('click', function () {
    popup.parentNode.removeChild(popup);
  });

  popup.appendChild(popupTitle);
  popup.appendChild(popupText);
  popup.appendChild(closeButton);

  window.createWarningPopup = function (errorText) {
    popup.style.top = '90px';
    popup.style.borderColor = errorColor;
    popupTitle.style.color = errorColor;
    popupTitle.textContent = 'Что-то пошло не так =(';
    popupText.textContent = errorText;

    setTimeout(function () {
      popup.parentNode.removeChild(popup);
    }, popupFadeoutTIme);

    return popup;
  };

  window.createSuccessPopup = function () {
    popup.style.top = '50%';
    popup.style.borderColor = successColor;
    popupTitle.style.color = successColor;
    popupTitle.textContent = 'Всё отлично! =)';
    popupText.textContent = 'Ваши данные успешно отправлены';

    setTimeout(function () {
      popup.parentNode.removeChild(popup);
    }, popupFadeoutTIme);

    return popup;
  };

})();

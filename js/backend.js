'use strict';

(function () {
  var load = function (onLoad, onError) {
    var URL = 'https://1510.dump.academy/keksobooking/data';

    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';
    xhr.timeout = 5000;

    xhr.addEventListener('load', function () {
      onLoad(xhr.response);
    });
    xhr.addEventListener('error', function () {
      onError('Ошибка получения данных');
    });
    xhr.addEventListener('timeout', function () {
      onError('Превышено время ожидания сервера');
    });


    xhr.open('GET', URL);
    xhr.send();
  };

  window.backend = {
    load: load
  };
})();

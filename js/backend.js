'use strict';

(function () {
  var BASE_URL = 'https://1510.dump.academy/keksobooking';

  var ErrorCodes = {
    401: 'Необходима авторизация',
    403: 'Доступ запрещен',
    404: 'Запрашиваемые данные не найдены',
    500: 'Внутренняя ошибка сервера'
  };

  var createRequest = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';
    xhr.timeout = 5000;

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError(ErrorCodes[xhr.status]);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Превышено время ожидания сервера');
    });

    return xhr;
  };

  var load = function (onLoad, onError) {
    var xhr = createRequest(onLoad, onError);

    xhr.open('GET', BASE_URL + '/data');
    xhr.send();
  };

  var save = function (data, onLoad, onError) {
    var xhr = createRequest(onLoad, onError);

    xhr.open('POST', BASE_URL);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    save: save
  };
})();

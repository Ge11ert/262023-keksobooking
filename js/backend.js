'use strict';

(function () {
  var BASE_URL = 'https://1510.dump.academy/keksobooking';

  /**
   * @enum {string} ErrorCodes
   */
  var ErrorCodes = {
    '400': 'Неверный запрос',
    '401': 'Необходима авторизация',
    '403': 'Доступ запрещен',
    '404': 'Запрашиваемые данные не найдены',
    '500': 'Внутренняя ошибка сервера',
    'default': 'Неизвестная ошибка'
  };

  /**
   * Creates a new XHR with predefined settings
   * @param {Function} onLoad - Callback function, invokes in case of no errors
   * @param {Function} onError - Callback function, invokes in case of some errors presence
   * @return {XMLHttpRequest}
   */
  var createRequest = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';
    xhr.timeout = 10000;

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError(ErrorCodes[xhr.status] || ErrorCodes['default']);
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

  /**
   * Manages downloading some data from the server
   * @param {Function} onLoad
   * @param {Function} onError
   */
  var load = function (onLoad, onError) {
    var xhr = createRequest(onLoad, onError);

    xhr.open('GET', BASE_URL + '/data');
    xhr.send();
  };

  /**
   * Sends provided data to the server
   * @param {*} data
   * @param {Function} onLoad
   * @param {Function} onError
   */
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

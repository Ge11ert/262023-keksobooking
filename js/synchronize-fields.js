'use strict';

(function () {
  /**
   * Takes the current value of the field1 and sends field2 and corresponding value (with the same index)
   * to the provided callback function
   * @param {Node} field1
   * @param {Node} field2
   * @param {Array.<string|number>} values1 - Array of values of the field1
   * @param {Array.<string|number>} values2 - Array of values of the field2
   * @param {Function} syncCallback - Callback function
   */
  window.synchronizeFields = function (field1, field2, values1, values2, syncCallback) {
    var valueIndex = values1.indexOf(field1.value);
    syncCallback(field2, values2[valueIndex]);
  };
})();

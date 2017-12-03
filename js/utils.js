'use strict';

window.utils = (function () {
  /**
   * Returns a random number between min and max
   * @param {number} min
   * @param {number} max
   * @return {number}
   */
  var getRandomFromRange = function (min, max) {
    return Math.random() * (max - min) + min;
  };

  /**
   * Creates an array of defined size. This array is filled with elements from the base array.
   * Elements of the new array can be repeating or not. Elements order is random.
   * @param {number} arrLen - Length of an array to be returned
   * @param {Array} baseArray - Initial array, from which elements will be copied
   * @param {boolean} unique - Defines, if array elements should be non-repeatable
   * @return {Array}
   */
  var getRandomArrayCopy = function (arrLen, baseArray, unique) {
    var baseArrCopy = baseArray.slice();
    var newArray = [];
    var newItem;

    if (arrLen > baseArray.length) {
      arrLen = baseArray.length;
    }

    while (newArray.length < arrLen) {
      newItem = baseArray[Math.floor(getRandomFromRange(0, baseArrCopy.length - 1))];
      if (unique && newArray.indexOf(newItem) !== -1) {
        continue;
      } else {
        newArray.push(newItem);
      }
    }

    return newArray;
  };

  return {
    getRandomFromRange: getRandomFromRange,
    getRandomArrayCopy: getRandomArrayCopy
  };
})();

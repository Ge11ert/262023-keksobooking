'use strict';

(function () {
  /** @enum {number} KeyCodes */
  var KeyCodes = {
    ENTER: 13,
    ESC: 27
  };

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

  /**
   * Accepts a DOM node and removes its child nodes
   * @param {Node} node
   */
  var clearDOMNode = function (node) {
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild); // clear UL element
    }
  };

  /**
   * Returns corresponding form of a word, depending on number before the word
   * @param {number} num - Integer
   * @param {Array.<string>} endingForms - [For one, for 2 - 4, more than 4]
   * @return {string}
   */
  var getWordEnding = function (num, endingForms) {
    var num10 = num % 10;
    var num100 = num % 100;

    if (num10 === 1) {
      return endingForms[0];
    }
    if (num10 > 1 && num10 < 5) {
      return endingForms[1];
    }
    if (num100 > 5 && num100 < 20) {
      return endingForms[2];
    }

    return endingForms[2];
  };

  window.utils = {
    KeyCodes: KeyCodes,
    getRandomFromRange: getRandomFromRange,
    getRandomArrayCopy: getRandomArrayCopy,
    clearDOMNode: clearDOMNode,
    getWordEnding: getWordEnding
  };
})();

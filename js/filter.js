'use strict';

(function () {
  /**
   * @const {number}
   */
  var FILTER_SWITCH_LATENCY = 500; // 0.5s

  /**
   * @enum {number} PriceBreakpoints
   */
  var PriceBreakpoints = {
    LOW: 10000,
    MIDDLE: 50000
  };

  var priceRange = {
    'low': function (price) {
      return price < PriceBreakpoints.LOW;
    },
    'middle': function (price) {
      return price >= PriceBreakpoints.LOW && price < PriceBreakpoints.MIDDLE;
    },
    'high': function (price) {
      return price >= PriceBreakpoints.MIDDLE;
    }
  };


  /**
   * Selects from an array of adverts those elements, which matches
   * the defined value of some filter type
   * @param {Array.<Advert>} advertsArray - Unfiltered array of adverts
   * @param {string} filterValue
   * @param {string} filterType
   * @return {Array.<Advert>} - Filtered array of adverts
   */
  var filterByValue = function (advertsArray, filterValue, filterType) {
    return advertsArray.filter(function (item) {
      return item.offer[filterType].toString() === filterValue;
    });
  };

  /**
   * Selects from an array of adverts those elements, which price matches
   * defined range conditions.
   * Corresponding price conditions are declared in {@link priceRange}
   * @param {Array.<Advert>} advertsArray - Unfiltered array of adverts
   * @param {string} filterValue
   * @return {Array.<Advert>} - Filtered array of adverts
   */
  var filterByPrice = function (advertsArray, filterValue) {
    return advertsArray.filter(function (item) {
      return priceRange[filterValue](item.offer.price);
    });
  };

  /**
   * Selects from an array of adverts those elements, which have given feature
   * @param {Array.<Advert>} advertsArray - Unfiltered array of adverts
   * @param {string} featureName
   * @return {Array.<Advert>} - Filtered array of adverts
   */
  var filterByFeature = function (advertsArray, featureName) {
    return advertsArray.filter(function (item) {
      return item.offer.features.indexOf(featureName) !== -1;
    });
  };

  var filtersContainer = document.querySelector('.map__filters-container');
  var filterFields = document.querySelectorAll('.map__filter');
  var filteredAdverts = [];

  filtersContainer.addEventListener('change', function () {
    window.utils.debounce(window.map.updateMap, FILTER_SWITCH_LATENCY);
  });

  /**
   * Defines, which filters are currently selected, and applies
   * these filters to an array of adverts
   * @param {Array.<Advert>} initialAdverts
   * @return {Array.<Advert>}
   */
  window.filterAdverts = function (initialAdverts) {
    var activeFeatures = document.querySelectorAll('.map__filter-set input[type="checkbox"]:checked');

    var appliedFilters = Array.prototype.filter.call(filterFields, function (filter) {
      return filter.value !== 'any';
    });

    filteredAdverts = initialAdverts.slice();

    appliedFilters.forEach(function (filter) {
      var type = filter.id.split('-')[1]; // get 'type' from 'housing-type' and so on...
      filteredAdverts = (type === 'price') ? filterByPrice(filteredAdverts, filter.value) : filterByValue(filteredAdverts, filter.value, type);
    });

    activeFeatures.forEach(function (feature) {
      filteredAdverts = filterByFeature(filteredAdverts, feature.value);
    });

    return filteredAdverts;
  };
})();

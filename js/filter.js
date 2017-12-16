'use strict';

(function () {

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


  var filterByType = function (advertsArray, filterValue) {
    return advertsArray.filter(function (item) {
      return item.offer.type === filterValue;
    });
  };

  var filterByRooms = function (advertsArray, filterValue) {
    return advertsArray.filter(function (item) {
      return item.offer.rooms.toString() === filterValue;
    });
  };

  var filterByGuests = function (advertsArray, filterValue) {
    return advertsArray.filter(function (item) {
      return item.offer.guests.toString() === filterValue;
    });
  };

  var filterByPrice = function (advertsArray, filterValue) {
    return advertsArray.filter(function (item) {
      return priceRange[filterValue](item.offer.price);
    });
  };

  var filterByFeature = function (advertsArray, featureValue) {
    return advertsArray.filter(function (item) {
      return item.offer.features.indexOf(featureValue) !== -1;
    });
  };

  var filterType = {
    'housing-type': filterByType,
    'housing-price': filterByPrice,
    'housing-rooms': filterByRooms,
    'housing-guests': filterByGuests
  };

  var filterFields = document.querySelectorAll('.map__filter');
  var featuresFields = document.querySelectorAll('.map__filter-set input[type="checkbox"]');
  var filteredArray = [];

  window.filterAdverts = function (initialAdverts) {
    var appliedFilters = Array.from(filterFields).reduce(function (array, filterElement) {
      if (filterElement.value !== 'any') {
        array.push({type: filterElement.id, value: filterElement.value});
      }
      return array;
    }, []);

    var activeFeatures = Array.from(featuresFields).reduce(function (array, featureElement) {
      if (featureElement.checked) {
        array.push(featureElement.value);
      }
      return array;
    }, []);

    filteredArray = initialAdverts.slice();

    appliedFilters.forEach(function (filter) {
      filteredArray = filterType[filter.type](filteredArray, filter.value);
    });

    activeFeatures.forEach(function (feature) {
      filteredArray = filterByFeature(filteredArray, feature);
    });

    return filteredArray;
  };
})();

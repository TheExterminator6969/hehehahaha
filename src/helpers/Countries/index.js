const countryStates = require('./CountryStates');
const states = require('./States');

function lower(str) {
  return str?.toLowerCase();
}

module.exports.getStates = function getStates(predicate) {
  return countryStates.find((country) => lower(country.iso2) === lower(predicate)
    || lower(country.iso3) === lower(predicate)
    || lower(country.name) === lower(predicate)
    || lower(country.native) === lower(predicate)).states || [];
};

module.exports.getCountry = function getCountry(predicate) {
  return countryStates.find((country) => lower(country.iso2) === lower(predicate)
    || lower(country.iso3) === lower(predicate)
    || lower(country.name) === lower(predicate)
    || lower(country.alt) === lower(predicate)
    || lower(country.native) === lower(predicate)) || undefined;
};

module.exports.getCountryState = function getCountryState(countryPredicate, statePredicate) {
  const country = module.exports.getCountry(countryPredicate);
  return country?.states.find((s) => lower(s.name) === lower(statePredicate)
    || lower(s.state_code) === lower(statePredicate)) || undefined;
};

module.exports.getState = function getState(predicate) {
  return states.find((state) => lower(state.name) === lower(predicate)
    || lower(state.state_code) === lower(predicate)) || undefined;
};

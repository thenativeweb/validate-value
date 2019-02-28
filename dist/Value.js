'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var jjv = require('jjv'),
    jjve = require('jjve');

var Value =
/*#__PURE__*/
function () {
  function Value(schema) {
    (0, _classCallCheck2.default)(this, Value);

    if (!schema) {
      throw new Error('Schema is missing.');
    }

    this.schema = schema;
  }

  (0, _createClass2.default)(Value, [{
    key: "validate",
    value: function validate(value) {
      var valueName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'value';

      if (value === undefined) {
        throw new Error('Value is missing.');
      }

      var schema = this.schema;
      var validator = jjv();
      var getErrors = jjve(validator);
      var result = validator.validate(schema, value);

      if (!result) {
        return;
      }

      var errors = getErrors(schema, value, result);
      var _errors$ = errors[0],
          message = _errors$.message,
          path = _errors$.path;
      var error = new Error("".concat(message, " (at ").concat(valueName).concat(path.substring(1), ")."));
      error.origins = errors;
      throw error;
    }
  }, {
    key: "isValid",
    value: function isValid(value) {
      if (value === undefined) {
        throw new Error('Value is missing.');
      }

      try {
        this.validate(value);
      } catch (ex) {
        return false;
      }

      return true;
    }
  }]);
  return Value;
}();

module.exports = Value;
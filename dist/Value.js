'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var Ajv = require('ajv');

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
      var valueName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Value';

      if (value === undefined) {
        throw new Error('Value is missing.');
      }

      var ajv = new Ajv();
      var isValid = ajv.validate(this.schema, value);

      if (isValid) {
        return;
      }

      var message = "".concat(ajv.errorsText([ajv.errors[0]], {
        dataVar: valueName
      }), ".");
      var error = new Error(message);
      error.origins = ajv.errors;
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
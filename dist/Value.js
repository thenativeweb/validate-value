'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Ajv = require('ajv');

var Value = function () {
  function Value(schema) {
    (0, _classCallCheck3.default)(this, Value);

    if (!schema) {
      throw new Error('Schema is missing.');
    }

    this.schema = schema;
  }

  (0, _createClass3.default)(Value, [{
    key: 'validate',
    value: function validate(value) {
      if (value === undefined) {
        throw new Error('Value is missing.');
      }

      var ajv = new Ajv();
      var isValid = ajv.validate(this.schema, value);

      if (isValid) {
        return;
      }

      var message = ajv.errorsText(ajv.errors, { dataVar: 'Value' }) + '.';
      var error = new Error(message);

      error.origins = ajv.errors;

      throw error;
    }
  }, {
    key: 'isValid',
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
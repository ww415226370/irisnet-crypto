'use strict';

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/inherits"));

var Crypto = require("../../crypto");

var Old = require('old');

var EthermintKeypair = require('./ethermint_keypair');

var EthermintCrypto =
/*#__PURE__*/
function (_Crypto) {
  (0, _inherits2["default"])(EthermintCrypto, _Crypto);

  function EthermintCrypto() {
    (0, _classCallCheck2["default"])(this, EthermintCrypto);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(EthermintCrypto).call(this));
  }

  (0, _createClass2["default"])(EthermintCrypto, [{
    key: "create",
    value: function create(language) {
      throw new Error("not implement");
    }
  }, {
    key: "recover",
    value: function recover(seedphrase, language) {
      throw new Error("not implement");
    }
  }, {
    key: "import",
    value: function _import(secret) {
      return EthermintKeypair.Import(secret);
    }
  }, {
    key: "isValidAddress",
    value: function isValidAddress(address) {
      return EthermintKeypair.isValidAddress(address);
    }
  }, {
    key: "isValidPrivate",
    value: function isValidPrivate(privateKey) {
      return EthermintKeypair.isValidPrivate(new Buffer(Hex.hexToBytes(privateKey)));
    }
  }, {
    key: "getAddress",
    value: function getAddress(publicKey) {
      return EthermintKeypair.getAddress(publicKey);
    }
  }]);
  return EthermintCrypto;
}(Crypto);

module.exports = Old(EthermintCrypto);
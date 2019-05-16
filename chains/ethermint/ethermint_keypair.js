"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var EthUtil = require('ethereumjs-util');

var EthereumTx = require('ethereumjs-tx');

var Codec = require("../../util/codec");

var EthermintKeypair =
/*#__PURE__*/
function () {
  function EthermintKeypair() {
    (0, _classCallCheck2["default"])(this, EthermintKeypair);
  }

  (0, _createClass2["default"])(EthermintKeypair, null, [{
    key: "Import",
    value: function Import(secret) {
      var publicKey = EthUtil.privateToPublic(secret);
      var addr = EthUtil.publicToAddress(publicKey);
      return {
        "address": "0x" + Codec.Hex.bytesToHex(addr),
        "privateKey": Codec.Hex.bytesToHex(secret),
        "publicKey": Codec.Hex.bytesToHex(publicKey)
      };
    }
  }, {
    key: "isValidAddress",
    value: function isValidAddress(address) {
      return EthUtil.isValidAddress(address);
    }
  }, {
    key: "isValidAddress",
    value: function isValidAddress(privateKey) {
      return EthUtil.isValidPrivate(new Buffer(Hex.hexToBytes(privateKey)));
    }
  }, {
    key: "sign",
    value: function sign(rawTx, privateKey) {
      var tx = new EthereumTx(rawTx);
      tx.sign(new Buffer(privateKey));
      return tx.sig;
    }
  }, {
    key: "getAddress",
    value: function getAddress(publicKey) {
      var addr = EthUtil.pubToAddress(publicKey);
      return Hex.bytesToHex(addr);
    }
  }]);
  return EthermintKeypair;
}();

module.exports = EthermintKeypair;
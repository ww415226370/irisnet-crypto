'use strict';

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.object.to-string");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/inherits"));

var Builder = require("../../builder").Builder;

var BigNumber = require('bignumber.js');

var EthereumTx = require('ethereumjs-tx');

var Old = require('old');

var EthermintBuilder =
/*#__PURE__*/
function (_Builder) {
  (0, _inherits2["default"])(EthermintBuilder, _Builder);

  function EthermintBuilder() {
    (0, _classCallCheck2["default"])(this, EthermintBuilder);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(EthermintBuilder).apply(this, arguments));
  }

  (0, _createClass2["default"])(EthermintBuilder, [{
    key: "buildTx",
    value: function buildTx(tx) {
      var req = (0, _get2["default"])((0, _getPrototypeOf2["default"])(EthermintBuilder.prototype), "buildParam", this).call(this, tx);
      var ether = new BigNumber(10e+17);
      var rawTx = new EthermintMsg(req.fees[0].amount, new BigNumber(req.coins[0].amount).times(ether), 21000, req.to, req.acc.sequence);
      rawTx.ValidateBasic();
      return rawTx;
    }
  }, {
    key: "signTx",
    value: function signTx(tx, privateKey) {
      var ethereumTx = new EthereumTx(tx);
      ethereumTx.sign(new Buffer(privateKey));
      var serializedTx = ethereumTx.serialize();
      return serializedTx.toString('hex');
    }
  }, {
    key: "buildAndSignTx",
    value: function buildAndSignTx(tx, privateKey) {
      var rawTx = this.buildTx(tx);
      var ethereumTx = new EthereumTx(rawTx);
      ethereumTx.sign(new Buffer(privateKey));
      var serializedTx = ethereumTx.serialize();
      return serializedTx.toString('hex');
    }
  }]);
  return EthermintBuilder;
}(Builder);

var EthermintMsg =
/*#__PURE__*/
function (_Builder$SignMsg) {
  (0, _inherits2["default"])(EthermintMsg, _Builder$SignMsg);

  function EthermintMsg(gasPrice, value, gasLimit, to, nonce) {
    var _this;

    (0, _classCallCheck2["default"])(this, EthermintMsg);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(EthermintMsg).call(this));
    _this.gasPrice = gasPrice;
    _this.value = value;
    _this.gasLimit = gasLimit;
    _this.to = to;
    _this.nonce = nonce;
    return _this;
  }

  (0, _createClass2["default"])(EthermintMsg, [{
    key: "GetSignBytes",
    value: function GetSignBytes() {
      return this;
    }
  }, {
    key: "ValidateBasic",
    value: function ValidateBasic() {
      if (this.gasPrice <= 0) {
        throw new Error("gasPrice must be more than 0");
      }

      if (this.value <= 0) {
        throw new Error("value must be more than 0");
      }

      if (this.gasLimit <= 0) {
        throw new Error("gasLimit must be more than 0");
      }

      if (!this.to || this.to.length == 0) {
        throw new Error("to is empty");
      }

      if (!this.nonce || this.to.nonce == 0) {
        throw new Error("nonce is empty");
      }
    }
  }]);
  return EthermintMsg;
}(Builder.SignMsg);

module.exports = Old(EthermintBuilder);
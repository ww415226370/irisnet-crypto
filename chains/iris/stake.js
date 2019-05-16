'use strict';

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

require("core-js/modules/es6.array.index-of");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.object.to-string");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/inherits"));

var Builder = require("../../builder");

var Utils = require('../../util/utils');

var Amino = require('./amino');

var Config = require('../../config');

var MsgDelegate =
/*#__PURE__*/
function (_Builder$Msg) {
  (0, _inherits2["default"])(MsgDelegate, _Builder$Msg);

  function MsgDelegate(delegator_addr, validator_addr, delegation) {
    var _this;

    (0, _classCallCheck2["default"])(this, MsgDelegate);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(MsgDelegate).call(this, Config.iris.tx.delegate.prefix));
    _this.delegator_addr = delegator_addr;
    _this.validator_addr = validator_addr;
    _this.delegation = delegation;
    return _this;
  }

  (0, _createClass2["default"])(MsgDelegate, [{
    key: "GetSignBytes",
    value: function GetSignBytes() {
      var msg = {
        "delegator_addr": this.delegator_addr,
        "validator_addr": this.validator_addr,
        "delegation": this.delegation
      };
      var sortMsg = Utils.sortObjectKeys(msg);
      return Amino.MarshalJSON(this.Type(), sortMsg);
    }
  }, {
    key: "ValidateBasic",
    value: function ValidateBasic() {
      if (Utils.isEmpty(this.delegator_addr)) {
        throw new Error("delegator_addr is empty");
      }

      if (Utils.isEmpty(this.validator_addr)) {
        throw new Error("validator_addr is empty");
      }

      if (Utils.isEmpty(this.delegation)) {
        throw new Error("delegation must great than 0");
      }
    }
  }, {
    key: "Type",
    value: function Type() {
      return Config.iris.tx.delegate.prefix;
    }
  }, {
    key: "GetMsg",
    value: function GetMsg() {
      var BECH32 = require('bech32');

      var delegator_key = BECH32.decode(this.delegator_addr);
      var delegator_addr = BECH32.fromWords(delegator_key.words);
      var validator_key = BECH32.decode(this.validator_addr);
      var validator_addr = BECH32.fromWords(validator_key.words);
      return {
        delegatorAddr: delegator_addr,
        validatorAddr: validator_addr,
        delegation: this.delegation
      };
    }
  }, {
    key: "GetDisplayContent",
    value: function GetDisplayContent() {
      return {
        i18n_tx_type: "i18n_delegate",
        i18n_delegator_addr: this.delegator_addr,
        i18n_validator_addr: this.validator_addr,
        i18n_amount: this.delegation
      };
    }
  }]);
  return MsgDelegate;
}(Builder.Msg);

var MsgBeginUnbonding =
/*#__PURE__*/
function (_Builder$Msg2) {
  (0, _inherits2["default"])(MsgBeginUnbonding, _Builder$Msg2);

  function MsgBeginUnbonding(delegator_addr, validator_addr, shares_amount) {
    var _this2;

    (0, _classCallCheck2["default"])(this, MsgBeginUnbonding);
    _this2 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(MsgBeginUnbonding).call(this, Config.iris.tx.unbond.prefix));
    _this2.delegator_addr = delegator_addr;
    _this2.validator_addr = validator_addr;
    _this2.shares_amount = shares_amount;
    return _this2;
  }

  (0, _createClass2["default"])(MsgBeginUnbonding, [{
    key: "GetSignBytes",
    value: function GetSignBytes() {
      var msg = {
        "delegator_addr": this.delegator_addr,
        "validator_addr": this.validator_addr,
        "shares_amount": this.shares_amount
      };
      return Utils.sortObjectKeys(msg);
    }
  }, {
    key: "ValidateBasic",
    value: function ValidateBasic() {
      if (Utils.isEmpty(this.delegator_addr)) {
        throw new Error("delegator_addr is empty");
      }

      if (Utils.isEmpty(this.validator_addr)) {
        throw new Error("validator_addr is empty");
      }

      if (Utils.isEmpty(this.shares_amount)) {
        throw new Error("shares must great than 0");
      }
    }
  }, {
    key: "Type",
    value: function Type() {
      return Config.iris.tx.unbond.prefix;
    }
  }, {
    key: "GetMsg",
    value: function GetMsg() {
      var BECH32 = require('bech32');

      var delegator_key = BECH32.decode(this.delegator_addr);
      var delegator_addr = BECH32.fromWords(delegator_key.words);
      var validator_key = BECH32.decode(this.validator_addr);
      var validator_addr = BECH32.fromWords(validator_key.words);
      return {
        delegatorAddr: delegator_addr,
        validatorAddr: validator_addr,
        sharesAmount: this.shares_amount
      };
    }
  }, {
    key: "GetDisplayContent",
    value: function GetDisplayContent() {
      return {
        i18n_tx_type: "i18n_begin_unbonding",
        i18n_delegator_addr: this.delegator_addr,
        i18n_validator_addr: this.validator_addr,
        i18n_shares_amount: this.shares_amount
      };
    }
  }]);
  return MsgBeginUnbonding;
}(Builder.Msg);

var MsgBeginRedelegate =
/*#__PURE__*/
function (_Builder$Msg3) {
  (0, _inherits2["default"])(MsgBeginRedelegate, _Builder$Msg3);

  function MsgBeginRedelegate(delegator_addr, validator_src_addr, validator_dst_addr, shares_amount) {
    var _this3;

    (0, _classCallCheck2["default"])(this, MsgBeginRedelegate);
    _this3 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(MsgBeginRedelegate).call(this, Config.iris.tx.redelegate.prefix));
    _this3.delegator_addr = delegator_addr;
    _this3.validator_src_addr = validator_src_addr;
    _this3.validator_dst_addr = validator_dst_addr;
    _this3.shares_amount = shares_amount;
    return _this3;
  }

  (0, _createClass2["default"])(MsgBeginRedelegate, [{
    key: "GetSignBytes",
    value: function GetSignBytes() {
      var msg = {
        "delegator_addr": this.delegator_addr,
        "validator_src_addr": this.validator_src_addr,
        "validator_dst_addr": this.validator_dst_addr,
        "shares": this.shares_amount
      };
      return Utils.sortObjectKeys(msg);
    }
  }, {
    key: "ValidateBasic",
    value: function ValidateBasic() {
      if (Utils.isEmpty(this.delegator_addr)) {
        throw new Error("delegator_addr is empty");
      }

      if (Utils.isEmpty(this.validator_src_addr)) {
        throw new Error("validator_src_addr is empty");
      }

      if (Utils.isEmpty(this.validator_dst_addr)) {
        throw new Error("validator_dst_addr is empty");
      }

      if (Utils.isEmpty(this.shares_amount)) {
        throw new Error("shares_amount is empty");
      }
    }
  }, {
    key: "Type",
    value: function Type() {
      return Config.iris.tx.redelegate.prefix;
    }
  }, {
    key: "GetMsg",
    value: function GetMsg() {
      var BECH32 = require('bech32');

      var delegator_key = BECH32.decode(this.delegator_addr);
      var delegator_addr = BECH32.fromWords(delegator_key.words);
      var validator_src_key = BECH32.decode(this.validator_src_addr);
      var validator_src_addr = BECH32.fromWords(validator_src_key.words);
      var validator_dst_key = BECH32.decode(this.validator_dst_addr);
      var validator_dst_addr = BECH32.fromWords(validator_dst_key.words);
      return {
        delegatorAddr: delegator_addr,
        validatorSrcAddr: validator_src_addr,
        validatorDstAddr: validator_dst_addr,
        sharesAmount: this.shares_amount
      };
    }
  }, {
    key: "GetDisplayContent",
    value: function GetDisplayContent() {
      return {
        i18n_tx_type: "i18n_redelegate",
        i18n_delegator_addr: this.delegator_addr,
        i18n_validator_src_addr: this.validator_src_addr,
        i18n_validator_dst_addr: this.validator_dst_addr,
        i18n_shares_amount: this.shares_amount
      };
    }
  }]);
  return MsgBeginRedelegate;
}(Builder.Msg);

module.exports =
/*#__PURE__*/
function () {
  function Stake() {
    (0, _classCallCheck2["default"])(this, Stake);
  }

  (0, _createClass2["default"])(Stake, null, [{
    key: "CreateMsgDelegate",
    value: function CreateMsgDelegate(req) {
      var delegation = {
        denom: req.msg.delegation.denom,
        amount: Utils.toString(req.msg.delegation.amount)
      };
      var msg = new MsgDelegate(req.from, req.msg.validator_addr, delegation);
      return msg;
    }
  }, {
    key: "CreateMsgBeginUnbonding",
    value: function CreateMsgBeginUnbonding(req) {
      var shares = Dec.String(req.msg.shares_amount);
      var msg = new MsgBeginUnbonding(req.from, req.msg.validator_addr, shares);
      return msg;
    }
  }, {
    key: "CreateMsgBeginRedelegate",
    value: function CreateMsgBeginRedelegate(req) {
      var shares = Dec.String(req.msg.shares_amount);
      var msg = new MsgBeginRedelegate(req.from, req.msg.validator_src_addr, req.msg.validator_dst_addr, shares);
      return msg;
    }
  }]);
  return Stake;
}();

var Dec =
/*#__PURE__*/
function () {
  function Dec() {
    (0, _classCallCheck2["default"])(this, Dec);
  }

  (0, _createClass2["default"])(Dec, null, [{
    key: "String",
    value: function String(share) {
      if (share.indexOf(".") === -1) {
        share = share + ".0000000000";
      }

      return share;
    }
  }]);
  return Dec;
}();
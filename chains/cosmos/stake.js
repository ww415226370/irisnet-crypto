"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

require("core-js/modules/es6.regexp.split");

require("core-js/modules/es6.array.index-of");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.object.to-string");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var Root = require('./tx/tx');

var Amino = require("../base");

var Utils = require('../../util/utils');

var Config = require('../../config');

var BECH32 = require('bech32');

var MsgDelegate = Root.cosmos.MsgDelegate;
var MsgUndelegate = Root.cosmos.MsgUndelegate;
var MsgBeginRedelegate = Root.cosmos.MsgBeginRedelegate;
MsgDelegate.prototype.type = Config.cosmos.tx.delegate.prefix;

MsgDelegate.prototype.GetSignBytes = function () {
  var msg = {
    delegator_address: BECH32.encode(Config.cosmos.bech32.accAddr, this.DelegatorAddr),
    validator_address: BECH32.encode(Config.cosmos.bech32.valAddr, this.ValidatorAddr),
    value: this.Value
  };
  var sortMsg = Utils.sortObjectKeys(msg);
  return Amino.MarshalJSON(this.type, sortMsg);
};

MsgDelegate.prototype.ValidateBasic = function () {
  if (Utils.isEmpty(this.DelegatorAddr)) {
    throw new Error("delegatorAddr is  empty");
  }

  if (Utils.isEmpty(this.ValidatorAddr)) {
    throw new Error("validatorAddr is  empty");
  }
};

MsgDelegate.prototype.GetMsg = function () {
  var BECH32 = require('bech32');

  var delegator_addr = BECH32.fromWords(this.DelegatorAddr);
  var validator_addr = BECH32.fromWords(this.ValidatorAddr);
  return {
    DelegatorAddr: delegator_addr,
    ValidatorAddr: validator_addr,
    Value: this.Value
  };
};

MsgUndelegate.prototype.type = Config.cosmos.tx.undelegate.prefix;

MsgUndelegate.prototype.GetSignBytes = function () {
  var msg = {
    delegator_address: BECH32.encode(Config.cosmos.bech32.accAddr, this.DelegatorAddr),
    validator_address: BECH32.encode(Config.cosmos.bech32.valAddr, this.ValidatorAddr),
    shares_amount: this.SharesAmount
  };
  var sortMsg = Utils.sortObjectKeys(msg);
  return Amino.MarshalJSON(this.type, sortMsg);
};

MsgUndelegate.prototype.ValidateBasic = function () {
  if (Utils.isEmpty(this.DelegatorAddr)) {
    throw new Error("delegatorAddr is  empty");
  }

  if (Utils.isEmpty(this.ValidatorAddr)) {
    throw new Error("validatorAddr is  empty");
  }
};

MsgUndelegate.prototype.GetMsg = function () {
  var BECH32 = require('bech32');

  var delegator_addr = BECH32.fromWords(this.DelegatorAddr);
  var validator_addr = BECH32.fromWords(this.ValidatorAddr);
  return {
    DelegatorAddr: delegator_addr,
    ValidatorAddr: validator_addr,
    SharesAmount: this.SharesAmount
  };
};

MsgBeginRedelegate.prototype.type = Config.cosmos.tx.beginRedelegate.prefix;

MsgBeginRedelegate.prototype.GetSignBytes = function () {
  var msg = {
    delegator_address: BECH32.encode(Config.cosmos.bech32.accAddr, this.DelegatorAddr),
    validator_src_address: BECH32.encode(Config.cosmos.bech32.valAddr, this.ValidatorSrcAddr),
    validator_dst_address: BECH32.encode(Config.cosmos.bech32.valAddr, this.ValidatorDstAddr),
    shares_amount: this.SharesAmount
  };
  var sortMsg = Utils.sortObjectKeys(msg);
  return Amino.MarshalJSON(this.type, sortMsg);
};

MsgBeginRedelegate.prototype.ValidateBasic = function () {
  if (Utils.isEmpty(this.DelegatorAddr)) {
    throw new Error("delegatorAddr is  empty");
  }

  if (Utils.isEmpty(this.ValidatorSrcAddr)) {
    throw new Error("validatorSrcAddr is  empty");
  }

  if (Utils.isEmpty(this.ValidatorDstAddr)) {
    throw new Error("validatorDstAddr is  empty");
  }

  if (Utils.isEmpty(this.SharesAmount)) {
    throw new Error("sharesAmount is  empty");
  }
};

MsgBeginRedelegate.prototype.GetMsg = function () {
  var BECH32 = require('bech32');

  var delegator_addr = BECH32.fromWords(this.DelegatorAddr);
  var validator_src_addr = BECH32.fromWords(this.ValidatorSrcAddr);
  var validator_dst_addr = BECH32.fromWords(this.ValidatorDstAddr);
  return {
    DelegatorAddr: delegator_addr,
    ValidatorSrcAddr: validator_src_addr,
    ValidatorDstAddr: validator_dst_addr,
    SharesAmount: this.SharesAmount
  };
};

module.exports =
/*#__PURE__*/
function () {
  function Stake() {
    (0, _classCallCheck2["default"])(this, Stake);
  }

  (0, _createClass2["default"])(Stake, null, [{
    key: "createMsgDelegate",
    value: function createMsgDelegate(req) {
      var value = {
        denom: req.msg.delegation.denom,
        amount: Utils.toString(req.msg.delegation.amount)
      };
      var delegator_addr = BECH32.decode(req.from).words;
      var validator_addr = BECH32.decode(req.msg.validator_addr).words;
      return new MsgDelegate({
        DelegatorAddr: delegator_addr,
        ValidatorAddr: validator_addr,
        Value: value
      });
    }
  }, {
    key: "createMsgUndelegate",
    value: function createMsgUndelegate(req) {
      var shares_amount = Dec.String(req.msg.shares_amount);
      var delegator_addr = BECH32.decode(req.from).words;
      var validator_addr = BECH32.decode(req.msg.validator_addr).words;
      return new MsgUndelegate({
        DelegatorAddr: delegator_addr,
        ValidatorAddr: validator_addr,
        SharesAmount: shares_amount
      });
    }
  }, {
    key: "createMsgBeginRedelegate",
    value: function createMsgBeginRedelegate(req) {
      var shares_amount = Dec.String(req.msg.shares_amount);
      var delegator_addr = BECH32.decode(req.from).words;
      var validator_src_addr = BECH32.decode(req.msg.validator_src_addr).words;
      var validator_dst_addr = BECH32.decode(req.msg.validator_dst_addr).words;
      return new MsgBeginRedelegate({
        DelegatorAddr: delegator_addr,
        ValidatorSrcAddr: validator_src_addr,
        ValidatorDstAddr: validator_dst_addr,
        SharesAmount: shares_amount
      });
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
        share = share + ".000000000000000000";
      } else {
        var padLen = 18 - share.split(".")[1].length;

        for (var i = 0; i < padLen; i++) {
          share = "".concat(share, "0");
        }
      }

      return share;
    }
  }]);
  return Dec;
}();
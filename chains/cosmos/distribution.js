"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var Root = require('./tx/tx');

var Amino = require("../base");

var Utils = require('../../util/utils');

var Config = require('../../config');

var BECH32 = require('bech32');

var MsgSetWithdrawAddress = Root.cosmos.MsgSetWithdrawAddress;
var MsgWithdrawDelegatorReward = Root.cosmos.MsgWithdrawDelegatorReward;
var MsgWithdrawValidatorCommission = Root.cosmos.MsgWithdrawValidatorCommission;
MsgSetWithdrawAddress.prototype.type = Config.cosmos.tx.setWithdrawAddress.prefix;

MsgSetWithdrawAddress.prototype.GetSignBytes = function () {
  var msg = {
    delegator_address: BECH32.encode(Config.cosmos.bech32.accAddr, this.DelegatorAddr),
    withdraw_address: BECH32.encode(Config.cosmos.bech32.accAddr, this.WithdrawAddr)
  };
  var sortMsg = Utils.sortObjectKeys(msg);
  return Amino.MarshalJSON(this.type, sortMsg);
};

MsgSetWithdrawAddress.prototype.ValidateBasic = function () {
  if (Utils.isEmpty(this.DelegatorAddr)) {
    throw new Error("delegatorAddr is  empty");
  }

  if (Utils.isEmpty(this.WithdrawAddr)) {
    throw new Error("WithdrawAddr is  empty");
  }
};

MsgSetWithdrawAddress.prototype.GetMsg = function () {
  var BECH32 = require('bech32');

  var delegator_addr = BECH32.fromWords(this.DelegatorAddr);
  var withdraw_addr = BECH32.fromWords(this.WithdrawAddr);
  return {
    DelegatorAddr: delegator_addr,
    WithdrawAddr: withdraw_addr
  };
};

MsgWithdrawDelegatorReward.prototype.type = Config.cosmos.tx.withdrawDelegatorReward.prefix;

MsgWithdrawDelegatorReward.prototype.GetSignBytes = function () {
  var msg = {
    delegator_address: BECH32.encode(Config.cosmos.bech32.accAddr, this.DelegatorAddr),
    validator_address: BECH32.encode(Config.cosmos.bech32.valAddr, this.ValidatorAddr)
  };
  var sortMsg = Utils.sortObjectKeys(msg);
  return Amino.MarshalJSON(this.type, sortMsg);
};

MsgWithdrawDelegatorReward.prototype.ValidateBasic = function () {
  if (Utils.isEmpty(this.DelegatorAddr)) {
    throw new Error("delegatorAddr is  empty");
  }

  if (Utils.isEmpty(this.ValidatorAddr)) {
    throw new Error("validatorAddr is  empty");
  }
};

MsgWithdrawDelegatorReward.prototype.GetMsg = function () {
  var BECH32 = require('bech32');

  var delegator_addr = BECH32.fromWords(this.DelegatorAddr);
  var validator_addr = BECH32.fromWords(this.ValidatorAddr);
  return {
    DelegatorAddr: delegator_addr,
    ValidatorAddr: validator_addr
  };
};

MsgWithdrawValidatorCommission.prototype.type = Config.cosmos.tx.withdrawValidatorCommission.prefix;

MsgWithdrawValidatorCommission.prototype.GetSignBytes = function () {
  var msg = {
    validator_address: BECH32.encode(Config.cosmos.bech32.valAddr, this.ValidatorAddr)
  };
  var sortMsg = Utils.sortObjectKeys(msg);
  return Amino.MarshalJSON(this.type, sortMsg);
};

MsgWithdrawValidatorCommission.prototype.ValidateBasic = function () {
  if (Utils.isEmpty(this.ValidatorAddr)) {
    throw new Error("validatorAddr is  empty");
  }
};

MsgWithdrawValidatorCommission.prototype.GetMsg = function () {
  var BECH32 = require('bech32');

  var validator_addr = BECH32.fromWords(this.ValidatorAddr);
  return {
    ValidatorAddr: validator_addr
  };
};

module.exports =
/*#__PURE__*/
function () {
  function Distribution() {
    (0, _classCallCheck2["default"])(this, Distribution);
  }

  (0, _createClass2["default"])(Distribution, null, [{
    key: "CreateMsgSetWithdrawAddress",
    value: function CreateMsgSetWithdrawAddress(req) {
      var delegator_addr = BECH32.decode(req.from).words;
      var withdraw_addr = BECH32.decode(req.msg.withdraw_addr).words;
      return new MsgSetWithdrawAddress({
        DelegatorAddr: delegator_addr,
        WithdrawAddr: withdraw_addr
      });
    }
  }, {
    key: "CreateMsgWithdrawDelegatorReward",
    value: function CreateMsgWithdrawDelegatorReward(req) {
      var delegator_addr = BECH32.decode(req.from).words;
      var validator_addr = BECH32.decode(req.msg.validator_addr).words;
      return new MsgWithdrawDelegatorReward({
        DelegatorAddr: delegator_addr,
        ValidatorAddr: validator_addr
      });
    }
  }, {
    key: "CreateMsgWithdrawValidatorCommission",
    value: function CreateMsgWithdrawValidatorCommission(req) {
      var validator_addr = BECH32.decode(req.msg.validator_addr).words;
      return new MsgWithdrawValidatorCommission({
        ValidatorAddr: validator_addr
      });
    }
  }]);
  return Distribution;
}();
'use strict';

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/inherits"));

var Builder = require("../../builder");

var Utils = require('../../util/utils');

var Amino = require('./amino');

var Config = require('../../config');

var MsgWithdrawDelegatorRewardsAll =
/*#__PURE__*/
function (_Builder$Msg) {
  (0, _inherits2["default"])(MsgWithdrawDelegatorRewardsAll, _Builder$Msg);

  function MsgWithdrawDelegatorRewardsAll(delegatorAddr) {
    var _this;

    (0, _classCallCheck2["default"])(this, MsgWithdrawDelegatorRewardsAll);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(MsgWithdrawDelegatorRewardsAll).call(this, Config.iris.tx.withdrawDelegationRewardsAll.prefix));
    _this.delegator_addr = delegatorAddr;
    return _this;
  }

  (0, _createClass2["default"])(MsgWithdrawDelegatorRewardsAll, [{
    key: "GetSignBytes",
    value: function GetSignBytes() {
      var msg = {
        "delegator_addr": this.delegator_addr
      };
      var sortMsg = Utils.sortObjectKeys(msg);
      return Amino.MarshalJSON(this.Type(), sortMsg);
    }
  }, {
    key: "ValidateBasic",
    value: function ValidateBasic() {
      if (Utils.isEmpty(this.delegator_addr)) {
        throw new Error("delegatorAddr is empty");
      }
    }
  }, {
    key: "Type",
    value: function Type() {
      return Config.iris.tx.withdrawDelegationRewardsAll.prefix;
    }
  }, {
    key: "GetMsg",
    value: function GetMsg() {
      var BECH32 = require('bech32');

      var delegator_key = BECH32.decode(this.delegator_addr);
      var delegator_addr = BECH32.fromWords(delegator_key.words);
      return {
        delegatorAddr: delegator_addr
      };
    }
  }, {
    key: "GetDisplayContent",
    value: function GetDisplayContent() {
      return {
        i18n_tx_type: "i18n_rwithdraw_delegation_rewards_all",
        i18n_delegator_addr: this.delegator_addr
      };
    }
  }]);
  return MsgWithdrawDelegatorRewardsAll;
}(Builder.Msg);

var MsgWithdrawDelegatorReward =
/*#__PURE__*/
function (_Builder$Msg2) {
  (0, _inherits2["default"])(MsgWithdrawDelegatorReward, _Builder$Msg2);

  function MsgWithdrawDelegatorReward(delegatorAddr, validator_addr) {
    var _this2;

    (0, _classCallCheck2["default"])(this, MsgWithdrawDelegatorReward);
    _this2 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(MsgWithdrawDelegatorReward).call(this, Config.iris.tx.withdrawDelegationReward.prefix));
    _this2.delegator_addr = delegatorAddr;
    _this2.validator_addr = validator_addr;
    return _this2;
  }

  (0, _createClass2["default"])(MsgWithdrawDelegatorReward, [{
    key: "GetSignBytes",
    value: function GetSignBytes() {
      var msg = {
        "delegator_addr": this.delegator_addr,
        "validator_addr": this.validator_addr
      };
      var sortMsg = Utils.sortObjectKeys(msg);
      return Amino.MarshalJSON(this.Type(), sortMsg);
    }
  }, {
    key: "ValidateBasic",
    value: function ValidateBasic() {
      if (Utils.isEmpty(this.delegator_addr)) {
        throw new Error("delegatorAddr is empty");
      }

      if (Utils.isEmpty(this.validator_addr)) {
        throw new Error("validator_addr is empty");
      }
    }
  }, {
    key: "Type",
    value: function Type() {
      return Config.iris.tx.withdrawDelegationReward.prefix;
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
        validatorAddr: validator_addr
      };
    }
  }, {
    key: "GetDisplayContent",
    value: function GetDisplayContent() {
      return {
        i18n_tx_type: "i18n_withdraw_delegation_reward",
        i18n_delegator_addr: this.delegator_addr,
        i18n_validator_addr: this.validator_addr
      };
    }
  }]);
  return MsgWithdrawDelegatorReward;
}(Builder.Msg);

module.exports =
/*#__PURE__*/
function () {
  function Distribution() {
    (0, _classCallCheck2["default"])(this, Distribution);
  }

  (0, _createClass2["default"])(Distribution, null, [{
    key: "CreateMsgWithdrawDelegatorRewardsAll",
    value: function CreateMsgWithdrawDelegatorRewardsAll(req) {
      return new MsgWithdrawDelegatorRewardsAll(req.from);
    }
  }, {
    key: "CreateMsgWithdrawDelegatorReward",
    value: function CreateMsgWithdrawDelegatorReward(req) {
      return new MsgWithdrawDelegatorReward(req.from, req.msg.validator_addr);
    }
  }]);
  return Distribution;
}();
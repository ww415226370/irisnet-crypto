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

var Bank = require('./bank');

var SubmitProposalMsg =
/*#__PURE__*/
function (_Builder$Msg) {
  (0, _inherits2["default"])(SubmitProposalMsg, _Builder$Msg);

  function SubmitProposalMsg(title, description, proposalKind, proposer, deposit) {
    var _this;

    (0, _classCallCheck2["default"])(this, SubmitProposalMsg);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(SubmitProposalMsg).call(this));
    _this.Title = title;
    _this.Description = description;
    _this.ProposalKind = proposalKind;
    _this.Proposer = proposer;
    _this.InitialDeposit = deposit;
    return _this;
  }

  (0, _createClass2["default"])(SubmitProposalMsg, [{
    key: "GetSignBytes",
    value: function GetSignBytes() {
      var msg = {
        "Title": this.Title,
        "Description": this.Description,
        "ProposalKind": this.ProposalKind,
        "Proposer": this.Proposer,
        "InitialDeposit": this.InitialDeposit
      };
      var sortMsg = Utils.sortObjectKeys(msg);
      return Amino.MarshalJSON(this.Type(), sortMsg);
    }
  }, {
    key: "ValidateBasic",
    value: function ValidateBasic() {
      if (Utils.isEmpty(this.Title)) {
        throw new Error("Title is empty");
      }

      if (Utils.isEmpty(this.Description)) {
        throw new Error("Description is empty");
      }

      if (Utils.isEmpty(this.ProposalKind)) {
        throw new Error("delegation must great than 0");
      }

      if (Utils.isEmpty(this.Proposer)) {
        throw new Error("Proposer must great than 0");
      }

      if (Utils.isEmpty(this.InitialDeposit)) {
        throw new Error("InitialDeposit must great than 0");
      }
    }
  }, {
    key: "Type",
    value: function Type() {
      return "cosmos-sdk/MsgSubmitProposal";
    }
  }]);
  return SubmitProposalMsg;
}(Builder.Msg);

module.exports =
/*#__PURE__*/
function () {
  function Gov() {
    (0, _classCallCheck2["default"])(this, Gov);
  }

  (0, _createClass2["default"])(Gov, null, [{
    key: "GetSubmitProposalMsg",
    // TODO
    value: function GetSubmitProposalMsg(acc, validatorAddr, coins, fee, gas, memo) {
      var stdFee = Bank.NewStdFee(fee, gas);
      var msg = new SubmitProposalMsg(acc.address, validatorAddr, coins);
      var signMsg = Bank.NewStdSignMsg(acc.chain_id, acc.account_number, acc.sequence, stdFee, msg, memo);
      return signMsg;
    }
  }]);
  return Gov;
}();
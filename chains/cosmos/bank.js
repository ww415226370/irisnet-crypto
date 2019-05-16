'use strict';

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.array.for-each");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var Utils = require('../../util/utils');

var Config = require('../../config');

var Amino = require("../base");

var Root = require('./tx/tx');

var MsgSend = Root.cosmos.MsgSend;

MsgSend.prototype.GetSignBytes = function () {
  var BECH32 = require('bech32');

  var msg = {
    "from_address": BECH32.encode(Config.cosmos.bech32.accAddr, this.FromAddress),
    "to_address": BECH32.encode(Config.cosmos.bech32.accAddr, this.ToAddress),
    "amount": this.Amount
  };
  var sortMsg = Utils.sortObjectKeys(msg);
  return Amino.MarshalJSON(this.type, sortMsg);
};

MsgSend.prototype.ValidateBasic = function () {
  if (Utils.isEmpty(this.FromAddress)) {
    throw new Error("sender is  empty");
  }

  if (Utils.isEmpty(this.ToAddress)) {
    throw new Error("sender is  empty");
  }
};

MsgSend.prototype.GetMsg = function () {
  var BECH32 = require('bech32');

  var from_address = BECH32.fromWords(this.FromAddress);
  var to_address = BECH32.fromWords(this.ToAddress);
  return {
    FromAddress: from_address,
    ToAddress: to_address,
    Amount: this.Amount
  };
};

MsgSend.prototype.type = Config.cosmos.tx.transfer.prefix;

module.exports =
/*#__PURE__*/
function () {
  function Bank() {
    (0, _classCallCheck2["default"])(this, Bank);
  }

  (0, _createClass2["default"])(Bank, null, [{
    key: "create",
    value: function create(req) {
      var coins = [];

      if (!Utils.isEmpty(req.msg.coins)) {
        req.msg.coins.forEach(function (item) {
          coins.push({
            denom: item.denom,
            amount: Utils.toString(item.amount)
          });
        });
      }

      var BECH32 = require('bech32');

      var from = BECH32.decode(req.from).words;
      var to = BECH32.decode(req.msg.to).words;
      var msg = new MsgSend({
        FromAddress: from,
        ToAddress: to,
        Amount: coins
      });
      return msg;
    }
  }]);
  return Bank;
}();
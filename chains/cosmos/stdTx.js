"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.array.for-each");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/inherits"));

var Utils = require('../../util/utils');

var Codec = require('../../util/codec');

var Config = require('../../config');

var Builder = require("../../builder");

var Amino = require("../base");

var TxSerializer = require("./tx/tx_serializer");

var Base64 = require('base64-node');

var Root = require('./tx/tx');

var StdFee = Root.cosmos.StdFee;
var Coin = Root.cosmos.Coin;

StdFee.prototype.GetSignBytes = function () {
  if (Utils.isEmpty(this.amount)) {
    this.amount = [new Coin({
      denom: '',
      amount: '0'
    })];
  }

  return {
    amount: this.amount,
    gas: this.gas
  };
};

var StdSignMsg =
/*#__PURE__*/
function (_Builder$Msg) {
  (0, _inherits2["default"])(StdSignMsg, _Builder$Msg);

  function StdSignMsg(chainID, accnum, sequence, fee, msg, memo, msgType) {
    var _this;

    (0, _classCallCheck2["default"])(this, StdSignMsg);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(StdSignMsg).call(this, msgType));
    _this.chain_id = chainID;
    _this.account_number = accnum;
    _this.sequence = sequence;
    _this.fee = fee;
    _this.msgs = [msg];
    _this.memo = memo;
    return _this;
  }

  (0, _createClass2["default"])(StdSignMsg, [{
    key: "GetSignBytes",
    value: function GetSignBytes() {
      var msgs = [];
      this.msgs.forEach(function (msg) {
        msgs.push(msg.GetSignBytes());
      });
      var tx = {
        account_number: this.account_number,
        chain_id: this.chain_id,
        fee: this.fee.GetSignBytes(),
        memo: this.memo,
        msgs: msgs,
        sequence: this.sequence
      };
      return Utils.sortObjectKeys(tx);
    }
  }, {
    key: "ValidateBasic",
    value: function ValidateBasic() {
      if (Utils.isEmpty(this.chain_id)) {
        throw new Error("chain_id is  empty");
      }

      if (this.account_number < 0) {
        throw new Error("account_number is  empty");
      }

      if (this.sequence < 0) {
        throw new Error("sequence is  empty");
      }

      this.msgs.forEach(function (msg) {
        msg.ValidateBasic();
      });
    }
  }]);
  return StdSignMsg;
}(Builder.Msg);

var StdTx =
/*#__PURE__*/
function () {
  function StdTx(properties) {
    (0, _classCallCheck2["default"])(this, StdTx);
    this.msgs = properties.msgs;
    this.fee = properties.fee;
    this.signatures = null;
    this.memo = properties.memo;
    this.signMsg = properties;
  }

  (0, _createClass2["default"])(StdTx, [{
    key: "SetSignature",
    value: function SetSignature(sig) {
      if (typeof sig === "string") {
        sig = JSON.parse(sig);
      }

      var signature = new Root.cosmos.StdSignature({
        pubKey: sig.pub_key,
        signature: sig.signature
      });
      this.signatures = [signature];
    }
  }, {
    key: "SetPubKey",
    value: function SetPubKey(pubkey) {
      if (Codec.Bech32.isBech32(Config.cosmos.bech32.accPub, pubkey)) {
        pubkey = Codec.Bech32.fromBech32(pubkey);
      }

      pubkey = Codec.Hex.hexToBytes(pubkey);

      if (!this.signatures || this.signatures.length == 0) {
        var signature = {
          pub_key: pubkey
        };
        this.SetSignature(signature);
        return;
      }

      this.signatures[0].pubKey = pubkey;
    }
  }, {
    key: "GetData",
    value: function GetData() {
      var signatures = [];

      if (this.signatures) {
        this.signatures.forEach(function (sig) {
          var publicKey = "";
          var signature = "";

          if (sig.pubKey.length > 33) {
            //去掉amino编码前缀
            publicKey = sig.pubKey.slice(5, sig.pubKey.length);
          }

          publicKey = Base64.encode(publicKey);

          if (!Utils.isEmpty(sig.signature)) {
            signature = Base64.encode(sig.signature);
          }

          signatures.push({
            pub_key: Amino.MarshalJSON(Config.cosmos.amino.pubKey, publicKey),
            signature: signature
          });
        });
      }

      var msgs = [];
      this.msgs.forEach(function (msg) {
        msgs.push(msg.GetSignBytes());
      });
      var fee = {
        amount: this.fee.amount,
        gas: Utils.toString(this.fee.gas)
      };
      return {
        'tx': {
          msg: msgs,
          fee: fee,
          signatures: signatures,
          memo: this.memo
        },
        'return': 'block'
      };
    }
    /**
     *  用于计算交易hash和签名后的交易内容(base64编码)
     *
     *  可以直接将data提交到irishub的/txs接口
     *
     * @returns {{data: *, hash: *}}
     * @constructor
     */

  }, {
    key: "Hash",
    value: function Hash() {
      var result = TxSerializer.encode(this);
      return {
        data: this.GetData(),
        hash: result.hash
      };
    }
  }, {
    key: "GetSignBytes",
    value: function GetSignBytes() {
      return this.signMsg.GetSignBytes();
    }
  }, {
    key: "GetDisplayContent",
    value: function GetDisplayContent() {
      var msg = this.msgs[0];
      var content = msg.GetDisplayContent();
      content.i18n_fee = this.fee.amount;
      return content;
    }
  }]);
  return StdTx;
}();

module.exports =
/*#__PURE__*/
function () {
  function Bank() {
    (0, _classCallCheck2["default"])(this, Bank);
  }

  (0, _createClass2["default"])(Bank, null, [{
    key: "create",
    value: function create(req, msg) {
      var fee = new StdFee({
        amount: req.fees,
        gas: req.gas
      });
      var stdMsg = new StdSignMsg(req.chain_id, req.account_number, req.sequence, fee, msg, req.memo, req.type);
      stdMsg.ValidateBasic();
      return new StdTx(stdMsg);
    }
  }]);
  return Bank;
}();
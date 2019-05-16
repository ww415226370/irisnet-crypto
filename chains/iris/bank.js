'use strict';

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.array.for-each");

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/inherits"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var Utils = require('../../util/utils');

var Codec = require('../../util/codec');

var Config = require('../../config');

var Builder = require("../../builder");

var Amino = require("./amino");

var TxSerializer = require("./tx/tx_serializer");

var Base64 = require('base64-node');

var Coin = function Coin(amount, denom) {
  (0, _classCallCheck2["default"])(this, Coin);
  this.denom = denom;
  this.amount = amount;
};

var Input =
/*#__PURE__*/
function (_Builder$Validator) {
  (0, _inherits2["default"])(Input, _Builder$Validator);

  function Input(address, coins) {
    var _this;

    (0, _classCallCheck2["default"])(this, Input);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Input).call(this));
    _this.address = address;
    _this.coins = coins;
    return _this;
  }

  (0, _createClass2["default"])(Input, [{
    key: "GetSignBytes",
    value: function GetSignBytes() {
      var msg = {
        "address": this.address,
        "coins": this.coins
      };
      return Utils.sortObjectKeys(msg);
    }
  }, {
    key: "ValidateBasic",
    value: function ValidateBasic() {
      if (Utils.isEmpty(this.address)) {
        throw new Error("address is empty");
      }

      if (Utils.isEmpty(this.coins)) {
        throw new Error("coins is empty");
      }
    }
  }]);
  return Input;
}(Builder.Validator);

var Output =
/*#__PURE__*/
function (_Builder$Validator2) {
  (0, _inherits2["default"])(Output, _Builder$Validator2);

  function Output(address, coins) {
    var _this2;

    (0, _classCallCheck2["default"])(this, Output);
    _this2 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Output).call(this));
    _this2.address = address;
    _this2.coins = coins;
    return _this2;
  }

  (0, _createClass2["default"])(Output, [{
    key: "GetSignBytes",
    value: function GetSignBytes() {
      var msg = {
        "address": this.address,
        "coins": this.coins
      };
      return Utils.sortObjectKeys(msg);
    }
  }, {
    key: "ValidateBasic",
    value: function ValidateBasic() {
      if (Utils.isEmpty(this.address)) {
        throw new Error("address is empty");
      }

      if (Utils.isEmpty(this.coins)) {
        throw new Error("coins is empty");
      }
    }
  }]);
  return Output;
}(Builder.Validator);

var MsgSend =
/*#__PURE__*/
function (_Builder$Msg) {
  (0, _inherits2["default"])(MsgSend, _Builder$Msg);

  function MsgSend(from, to, coins) {
    var _this3;

    (0, _classCallCheck2["default"])(this, MsgSend);
    _this3 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(MsgSend).call(this, Config.iris.tx.transfer.prefix));
    _this3.inputs = [new Input(from, coins)];
    _this3.outputs = [new Output(to, coins)];
    return _this3;
  }

  (0, _createClass2["default"])(MsgSend, [{
    key: "GetSignBytes",
    value: function GetSignBytes() {
      var inputs = [];
      var outputs = [];
      this.inputs.forEach(function (item) {
        inputs.push(item.GetSignBytes());
      });
      this.outputs.forEach(function (item) {
        outputs.push(item.GetSignBytes());
      });
      var msg = {
        "inputs": inputs,
        "outputs": outputs
      };
      return Utils.sortObjectKeys(msg);
    }
  }, {
    key: "ValidateBasic",
    value: function ValidateBasic() {
      if (Utils.isEmpty(this.inputs)) {
        throw new Error("sender is  empty");
      }

      if (Utils.isEmpty(this.outputs)) {
        throw new Error("sender is  empty");
      }

      this.inputs.forEach(function (input) {
        input.ValidateBasic();
      });
      this.outputs.forEach(function (output) {
        output.ValidateBasic();
      });
    }
  }, {
    key: "Type",
    value: function Type() {
      return Config.iris.tx.transfer.prefix;
    }
  }, {
    key: "GetMsg",
    value: function GetMsg() {
      var inputs = [];
      var outputs = [];
      this.inputs.forEach(function (item) {
        var BECH32 = require('bech32');

        var ownKey = BECH32.decode(item.address);
        var addrHex = BECH32.fromWords(ownKey.words);
        inputs.push({
          address: addrHex,
          coins: item.coins
        });
      });
      this.outputs.forEach(function (item) {
        var BECH32 = require('bech32');

        var ownKey = BECH32.decode(item.address);
        var addrHex = BECH32.fromWords(ownKey.words);
        outputs.push({
          address: addrHex,
          coins: item.coins
        });
      });
      return {
        input: inputs,
        output: outputs
      };
    }
  }, {
    key: "GetDisplayContent",
    value: function GetDisplayContent() {
      return {
        i18n_tx_type: "i18n_transfer",
        i18n_from: this.inputs[0].address,
        i18n_to: this.outputs[0].address,
        i18n_amount: this.outputs[0].coins
      };
    }
  }]);
  return MsgSend;
}(Builder.Msg);

var StdFee =
/*#__PURE__*/
function () {
  function StdFee(amount, gas) {
    (0, _classCallCheck2["default"])(this, StdFee);
    this.amount = amount;

    if (!gas) {
      gas = Config.iris.maxGas;
    }

    this.gas = gas;
  }

  (0, _createClass2["default"])(StdFee, [{
    key: "GetSignBytes",
    value: function GetSignBytes() {
      if (Utils.isEmpty(this.amount)) {
        this.amount = [new Coin("0", "")];
      }

      return {
        amount: this.amount,
        gas: this.gas
      };
    }
  }]);
  return StdFee;
}();

var StdSignMsg =
/*#__PURE__*/
function (_Builder$Msg2) {
  (0, _inherits2["default"])(StdSignMsg, _Builder$Msg2);

  function StdSignMsg(chainID, accnum, sequence, fee, msg, memo, msgType) {
    var _this4;

    (0, _classCallCheck2["default"])(this, StdSignMsg);
    _this4 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(StdSignMsg).call(this, msgType));
    _this4.chain_id = chainID;
    _this4.account_number = accnum;
    _this4.sequence = sequence;
    _this4.fee = fee;
    _this4.msgs = [msg];
    _this4.memo = memo;
    return _this4;
  }

  (0, _createClass2["default"])(StdSignMsg, [{
    key: "GetSignBytes",
    value: function GetSignBytes() {
      var msgs = [];
      this.msgs.forEach(function (msg) {
        msgs.push(msg.GetSignBytes());
      });
      var tx = {
        "account_number": this.account_number,
        "chain_id": this.chain_id,
        "fee": this.fee.GetSignBytes(),
        "memo": this.memo,
        "msgs": msgs,
        "sequence": this.sequence
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

var StdSignature = function StdSignature(pub_key, signature, account_number, sequence) {
  (0, _classCallCheck2["default"])(this, StdSignature);
  this.pub_key = pub_key;
  this.signature = signature;
  this.account_number = account_number;
  this.sequence = sequence;
};

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

      var signature = new StdSignature(sig.pub_key, sig.signature, this.signMsg.account_number, this.signMsg.sequence);
      this.signatures = [signature];
    }
  }, {
    key: "SetPubKey",
    value: function SetPubKey(pubkey) {
      if (Codec.Bech32.isBech32(Config.iris.bech32.accPub, pubkey)) {
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

      this.signatures[0].pub_key = pubkey;
    }
  }, {
    key: "GetData",
    value: function GetData() {
      var signatures = [];

      if (this.signatures) {
        this.signatures.forEach(function (sig) {
          var publicKey = "";
          var signature = "";

          if (sig.pub_key.length > 33) {
            //去掉amino编码前缀
            publicKey = sig.pub_key.slice(5, sig.pub_key.length);
          }

          publicKey = Base64.encode(publicKey);

          if (!Utils.isEmpty(sig.signature)) {
            signature = Base64.encode(sig.signature);
          }

          signatures.push({
            pub_key: Amino.MarshalJSON(Config.iris.amino.pubKey, publicKey),
            signature: signature,
            account_number: Utils.toString(sig.account_number),
            sequence: Utils.toString(sig.sequence)
          });
        });
      }

      var msgs = [];
      this.msgs.forEach(function (msg) {
        msgs.push(Amino.MarshalJSON(msg.type, msg));
      });
      var fee = {
        amount: this.fee.amount,
        gas: Utils.toString(this.fee.gas)
      };
      return {
        tx: {
          msg: msgs,
          fee: fee,
          signatures: signatures,
          memo: this.memo
        }
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
        data: Base64.encode(result.data),
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
    key: "CreateMsgSend",
    value: function CreateMsgSend(req) {
      var coins = [];

      if (!Utils.isEmpty(req.msg.coins)) {
        req.msg.coins.forEach(function (item) {
          coins.push({
            denom: item.denom,
            amount: Utils.toString(item.amount)
          });
        });
      }

      var msg = new MsgSend(req.from, req.msg.to, coins);
      return msg;
    }
  }, {
    key: "NewStdSignature",
    value: function NewStdSignature(pub_key, signature, account_number, sequence) {
      return new StdSignature(pub_key, signature, account_number, sequence);
    }
  }, {
    key: "NewStdTx",
    value: function NewStdTx(properties) {
      return new StdTx(properties);
    }
  }, {
    key: "NewStdFee",
    value: function NewStdFee(amount, gas) {
      return new StdFee(amount, gas);
    }
  }, {
    key: "NewStdSignMsg",
    value: function NewStdSignMsg(chainID, accnum, sequence, fee, msg, memo, msgType) {
      return new StdSignMsg(chainID, accnum, sequence, fee, msg, memo, msgType);
    }
  }]);
  return Bank;
}();
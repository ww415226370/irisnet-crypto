'use strict';

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var Codec = require("../util/codec");

var Sha256 = require("sha256");

var Config = require('../config');

var R_Cosmos = require('./cosmos/tx/tx');

var R_Iris = require('./iris/tx/tx');
/**
 * 处理amino编码（目前支持序列化）
 *
 */


var Amino =
/*#__PURE__*/
function () {
  function Amino() {
    (0, _classCallCheck2["default"])(this, Amino);
    this._keyMap = {};
  }
  /**
   */


  (0, _createClass2["default"])(Amino, [{
    key: "GetRegisterInfo",
    value: function GetRegisterInfo(key) {
      var info = this._keyMap[key];

      if (info === undefined) {
        throw new Error("not Registered");
      }

      return info;
    }
    /**
     * 注册amino类型
     *
     * @param class field的类型
     * @param key amino前缀
     */

  }, {
    key: "RegisterConcrete",
    value: function RegisterConcrete(type, key) {
      this._keyMap[key] = {
        prefix: this._aminoPrefix(key),
        classType: type
      };
    }
    /**
     * 给消息加上amino前缀
     *
     * @param key amino前缀
     * @param message 编码msg
     * @returns { Array }
     */

  }, {
    key: "MarshalBinary",
    value: function MarshalBinary(key, message) {
      var prefixBytes = this._keyMap[key].prefix;
      prefixBytes = Buffer.from(prefixBytes.concat(message.length));
      prefixBytes = Buffer.concat([prefixBytes, message]);
      return prefixBytes;
    }
  }, {
    key: "MarshalJSON",
    value: function MarshalJSON(key, message) {
      var pair = {
        "type": key,
        "value": message
      };
      return pair;
    }
  }, {
    key: "_aminoPrefix",
    value: function _aminoPrefix(name) {
      var a = Sha256(name);
      var b = Codec.Hex.hexToBytes(a);

      while (b[0] === 0) {
        b = b.slice(1, b.length - 1);
      }

      b = b.slice(3, b.length - 1);

      while (b[0] === 0) {
        b = b.slice(1, b.length - 1);
      }

      b = b.slice(0, 4); //注意和go-amino v0.6.2以前的不一样

      return b;
    }
  }]);
  return Amino;
}();

var amino = new Amino();
amino.RegisterConcrete(null, Config.cosmos.amino.pubKey);
amino.RegisterConcrete(null, Config.cosmos.amino.signature);
amino.RegisterConcrete(R_Cosmos.cosmos.MsgDelegate, Config.cosmos.tx.delegate.prefix);
amino.RegisterConcrete(R_Cosmos.cosmos.MsgSend, Config.cosmos.tx.transfer.prefix);
amino.RegisterConcrete(R_Cosmos.cosmos.MsgSetWithdrawAddress, Config.cosmos.tx.setWithdrawAddress.prefix);
amino.RegisterConcrete(R_Cosmos.cosmos.MsgWithdrawDelegatorReward, Config.cosmos.tx.withdrawDelegatorReward.prefix);
amino.RegisterConcrete(R_Cosmos.cosmos.MsgWithdrawValidatorCommission, Config.cosmos.tx.withdrawValidatorCommission.prefix);
amino.RegisterConcrete(R_Cosmos.cosmos.MsgUndelegate, Config.cosmos.tx.undelegate.prefix);
amino.RegisterConcrete(R_Cosmos.cosmos.MsgBeginRedelegate, Config.cosmos.tx.beginRedelegate.prefix);
amino.RegisterConcrete(R_Cosmos.cosmos.StdTx, Config.cosmos.tx.stdTx.prefix);
amino.RegisterConcrete(null, Config.iris.amino.pubKey);
amino.RegisterConcrete(null, Config.iris.amino.signature);
amino.RegisterConcrete(R_Iris.irisnet.tx.MsgDelegate, Config.iris.tx.delegate.prefix);
amino.RegisterConcrete(R_Iris.irisnet.tx.MsgSend, Config.iris.tx.transfer.prefix);
amino.RegisterConcrete(R_Iris.irisnet.tx.MsgBeginRedelegate, Config.iris.tx.redelegate.prefix);
amino.RegisterConcrete(R_Iris.irisnet.tx.MsgBeginUnbonding, Config.iris.tx.unbond.prefix);
amino.RegisterConcrete(R_Iris.irisnet.tx.MsgWithdrawDelegatorRewardsAll, Config.iris.tx.withdrawDelegationRewardsAll.prefix);
amino.RegisterConcrete(R_Iris.irisnet.tx.MsgWithdrawDelegatorReward, Config.iris.tx.withdrawDelegationReward.prefix);
amino.RegisterConcrete(R_Iris.irisnet.tx.StdTx, Config.iris.tx.stdTx.prefix);
module.exports = amino;
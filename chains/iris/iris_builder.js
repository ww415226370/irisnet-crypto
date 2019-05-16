'use strict';

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/inherits"));

var Builder = require("../../builder").Builder;

var Old = require('old');

var Bank = require('./bank');

var Stake = require('./stake');

var Distribution = require('./distribution');

var IrisKeypair = require('./iris_keypair');

var Codec = require("../../util/codec");

var Config = require('../../config');

var Utils = require("../../util/utils");

var IrisBuilder =
/*#__PURE__*/
function (_Builder) {
  (0, _inherits2["default"])(IrisBuilder, _Builder);

  function IrisBuilder() {
    (0, _classCallCheck2["default"])(this, IrisBuilder);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(IrisBuilder).apply(this, arguments));
  }

  (0, _createClass2["default"])(IrisBuilder, [{
    key: "buildTx",

    /**
     * 构造签名内容
     *
     * @param tx  请求内容
     * @returns {StdTx}
     */
    value: function buildTx(tx) {
      var req = (0, _get2["default"])((0, _getPrototypeOf2["default"])(IrisBuilder.prototype), "buildParam", this).call(this, tx);
      var msg;

      switch (req.type) {
        case Config.iris.tx.transfer.type:
          {
            msg = Bank.CreateMsgSend(req);
            break;
          }

        case Config.iris.tx.delegate.type:
          {
            msg = Stake.CreateMsgDelegate(req);
            break;
          }

        case Config.iris.tx.unbond.type:
          {
            msg = Stake.CreateMsgBeginUnbonding(req);
            break;
          }

        case Config.iris.tx.redelegate.type:
          {
            msg = Stake.CreateMsgBeginRedelegate(req);
            break;
          }

        case Config.iris.tx.withdrawDelegationRewardsAll.type:
          {
            msg = Distribution.CreateMsgWithdrawDelegatorRewardsAll(req);
            break;
          }

        case Config.iris.tx.withdrawDelegationReward.type:
          {
            msg = Distribution.CreateMsgWithdrawDelegatorReward(req);
            break;
          }

        default:
          {
            throw new Error("not exist tx type");
          }
      }

      var stdFee = Bank.NewStdFee(req.fees, req.gas);
      var signMsg = Bank.NewStdSignMsg(req.chain_id, req.account_number, req.sequence, stdFee, msg, req.memo, req.type);
      signMsg.ValidateBasic();
      return Bank.NewStdTx(signMsg);
    }
    /**
     * 签名交易数据
     *
     * @param data
     * @param privateKey
     * @returns {}
     */

  }, {
    key: "sign",
    value: function sign(data, privateKey) {
      if (typeof data === "string") {
        data = JSON.parse(data);
      }

      var signbyte = IrisKeypair.sign(privateKey, data);
      var keypair = IrisKeypair["import"](privateKey);
      return {
        pub_key: Codec.Hex.hexToBytes(keypair.publicKey),
        signature: signbyte
      };
    }
    /**
     * (热钱包)
     *
     * 根据请求内容构造交易并对交易进行签名
     *
     * @param tx  请求内容
     * @param privateKey 发送方账户私钥
     * @returns {StdTx}  交易
     */

  }, {
    key: "buildAndSignTx",
    value: function buildAndSignTx(tx, privateKey) {
      var stdTx = this.buildTx(tx);
      var mode = tx.mode ? tx.mode : Config.iris.mode.normal;
      var signature;

      if (mode === Config.iris.mode.normal) {
        if (Utils.isEmpty(privateKey)) {
          throw new Error("privateKey is  empty");
        }

        signature = this.sign(stdTx.GetSignBytes(), privateKey);
        stdTx.SetSignature(signature);
      }

      return stdTx;
    }
  }]);
  return IrisBuilder;
}(Builder);

module.exports = Old(IrisBuilder);
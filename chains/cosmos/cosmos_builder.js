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

var CosmosKeypair = require('./cosmos_keypair');

var Codec = require("../../util/codec");

var Config = require('../../config');

var StdTx = require("./stdTx");

var CosmosBuilder =
/*#__PURE__*/
function (_Builder) {
  (0, _inherits2["default"])(CosmosBuilder, _Builder);

  function CosmosBuilder() {
    (0, _classCallCheck2["default"])(this, CosmosBuilder);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(CosmosBuilder).apply(this, arguments));
  }

  (0, _createClass2["default"])(CosmosBuilder, [{
    key: "buildTx",

    /**
     * 构造签名内容
     *
     * @param tx  请求内容
     * @returns {StdTx}
     */
    value: function buildTx(tx) {
      var req = (0, _get2["default"])((0, _getPrototypeOf2["default"])(CosmosBuilder.prototype), "buildParam", this).call(this, tx);
      var msg;

      switch (req.type) {
        case Config.cosmos.tx.transfer.type:
          {
            msg = Bank.create(req);
            break;
          }

        case Config.iris.tx.delegate.type:
          {
            msg = Stake.createMsgDelegate(req);
            break;
          }

        case Config.cosmos.tx.undelegate.type:
          {
            msg = Stake.createMsgUndelegate(req);
            break;
          }

        case Config.cosmos.tx.beginRedelegate.type:
          {
            msg = Stake.createMsgBeginRedelegate(req);
            break;
          }

        case Config.cosmos.tx.setWithdrawAddress.type:
          {
            msg = Distribution.CreateMsgSetWithdrawAddress(req);
            break;
          }

        case Config.cosmos.tx.withdrawDelegatorReward.type:
          {
            msg = Distribution.CreateMsgWithdrawDelegatorReward(req);
            break;
          }

        case Config.cosmos.tx.withdrawValidatorCommission.type:
          {
            msg = Distribution.CreateMsgWithdrawValidatorCommission(req);
            break;
          }

        default:
          {
            throw new Error("not exist tx type");
          }
      }

      return StdTx.create(req, msg);
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

      var signbyte = CosmosKeypair.sign(privateKey, data);
      var keypair = CosmosKeypair["import"](privateKey);
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
      var signature;
      signature = this.sign(stdTx.GetSignBytes(), privateKey);
      stdTx.SetSignature(signature);
      return stdTx;
    }
  }]);
  return CosmosBuilder;
}(Builder);

module.exports = Old(CosmosBuilder);
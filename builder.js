'use strict';

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/inherits"));

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.object.to-string");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var Config = require('./config');

var Utils = require('./util/utils');

var Builder =
/*#__PURE__*/
function () {
  function Builder() {
    (0, _classCallCheck2["default"])(this, Builder);
  }

  (0, _createClass2["default"])(Builder, [{
    key: "buildTx",

    /**
     * (冷钱包)
     *
     * 构造需要签名的交易内容,得到签名对象后，调用GetSignBytes()方法获取签名字符串
     *
     * @param tx {blockChainThriftModel.Tx} 请求内容
     * @returns {*}
     */
    value: function buildTx(tx) {
      throw new Error("not implement");
    }
    /**
     * (冷钱包)
     *
     * 根据请求内容构造交易并对交易进行签名
     *
     * @param data {*}
     * @param privateKey {string} 交易发送方私钥(hex编码)，冷钱包提供
     * @returns {StdSignature} 交易
     */

  }, {
    key: "sign",
    value: function sign(data, privateKey) {
      throw new Error("not implement");
    }
    /**
     * (热钱包)
     *
     * 根据请求内容构造交易并对交易进行签名
     *
     * @param tx {blockChainThriftModel.Tx} 请求内容
     * @param privateKey 发送方账户私钥
     * @returns {StdTx}  交易
     */

  }, {
    key: "buildAndSignTx",
    value: function buildAndSignTx(tx, privateKey) {
      throw new Error("not implement");
    }
    /**
     * builder 构建方法，返回具体实现类
     *
     * @param chainName 链名字
     * @returns {*} 具体实现(iris_builder | ethermint_builder)
     */

  }, {
    key: "buildParam",

    /**
     * 将外部请求参数封装为crypto统一类型，与具体业务代码松耦合.由具体子类调用
     *
     * @param tx {blockChainThriftModel.Tx} 传入参数
     * @returns {{acc, to, coins, fees, gas, type}}
     */
    value: function buildParam(tx) {
      var convert = function convert(tx) {
        var fees = [];

        if (!Utils.isEmpty(tx.fees)) {
          fees.push({
            "denom": tx.fees.denom,
            "amount": Utils.toString(tx.fees.amount)
          });
        }

        var memo = tx.memo ? tx.memo : '';
        return new Request(tx.chain_id, tx.from, tx.account_number, tx.sequence, fees, tx.gas, memo, tx.type, tx.msg);
      };

      return convert(tx);
    }
  }], [{
    key: "getBuilder",
    value: function getBuilder(chainName) {
      switch (chainName) {
        case Config.chain.iris:
          {
            return require('./chains/iris/iris_builder')();
          }

        case Config.chain.ethermint:
          {
            return require('./chains/ethermint/ethermint_builder')();
          }

        case Config.chain.cosmos:
          {
            return require('./chains/cosmos/cosmos_builder')();
          }

        default:
          {
            throw new Error("not correct chain");
          }
      }
    }
  }]);
  return Builder;
}();

var Request = function Request(chain_id, from, account_number, sequence, fees, gas, memo, type, msg) {
  (0, _classCallCheck2["default"])(this, Request);

  if (Utils.isEmpty(chain_id)) {
    throw new Error("chain_id is empty");
  }

  if (Utils.isEmpty(from)) {
    throw new Error("from is empty");
  }

  if (account_number < 0) {
    throw new Error("account_number is empty");
  }

  if (sequence < 0) {
    throw new Error("sequence is empty");
  }

  if (Utils.isEmpty(fees)) {
    throw new Error("fees is empty");
  }

  if (Utils.isEmpty(type)) {
    throw new Error("type is empty");
  }

  this.chain_id = chain_id;
  this.from = from;
  this.account_number = account_number;
  this.sequence = sequence;
  this.fees = fees;
  this.gas = gas;
  this.memo = memo;
  this.type = type;
  this.msg = msg;
};
/**
 * 校验器接口
 *
 */


var Validator =
/*#__PURE__*/
function () {
  function Validator() {
    (0, _classCallCheck2["default"])(this, Validator);
  }

  (0, _createClass2["default"])(Validator, [{
    key: "ValidateBasic",
    value: function ValidateBasic() {
      throw new Error("not implement");
    }
  }]);
  return Validator;
}();
/**
 * 签名消息接口
 *
 */


var Msg =
/*#__PURE__*/
function (_Validator) {
  (0, _inherits2["default"])(Msg, _Validator);
  (0, _createClass2["default"])(Msg, [{
    key: "GetSignBytes",
    value: function GetSignBytes() {
      throw new Error("not implement");
    }
  }, {
    key: "Type",
    value: function Type() {
      throw new Error("not implement");
    }
  }]);

  function Msg(type) {
    var _this;

    (0, _classCallCheck2["default"])(this, Msg);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Msg).call(this));
    _this.type = type;
    return _this;
  }

  (0, _createClass2["default"])(Msg, [{
    key: "GetMsg",
    value: function GetMsg() {
      throw new Error("not implement");
    }
  }, {
    key: "GetDisplayContent",
    value: function GetDisplayContent() {
      throw new Error("not implement");
    }
  }]);
  return Msg;
}(Validator);

module.exports = {
  Builder: Builder,
  Msg: Msg,
  Validator: Validator
};

'use strict';

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var Config = require('./config');

var Crypto =
/*#__PURE__*/
function () {
  function Crypto() {
    (0, _classCallCheck2["default"])(this, Crypto);
  }

  (0, _createClass2["default"])(Crypto, [{
    key: "create",

    /**
     * 创建账户
     *
     * @param (language:string} 字符集 (constants.Language.CH_S | constants.Language.JP |constants.Language.SP |constants.Language.EN |)
     * @returns {{address, phrase, privateKey, publicKey}}
     */
    value: function create(language) {
      throw new Error("not implement");
    }
    /**
     * 通过助记词恢复账户
     *
     * @param (seedphrase:string} 助记词
     * @param (language:string} 字符集 (constants.Language.CH_S | constants.Language.JP |constants.Language.SP |constants.Language.EN |)
     * @returns {{address, phrase, privateKey, publicKey}}
     */

  }, {
    key: "recover",
    value: function recover(seedphrase, language) {
      throw new Error("not implement");
    }
    /**
     * 通过私钥恢复账户
     *
     * @param (privateKey:string('hex')} 助记词
     * @returns {{address, privateKey, publicKey}}
     */

  }, {
    key: "import",
    value: function _import(privateKey) {
      throw new Error("not implement");
    }
    /**
     * 验证地址是否合法
     *
     * @param (address:string('hex')} 账户地址
     * @returns {true | false}
     */

  }, {
    key: "isValidAddress",
    value: function isValidAddress(address) {
      throw new Error("not implement");
    }
    /**
     * 验证私钥是否合法
     *
     * @param (privateKey:string('hex')} 私钥
     *
     * @returns {true | false}
     */

  }, {
    key: "isValidPrivate",
    value: function isValidPrivate(privateKey) {
      throw new Error("not implement");
    }
    /**
     * 通过公钥获取地址(bech32)
     *
     * @param (publicKey:string('hex')} 公钥
     */

  }, {
    key: "getAddress",
    value: function getAddress(publicKey) {
      throw new Error("not implement");
    }
    /**
     * getCrypto 构建方法，返回具体实现类
     *
     * @param chain 链名字
     * @returns {*} 具体实现(iris_crypto | ethermint_crypto)
     */

  }], [{
    key: "getCrypto",
    value: function getCrypto(chain) {
      switch (chain) {
        case Config.chain.iris:
          {
            return require('./chains/iris/iris_crypto')();
          }

        case Config.chain.ethermint:
          {
            return require('./chains/ethermint/ethermint_crypto')();
          }

        case Config.chain.cosmos:
          {
            return require('./chains/cosmos/cosmos_crypto')();
          }

        default:
          {
            throw new Error("not correct chain");
          }
      }
    }
  }]);
  return Crypto;
}();

module.exports = Crypto;

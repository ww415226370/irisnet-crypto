'use strict';

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/inherits"));

var Crypto = require("../../crypto");

var Old = require('old');

var CosmosKeypair = require('./cosmos_keypair');

var Codec = require("../../util/codec");

var Utils = require("../../util/utils");

var Config = require('../../config');

var Bip39 = require('bip39');

var CosmosCrypto =
/*#__PURE__*/
function (_Crypto) {
  (0, _inherits2["default"])(CosmosCrypto, _Crypto);

  function CosmosCrypto() {
    (0, _classCallCheck2["default"])(this, CosmosCrypto);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(CosmosCrypto).apply(this, arguments));
  }

  (0, _createClass2["default"])(CosmosCrypto, [{
    key: "create",

    /**
     *
     * @param language
     * @returns {*}
     */
    value: function create(language) {
      var keyPair = CosmosKeypair.create(switchToWordList(language));

      if (keyPair) {
        return encode({
          address: keyPair.address,
          phrase: keyPair.secret,
          privateKey: keyPair.privateKey,
          publicKey: keyPair.publicKey
        });
      }

      return keyPair;
    }
  }, {
    key: "recover",
    value: function recover(secret, language) {
      var keyPair = CosmosKeypair.recover(secret, switchToWordList(language));

      if (keyPair) {
        return encode({
          address: keyPair.address,
          phrase: secret,
          privateKey: keyPair.privateKey,
          publicKey: keyPair.publicKey
        });
      }
    }
  }, {
    key: "import",
    value: function _import(privateKey) {
      var keyPair = CosmosKeypair["import"](privateKey);

      if (keyPair) {
        return encode({
          address: keyPair.address,
          phrase: null,
          privateKey: keyPair.privateKey,
          publicKey: keyPair.publicKey
        });
      }
    }
  }, {
    key: "isValidAddress",
    value: function isValidAddress(address) {
      return CosmosKeypair.isValidAddress(address);
    }
  }, {
    key: "isValidPrivate",
    value: function isValidPrivate(privateKey) {
      return CosmosKeypair.isValidPrivate(privateKey);
    }
  }, {
    key: "getAddress",
    value: function getAddress(publicKey) {
      var pubKey = Codec.Hex.hexToBytes(publicKey);
      var address = CosmosKeypair.getAddress(pubKey);
      address = Codec.Bech32.toBech32(Config.cosmos.bech32.accAddr, address);
      return address;
    }
  }]);
  return CosmosCrypto;
}(Crypto);

function encode(acc) {
  if (!Utils.isEmpty(acc)) {
    switch (Config.cosmos.defaultCoding) {
      case Config.cosmos.coding.bech32:
        {
          if (Codec.Hex.isHex(acc.address)) {
            acc.address = Codec.Bech32.toBech32(Config.cosmos.bech32.accAddr, acc.address);
          }

          if (Codec.Hex.isHex(acc.publicKey)) {
            acc.publicKey = Codec.Bech32.toBech32(Config.cosmos.bech32.accPub, acc.publicKey);
          }
        }
    }

    return acc;
  }
}

function switchToWordList(language) {
  switch (language) {
    case Config.language.cn:
      return Bip39.wordlists.chinese_simplified;

    case Config.language.en:
      return Bip39.wordlists.english;

    case Config.language.jp:
      return Bip39.wordlists.japanese;

    case Config.language.sp:
      return Bip39.wordlists.spanish;

    default:
      return Bip39.wordlists.english;
  }
}

module.exports = Old(CosmosCrypto);
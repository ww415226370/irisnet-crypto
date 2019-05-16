'use strict';

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

require("core-js/modules/es6.regexp.constructor");

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.object.to-string");

var _parseInt2 = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/parse-int"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var BECH32 = require('bech32');
/**
 * 处理编码/解码
 *
 */


var Codec = function Codec() {
  (0, _classCallCheck2["default"])(this, Codec);
};
/**
 * 处理hex编码
 *
 * @type {hex}
 */


var hex =
/*#__PURE__*/
function () {
  function hex() {
    (0, _classCallCheck2["default"])(this, hex);
  }

  (0, _createClass2["default"])(hex, null, [{
    key: "hexToBytes",
    value: function hexToBytes(hex) {
      var bytes = [];

      for (var c = 0; c < hex.length; c += 2) {
        bytes.push((0, _parseInt2["default"])(hex.substr(c, 2), 16));
      }

      return bytes;
    }
  }, {
    key: "bytesToHex",
    value: function bytesToHex(bytes) {
      var hex = [];

      for (var i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
      }

      return hex.join("").toUpperCase();
    }
  }, {
    key: "stringToHex",
    value: function stringToHex(str) {
      var bytes = [];

      for (var i = 0; i < str.length; i++) {
        bytes.push(str.charCodeAt(i).toString(16));
      }

      return bytes.join("");
    }
  }, {
    key: "isHex",
    value: function isHex(str) {
      str = str.replace("0x", "");
      return /^[0-9a-fA-F]*$/i.test(str);
    }
  }]);
  return hex;
}();
/**
 * 处理bech32编码
 *
 * @type {bech32}
 */


var bech32 =
/*#__PURE__*/
function () {
  function bech32() {
    (0, _classCallCheck2["default"])(this, bech32);
  }

  (0, _createClass2["default"])(bech32, null, [{
    key: "fromBech32",

    /**
     *
     * @param bech32Str  使用bech32编码后的字符串
     * @returns {string} 大写的hex字符串
     */
    value: function fromBech32(bech32Str) {
      var ownKey = BECH32.decode(bech32Str);
      return hex.bytesToHex(BECH32.fromWords(ownKey.words)).toUpperCase();
    }
    /**
     *
     * @param prefix bech32编码前缀
     * @param str    待编码的字符串
     * @returns {*}  bech32编码后的字符串
     */

  }, {
    key: "toBech32",
    value: function toBech32(prefix, str) {
      var strByte = BECH32.toWords(Buffer.from(str, 'hex'));
      return BECH32.encode(prefix, strByte);
    }
    /**
     *
     * @param prefix bech32编码
     * @param str    待编码的字符串
     * @returns
     */

  }, {
    key: "isBech32",
    value: function isBech32(prefix, str) {
      if (!prefix || prefix.length == 0) {
        return false;
      }

      var preReg = new RegExp('^' + prefix + '1');

      if (!preReg.test(str)) {
        return false;
      }

      var allReg = new RegExp(/^[0-9a-zA-Z]*$/i);

      if (!allReg.test(str)) {
        return false;
      }

      try {
        bech32.fromBech32(str);
        return true;
      } catch (e) {
        return false;
      }
    }
  }]);
  return bech32;
}();

Codec.Hex = hex;
Codec.Bech32 = bech32;
module.exports = Codec;
'use strict';

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _parseInt2 = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/parse-int"));

require("core-js/modules/es6.array.for-each");

require("core-js/modules/es6.regexp.split");

var _from = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/array/from"));

require("core-js/modules/es6.typed.uint8-array");

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/json/stringify"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var Codec = require("../../util/codec");

var Util = require("../../util/utils");

var Sha256 = require("sha256");

var RIPEMD160 = require('ripemd160');

var Bip39 = require('bip39');

var Random = require('randombytes');

var Secp256k1 = require('secp256k1');

var BN = require("bn");

var Config = require('../../config');

var Amino = require('./amino');

var CosmosKeypair =
/*#__PURE__*/
function () {
  function CosmosKeypair() {
    (0, _classCallCheck2["default"])(this, CosmosKeypair);
  }

  (0, _createClass2["default"])(CosmosKeypair, null, [{
    key: "getPrivateKeyFromSecret",
    value: function getPrivateKeyFromSecret(mnemonicS) {
      var seed = Bip39.mnemonicToSeed(mnemonicS);
      var master = Hd.ComputeMastersFromSeed(seed);
      var derivedPriv = Hd.DerivePrivateKeyForPath(master.secret, master.chainCode, Config.iris.bip39Path);
      return derivedPriv;
    }
  }, {
    key: "sign",
    value: function sign(private_key, msg) {
      //将签名字符串使用Sha256构造32位byte数组
      var sigByte = Buffer.from((0, _stringify["default"])(msg));
      var sig32 = Buffer.from(Sha256(sigByte, {
        asBytes: true
      })); //对数据签名

      var prikeyArr = Buffer.from(new Uint8Array(Codec.Hex.hexToBytes(private_key)));
      var sig = Secp256k1.sign(sig32, prikeyArr); //let signature = Buffer.from(Hd.Serialize(sig.signature));
      //将签名结果加上amino编码前缀(irishub反序列化需要) (cosmos-sdk v0.24.0去掉了前缀)
      //signature = Amino.MarshalBinary(Config.iris.amino.signature,signature);

      return (0, _from["default"])(sig.signature);
    }
  }, {
    key: "getAddress",
    value: function getAddress(publicKey) {
      if (publicKey.length > 33) {
        //去掉amino编码前缀
        publicKey = publicKey.slice(5, publicKey.length);
      }

      var hmac = Sha256(publicKey);
      var b = Buffer.from(Codec.Hex.hexToBytes(hmac));
      var addr = new RIPEMD160().update(b);
      return addr.digest('hex').toUpperCase();
    }
  }, {
    key: "create",
    value: function create(language) {
      //生成24位助记词
      var entropySize = 24 * 11 - 8;
      var entropy = Random(entropySize / 8);
      var mnemonicS = Bip39.entropyToMnemonic(entropy, language);

      while (Util.hasRepeatElement(mnemonicS, " ")) {
        entropy = Random(entropySize / 8);
        mnemonicS = Bip39.entropyToMnemonic(entropy, language);
      } //生成私钥


      var secretKey = this.getPrivateKeyFromSecret(mnemonicS);

      if (secretKey.length === 31) {
        var pad = Buffer.from([0]);
        secretKey = Buffer.concat([pad, secretKey]);
      } //构造公钥


      var pubKey = Secp256k1.publicKeyCreate(secretKey); //将公钥加上amino编码前缀(irishub反序列化需要)

      pubKey = Amino.MarshalBinary(Config.iris.amino.pubKey, pubKey);
      return {
        "secret": mnemonicS,
        "address": this.getAddress(pubKey),
        "privateKey": Codec.Hex.bytesToHex(secretKey),
        "publicKey": Codec.Hex.bytesToHex(pubKey)
      };
    }
  }, {
    key: "recover",
    value: function recover(mnemonic, language) {
      this.checkSeed(mnemonic, language); //生成私钥

      var secretKey = this.getPrivateKeyFromSecret(mnemonic); //构造公钥

      var pubKey = Secp256k1.publicKeyCreate(secretKey); //将公钥加上amino编码前缀(irishub反序列化需要)

      pubKey = Amino.MarshalBinary(Config.iris.amino.pubKey, pubKey);
      return {
        "secret": mnemonic,
        "address": this.getAddress(pubKey),
        "privateKey": Codec.Hex.bytesToHex(secretKey),
        "publicKey": Codec.Hex.bytesToHex(pubKey)
      };
    }
  }, {
    key: "checkSeed",
    value: function checkSeed(mnemonic, language) {
      var seed = mnemonic.split(" ");

      if (seed.length != 12 && seed.length != 24) {
        throw new Error("seed length must be equal 12 or 24");
      }

      if (!Bip39.validateMnemonic(mnemonic, language)) {
        throw new Error("seed is invalid");
      }
    }
  }, {
    key: "import",
    value: function _import(secretKey) {
      var secretBytes = Buffer.from(secretKey, "hex"); //构造公钥

      var pubKey = Secp256k1.publicKeyCreate(secretBytes); //将公钥加上amino编码前缀(irishub反序列化需要)

      pubKey = Amino.MarshalBinary(Config.iris.amino.pubKey, pubKey);
      return {
        "address": this.getAddress(pubKey),
        "privateKey": secretKey,
        "publicKey": Codec.Hex.bytesToHex(pubKey)
      };
    }
  }, {
    key: "isValidAddress",
    value: function isValidAddress(address) {
      var prefix = Config.iris.bech32.accAddr;
      return Codec.Bech32.isBech32(prefix, address);
    }
  }, {
    key: "isValidPrivate",
    value: function isValidPrivate(privateKey) {
      return /^[0-9a-fA-F]{64}$/i.test(privateKey);
    }
  }]);
  return CosmosKeypair;
}();

var Hd =
/*#__PURE__*/
function () {
  function Hd() {
    (0, _classCallCheck2["default"])(this, Hd);
  }

  (0, _createClass2["default"])(Hd, null, [{
    key: "ComputeMastersFromSeed",
    value: function ComputeMastersFromSeed(seed) {
      var masterSecret = Buffer.from("Bitcoin seed");
      var master = Hd.I64(masterSecret, seed);
      return master;
    }
  }, {
    key: "DerivePrivateKeyForPath",
    value: function DerivePrivateKeyForPath(privKeyBytes, chainCode, path) {
      var data = privKeyBytes;
      var parts = path.split("/");
      parts.forEach(function (part) {
        var harden = part.slice(part.length - 1, part.length) === "'";

        if (harden) {
          part = part.slice(0, part.length - 1);
        }

        var idx = (0, _parseInt2["default"])(part);

        if (data.length === 31) {
          var pad = Buffer.from([0]);
          data = Buffer.concat([pad, data]);
        }

        var json = Hd.DerivePrivateKey(data, chainCode, idx, harden);
        data = json.data;
        chainCode = json.chainCode;
      });
      var derivedKey = data;
      return derivedKey;
    }
  }, {
    key: "I64",
    value: function I64(key, data) {
      var createHmac = require('create-hmac');

      var hmac = createHmac('sha512', key);
      hmac.update(data); //optional encoding parameter

      var i = hmac.digest(); // synchronously get result with optional encoding parameter

      return {
        secret: i.slice(0, 32),
        chainCode: i.slice(32, i.length)
      };
    }
  }, {
    key: "DerivePrivateKey",
    value: function DerivePrivateKey(privKeyBytes, chainCode, index, harden) {
      var data;
      var indexBuffer = Buffer.from([index]);

      if (harden) {
        var c = new BN(index).or(new BN(0x80000000));
        indexBuffer = c.toBuffer();
        var privKeyBuffer = Buffer.from(privKeyBytes);
        data = Buffer.from([0]);
        data = Buffer.concat([data, privKeyBuffer]);
      } else {
        var pubKey = Secp256k1.publicKeyCreate(privKeyBytes); // TODO

        if (index == 0) {
          indexBuffer = Buffer.from([0, 0, 0, 0]);
        }

        data = pubKey;
      }

      data = Buffer.concat([data, indexBuffer]);
      var i64P = Hd.I64(chainCode, Uint8Array.from(data));
      var aInt = new BN(privKeyBytes);
      var bInt = new BN(i64P.secret);
      var x = Hd.AddScalars(aInt, bInt);
      return {
        data: x.toBuffer(),
        chainCode: i64P.chainCode
      };
    }
  }, {
    key: "AddScalars",
    value: function AddScalars(a, b) {
      var c = a.add(b);

      var bn = require('secp256k1/lib/js/bn/index');

      var n = bn.n.toBuffer();
      var x = c.mod(new BN(n));
      return x;
    }
    /*
    *
    *  需要仿写以下代码，现在虽然没有调用，可能以后会出问题
    *
    func (sig *Signature) Serialize() []byte {
        // low 'S' malleability breaker
        sigS := sig.S
        if sigS.Cmp(S256().halfOrder) == 1 {
            sigS = new(big.Int).Sub(S256().N, sigS)
        }
        rBytes := sig.R.Bytes()
        sBytes := sigS.Bytes()
        sigBytes := make([]byte, 64)
        // 0 pad the byte arrays from the left if they aren't big enough.
        copy(sigBytes[32-len(rBytes):32], rBytes)
        copy(sigBytes[64-len(sBytes):64], sBytes)
        return sigBytes
    }
    *
    * */

  }, {
    key: "Serialize",
    value: function Serialize(sig) {
      var sigObj = {
        r: sig.slice(0, 32),
        s: sig.slice(32, 64)
      };

      var SignatureFun = require('elliptic/lib/elliptic/ec/signature');

      var signature = new SignatureFun(sigObj);
      return signature.toDER();
    }
  }]);
  return Hd;
}();

module.exports = CosmosKeypair;
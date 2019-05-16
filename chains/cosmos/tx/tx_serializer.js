"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var root = require('./tx');

var amino = require('../../base');

var config = require('../../../config');
/**
 *
 *  用于编码/解码 cosmos-sdk识别的StdTx交易模型
 *  当需要支持新的交易类型(msg)时,按照以下步骤执行：
 *
 *      1：在../proto/tx.proto中定义msg的数据结构(protobuf3)
 *      2: 使用pbjs -t static-module -w commonjs -o tx.js tx.proto生产信息tx编解码文件，注意和原文件比较(需要手动合并)
 *      3: 使用amino 注册新的msg信息
 *      4：TxSerializer类的编解码方法不用修改
 *
 *
 */


var TxSerializer =
/*#__PURE__*/
function () {
  function TxSerializer() {
    (0, _classCallCheck2["default"])(this, TxSerializer);
  }

  (0, _createClass2["default"])(TxSerializer, null, [{
    key: "encode",

    /**
     * 对StdTx编码(勿动)
     *
     * @param object: StdTx
     * @returns {{data: Buffer, hash: string}}
     */
    value: function encode(object) {
      var txMsg = object.msgs[0];
      var msg = txMsg.GetMsg();
      var info = amino.GetRegisterInfo(txMsg.type);
      var msgClass = info.classType;
      var sendMsg = msgClass.create(msg);
      var msgBytes = msgClass.encode(sendMsg).finish();
      var fee = object.fee;
      var StdFee = root.cosmos.StdFee;
      var feeMsg = StdFee.create(fee);
      var StdSignature = root.cosmos.StdSignature;
      var signature;

      if (object.signatures) {
        signature = [StdSignature.create({
          pubKey: object.signatures[0].pubKey,
          signature: object.signatures[0].signature
        })];
      }

      var memo = object.memo;
      var StdTx = root.cosmos.StdTx;
      var tx = StdTx.create({
        msg: [msgBytes],
        fee: feeMsg,
        signatures: signature,
        memo: memo
      });
      var txMsgBuf = StdTx.encode(tx).finish(); //stdTx amion编码前缀[auth/StdTx]

      var txPreBuf = Buffer.from(amino.GetRegisterInfo(config.cosmos.tx.stdTx.prefix).prefix);
      var msgPreBuf = Buffer.from(info.prefix);
      var buf = Buffer.from(""); //填充stdTx amion编码前缀

      buf = Buffer.concat([buf, txPreBuf]); //填充txMsgBuf第一位编码字节(数组标识)

      buf = Buffer.concat([buf, txMsgBuf.slice(0, 1)]); //填充txMsgBuf加入前缀后的编码长度

      var uvintMsgBuf = EncodeUvarint(msgPreBuf.length + txMsgBuf[1]);
      buf = Buffer.concat([buf, uvintMsgBuf]); //填充msg amion编码前缀

      buf = Buffer.concat([buf, msgPreBuf]); //填充交易内容字节

      buf = Buffer.concat([buf, txMsgBuf.slice(DecodeUvarint(txMsgBuf[1]) + 1)]);
      var uvarintBuf = Buffer.from(EncodeUvarint(buf.length));
      var bz = Buffer.concat([uvarintBuf, buf]);

      var crypto = require('crypto');

      var hash = crypto.createHash('sha256');
      hash.update(bz);
      var hashTx = hash.digest('hex').substring(0, 64);
      return {
        data: bz,
        hash: hashTx.toUpperCase()
      };
    }
  }]);
  return TxSerializer;
}();

function EncodeUvarint(u) {
  var buf = Buffer.alloc(10);
  var i = 0;

  var BN = require("bn");

  while (u >= 0x80) {
    buf[i] = new BN(u).or(new BN(0x80));
    u >>= 7;
    i++;
  }

  buf[i] = new BN(u);
  return buf.slice(0, i + 1);
}

function DecodeUvarint(u) {
  if (u >= 0x80) {
    return 2;
  }

  return 1;
}

module.exports = TxSerializer;
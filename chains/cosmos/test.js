"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/json/stringify"));

var Irisnet = require('../../index');

describe('cosmos traction test', function () {
  var chain_id = "gaia-13001";
  var from = "cosmos1j3nlv8wcfst2mezkny4w2up76wfgnkq744ezus";
  var gas = 200000;
  var account_number = 920;
  var fees = {
    denom: "photino",
    amount: "20"
  };
  var memo = "";
  var privateKey = "";
  var chain = Irisnet.config.chain.cosmos;
  it('test  transfer', function () {
    var tx = {
      chain_id: chain_id,
      from: from,
      account_number: account_number,
      sequence: 8,
      fees: fees,
      gas: gas,
      memo: memo,
      type: Irisnet.config.cosmos.tx.transfer.type,
      return_type: 'block',
      msg: {
        to: "cosmos1cx7ny2znzdegzj27mq2lqavk8dcvc0uysmyzg7",
        coins: [{
          denom: "muon",
          amount: "10"
        }]
      }
    };
    extracted(tx);
  });
  it('test delegate', function () {
    var tx = {
      chain_id: chain_id,
      from: from,
      account_number: account_number,
      sequence: 9,
      fees: fees,
      gas: gas,
      memo: memo,
      type: Irisnet.config.cosmos.tx.delegate.type,
      msg: {
        validator_addr: "cosmosvaloper1qksw0e05eh652yy0zqd7f0e3q4082dxy9qxdx6",
        delegation: {
          denom: "muon",
          amount: "10"
        }
      }
    };
    extracted(tx);
  });
  it('test undelegate', function () {
    var tx = {
      chain_id: chain_id,
      from: from,
      account_number: account_number,
      sequence: 10,
      fees: fees,
      gas: gas,
      memo: memo,
      type: Irisnet.config.cosmos.tx.undelegate.type,
      msg: {
        validator_addr: "cosmosvaloper1qksw0e05eh652yy0zqd7f0e3q4082dxy9qxdx6",
        shares_amount: "1.05"
      }
    };
    extracted(tx);
  });
  it('test beginRedelegate', function () {
    var tx = {
      chain_id: chain_id,
      from: from,
      account_number: account_number,
      sequence: 11,
      fees: fees,
      gas: gas,
      memo: memo,
      type: Irisnet.config.cosmos.tx.beginRedelegate.type,
      msg: {
        validator_src_addr: "cosmosvaloper1qksw0e05eh652yy0zqd7f0e3q4082dxy9qxdx6",
        validator_dst_addr: "cosmosvaloper1le34teftd4fa5lu64uyafzmw78yq7dgcnxchp3",
        shares_amount: "1.05"
      }
    };
    execute(tx);
  });
  it('test MsgSetWithdrawAddress', function () {
    var tx = {
      chain_id: chain_id,
      from: from,
      account_number: account_number,
      sequence: 12,
      fees: fees,
      gas: gas,
      memo: memo,
      type: Irisnet.config.cosmos.tx.setWithdrawAddress.type,
      msg: {
        withdraw_addr: "cosmos1j3nlv8wcfst2mezkny4w2up76wfgnkq744ezus"
      }
    };
    execute(tx);
  });
  it('test MsgWithdrawDelegatorReward', function () {
    var tx = {
      chain_id: chain_id,
      from: from,
      account_number: account_number,
      sequence: 13,
      fees: fees,
      gas: gas,
      memo: memo,
      type: Irisnet.config.cosmos.tx.withdrawDelegatorReward.type,
      msg: {
        validator_addr: "cosmosvaloper1qksw0e05eh652yy0zqd7f0e3q4082dxy9qxdx6"
      }
    };
    execute(tx);
  }); //TODO Pending verification

  it('test MsgWithdrawValidatorCommission', function () {
    var tx = {
      chain_id: chain_id,
      from: from,
      account_number: account_number,
      sequence: 6,
      fees: fees,
      gas: gas,
      memo: memo,
      type: Irisnet.config.cosmos.tx.withdrawValidatorCommission.type,
      msg: {
        validator_addr: "cosmosvaloper1qksw0e05eh652yy0zqd7f0e3q4082dxy9qxdx6"
      }
    };
    execute(tx);
  });
  it('test config', function () {
    var conf = require('../../config');

    console.log('prefix', conf.iris.bech32);
    conf.iris.bech32 = {
      "accAddr": "iaa",
      "valAddr": "iva",
      "accPub": "iap"
    };

    var conf2 = require('../../config');

    console.log('prefix', conf2.iris.bech32);
  });

  function execute(tx) {
    var builder = Irisnet.getBuilder(chain);
    var stdTx = builder.buildAndSignTx(tx, privateKey); //you can post tx to lcd's /txs api

    console.log((0, _stringify["default"])(stdTx.GetData()));
    var result = stdTx.Hash();
    console.log(result.hash);
  } //冷钱包调用


  function extracted(tx) {
    var builder = Irisnet.getBuilder(chain); //①先用联网的钱包构造一笔交易

    var stdTx = builder.buildTx(tx); //②把步骤①的结构序列化为字符串，装入二维码

    var signStr = (0, _stringify["default"])(stdTx.GetSignBytes()); //③用未联网的钱包(存有账户秘钥)扫描步骤②的二维码，拿到待签名的字符串，调用signTx签名

    var signature = builder.sign(signStr, privateKey); //④

    var signatureStr = (0, _stringify["default"])(signature); //二维码字符串

    stdTx.SetSignature(signatureStr); //console.log("======待提交交易======");
    //④步骤③的结果调用GetData，得到交易字符串，回传给联网的钱包，并发送该内容给irishub-server

    console.log((0, _stringify["default"])(stdTx.GetData())); //以下步骤为异常处理：在请求irishub-server超时的时候，服务器可能没有任何返回结果，这笔交易状态为止，所以需要客户端计算出
    //本次交易的hash，校准该笔交易的状态。调用步骤③结构的Hash，可以得到交易hash以及本次交易内容的base64编码（以后考虑使用该编码内容替换
    // GetPostData,解耦crypto和irishub交易结构的依赖）

    var result = stdTx.Hash();
    console.log("hash", result.hash); //console.log("displayContent", JSON.stringify(stdTx.GetDisplayContent()));
  }
});
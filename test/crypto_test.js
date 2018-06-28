const Irisnet = require('../index');
const chai = require('chai');
const assert = chai.assert;
const blockChainThriftModel = require("blockchain-rpc/codegen/gen-nodejs/model_types")

describe('CryPto test', function () {
    describe('bech32 is Valid', function () {
        it('test create and recover', function () {
            let crypto = Irisnet.getCrypto(Irisnet.Constants.Chains.IRIS);
            let keyPair = crypto.create("english");
            let keyPair2 = crypto.recover(keyPair.phrase,"english");
            console.log(JSON.stringify(keyPair))
            assert.deepEqual(keyPair, keyPair2);
        });

        it('test import', function () {
            let crypto = Irisnet.getCrypto(Irisnet.Constants.Chains.IRIS);
            let account = crypto.import("833a2457add0d23c840edb115e07069465ca04942406f799ea7128c3bc9b842f515fbd60f777a55d2c59069892b6e72e57fdc96da4b608cd07c86306d0ab6439")
            assert.deepEqual(account, {
                    address: '4B0647A2FECBBB752C8C5134963EB0DF159E8501',
                    privateKey: '833a2457add0d23c840edb115e07069465ca04942406f799ea7128c3bc9b842f515fbd60f777a55d2c59069892b6e72e57fdc96da4b608cd07c86306d0ab6439',
                    publicKey: '515fbd60f777a55d2c59069892b6e72e57fdc96da4b608cd07c86306d0ab6439'
                }
            );
            //let acc = crypto.import("625f0968c78d95857629ea4b4cbafe2f3f949a92e82dda09b5fbe9fbc70d50cc62f3621a751f0431b69b965d41ec480f1b9a4b6f14a1f6c0d17158281a980f74");
            //console.log(JSON.stringify(acc))
        });

        it('test transfer buildSignMsg', function () {
           let tx = new blockChainThriftModel.Tx({
               "sequence":1,
               "ext":1,
               "sender":{
                   "chain":"iris",
                   "app":"v0.2.0",
                   "addr":"1EC2E86065D5EF88A3ED65B8B3A43210FAD9C7B2"
               },
               "receiver":{
                   "chain":"iris",
                   "app":"v0.2.0",
                   "addr":"3A058A8B5468AE0EA2D2517CE3BAFDD281E50C2F"
               },
               "amount":[new blockChainThriftModel.Coin({amount: 10, denom: "iris"})],
               "fee":new blockChainThriftModel.Fee({amount: 1, denom: "fermion"}),
               "type":"transfer"
           });

           let builder = Irisnet.getBuilder("iris");
           let sigMsg = builder.buildSignMsg(tx);
           console.log(sigMsg)
        });

        it('test delegate buildSignMsg', function () {
            let tx = new blockChainThriftModel.Tx({
                "sequence":1,
                "ext":1,
                "sender":{
                    "chain":"iris",
                    "app":"v0.2.0",
                    "addr":"1EC2E86065D5EF88A3ED65B8B3A43210FAD9C7B2"
                },
                "receiver":{
                    "chain":"iris",
                    "app":"v0.2.0",
                    "addr":"3A058A8B5468AE0EA2D2517CE3BAFDD281E50C2F"
                },
                "amount":[{amount: 10, denom: "iris"}],
                "fee":new blockChainThriftModel.Fee({amount: 1, denom: "fermion"}),
                "type":"delegate"
            });

            let builder = Irisnet.getBuilder("iris");
            let sigMsg = builder.buildSignMsg(tx);
            console.log(JSON.stringify(sigMsg))
        });

        it('test transfer', function () {
            let tx = new blockChainThriftModel.Tx({
                "sequence":30,
                "ext":0,
                "sender":{
                    "chain":"fuxi",
                    "app":"v0.2.0",
                    "addr":"1EC2E86065D5EF88A3ED65B8B3A43210FAD9C7B2"
                },
                "receiver":{
                    "chain":"iris",
                    "app":"v0.2.0",
                    "addr":"3A058A8B5468AE0EA2D2517CE3BAFDD281E50C2F"
                },
                "amount":[new blockChainThriftModel.Coin({denom: "iris",amount: 10})],
                "fee":new blockChainThriftModel.Fee({denom: "iris",amount: 0}),
                "type":Irisnet.Constants.TxType.TRANSFER
            });

            let builder = Irisnet.getBuilder("iris");
            let stdTx = builder.buildAndSignTx(tx,"625f0968c78d95857629ea4b4cbafe2f3f949a92e82dda09b5fbe9fbc70d50cc62f3621a751f0431b69b965d41ec480f1b9a4b6f14a1f6c0d17158281a980f74");
            console.log(JSON.stringify(stdTx))
            //TODO 将stdTx提交到iris-hub[/tx/send]
        });

        it('test delegate', function () {
            let tx = new blockChainThriftModel.Tx({
                "sequence":4,
                "ext":2,
                "sender":{
                    "chain":"fuxi",
                    "app":"v0.2.0",
                    "addr":"706B0BCF42131FFA2AE9EACB850C9C7A18EED6F1"
                },
                "receiver":{
                    "chain":"iris",
                    "app":"v0.2.0",
                    "addr":"3A058A8B5468AE0EA2D2517CE3BAFDD281E50C2F"
                },
                "amount":[new blockChainThriftModel.Coin({denom: "steak",amount: 10})],
                "fee":new blockChainThriftModel.Fee({denom: "iris",amount: 0}),
                "type":Irisnet.Constants.TxType.DELEGATE
            });

            let builder = Irisnet.getBuilder("iris");
            let stdTx = builder.buildAndSignTx(tx,"93af640b13a89d643a5c5715a9347ab4a3272ef23ed97854b91b9619c8319df1049605b7d0014bc14d5630e34f688fda8b14d46bc8e917887d1bab28bbf475d8");
            console.log(JSON.stringify(stdTx))
            //TODO 将stdTx提交到iris-hub[/tx/send]
        });
    });
});
"use strict";

import { providers, utils, Wallet } from "ethers";
const provider = new providers.JsonRpcProvider();

const mnemonic = "wing mandate witness great able grain comfort hill polar income unique hip";

// [FIXME] how to work?
// const ganache = require("ganache");
// const provider = new ethers.providers.Web3Provider(ganache.provider());

// console.log(provider);
provider.getBlockNumber().then(
    (num) => { console.log(num); },
    (reason) => { console.log(reason); }
)

// read a balance
provider.getBalance("0xF0DcC5857b1c8D4378eE4044eb4Ae207c4d44Fe5")
    .then(
        (balance) => {
            console.log(balance.toHexString());
            console.log(utils.formatEther(balance));
        },
        (reason) => { console.log(reason); }
    )

// read mutiple balances
Promise.all([
    provider.getBalance("0xF0DcC5857b1c8D4378eE4044eb4Ae207c4d44Fe5"), // 1
    provider.getBalance("0x0F50eEbb527283141099F743cfdE87501bDD9457"), // 3
    provider.getBalance("0x504fB90D7DB0a02c9deFeee1EF0B57cbd79ed359"), // 3
]).then((balanceArray) => {
    for (let balance of balanceArray) {
        console.log(utils.formatEther(balance));
    }
}).catch(console.log());

(async () => {
    // utils
    // Ether string to ethers.BigNumber
    let etherBigNum = utils.parseEther("1.0")
    let etherString = utils.formatEther(etherBigNum)
    console.log(etherBigNum, etherString);

    let signer = provider.getSigner('0xF0DcC5857b1c8D4378eE4044eb4Ae207c4d44Fe5');
    console.log(signer);

    // Import Wallet from mnemonic
    let wallets = new Array();
    for (let i = 0; i < 10; i++) {
        let w = Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/" + i); // use default mnemonic index
        w = w.connect(provider);
        wallets.push(w);
        console.log("==>> m/44'/60'/0'/0/" + i, w.address)
    }
    let balances = new Array();
    wallets.map(function (w, index, array) {
        balances.push(w.getBalance());
    })

    // read mutiple balances
    Promise.all(balances).then((balanceArray) => {
        for (let balance of balanceArray) {
            console.log("==>> balance", utils.formatEther(balance));
        }
    }).catch(console.log());

    let TxCount = new Array();
    wallets.map(function (w, index, array) {
        TxCount.push(w.getTransactionCount());
    })

    // read mutiple TxCount
    Promise.all(TxCount).then((TxCountArray) => {
        for (let count of TxCountArray) {
            console.log("==>> TxCount", count.toString());
        }
    }).catch(console.log());
})();

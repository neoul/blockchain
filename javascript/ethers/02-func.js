"use strict";

import { providers, Wallet, utils } from "ethers";

export async function getWallets() {
    const provider = new providers.JsonRpcProvider();
    const mnemonic = "wing mandate witness great able grain comfort hill polar income unique hip";

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
    await Promise.all(balances).then((balanceArray) => {
        for (let balance of balanceArray) {
            console.log("==>> balance", utils.formatEther(balance));
        }
    }).catch(console.log());

    let TxCount = new Array();
    wallets.map(function (w, index, array) {
        TxCount.push(w.getTransactionCount());
    })

    // read mutiple TxCount
    await Promise.all(TxCount).then((TxCountArray) => {
        for (let count of TxCountArray) {
            console.log("==>> TxCount", count.toString());
        }
    }).catch(console.log());

    return wallets
}

async function main() {
    let wallets = await getWallets();
    console.log(wallets);
}

// main();
"use strict";

import { providers, Wallet, utils, Contract, ContractFactory } from "ethers";
import * as fs from 'fs';

const provider = new providers.JsonRpcProvider();
const mnemonic = "wing mandate witness great able grain comfort hill polar income unique hip";

async function main() {
    let sender = Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/" + 0);
    sender = sender.connect(provider);
    let num = await sender.getTransactionCount();
    console.log(num);
    for (let i = 0; i < num; i++) {
        let block = await provider.getBlock(i);
        let txblocks = await provider.getBlockWithTransactions(block.hash);
        // console.log(txblocks);
        for (let tx of txblocks.transactions) {
            let receipt = await provider.getTransactionReceipt(tx.hash);
            console.log(receipt);
        }
    }
}

main();
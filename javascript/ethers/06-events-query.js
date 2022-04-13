"use strict";

import { providers, Wallet, utils, Contract, BigNumber } from "ethers";
import * as fs from 'fs';

const provider = new providers.JsonRpcProvider();
const mnemonic = "wing mandate witness great able grain comfort hill polar income unique hip";

async function main() {
    const contractaddr = '0x6D2CecfF6a5E2b9eE4A3Ca3a3DBf9933c31636D1';
    let A = Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/" + 0).connect(provider);

    // solidity output json combined with both abi and bytecode.
    let abi = fs.readFileSync('../../bin/javascript/ethers/solidity/ClassToken.abi');
    let contract = new Contract(contractaddr, abi.toString());
    console.log(contract.interface.format("full"));
    console.log("Contract Address", contract.address);
    let contractA = contract.connect(A);

    // // use eventFilter if you want to filter something...
    // let eventFilter = contractA.filters.Transfer();
    // console.log(eventFilter);
    // let logs = await contractA.queryFilter(eventFilter);
    let logs = await contractA.queryFilter("*", -5, "latest"); // filtering event for latest 10 blocks
    for (let e of logs) {
        try {
            let eventobj = {}
            for (let input of contract.interface.events[e.eventSignature].inputs) {
                // event params
                eventobj[input.name] = e.args[input.name];
            }
            console.log(e.event, eventobj);
        } catch(err) {
            console.log(err);
        }
        // console.log(e);
        // console.log(e.event, e.args);
    }
}

main();
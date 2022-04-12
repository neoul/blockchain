"use strict";

import { providers, Wallet, utils, ContractFactory } from "ethers";
import * as fs from 'fs';

const provider = new providers.JsonRpcProvider();
const mnemonic = "wing mandate witness great able grain comfort hill polar income unique hip";

async function main() {
    let sender = Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/" + 0);
    sender = sender.connect(provider);
    const initialSupply = utils.parseEther('10000');

    // solidity output json combined with both abi and bytecode.
    let abi = fs.readFileSync('../../bin/javascript/ethers/solidity/ClassToken.abi');
    let bytecode = fs.readFileSync('../../bin/javascript/ethers/solidity/ClassToken.bin');
    let factory = new ContractFactory(abi.toString(), bytecode.toString(), sender);
    let contract = await factory.deploy(initialSupply);
    console.log(contract);
    console.log("Contract Address", contract.address);
    // var str = JSON.stringify(obj, null, 2);
}

main();
"use strict";

import { providers, Wallet, utils, Contract, BigNumber } from "ethers";
import * as fs from 'fs';

const provider = new providers.JsonRpcProvider();
const mnemonic = "wing mandate witness great able grain comfort hill polar income unique hip";

async function main() {
    const contractaddr = '0x6D2CecfF6a5E2b9eE4A3Ca3a3DBf9933c31636D1';
    let A = Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/" + 0);
    let B = Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/" + 1);
    let C = Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/" + 2);
    let D = Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/" + 3);
    A = A.connect(provider);
    B = B.connect(provider);
    C = C.connect(provider);
    D = D.connect(provider);

    // solidity output json combined with both abi and bytecode.
    let abi = fs.readFileSync('../../bin/javascript/ethers/solidity/ClassToken.abi');
    let contract = new Contract(contractaddr, abi.toString());
    console.log(contract.interface.format("full"));
    console.log("Contract Address", contract.address);
    let contractA = contract.connect(A);
    let contractB = contract.connect(B);
    let contractC = contract.connect(C);
    let contractD = contract.connect(D);

    // What to do in this step
    // 1. Mint tokens to an EOA.
    let amount = BigNumber.from(10);
    amount = amount.pow(18); // 1 token
    console.log(`1. mint ${utils.formatUnits(amount.toString())} to B`);
    contractA.functions.mint(B.address, amount.toString())
    .then((resp) => {
        return resp.wait(1);
    })
    .then((receipt) => {
        // console.log(receipt);
        return contractB.functions.balanceOf(B.address);
    })
    .then((balance) => {
        console.log(`1. B owns ${utils.formatUnits(balance.toString())} tokens`);
    })
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });

    // 2. Send tokens to another EOA.
    console.log(`2. transfer 1 from B to C`);
    contractB.functions.transfer(C.address, utils.parseEther("1"))
    .then((resp) => {
        return resp.wait(1);
    })
    .then((receipt) => {
        // console.log(receipt);
        return contractC.functions.balanceOf(C.address);
    })
    .then((balance) => {
        console.log(`2. C owns ${utils.formatUnits(balance.toString())} tokens`);
    })
    .catch((error) => {
        console.log(error);
        process.exit(1);
    })

    // 3. Send larger tokens than an EOA owned.
    console.log(`3. transfer 1000 from B to C`);
    contractB.functions.transfer(C.address, amount.mul(1000).toString())
    .then((resp) => {
        return resp.wait(1);
    })
    .then((receipt) => { // not executed due to insufficient ether
        return contractB.functions.balanceOf(B.address);
    })
    .then((balance) => {
        console.log(`3. B owns ${utils.formatUnits(balance.toString())} tokens`);
    })
    .catch((txResp) => {
        console.log(`3. [FAIL] transfer ${utils.formatUnits(amount.mul(1000).toString())} to C`);
        ; // It was intended to be an error.
    })

    // 4. Burn half C-owned tokens by A (contract manager).
    console.log("4. burn half C-owned tokens")
    try {
        console.log(`4. approve A to burn C's tokens`);
        let balance = await contractC.functions.balanceOf(C.address);
        let amount = BigNumber.from(balance.toString());
        // console.log("C amount", utils.formatUnits(amount.toString()));
        // console.log("C amount.div", utils.formatUnits(amount.div(2).toString()));
        let receipt = await contractC.functions.approve(A.address, amount.div(2).toString());
        await receipt.wait(1);
        receipt = await contractA.functions.burnFrom(C.address, amount.div(2).toString());
        await receipt.wait(1);
        amount = await contractC.functions.balanceOf(C.address);
        console.log(`4. C owns ${utils.formatUnits(amount.toString())} tokens`);
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
}

main();
"use strict";

import { providers, Wallet, utils, Contract, ContractFactory } from "ethers";
import * as fs from 'fs';

const provider = new providers.JsonRpcProvider();
const mnemonic = "wing mandate witness great able grain comfort hill polar income unique hip";

async function main() {
    let sender = Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/" + 0);
    sender = sender.connect(provider);
    const contractaddr = '0x6D2CecfF6a5E2b9eE4A3Ca3a3DBf9933c31636D1';

    // solidity output json combined with both abi and bytecode.
    let abi = fs.readFileSync('../../bin/javascript/ethers/solidity/ClassToken.abi');
    let contract = new Contract(contractaddr, abi.toString(), sender);
    console.log(contract.interface.format("full"));
    console.log(contract.address);
    
    let retrieval = {
        totalSupply: await contract.functions.totalSupply(),
        balanceOf: await contract.functions.balanceOf(sender.address),
        DEFAULT_ADMIN_ROLE: await contract.functions.DEFAULT_ADMIN_ROLE(),
        MINTER_ROLE: await contract.functions.MINTER_ROLE(),
        PAUSER_ROLE: await contract.functions.PAUSER_ROLE(),
        decimals: await contract.functions.decimals(),
        name: await contract.functions.name(),
        symbol: await contract.functions.symbol()
    };
    retrieval.getRoleAdmin_DEFAULT_ADMIN_ROLE = await contract.functions.hasRole(retrieval.DEFAULT_ADMIN_ROLE.toString(), sender.address);
    retrieval.getRoleAdmin_MINTER_ROLE = await contract.functions.hasRole(retrieval.MINTER_ROLE.toString(), sender.address);
    retrieval.getRoleAdmin_PAUSER_ROLE = await contract.functions.hasRole(retrieval.PAUSER_ROLE.toString(), sender.address);

    // https://docs.ethers.io/v5/api/utils/display-logic
    // https://docs.ethers.io/v5/api/utils/bignumber/
    for (let key in retrieval) {
        console.log(key, retrieval[key].toString());
        if (key == "totalSupply" || key == "balanceOf") {
            console.log(key, utils.commify(retrieval[key].toString()));
            console.log(key, utils.formatUnits(retrieval[key].toString()));
        }
    }
}

main();
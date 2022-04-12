"use strict";

import { providers, Wallet, utils, Contract } from "ethers";
import * as fs from 'fs';

const provider = new providers.JsonRpcProvider();
const mnemonic = "wing mandate witness great able grain comfort hill polar income unique hip";

async function main() {
    let sender = Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/" + 0);
    sender = sender.connect(provider);
    const contractaddr = '0x6D2CecfF6a5E2b9eE4A3Ca3a3DBf9933c31636D1';

    // solidity output json combined with both abi and bytecode.
    let abi = fs.readFileSync('../../bin/javascript/ethers/solidity/ClassToken.abi');
    let iface = new utils.Interface(abi.toString());
    let format = utils.FormatTypes

    // print Human-Readable Abi
    console.log(iface.format(format.full));

    // get function signature hash (Function Selector)
    // e.g. bytes4(keccak256('supportsInterface(bytes4)'));
    // console.log(iface.getSighash("supportsInterface"));

    // check each function signature for ERC20 operation
    let funcname = ["totalSupply", "balanceOf", "transfer", "allowance", "approve", "transferFrom"];
    for (let each of funcname) {
        try {
            // console.log(each, iface.getSighash(each));
            iface.getSighash(each)
        }
        catch {
            console.log(`This contract doesn't support ERC20 function ${each}`)
            break;
        }
    }
}

main();
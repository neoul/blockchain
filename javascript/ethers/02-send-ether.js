"use strict";

import { providers, Wallet, utils } from "ethers";
const provider = new providers.JsonRpcProvider();
const mnemonic = "wing mandate witness great able grain comfort hill polar income unique hip";

async function main() {
    let sender = Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/" + 0);
    let receiver = Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/" + 1);
    sender = sender.connect(provider);
    let nonce = await sender.getTransactionCount();
    let gasPrise = await sender.getGasPrice();
    let gasLimit = utils.hexlify(BigInt(21000));
    let value = utils.parseUnits("2", 18);

    // [Transaction object]
    // export type TransactionRequest = {
    //     to?: string,
    //     from?: string,
    //     nonce?: BigNumberish,
    //     gasLimit?: BigNumberish,
    //     gasPrice?: BigNumberish,
    //     data?: BytesLike,
    //     value?: BigNumberish,
    //     chainId?: number
    //     type?: number;
    //     accessList?: AccessListish;
    //     maxPriorityFeePerGas?: BigNumberish;
    //     maxFeePerGas?: BigNumberish;
    //     customData?: Record<string, any>;
    //     ccipReadEnabled?: boolean;
    // }
    let tx = {
        from: sender.address,
        to: receiver.address,
        nonce: nonce,
        value: value,
        gasLimit: gasLimit,
        gasPrice: gasPrise
    }
    
    // sign and send tx
    try {
        let txResponse = await sender.sendTransaction(tx);
        let txReceipt = await txResponse.wait(1);
        console.log(txReceipt);
    } catch(error) {
        console.log(error.error);
    }
}

main();
const Web3 = require('web3');
const fs = require('fs');
const web3 = new Web3('HTTP://127.0.0.1:7545');

const senderAddr = '0x51F7B1BC894C0Af015C9AC3bFf11A444a7A8c5b1';
const senderPriKey = '1be129a832c10bc2088a59200c49c828f569bf3f41de3f0099fff796bfee58b6';

// GoldERC20.abi (json interface), GoldERC20.bin (bytecode)

// read ABI
let goldABI, goldBin;
try {
    goldABI = JSON.parse(fs.readFileSync('../../bin/solidity/GLDToken.abi'));
    goldBin = '0x' + fs.readFileSync('../../bin/solidity/GLDToken.bin').toString();
} catch(err) {
    console.log(err);
}

// console.log(goldABI);
// console.log(goldBin);

(async () => {
    web3.eth.getBalance(senderAddr).then(console.log);

    let initialSupply = 10000;
    console.log(`deploy contract`);
    let goldcontract = new web3.eth.Contract(goldABI);
    let data = goldcontract.deploy({
        data: goldBin,
        // arguments: [100000000000000]
        arguments: [initialSupply]
    }).encodeABI();

    let tx = await web3.eth.accounts.signTransaction(
        {
            from: senderAddr,
            // to: addressTo, // ETH 송신 아님
            // value: web3.utils.toWei('1', 'ether'), // deploy시 공란
            gas: 289259, 
            gasPrice: '99999327974718290900',
            data: data,
        },
        senderPriKey
    );
    console.log(tx);

    await web3.eth.sendSignedTransaction(
        tx.rawTransaction, (err, receipt) => {
            if (err !== undefined) {
                // console.log("????????????")
                // console.log(err)
            }
            // console.log(receipt)
        }
    );
})();

// 엄청 비싸다...
// /home/neoul/projects/blockchain/node_modules/web3-core-helpers/lib/errors.js:28
//         var err = new Error('Returned error: ' + message);
//                   ^

// Error: Returned error: sender doesn't have enough funds to send tx. The upfront cost is: 28925705610639038107443100 and the sender's account only has: 99999244303949209900
//     at Object.ErrorResponse (/home/neoul/projects/blockchain/node_modules/web3-core-helpers/lib/errors.js:28:19)
//     at /home/neoul/projects/blockchain/node_modules/web3-core-requestmanager/lib/index.js:300:36
//     at XMLHttpRequest.request.onreadystatechange (/home/neoul/projects/blockchain/node_modules/web3-providers-http/lib/index.js:98:13)
//     at XMLHttpRequestEventTarget.dispatchEvent (/home/neoul/projects/blockchain/node_modules/xhr2-cookies/dist/xml-http-request-event-target.js:34:22)
//     at XMLHttpRequest._setReadyState (/home/neoul/projects/blockchain/node_modules/xhr2-cookies/dist/xml-http-request.js:208:14)
//     at XMLHttpRequest._onHttpResponseEnd (/home/neoul/projects/blockchain/node_modules/xhr2-cookies/dist/xml-http-request.js:318:14)
//     at IncomingMessage.<anonymous> (/home/neoul/projects/blockchain/node_modules/xhr2-cookies/dist/xml-http-request.js:289:61)
//     at IncomingMessage.emit (node:events:539:35)
//     at endReadableNT (node:internal/streams/readable:1345:12)
//     at processTicksAndRejections (node:internal/process/task_queues:83:21) {
//   data: {
//     stack: "Error: sender doesn't have enough funds to send tx. The upfront cost is: 28925705610639038107443100 and the sender's account only has: 99999244303949209900\n" +
//       '    at VM.<anonymous> (/tmp/.mount_ganachTYdE5t/resources/static/node/node_modules/ganache-core/node_modules/ethereumjs-vm/lib/runTx.ts:114:11)\n' +
//       '    at step (/tmp/.mount_ganachTYdE5t/resources/static/node/node_modules/ganache-core/node_modules/ethereumjs-vm/dist/runTx.js:33:23)\n' +
//       '    at Object.next (/tmp/.mount_ganachTYdE5t/resources/static/node/node_modules/ganache-core/node_modules/ethereumjs-vm/dist/runTx.js:14:53)\n' +
//       '    at fulfilled (/tmp/.mount_ganachTYdE5t/resources/static/node/node_modules/ganache-core/node_modules/ethereumjs-vm/dist/runTx.js:5:58)\n' +
//       '    at runMicrotasks (<anonymous>)\n' +
//       '    at processTicksAndRejections (internal/process/task_queues.js:93:5)',
//     name: 'Error'
//   }
// }
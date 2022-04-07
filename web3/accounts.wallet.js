
const Web3 = require('web3');
const web3 = new Web3('HTTP://127.0.0.1:7545');

// wallet is in memory web3 account management

// 1. Create new account
let numOfAccounts = 2;
wallet = web3.eth.accounts.wallet.create(numOfAccounts);

// output wallet object
// console.log(wallet);

// 2. Add an account using a private key or account object to the wallet.
// web3.eth.accounts.wallet.add()
wallet.add(`867e68ab83469717850f54ecb0e265860335024d94b0c89bee456f430e204f80`);

for (let i = 0; i < wallet.length; i++) {
    // print accounts in memory
    // wallet에 정의된 signTransaction, sign, encrypt 함수로 TX 서명할 수 있음
    console.log(wallet[i]);
}

// 3. Remove the first account from the wallet.
wallet.remove(wallet[0]);

// 4. Clear all accounts.
wallet.clear();

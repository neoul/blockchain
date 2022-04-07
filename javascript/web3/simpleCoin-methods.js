const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'HTTP://127.0.0.1:7545');

const senderAddr = '0x51F7B1BC894C0Af015C9AC3bFf11A444a7A8c5b1';
const contractAddr = '0x9046FF3E1ed3cf03F5162415Ec740b9241674f11';

let amount = 10;
let receiverAddr = '0x5a76EEeEdAeDB9f6a5B053659f54f41C5a6D3b4C';

// SimpleCoin.abi (json interface)
let SimpleCoinAbi = [{ "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "transfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "coinBalance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "_initialSupply", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }];

let Contract = require('web3-eth-contract');
Contract.setProvider('HTTP://127.0.0.1:7545');

let contract = new Contract(SimpleCoinAbi, contractAddr);
contract.methods.transfer(receiverAddr, amount)
   .send({
      from: senderAddr,
      gas: 289259,
      gasPrice: '2892590',
   })
   .on('receipt', function (receipt) {
      console.log(receipt)
   });

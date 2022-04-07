

const Web3 = require('web3');
const web3 = new Web3('HTTP://127.0.0.1:7545');

// SimpleCoin.abi (json interface)
let SimpleCoinAbi = [{ "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "transfer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "coinBalance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "_initialSupply", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }];

// SimpleCoin.bin (bytecode; data in deply), it starts with '0x
let simpleCoinBin = '0x608060405234801561001057600080fd5b5060405160208061039983398101806040528101908080519060200190929190505050806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555050610313806100866000396000f30060806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063a9059cbb14610051578063fabde80c1461009e575b600080fd5b34801561005d57600080fd5b5061009c600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506100f5565b005b3480156100aa57600080fd5b506100df600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506102cf565b6040518082815260200191505060405180910390f35b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205411151561014157600080fd5b6000808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205401101515156101ce57600080fd5b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540392505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508173ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040518082815260200191505060405180910390a35050565b600060205280600052604060002060009150905054815600a165627a7a7230582050d3f82c37391d8b714e5711a077c93d90fa8532d82d80c57b4fdad46de8a8860029';

let deployer = '0x95a5f6c3c60D2FeEFAc2dE055E98670773c08Bfd';

let simpleCoinContract = new web3.eth.Contract(SimpleCoinAbi, deployer);

// This is the format of the contract function loaded.
console.log(simpleCoinContract._jsonInterface);

let initialSupply = 10000;

simpleCoinContract.deploy({
    data: simpleCoinBin,
    arguments: [initialSupply] // constructor arguments
})
.send({
    from: deployer,
    gas: 289259, 
    gasPrice: '2892590',
})
.then(function(newContractInstance){
    console.log(newContractInstance.options.address) // instance with the new contract address
});

const Web3 = require('web3');
const web3 = new Web3('HTTP://127.0.0.1:7545');

web3.eth.getBalance("0x51F7B1BC894C0Af015C9AC3bFf11A444a7A8c5b1")
.then(console.log);

console.log(web3.utils.fromWei('28925705610639038107443100', 'ether'))
console.log(web3.utils.fromWei('99999327974718290900', 'ether'))


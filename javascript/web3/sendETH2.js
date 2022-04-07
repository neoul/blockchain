const Tx = require('ethereumjs-tx').Transaction

const Web3 = require('web3')
var web3 = new Web3(Web3.givenProvider || 'HTTP://127.0.0.1:7545');

const sender = '0x7eE9788d28Bbf333BAD74Cc3add5a7247EaEA7f2'
const receiver = '0x8C20ef44C16027d3789a3ef7f487c077aCdeC726'

// without 0x
const senderKey = Buffer.from('f1fcaa611aa04d47fcd8a0d6066b9b8af8c9ad8c643953755427d0785845cdfc', 'hex')
console.log(senderKey)

web3.eth.getTransactionCount(sender, (err, txCount) => {
   // Build a transaction
   const txObject = {
      nonce: web3.utils.toHex(txCount),
      to: receiver,
      value: web3.utils.toHex(web3.utils.toWei('1', 'ether')),
      gasLimit: web3.utils.toHex(21000),
      gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
   }
   // Sign the transaction
   // const txData = {
   //    nonce: '0x00',
   //    gasPrice: '0x09184e72a000',
   //    gasLimit: '0x2710',
   //    to: '0x0000000000000000000000000000000000000000',
   //    value: '0x00',
   //    data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
   //    v: '0x1c',
   //    r: '0x5e1d3a76fbf824220eafc8c79ad578ad2b67d01b0c2425eb1f1347e8f50882ab',
   //    s: '0x5bd428537f05f9830e93792f90ea6a3e2d1ee84952dd96edbae9f658f831ab13'
   //  };
   const tx = new Tx(txObject)
   tx.sign(senderKey)
   const serializedTransaction = tx.serialize()
   const raw = '0x' + serializedTransaction.toString('hex')
   // Broadcast the transaction
   web3.eth.sendSignedTransaction(raw, (err, txHash) => {
      console.log('txHash: ', txHash)
      console.log(err)
   })
})
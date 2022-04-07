const Web3 = require('web3');

// [Q] import된 package의 default class가 자동 생성 지정되나?
var web3 = new Web3(Web3.givenProvider || 'HTTP://127.0.0.1:7545');

const privKey = 'a8ccb79b1952912b10490679bf6e5997f61862a9cee1d3b215fa9b86b210ffb1';
const addressFrom = '0x3a2798B855cad70005FEb2Ad4a1f3953aDD476D1';
const addressTo = '0x29cC89aDC05D0E1fdAF09d76c6dF0A1EFBAF4429';

// Create transaction
const deploy = async () => {
   console.log(`Attempting to make transaction from ${addressFrom} to ${addressTo}`);

   const createTransaction = await web3.eth.accounts.signTransaction(
      {
         from: addressFrom,
         to: addressTo,
         value: web3.utils.toWei('1', 'ether'),
         gas: '21000',
      },
      privKey
   );

   // Deploy transaction
   const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
   );
   console.log(
      `Transaction successful with hash: ${createReceipt.transactionHash}`
   );
};

deploy();

// [RESULT]
// neoul@neoul-dev:~/projects/web3$ node web3-01.js 
// Attempting to make transaction from 0x3a2798B855cad70005FEb2Ad4a1f3953aDD476D1 to 0x29cC89aDC05D0E1fdAF09d76c6dF0A1EFBAF4429
// Transaction successful with hash: 0x24079c5326d94fe04c890c07b15f5152fe3c51690b3ef8e7ab3f5ee24c09dce6
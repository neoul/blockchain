# web3

The `web3.js` library is a collection of modules which contain specific functionality for the ethereum ecosystem.

- `web3-eth`: for specifically Ethereum blockchain interactions
- `web3-shh`: for the whisper protocol to communicate p2p and broadcast
- `web3-bzz`: for the swarm protocol (decentralized file storage)
- `web3-utils`: etc.

## Term

- `ENS`: Ethereum Name Service

## Setup supplies

```bash
npm install web3
npm install ethereumjs-tx
npm install @openzeppelin/contracts
```

## Autocompletion about web3

> vscode에서 web3 library에 대한 autocompletion 기능이 동작하지 않는다. [Q] 왜?


## Compile Smart Contracts

### Using docker solidity compiler

container로 만들어진 solidity compiler는 solidity code의 버전에 따라 쉽게 컴파일 버전을 쉽게 변경할 수 있다는 장점이 있다.

```bash
docker run -v $PWD/solidity:/solidity ethereum/solc:0.4.24 -o /solidity/bin --abi --bin /solidity/SimpleCoin.sol
```

### Using solc (solcjs)

```bash
npm install solc
cd solidity
solcjs --include-path ../node_modules --base-path ./ --bin --abi myERC777.sol
```

## Compilation output

Solidity를 컴파일하게 되면, 다음 두 가지 파일이 만들어짐

- `ContractFileName.bin`: bytecode for the smart contract
- `ContractFileName.abi`: Application Binary Interface (JSON interface) for the smart contract interface.

### ABI; JSON Interface

The JSON interface is a JSON object describing the **Application Binary Interface (ABI)** for an Ethereum smart contract. Using this JSON interface `web3.js` is able to create JavaScript object representing the smart contract and its methods and events using the `web3.eth.Contract` object.

> JSON interface에는 smart contract의 method와 event가 json으로 명시되며, 이를 통해 호출할 contract와 method의 hash value 값과 argument를 web3에서 파악할 때 사용된다. 결과적으로 **smart contract의 schema**라 할 수 있음.

### functions described in ABI

- `type`: `function`, `constructor`, `fallback`
- `name`: function name
- `constant`: `[FIXME]` true if the function is `pure`, `view`
- `payable`: true if the function is `payable`.
- `stateMutability`: `pure`, `view`, `nonpayable` and `payable`
- `inputs`: the function arguments
  - `name`: the function parameter name
  - `type`: the canonical type of the parameter
- `output`: input과 동일, function return이 없을 경우 생략

### Events described in ABI

- `type`: always `event`
- `name`: the name of the event
- `inputs`:
  - `name`, `type`: 앞서 function 내용과 동일
  - `indexed`: 해당 값이 logging event index로 사용될 경우 true
- `anonymous`: [FIXME] true if the event was declared as anonymous.

### ABI Example

```solidity
contract Test {
    uint a;
    address d = 0x12345678901234567890123456789012;
    function Test(uint testInt)  { a = testInt;}
    event Event(uint indexed b, bytes32 c);
    event Event2(uint indexed b, bytes32 c);
    function foo(uint b, bytes32 c) returns(address) {
        Event(b, c);
        return d;
    }
}
```

The contract is compiled out as the ABI.

```json
[{
    "type":"constructor",
    "payable":false,
    "stateMutability":"nonpayable"
    "inputs":[{"name":"testInt","type":"uint256"}],
  },{
    "type":"function",
    "name":"foo",
    "constant":false,
    "payable":false,
    "stateMutability":"nonpayable",
    "inputs":[{"name":"b","type":"uint256"}, {"name":"c","type":"bytes32"}],
    "outputs":[{"name":"","type":"address"}]
  },{
    "type":"event",
    "name":"Event",
    "inputs":[{"indexed":true,"name":"b","type":"uint256"}, {"indexed":false,"name":"c","type":"bytes32"}],
    "anonymous":false
  },{
    "type":"event",
    "name":"Event2",
    "inputs":[{"indexed":true,"name":"b","type":"uint256"},{"indexed":false,"name":"c","type":"bytes32"}],
    "anonymous":false
}]
```

The ABI is used to load the smart contract schema to the `web3` instance.

```javascript

// SimpleCoin.abi (json interface)
let TestABI = [{
    "type":"constructor", ... }];
const contractAddr = '0x9046FF3E1ed3cf03F5162415Ec740b9241674f11';
let Contract = require('web3-eth-contract');
Contract.setProvider('HTTP://127.0.0.1:7545');
// The ABI and the contract address are used to load the smart contract schema.
let contract = new Contract(TestABI, contractAddr);
```

## Call-chaining in web3

web3는 call chain으로 역인 callback를 통해 비동기적으로 작업을 수행함

### promiEvent (Promises Event)

This “promiEvent” is a promise combined with an event emitter to allow acting on different stages of action on the blockchain, like a transaction.

- `on`
- `once`
- `off`
- `receipt`
- `transactionHash`

```javascript
web3.eth.sendTransaction({from: '0x123...', data: '0x432...'})
.once('transactionHash', function(hash){
  // transactionHash가 반환된 시점?
})
.once('receipt', function(receipt){
  // receipt 처리 발행된 시점
})
.on('confirmation', function(confNumber, receipt){
  // transaction이 완료/확인된 시점
})
.on('error', function(error){
  // error가 발생한 경우
})
.then(function(receipt){
    // will be fired once the receipt is mined
});
```

## Deploy Smart Contract

### deploy examples

- `simpleCoin-deploy1.js`: deploy완료후 script가 pending 되는 증상있음; javascript study 필요
- `simpleCoin-deploy2.js`: private key를 어디서 가져오는가 확인 필요
- `simpleCoin-deploy3.js`: 이상무
- `SendRawTransaction.EIP-1820.js`: EIP-1820 Registry contract deploy를 위해 만듬

## Transaction (TX)

> Smart contract 데이터 조회나 ETH 조회시에도 TX를 만들고 서명하나?

### Transaction structure

web3의 API 동작은 신규 TX에 필요정보를 채우고, blockchain node에 송신하는 동작이므로 다음 Transaction (TX) 기본 구조와 사용하는 필드에 대해 이해가 반드시 필요하다.

```go
// LegacyTx is the transaction data of regular Ethereum transactions.
type LegacyTx struct {
    Nonce    uint64          // nonce of sender account
    GasPrice *big.Int        // wei per gas
    Gas      uint64          // gas limit
    To       *common.Address `rlp:"nil"` // nil means contract creation
    Value    *big.Int        // wei amount
    Data     []byte          // contract invocation input data
    V, R, S  *big.Int        // signature values
}
```

- EOA's private key로 서명된 message; 작업단위
- ECDSA (Ellictic Curve Digital Signature Algorithm)로 서명
- 구성요소
  - nonce: 발신자의 transaction 갯수
  - price: transaction 수행 수수료 (fee); unit: wei
  - gaslimit: 사용할 수 있는 gas 최대값
  - recipient: 수신자 주소
  - amount: 전송할 ether 량; unit: wei
  - payload: optional field; smart contract 호출일 경우 필요한 매개변수
  - v,r,s: ECDSA private key hash values?

## 참고

- https://medium.com/coinmonks/deploy-smart-contract-with-web3js-account-private-key-no-truffle-solidity-tutorial-2-5926fface340
- https://www.dappuniversity.com/articles/web3-js-intro

## Other blockchain libraries

지금까지 사용해 본 결과 사용법이 조금 지저분하다. 다른 library도 고민해볼 필요가 있음

- https://docs.ethers.io/v5/: 문서상으론 정리 잘되어 있음

## Wallet

Wallet is in memory web3 account management. These accounts can be used when using web3.eth.sendTransaction().

`web3.eth.accounts.wallet`


## keystore v3

- v1과의 차이: crypto algorithm; no longer fixed to AES-128-CBC
- `Web3 Secret Storage Definition`
- mac: the SHA3 (keccak-256) of the concatenations of the second-leftmost 16 bytes of the derived key together with the full ciphertext


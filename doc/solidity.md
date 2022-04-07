# Solidity

## EVM (Ethereum Virtual Manchine)

256 bits 소프트웨어 가상 머신으로 스택을 기반으로 구현되어 있으며, Tunning Complete하다.

![EVM (Ethereum Virtual Manchine)](https://imgs.developpaper.com/imgs/4085252435-5aaa9ae72c4d3_articlex.jpg)

## Tips

- Account는 Ether를 송수신하고, 보유할 수 있다.
- Contract도 account이므로 Ether를 보유할 수 있다. 단, `receive()`또는 `fallback()`이 선언해야 함.

## Variables

## Predefined variables

solidity provides following variables globally.

- `blockhash(uint blockNumber) returns (bytes32)`: hash of the given block when blocknumber is one of the 256 most recent blocks; otherwise returns zero
- `block.basefee (uint)`: current block’s base fee (EIP-3198 and EIP-1559)
- `block.chainid (uint)`: current chain id
- `block.coinbase (address payable)`: current block miner’s address
- `block.difficulty (uint)`: current block difficulty
- `block.gaslimit (uint)`: current block gaslimit
- `block.number (uint)`: current block number
- `block.timestamp (uint)`: current block timestamp as seconds since unix epoch
- `now (uint)`: 현재 블록 타임스탬프(block.timestamp 의 별칭)
- `gasleft() returns (uint256)`: remaining gas
- `msg.gas (uint)` remaining gas in older version than 0.4.21
- `msg.data (bytes calldata)`: complete calldata
- `msg.sender (address)`: sender of the message (current call); 바로이전 발신자
- `msg.sig (bytes4)`: first four bytes of the calldata (i.e. function identifier)
- `msg.value (uint)`: number of wei sent with the message
- `tx.gasprice (uint)`: gas price of the transaction
- `tx.origin (address)`: sender of the transaction (full call chain)

## Decimals

solidity에서는 10진수의 자리수를 의미

```text
1000000000000000000 wei = 18 decimal = 1 ether
```


## Functions

```text
function name(<PARAMETER TYPES>)
  [internal|external|public|private]
  [pure|constant|view|payable]
    [returns <RETURN TYPES>] {
      // function body
  }
```

### Function attributes


- **external**: EOA만 호출 가능, contract 내에서 호출 X, 단 `this.f()`로 호출 가능, 데이터가 클 때 유리 (calldata의 메모리 복사 없음)
- **public**: EOA, contract가 호출 가능, calldata의 메모리 복사로 비용증가
- **internal**: 해당 contract 또는 자식 contract에서 호출 가능
- **private**: 해당 contract 내부에서만 사용
- **view**: state 읽기 (o), state 쓰기 (x)
- **pure**: state 읽기 (x), state 쓰기 (x)
- **constant**:
- **payable**: Possible to send ether with the function
- **virtual**: A function that allows an inheriting contract to override its behavior will be marked at `virtual`.
- **override**: The function that overrides that base function should be marked as `override`.

> - ❗ EOA (External Owned Account; User Account)
> - [❗ Solidity override vs. virtual functions](https://medium.com/upstate-interactive/solidity-override-vs-virtual-functions-c0a5dfb83aaf)


### Function modifier

python decorator와 유사, ether 전송시 payable modifier로 선언되어야 한다.

### Interface ID? Function Selector?


- ❗ https://nhancv.medium.com/solidity-get-interface-id-and-erc165-190f0e2e3a9
- ❗ https://solidity-by-example.org/function-selector/

To get interface id, use

```solidity
// 1.
type(_func).interfaceId

// 2.
bytes4(keccak256(bytes(_func)))
```

Remember interfaceId = xor of all selectors (methods) name and param type, don't care to return type


### Contract Indicator

`super`: parent contract
`this`: this contract

### Error handling functions

- **assert(bool condition)** − In case condition is not met, this method call causes an invalid opcode and any changes done to state got reverted. This method is to be used for internal errors.
- **require(bool condition)** − In case condition is not met, this method call reverts to original state. - This method is to be used for errors in inputs or external components.
- **require(bool condition, string memory message)** − In case condition is not met, this method call reverts to original state. - This method is to be used for errors in inputs or external components. It provides an option to provide a custom message.
- **revert()** − This method aborts the execution and revert any changes done to the state.
- **revert(string memory reason)** − This method aborts the execution and revert any changes done to the state. It provides an option to provide a custom message.

```solidity
require(caller == _owner, "failure message");
revert("failure message")
```

### Cryptographic functions

- **keccak256(bytes memory) returns (bytes32)** − computes the Keccak-256 hash of the input.
- **sha256(bytes memory) returns (bytes32)** − computes the SHA-256 hash of the input.
- **ripemd160(bytes memory) returns (bytes20)** − compute RIPEMD-160 hash of the input.
- **ecrecover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) returns (address)** recover the address associated with the public key from elliptic curve signature or return zero on error. The function parameters correspond to ECDSA values of the signature: r - first 32 bytes of signature; s: second 32 bytes of signature; v: final 1 byte of signature. This method returns an address.

### Special functions

#### Sending or receiving Ether

- **to.transfer(ETH)** (2300 gas, throws error): `to`에게 송금
- **to.send(ETH)** (2300 gas, returns bool): `to`에게 송금
- **call** (forward all gas or set gas, returns bool)
- **receive() external payable**: contract가 Ether를 송금 받을 경우 사용됨 단, msg.data is empty, otherwise fallback() is called.
- **fallback() external payable**: contract가 Ether를 송금 받을 경우 
- **fallback() external payable**: executed if a target function doesn't exist.
- **constructor()**: Contract가 생성될 때 한번 호출되는 초기화 함수
  - constructor argument는 EVM code deploy시 반드시 포함되어야 함
  - 낮은 버전에서 contract명과 동일하게 이름 지정해야 함
  - public 꼭 선언?



### Calling another contract

- call: contract A를 통해 contract B의 함수 호출시 B의 storage를 변경시키며 msg.sender(호출자)는 컨트랙트A의 주소가 됩니다.
- callcode: v.0.5.0이후 삭제
- delegate: contract A를 통해 contract B 호출시 B의 storage를 변경시키지 않고, B의 코드를 A에서 실행합니다. msg.sender와 msg.value가 contract A 호출시와 같고, 변동되지 않습니다.
- StaticCall
- call, delegatecall and callcode

```solidity
bool check = address.call(bytes4(keccak256("함수명(변수타입)")),매개변수값);
bool check = address.delegatecall(bytes4(keccak256("함수명(변수타입)")),매개변수값);

(bool check, bytes memory data) = address.call(abi.encodeWithSignature("함수명(변수타입)",매개변수값));
(bool check, bytes memory data) = address.delegatecall(abi.encodeWithSignature("함수명(변수타입)",매개변수값));

//data decode
(uint a, uint b) = abi.decode(data, (uint, uint))
```

### ABI functions

```solidity
abi.encodePacked(_text, _anotherText)
abi.encode()
abi.encodePacked()
abi.encodeWithSelector()
abi.encodeWithSignature()
```


### State write in function 

상태가 변경되는 경우는 다음과 같다.

- Modifying state variables.
- Emitting events.
- Creating other contracts.
- Using selfdestruct.
- Sending Ether via calls.
- Calling any function which is not marked view or pure.
- Using low-level calls.
- Using inline assembly containing certain opcodes.

### State Read in function

- state variable 읽기
- this.balance 또는 address.balance 접근
- block, tx, msg 접근 (msg.data, msg.sig 제외)?
- pure로 선언되지않은 함수 호출
- 특정 opcode를 포함한 inlince assembly 사용?

## Events

- EVM Logging 기능을 사용
- blockchain log에 parameter와 함께 기록
- contract 내부에서 접근 불가함
- transaction을 생성한 account에 결과값 반환 용도
- log 영역은 storage 영역보다 저렴
- indexed parameter 지정후 검색에 사용 가능 (총 3개 지정가능)

## Library를 모아 놓자

```solidity
library Address {
    function isContract(address account) internal view returns (bool) {
        uint size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }
}
```

## Unit in use

```
assert(1 wei == 1);
assert(1 gwei == 1e9);
assert(1 ether == 1e18);

// Time Units
1 == 1 seconds
1 minutes == 60 seconds
1 hours == 60 minutes
1 days == 24 hours
1 weeks == 7 days
```

## Data Locations - Storage, Memory and Calldata

It Explicitly specifies the location of the data on the function declaration.

- **storage** - variable is a state variable (store on blockchain)
- **memory** - variable is in memory and it exists while a function is being called
- **calldata** - special data location that contains function arguments

## Checked or Unchecked Arithmetic

- Since Solidity 0.8.0, all arithmetic operations revert on over- and underflow by default, thus making the use of these libraries unnecessary.
- 0.8.0 이후 버전에서 수의 overflow, underflow시 except 처리되고, revert됨
- `unchecked { return a - b; }`로 수식을 감쌀 경우 기존과 동일하게 revert되지 않음
- safeMath 필요없음

## type function

```solidity
type(uint256).max // 최대값
type(uint256).min // 최소값
```
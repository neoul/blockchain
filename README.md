# Blockchain

- `Ethereum`: https://hersheythings.xyz/entry/ethtereumstructure
- `DeFi`: https://seekingalpha.com/article/4486894-decentralized-finance-crypto

## Terms

- `TX`: Transaction
- `IPFS` (InterPlanetary File System): file server based on blockchain?
- `EVM (Ethereum Virtual Machine)`: Smart Contract를 blockchain내에서 실행하기 위한 런타임 환경
- `Account`: blockchain의 Service Access Point
- `EOA (Externally Owned Accounts)`: 외부에서 PKI로 만들어진 계정 (account)
  - [ECDSA (Elliptic Curve Digital Signature Algorithm)](javascript/web3/ECDSA.md)
  - `Private key`: Transaction 서명에 사용하며, miner에 의해 Ethereum network에서 실행전 검증; 256 bits(32 bytes)
  - `Public key`: Private key로 만들어진 512 bits (64 bytes) key로 ECDSA는 public key를 signature에서 추출가능/ 이를 사용해 TX 검증
  - `Address`: EOA의 공개키를 keccak-256로 해싱후 뒤 20 bytes (160 bits)를 16진수로 표현한 byte string
  - `Account Component`: 지갑 (Wallet) 에는 키 값만 소유하고, Ether나 Token에 대한 정보는 모두 blockchain에 기록.
    - `nonce`: 해당 account의 transaction 수
    - `balance`: Ether 잔고
    - `root`: 해당 account가 저장될 머클 매트리시아 트리의 루트노드?
    - `codehash`: Smart Contract byte code hash value?
  - `Account Wallet`: 키만 저장되며, 나머지 정보는 blockchain 내 존재
- `CA (Contract Accounts)`: 컨트랙트 접근을 위해 컨트랙트 생성시 만들어진 계정, 주소 (생성한 사용자의 주소와 주소로부터 보내진 Transaction의 수, "Nonce"에 기반)
- `Account Address`: EOA의 공개키를 keccak-256로 해싱후 뒤 20 bytes (160 bits)를 16진수로 표현한 byte string
- `Byte Code`: EVM code
- `Parity`: Rust로 구현한 Ethereum client
- `Geth`: Ethereum Foundation의 공식 Ethereum client
- `Ganache`, `ganache-cli`: 테스트용 local Ethereum network
- `Metamask`: Ethereum Wallet application
- `ethers.js`, `web3`: Blockchain network communication API
- `truffle`, `hardhat`: Dapp development framework; contract의 deploy, test package


## Read the account address from a private key

> - https://medium.com/free-code-camp/how-to-create-an-ethereum-wallet-address-from-a-private-key-ae72b0eee27b

![Read the account address from a private key](https://miro.medium.com/max/700/1*9Vhh9WVns4yFz4swpElcGg.png)

## Keystore

> - https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
> - https://julien-maffre.medium.com/what-is-an-ethereum-keystore-file-86c8c5917b97

A keystore file in Ethereum is an encrypted version of your private key. They are generated using your private key and a password that you use to encrypt it. If you open up your keystore file in a text editor it contains data pertaining to the encryption of the private key.

- JSON format
- UTC file이라고도 불림
- File Name: `~/.ethereum/keystore/UTC--<created_date_time>--<AccountAddress>`

### ❗취약점 (Vulnerability)

- Online에 업로드 password를 통한 사용으로 spoofing에 취약
- keystore 분실 및 도난에 대한 복구 불가능; 복사본 유지 필요
- passphrase를 잊을 경우 private key 사용 불가

### Keystore contents

```json
{
  "crypto" : {
    "cipher" : "aes-128-ctr",
    "cipherparams" : {
      "iv" : "83dbcc02d8ccb40e466191a123791e0e"
    },
    "ciphertext" : "d172bf743a674da9cdad04534d56926ef8358534d458fffccd4e6ad2fbde479c",
    "kdf" : "scrypt",
    "kdfparams" : {
      "dklen" : 32,
      "n" : 262144,
      "r" : 1,
      "p" : 8,
      "salt" : "ab0c7876052600dd703518d6fc3fe8984592145b591fc8fb5c6d43190334ba19"
    },
    "mac" : "2103ac29920d71da29f15d75b4a16dbe95cfd7ff8faea1056c33131d846e3097"
  },
  "id" : "3198bc9c-6672-5ab3-d995-4942343ae5b6",
  "version" : 3
}
```

- **cipher**: The name of a symmetric AES algorithm; `aes-128-ctr`
- **cipherparams**: The parameters required for the “cipher” algorithm above; `aes-128-ctr parmeters`
- **ciphertext**: Your Ethereum private key encrypted using the “cipher” algorithm above;
- **kdf**: A Key Derivation Function used to let you encrypt your keystore file with a password; 키유도함수
- **kdfparams**: The parameters required for the “kdf” algorithm above;
- **mac**: hash-based Message Authentication Code; A code used to verify your password

### Symmetric decryption of ciphertext

![Symmetric decryption of ciphertext](https://miro.medium.com/max/700/1*3a9LeWT9B9CSu7a3x8GdKw.png)
### Key Derivation Function from passphrase

![Key Derivation Function from passphrase](https://miro.medium.com/max/700/1*nNI586I7fXesxYNls1pm2A.png)

### Decryption key verification

![Decryption key verification](https://miro.medium.com/max/700/1*YaBR2RaF0-RulLc-pUmdyQ.png)

### Keystore entire process

![Key Store file](https://miro.medium.com/max/700/1*jHfiOdfCKhyCq5V39vty-A.png)

## Wallet

> - http://wiki.hash.kr/index.php/HD_%EC%A7%80%EA%B0%91
> - https://steemit.com/kr-dev/@modolee/mastering-ethereum-4-wallet

안전하게 Private key를 생성/저장/관리하기 위한 일련의 기술

- Keystore
- HD (Hierarchical Deterministic) Wallet:  [BIP-32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)에 정의
- Mnemonic Phrase
- Metamask/ Mist

### Mnemonic (연상기호)

This BIP describes the implementation of a mnemonic code or mnemonic sentence -- a group of easy to remember words -- for the generation of deterministic wallets.
It consists of two parts: generating the mnemonic and converting it into a binary seed. This seed can be later used to generate deterministic wallets using BIP-0032 or similar methods.

- [BIP-39 Mnemonic code for generating deterministic keys](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
- [BIT-39 Word list](https://github.com/bitcoin/bips/blob/master/bip-0039/bip-0039-wordlists.md); 2^11 bits => word(2048 words) mapping

## DeFi (Decentralized Finance)

❗ 디파이(DeFi), 탈중앙화 금융(Decentralized Finance), 분산금융 또는 분산재정

❗Blockchain의 coin, token, NFT를 활용한 금융 서비스

- Short for decentralized finance.
- Consists of a series of platforms and apps that developers have created to enable a wide array of banking functions on the blockchain within the cryptocurrency ecosystem.
- Can be thought of as the financial infrastructure of the cryptocurrency landscape.
- Within the span of a few years, robust lending, borrowing, and trading features have emerged in the DeFi ecosystem.
- Representative protocol: ERC-20 NT (Fungible Token)

## Best Block Explorers for Ethereum Developers

- Etherscan
- Bloxy
- Blockchair
- Ethplorer

### Transaction

Transaction (TX) 기본 구조

- https://github.com/ethereumbook/ethereumbook/blob/develop/06transactions.asciidoc

```go
// LegacyTx is the transaction data of regular Ethereum transactions.
type LegacyTx struct {
    Nonce    uint64          // nonce of sender account; sender의 TX 갯수
    GasPrice *big.Int        // wei per gas
    Gas      uint64          // gas limit; 사용가능한 최대 수수료
    To       *common.Address `rlp:"nil"` // nil means contract creation
    Value    *big.Int        // wei amount; 전송할 ether량 (wei 단위)
    Data     []byte          // contract invocation input data
    V, R, S  *big.Int        // signature values (ECDSA signature)
}
```

```typescript
// [Transaction object]
export type TransactionRequest = {
    to?: string,
    from?: string,
    nonce?: BigNumberish,
    gasLimit?: BigNumberish,
    gasPrice?: BigNumberish,
    data?: BytesLike,
    value?: BigNumberish,
    chainId?: number
    type?: number;
    accessList?: AccessListish;
    maxPriorityFeePerGas?: BigNumberish;
    maxFeePerGas?: BigNumberish;
    customData?: Record<string, any>;
    ccipReadEnabled?: boolean;
}
```

## Smart Contract Deployment

- Contract deployment is a special Ethereum transaction sent to the address 0.
- The deployment has the side effects of creating bytecode at a specific address (i.e, it creates a smart contract account).
- Contracts are deployed at predictable addresses based on the address and nonce of the account creating the contract.
  - The address of the new account is defined as being the rightmost 160 bits of the Keccak hash of the RLP encoding of the structure containing only the sender and the nonce.


![Deployment-process](https://www.researchgate.net/publication/357892985/figure/download/fig6/AS:1125027646832644@1645238901314/Deployment-process-of-Ethereum-smart-contract.png)


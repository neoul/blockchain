# Blockchain

- `Ethereum`: https://hersheythings.xyz/entry/ethtereumstructure
- `DeFi`: https://seekingalpha.com/article/4486894-decentralized-finance-crypto


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

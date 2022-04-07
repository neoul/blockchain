# Blockchain

- ❗**Ethereum** https://hersheythings.xyz/entry/ethtereumstructure
- ❗**DeFi** https://seekingalpha.com/article/4486894-decentralized-finance-crypto

## Wallet

- **Format**: JSON format
- **version**: 3
- **id**: wallet 식별용 ID
- **address**: 사용자 계정의 address
- **crypto**: Private key
  - **ciphertext**: private encoded by KDF
  - **solt**, **iv**: initialization vector (random numbers)
  - **kdf**: Key derivation function (키 유도 함수) e.g. scrypt, pbkdf2
  - **password**, 로 부터 암호키 (private key)를 유도하는 함수
  - **kdfparams**: 유도함수에 사용된 인자
  - **pbkdf2**: Password-Based Key Derivation Function
  - **mac**: an hash value of the chipertext for its validation

❗Wallet은 ethereum에서 사용되는 private key를 생성 저장하는 것이 아니라 키 유도 함수를 통해 사용시 매번 생성한다.

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


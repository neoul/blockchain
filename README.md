# blockchain

```bash

```

## Terms

- `TX`: Transaction
- `IPFS` (InterPlanetary File System): file server based on blockchain?
- `EVM (Ethereum Virtual Machine)`: Smart Contract를 blockchain내에서 실행하기 위한 런타임 환경
- `Account`: blockchain의 Service Access Point
- `EOA (Externally Owned Accounts)`: 외부에서 PKI (공개키 기반 암호 알고리즘)로 만들어진 계정
  - `Public key`: Account Address 생성 및 Transaction 검증에 사용
  - `Private key`: Transaction 서명에 사용하며, miner에 의해 Ethereum network에서 실행전 검증
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
- `Web3`와 `Truffle`: Web API for Ethereum
- `Ganache`, `ganache-cli`: 테스트용 local Ethereum network
- `Metamask`: Ethereum Wallet application
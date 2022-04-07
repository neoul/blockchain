
# Receiver Pays

> https://programtheblockchain.com/posts/2018/02/17/signing-and-verifying-messages-in-ethereum/

Contract를 사용해 수취인에게 ether/token 전송 비용 (pay the transaction fee)을 부과하는 방법

## Digital Signature

다음은 인증서 (certificate)를 사용한 전자 서명 기본 구조로 Ethereum에서도 동일한 동작 수행

![Digital Signature Architecture using PKI](https://cheapsslsecurity.com/blog/wp-content/uploads/2018/09/how-do-digital-signatures-and-digital-certificates-work-together-in-ssl.png)

In Ethereum, 

- **Data**: = message = transaction (TX)
- **Hash**: = hash value = digest
- **Signature** = signed digest = `v`, `r` and `s` fields in TX structure
- **Hash Algorithm**: `keccak256/sha3`
- **Signature Algorithm (Public/Private key)**: `EDCSA` (Elliptic Curve Digital Signature Algorithm)

The sign method calculates an Ethereum specific signature with: `sign(keccak256("\x19Ethereum Signed Message:\n" + len(message) + message)))`.

### What to Sign

- `to`: The address of the recipient
- `value`: The amount ether or token that is to be transferred
- `nonce`: 중복된 nonce 사용 불가 ==> replay attack 예방

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

## Replay attack prevention in contract

Contract에서 replay attack 예방법

- ethereum은 nonce 값의 중복 사용을 제한하여, ether 송금에 대한 replay attack을 회피
- smart contract에서도 nonce를 인자로 받아 replay attack을 회피할 수 있다.
- 매거래마다 contract deploy/destroy 수행


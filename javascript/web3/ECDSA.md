# ECDSA in Ethereum

타원 곡선 (Elliptic Curve)의 특성을 활용한 전자서명

- ECDSA signatures are 2 times longer than the signer's private key.
  - Private key 256 bits(32 bytes) ==> 512 bits signature
  - Ethereum ECDSA: (secp256k1) 256-bit elliptic curves ==> 512 bits
  - secp521r1: 521-bit curves ==> 1042 bits
- ECDSA에서 Public key도 마찮가지로 private key보대 2배 길다.
- ECDSA signature `{r, s, v}` + `signed message`에서 signer의 public key를 복구할 수 있다.

Reference

- https://m.blog.naver.com/aepkoreanet/221178375642
- https://chocolate-life.tistory.com/6
- https://cryptobook.nakov.com/digital-signatures/ecdsa-sign-verify-messages
- https://cryptobook.nakov.com/digital-signatures/ecdsa-sign-verify-examples

## ECDSA signature

ECDSA signatures are 2 times longer than the signer's private key for the curve used during the signing process. For example, for 256-bit elliptic curves (like secp256k1) the ECDSA signature is 512 bits (64 bytes) and for 521-bit curves (like secp521r1) the signature is 1042 bits.

It is important to know that the ECDSA signature scheme allows the public key to be recovered from the signed message together with the signature. The recovery process is based on some mathematical computations (described in the SECG: SEC 1 standard) and returns 0, 1 or 2 possible EC points that are valid public keys, corresponding to the signature. To avoid this ambiguity, some ECDSA implementations add one additional bit v to the signature during the signing process and it takes the form `{r, s, v}`. From this extended ECDSA signature `{r, s, v}` + the signed message, the signer's public key can be restored with confidence.

The public key recovery from the ECDSA signature is very useful in bandwidth constrained or storage constrained environments (such as blockchain systems), when transmission or storage of the public keys cannot be afforded. For example, the Ethereum blockchain uses extended signatures `{r, s, v}` for the signed transactions on the chain to save storage and bandwidth.
Public key recovery is possible for signatures, based on the ElGamal signature scheme (such as DSA and ECDSA).

## 타원곡선 방정식

- ![타원 곡선 방정식](https://wikimedia.org/api/rest_v1/media/math/render/svg/3dbe6cab1bc2c7f1c99757dc6e5d7a517cf9b4f8); secp256k1 curve 인 경우는 a=0 , b=7인; `Y^2 = X^3 + 7`
- `secp256k1`: 타원 곡선에 대한 Domain Parameter 규정한 Standard Curve
  - p : Modulo Prime Number
  - a : 타원곡선 방정식에서 사용되는 계수
  - b : 타원곡선 방정식에서 사용되는 계수
  - G : Base point 또는 Generator Point , G 는 E(Fp)에 속해 있는 point 입니다.
  - n : the order of point G (G를 n번 더하면, 무한원점이 되는 값 :  nG = ∞)
  - h : cofactor 


# Test Environments

## Testnet - Kovan 사용

1. https://docs.infura.io/infura/create-a-project에서 infura 가입 및 프로젝트 생성
2. 프로젝트 ID는 testnet 접속을 위한 endpoint가 됨. e.g.https://kovan.infura.io/v3/PROJECT_ID
3. https://gitter.im/kovan-testnet/faucet의 가입/채팅창에 계정주소를 올리면 Ether를 준다.
4. Ether를 받은 후 https://kovan.etherscan.io/에서 트랜젝션과 계정주소 정보를 조회한다.
   - All Filters> insert your account address
5. 

## My transaction test

```text
0xb0f47adb43d6986fc064a3b39f0defae17ea8954ecf11a13ee47b8227e1f7066
// from: 0x699c833a3af793ccb9af57a461a67b679da46db1
// to: 0x5836187d93100836faf0478224ac8dd2c85776d7
// 0.0001 Ether

0x15b093f28f6e4c552e1aee945e8b9607aa041ebb687181b04691268f0384d839
	// from: 0x5836187d93100836faf0478224ac8dd2c85776d7
	// to: 0x699c833a3af793ccb9af57a461a67b679da46db1
	// Value(Sent Ether): 0.000001 Ether
```

```bash

```


- EIP(Ethereum Improvement Proposals) - 제안서?, 제안 기술에 대한 근거 제시, 반대의견에 대한 문서화
- EIP는 Standard Track EIP, Informational  EIP, Meta  EIP 의 3가지 종류
- ERC = Standard Track EIP
- ERC-1155: ERC-1155는 단일 계약을 통해 대체 가능한 ERC-20 이나 대체 불가능한(Non-fungible) ERC-721을 무한히 발행(e.g. 복잡한 게임 아이템 시스템)


### ERC-20, ERC-1155, ERC-223, ERC-721 – 차이점은 무엇인가요?

https://academy.binance.com/ko/articles/an-introduction-to-erc-20-tokens

ERC-20은 첫 이더리움 토큰 표준이었습니다(그리고 오늘날까지도 가장 인기 있는 것입니다). 그러나 ERC-20만이 유일한 것은 아닙니다. 수 년에 걸쳐 다른 많은 것들이 등장했으며, 이는 ERC-20 개선을 제안하는 것이거나, 전적으로 다른 목적을 달성하기 위한 것입니다.

상대적으로 일반적이지 않은 표준 중 일부는 NFT(대체 불가능한 토큰)에 사용됩니다. 때로는 다른 속성을 가진 고유한 토큰을 사용하는 데서 이점을 얻을 수 있습니다. 여러분이 예술 작품의 한 부분이나, 게임 내 자산 등을 토큰화하고자 할 경우, 이러한 콘트랙트 유형 중 하나가 더 적합할 수 있습니다.
예를 들어, ERC-721 표준은 무척이나 인기 있는 크립토키티 디앱에서 사용됐습니다. 이러한 콘트랙트는 사용자에게 API를 제공하여, 자신만의 대체 불가능한 토큰을 주조하고 메타 데이터(이미지, 설명 등)를 표현할 수 있게 했습니다. 
ERC-1155 표준은 ERC-721과 ERC-20 모두를 개선한 것으로 볼 수 있습니다. 간략히 말해 이는 대체 가능한 토큰과 대체 불가능한 토큰을 동일한 콘트랙트 내에서 모두 지원하는 표준입니다.

ERC-223 또는 ERC-621처럼 사용성을 개선하고자 하는 다른 선택지도 있습니다. ERC-223은 토큰 전송 사고를 방지하기 위한 안전 장치를 사용합니다. ERC-621은 토큰 공급량 증가와 감소를 위한 부가적인 기능을 제공합니다.

NFT와 관련한 보다 자세한 설명은, 암호화폐 수집물과 대체 불가능한 토큰(NFT) 설명을 확인해 보시기 바랍니다.

# ERC

- Ethereum Request for Comments
- Listed to https://eips.ethereum.org/erc


## EIR

Ethereum Improvement Proposals (EIPs) describe standards for the Ethereum platform, including core protocol specifications, client APIs, and contract standards.

- https://github.com/ethereum/EIPs
- **EIP Status**: [`Idea`, `Draft`, `Review`, `Last Call`, `Final`, `Stagnant`, `Withdrawn`, `Living`]
- **EIP Types**: [`Core`, `Networking`, `Interface`, `ERC`, `Meta`, `Informational`]


### ERC is one of EIR Types

Application-level standards and conventions, including contract standards such as token standards (ERC-20), name registries (ERC-137), URI schemes (ERC-681), library/package formats (EIP190), and wallet formats (EIP-85).


## ERC-20

ERC-20 is a standard or guideline for creating new tokens. The standard defines six mandatory functions that a smart contract should implement and three optional ones.

To start you can give your token a name, a symbol, and mention how dividable your token is, by specifying the decimals. ERC specifies a set of mandatory functions, which are a bit more complex and listed below:

- **totalSupply**: A method that defines the total supply of your tokens, When this limit is reached the smart contract will refuse to create new tokens.
- **balanceOf**: A method that returns the number of tokens a wallet address has.
- **transfer**: A method that takes a certain amount of tokens from the total supply and gives it to a user.
- **transferFrom**: Another type of transfer method which is used to transfer tokens between users.
- **approve**: This method verifies whether a smart contract is allowed to allocate a certain amount of tokens to a user, considering the total supply.
- **allowance**: This method is exactly the same as the approved method except that it checks if one user has enough balance to send a certain amount of tokens to another.

If you know something about Object Oriented programming you can compare ERC-20 to an Interface. If you want your token to be an ERC-20 token, you have to implement the ERC-20 interface and that forces you to implement these 6 methods. 

- See more details: https://www.quicknode.com/guides/solidity/how-to-create-and-deploy-an-erc20-token


## ERC-165

ERC-165는 사용하려는 contract가 어떠한 인터페이스(A set of functions) 구현했는지 확인할 수 있는 방법을 제시한다.

- **Function ID**: the string of function_name(argument type) > keccak256 hashing > cut first 4 bytes of the hashing value
- **Function Selector**: = Function ID

제공해야 할 인터페이스의 Function ID들을 XOR하여 아래 인터페이스를 통해 사용하려는 인터페이스의 지원 유무를 제공함.

```solidity
function supportsInterface(bytes4 interfaceID) external view returns (bool);
```

- See more details: https://medium.com/humanscape-tech/erc-165%EB%9E%80-%EB%AD%98%EA%B9%8C-910b29533188


## ERC-1820: Pseudo-introspection Registry Contract

- ERC-820을 대체함
- ERC-165의 역할도 함
- Smart contract나 regular account가 제공하고 있는 인터페이스를 등록하는 등기소 (Registry)
- 고정된 등기소 주소(Registry Contract Address) 제공: `0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24`
- raw transaction data를 제공하므로 어느 chain이건 위의 Registry Contract Address에 Registry Contract를 배포해 registry 서비스를 해줄 수 있음.

This standard defines a registry where smart contracts and regular accounts can publish which functionality they implement—either directly or through a proxy contract.
Anyone can query this registry to ask if a specific address implements a given interface and which smart contract handles its implementation.
Interfaces with zeroes (0) as the last 28 bytes are considered ERC-165 interfaces, and this registry SHALL forward the call to the contract to see if it implements the interface. This contract also acts as an ERC-165 cache to reduce gas consumption.

This standard also provides a unique address for all chains. Thus solving the problem of resolving the correct registry address for different chains.


### ERC-777과의 동작

ERC-777 token contract는 ERC-1820 Registry의 `setInterfaceImplementer`을 호출하여 자신이 ERC-777 token 인터페이스 임을 등록해야 한다.

This is done by calling the `setInterfaceImplementer` function on the ERC-1820 registry with the token contract address as both the address and the implementer and the keccak256 hash of ERC777Token (0xac7fbab5f54a3ca8194167523c6753bfeb96a445279294b6125b68cce2177054) as the interface hash.


## ERC-777 Token Contract

ERC-20에 대한 호환성을 유지하면서 contract, account간의 token 교환 및 token의 send/receive hooks를 통한 세부제어 방법을 정의한다.

This standard defines a new way to interact with a token contract while remaining backward compatible with ERC-20. It defines advanced features to interact with tokens.
It defines advanced features to interact with tokens. Namely, operators to send tokens on behalf of another address—contract or regular account—and send/receive hooks to offer token holders more control over their tokens.

This standard tries to improve upon the widely used ERC-20 token standard. The main advantages of this standard are:

1. Ether를 보낼 때 와 동일한 개념을 사용
2. `tokensToSend`와 `tokensReceived` hook를 사용하여 token 송수신을 거부할 수 있다. (Rejection is done by reverting in the hook function.)
3. `tokensReceived` hook으로 token 송신을 승인할 수 있으며, 그 결과를 공지할 수 있다. The tokensReceived hook allows to send tokens to a contract and notify it in a single transaction, unlike ERC-20 which requires a double call (approve/transferFrom) to achieve this.
4. token 소유자가 token 송수신에 대한 제 3자의 제어 (operator, exchange agent, automatic charging system) 를 허용한다. The holder can “authorize” and “revoke” operators which can send tokens on their behalf. These operators are intended to be verified contracts such as an exchange, a cheque processor or an automatic charging system.
5. 모든 token 교환에 사용된 정보(operator 정보 포함)를 기록한다. Every token transaction contains data and operatorData bytes fields to be used freely to pass data from the holder and the operator, respectively.
6. proxy contract를 배포해 `tokenReceived` hook이 없는 wallet과의 호환성을 지원한다. It is backward compatible with wallets that do not contain the tokensReceived hook function by deploying a proxy contract implementing the tokensReceived hook for the wallet.

### operator

An operator is an address which is allowed to send and burn tokens on behalf of some holder.


### ERC-777과 ERC-20 Backward Compatibility (호환성)

- `transfer`, `transferFrom`: ERC-777에서 사용안함, `send`, `operatorSend` 사용됨
- `decimal()`: 18 반환 (ETH 동일한 granuality를 위해), It is optional.
- `name`, `symbol`, `balanceOf`, `totalSupply` 구현되어야 함
- ERC-777 token이 ERC-20을 지원하려면,
  - It MUST register the ERC20Token interface with its own address via ERC-1820.
  - ERC1820 registry의 `setInterfaceImplementer`를 호출해 `ERC20Token` interface 등록해야 함
  - keccak256("ERC20Token"): 0xaea199e31a596269b42cdafd93407f14436db6e4cad65417994c2eb37381e05a
  - ERC-20 지원 기능을 끄고 켜기위한 동작: `ERC20Token` interface 등록/해제로 가능

## EIP 1155 (Ethereum Improvement Proposals)

> 📢 **Key features**: `Multi token`, `Batch operation`, `operator(agent contract)` and `safety call`

- = `IERC-1155`
- **Multi token**: ERC-20 (ERC-777) + ERC-721; A standard interface for contracts that manage multiple token types. A single deployed contract may include any combination of fungible tokens, non-fungible tokens or other configurations.
- **Batch operation**: 다수의 token을 하나의 transaction으로 처리
- **operator**: from의 token 송수신을 대신하는 contract 지정
- **Safety call**: 엉뚱한 contract의 token 송신을 막기위해 operator contract를 지정해야 동작; operator contract는 `ERC1155TokenReceiver` 인터페이스를 반드시 구현해야 함.
- **URI**: The URI MUST point to a JSON file that conforms to the "ERC-1155 Metadata URI JSON Schema".

```solidity
interface ERC1155 {
    event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);
    event TransferBatch(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256[] ids,
        uint256[] values
    );
    event ApprovalForAll(address indexed account, address indexed operator, bool approved);
    event URI(string value, uint256 indexed id);

    function balanceOf(address account, uint256 id) external view returns (uint256);
    function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids)
    function setApprovalForAll(address operator, bool approved) external;
    function isApprovedForAll(address account, address operator) external view returns (bool);
    function safeTransferFrom(address from,
            address to,
            uint256 id,
            uint256 amount,
            bytes calldata data
        ) external;
    function safeBatchTransferFrom(address from,
            address to,
            uint256[] calldata ids,
            uint256[] calldata amounts,
            bytes calldata data
        ) external;
}

// Smart contracts MUST implement all of the functions in the ERC1155TokenReceiver interface to accept transfers. See “Safe Transfer Rules” for further detail.
interface ERC1155TokenReceiver {
    function onERC1155Received(address _operator, address _from, uint256 _id, uint256 _value, bytes calldata _data) external returns(bytes4);
    function onERC1155BatchReceived(address _operator, address _from, uint256[] calldata _ids, uint256[] calldata _values, bytes calldata _data) external returns(bytes4);
}
```

### ERC1155TokenReceiver interface

- `ERC1155TokenReceiver`를 구현한 contract만이 ERC-1155 token을 수신할 수 있는 contract가 될 수 있다.
- 해당 contract가 수신한 token을 거래할 수 있는 인터페이스를 가졌다는 의미
- `onERC1155Received`, `onERC1155BatchReceived` 함수는 `safeTransferFrom`, `safeBatchTransferFrom` 두 함수의 selector를 각 각 반환하여, 두 함수가 contract에 구현되어 있음을 알림.
- 따라서 `safeTransferFrom`, `safeBatchTransferFrom`를 구현하지 않은 contract는 ERC1155 token 거래에 참여할 수 없음.


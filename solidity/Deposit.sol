pragma solidity ^0.6.0;

// Deposit Ether to a contract
// - Ether를 인출할 Account를 지정하여 예치
// - manager 또는 withdrawer가 Ether를 출금
// 구현이유: Contract에 Ether가 deposit될 수 있는지 확인
contract Deposit {
    address manager;
    
    // depositer => withdrawer
    mapping(address => address) sendto;

    // withdrawer => deposit receipt (예금증서)
    mapping(address => uint256) public depositReceipt;

    // Contract creater is manager.
    constructor() public payable {
        manager = msg.sender;
    }

    // 인출자 지정하여 예치, account가 EOA
    function deposit(address withdrawer) public payable {
        sendto[msg.sender] = withdrawer;
        // overflow 처리 필요?
        depositReceipt[withdrawer] = depositReceipt[withdrawer] + msg.value;
    }


    // 인출자 또는 관리자가 인출
    function withdraw() public {
        require(depositReceipt[msg.sender] != 0, "no deposit to withdraw");
        msg.sender.transfer(depositReceipt[msg.sender]);
        delete depositReceipt[msg.sender];
    }

    //  0.6.0에서는 receive()또는 fallback()함수가 명시되지 않아도 Ether를 수신함..
    // receive() external payable {
    //     // this function enables the contract to receive funds
    // }
}

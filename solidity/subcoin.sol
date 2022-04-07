pragma solidity ^0.5.0;

contract Coin {
    // readable from outside using public
    address public minter;
    mapping (address => uint) public balance;
    
    // event allows clients receives the changes.
    event Send(address from, address to, uint amount);

    // once executed at contract creation
    constructor() public {
        minter = msg.sender;
    }

    // issue coins
    function mint(address receiver, uint amount) public {
        require(msg.sender == minter, "no permission");
        require(amount < 1e60, "too big amount");
        balance[receiver]+=amount;
    }

    // send coin
    function send(address receiver, uint amount) public {
        require(amount <= balance[receiver], "insufficient balance");
        balance[msg.sender] -= amount;
        balance[receiver] += amount;
        // send event to clients
        emit Send(msg.sender, receiver, amount);
    }
}

// javascript에서 event 수신
// Coin.Sent().watch({}, "", function(error, result) {
//     if (!error) {
//         console.log("Coin transfer: " + result.args.amount +
//             " coins were sent from " + result.args.from +
//             " to " + result.args.to + ".");
//         console.log("Balances now:\n" +
//             "Sender: " + Coin.balances.call(result.args.from) +
//             "Receiver: " + Coin.balances.call(result.args.to));
//     }
// })
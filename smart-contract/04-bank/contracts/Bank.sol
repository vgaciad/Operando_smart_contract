// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Bank {
    // Variables

    mapping(address => int) balance;

    // Events

    event DepositMade(address account, uint value);
    event WithdrawMade(address account, uint value);
    event TransferMade(address from, address to, uint value);

    // Public functions

    function getBalance(address account) public view returns (int) {
        return balance[account];
    }

    function deposit() public payable {
        require(msg.value > 0, "MIN_ETHER_NOT_MET");
        balance[msg.sender] += int(msg.value);
        emit DepositMade(msg.sender, msg.value);
    }

    function withdraw(uint amount) public {
        require(balance[msg.sender] - int(amount) >= -10, "NOT_ENOUGH");
        balance[msg.sender] -= int(amount);
        payable(msg.sender).transfer(amount);
        emit WithdrawMade(msg.sender, amount);
    }

    function transfer(address destination, uint amount) public {
        require(balance[msg.sender] - int(amount) >= -10, "NOT_ENOUGH");
        balance[msg.sender] -= int(amount);
        balance[destination] += int(amount);
        emit TransferMade(msg.sender, destination, amount);
    }
}

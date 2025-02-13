// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Bank {
    // Variables

    address admin;

    mapping(address => int) balance;

    mapping(address => int) private totalInterest;
    mapping(address => uint256) private lastInterestTime;

    uint256 private annualInterestRate = 5;

    constructor() {
        admin = tx.origin;
    }

    // Events

    event DepositMade(address account, uint value);
    event WithdrawMade(address account, uint value);
    event TransferMade(address from, address to, uint value);

    // Public functions

    function setInterestRate(uint256 newRate) public {
        require(msg.sender == admin, "UNAUTHORIZED");
        annualInterestRate = newRate;
    }

    function getBalance(address account) public view returns (int) {
        int interest = calculateInterest(account, block.timestamp);
        return balance[account] + interest;
    }

    function getInterest(address account) public view returns (int) {
        int interest = calculateInterest(account, block.timestamp);
        return totalInterest[account] + interest;
    }

    function deposit() public payable {
        int interest = calculateInterest(msg.sender, block.timestamp);

        if (interest > 0) {
            balance[msg.sender] += interest;
            totalInterest[msg.sender] += interest;
        }

        require(msg.value > 0, "MIN_ETHER_NOT_MET");
        balance[msg.sender] += int(msg.value);
        lastInterestTime[msg.sender] = block.timestamp;
        emit DepositMade(msg.sender, msg.value);
    }

    function withdraw(uint amount) public {
        int interest = calculateInterest(msg.sender, block.timestamp);

        if (interest > 0) {
            balance[msg.sender] += interest;
            totalInterest[msg.sender] += interest;
        }

        require(balance[msg.sender] - int(amount) >= -10, "NOT_ENOUGH");
        balance[msg.sender] -= int(amount);
        lastInterestTime[msg.sender] = block.timestamp;
        payable(msg.sender).transfer(amount);
        emit WithdrawMade(msg.sender, amount);
    }

    function transfer(address destination, uint amount) public {
        int interest = calculateInterest(msg.sender, block.timestamp);

        if (interest > 0) {
            balance[msg.sender] += interest;
            totalInterest[msg.sender] += interest;
        }

        require(balance[msg.sender] - int(amount) >= -10, "NOT_ENOUGH");
        balance[msg.sender] -= int(amount);
        lastInterestTime[msg.sender] = block.timestamp;
        balance[destination] += int(amount);
        emit TransferMade(msg.sender, destination, amount);
    }

    function calculateInterest(
        address user,
        uint256 timestamp
    ) internal view returns (int) {
        if (lastInterestTime[user] == 0 || timestamp < lastInterestTime[user]) {
            return 0;
        }

        if (balance[user] <= 0) {
            return 0;
        }

        uint256 balanceUser = uint(balance[user]);
        uint256 timeElapsed = timestamp - lastInterestTime[user];
        uint256 userInterest = ((balanceUser * annualInterestRate) / 100);
        uint256 overTime = (userInterest * timeElapsed);
        uint256 yearly = overTime / 365 days;

        return int(yearly);
    }
}

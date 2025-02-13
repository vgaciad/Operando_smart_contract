// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract StreetFighter {
    // Variables

    address public creator;
    mapping(address => uint) life;

    // Events

    event Started(address indexed _player1, address indexed _player2);
    event Hit(address indexed _player1, address indexed _player2, uint val);
    event Dead(address indexed _player);

    // Constructor

    constructor() {
        creator = tx.origin;
    }

    // Public Functions

    function start(address player1, address player2) public {
        require(msg.sender == creator, "INVALID_SENDER");

        life[player1] = 100;
        life[player2] = 100;

        emit Started(player1, player2);
    }

    function hit(address player1, address player2, uint strength) public {
        require(msg.sender == player1, "INVALID_SENDER");
        require(life[player1] > 0, "USER_IS_DEAD");

        if (life[player2] <= strength) {
            life[player2] = 0;
            emit Dead(player2);
        } else {
            life[player2] -= strength;
        }

        emit Hit(player1, player2, strength);
    }

    function getLife(address player) public view returns (uint) {
        return life[player];
    }
}

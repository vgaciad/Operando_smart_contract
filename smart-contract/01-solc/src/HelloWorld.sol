// SPDX-License-Identifier: Unlicense
pragma solidity >=0.7.0 <0.9.0;

contract HelloWorld {
    int hello = 0;
    address _implementation;

    constructor(address implementation) {
        _implementation = implementation;
    }

    function sayHelloWorld(uint a) public pure returns (uint) {
        return a;
    }

    function sayHelloWorld2() public payable {
        hello++;
    }
}

// SPDX-License-Identifier: Unlicense
pragma solidity >=0.7.0 <0.9.0;

contract HelloWorld {
    int value = 0;

    function set(int a) public {
        value = a;
    }

    function get() public view returns (int) {
        return value;
    }
}

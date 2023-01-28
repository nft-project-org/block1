// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract UserList {
    uint256 public userCount = 0;

    struct User {
        uint256 id;
        string walletAddr;
        uint256 balance;
    }

    mapping(uint256 => User) public users;

    constructor() {
        addUser("0xdeadbeef", 0);
    }

    function addUser(string memory _walletAddr, uint256 _balance) public {
        userCount++;
        users[userCount] = User(userCount, _walletAddr, _balance);
    }
}

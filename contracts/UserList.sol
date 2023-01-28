// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract UserList {
    uint256 public userCount = 0;

    struct User {
        uint256 id;
        string walletAddr;
    }

    mapping(uint256 => User) public users;

    constructor() {
        // add dummy user
        addUser("0xdeadbeef");
    }

    function addUser(string memory _walletAddr) public {
        userCount++;
        users[userCount] = User(userCount, _walletAddr);
    }
}

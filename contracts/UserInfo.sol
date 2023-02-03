// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract UserInfo {
    uint256 public userCount = 0;

    struct User {
        address walletAddr;
        address[] ownedNfts;
        address[] boughtNfts;
    }

    mapping(address => User) public users;

    constructor() {}

    function getUserDetails(address _walletAddr)
        public
        view
        returns (User memory)
    {
        return users[_walletAddr];
    }

    function addUser(address _walletAddr) public {
        // init user data with empty nft arrays
        address[] memory nftArr = new address[](0);
        users[_walletAddr] = User(_walletAddr, nftArr, nftArr);
        userCount++;
    }

    function addOwnedNft(address _userAddr, address _nftAddr) public {
        User storage user = users[_userAddr];
        user.ownedNfts.push(_nftAddr);
    }

    function addBoughtNft(address _userAddr, address _nftAddr) public {
        User storage user = users[_userAddr];
        user.boughtNfts.push(_nftAddr);
    }
}

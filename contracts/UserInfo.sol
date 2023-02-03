// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract UserInfo {
    uint256 public userCount = 0;

    struct User {
        address walletAddr;
        // store token id's
        uint256[] ownedNfts;
        uint256[] listedNfts;
        uint256[] boughtNfts;
        uint256[] favoritedNfts;
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
        // init user data with empty arrays
        uint256[] memory tokenArr = new uint256[](0);
        users[_walletAddr] = User(
            _walletAddr,
            tokenArr,
            tokenArr,
            tokenArr,
            tokenArr
        );
        userCount++;
    }

    function addOwnedNft(address _userAddr, uint256 _tokenId) public {
        User storage user = users[_userAddr];
        user.ownedNfts.push(_tokenId);
    }

    function addListedNft(address _userAddr, uint256 _tokenId) public {
        User storage user = users[_userAddr];
        user.listedNfts.push(_tokenId);
    }

    function addBoughtNft(address _userAddr, uint256 _tokenId) public {
        User storage user = users[_userAddr];
        user.boughtNfts.push(_tokenId);
    }

    function addFavoritedNft(address _userAddr, uint256 _tokenId) public {
        User storage user = users[_userAddr];
        user.favoritedNfts.push(_tokenId);
    }
}

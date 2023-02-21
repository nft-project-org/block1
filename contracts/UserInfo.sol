// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

library UserInfo {
    struct User {
        address walletAddr;
        uint256[] ownedNfts;
        uint256[] listedNfts;
        uint256[] boughtNfts;
        uint256[] favoritedNfts;
    }

    function addUser(
        mapping(address => User) storage users,
        address _walletAddr
    ) public {
        uint256[] memory tokenArr = new uint256[](0);
        users[_walletAddr] = User(
            _walletAddr,
            tokenArr,
            tokenArr,
            tokenArr,
            tokenArr
        );
    }

    function getUserDetails(
        mapping(address => User) storage users,
        address _walletAddr
    ) public view returns (User memory) {
        return users[_walletAddr];
    }

    function addOwnedNft(
        mapping(address => User) storage users,
        address _walletAddr,
        uint256 _tokenId
    ) public {
        users[_walletAddr].ownedNfts.push(_tokenId);
    }

    function addListedNft(
        mapping(address => User) storage users,
        address _walletAddr,
        uint256 _tokenId
    ) public {
        users[_walletAddr].listedNfts.push(_tokenId);
    }

    function addBoughtNft(
        mapping(address => User) storage users,
        address _walletAddr,
        uint256 _tokenId
    ) public {
        users[_walletAddr].boughtNfts.push(_tokenId);
    }

    function addFavoritedNft(
        mapping(address => User) storage users,
        address _walletAddr,
        uint256 _tokenId
    ) public {
        users[_walletAddr].favoritedNfts.push(_tokenId);
    }
}

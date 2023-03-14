// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

library NFTStorage {
    struct NftItem {
        uint256 tokenId;
        string uri;
        uint256 price;
        // creator and owner are not same. creator someone who minted. creator does not change
        address owner;
        address creator;
        // is nft listed for sale
        bool isListed;
    }

    function addNftToStorage(
        mapping(uint256 => NftItem) storage nftItems,
        NftItem memory nftItem,
        uint256 _tokenCounter
    ) public {
        uint256 tokenId = _tokenCounter;
        nftItem.tokenId = tokenId;
        nftItems[tokenId] = nftItem;
    }

    function changeNftOwner(
        mapping(uint256 => NftItem) storage nftItems,
        uint256 _tokenId,
        address _walletAddr
    ) public {
        nftItems[_tokenId].owner = _walletAddr;
    }

    function getNftItem(
        mapping(uint256 => NftItem) storage nftItems,
        uint256 _tokenId
    ) public view returns (NftItem memory) {
        return nftItems[_tokenId];
    }

    function getAllNftItems(
        mapping(uint256 => NftItem) storage nftItems,
        uint256 _nftItemCount
    ) external view returns (NftItem[] memory) {
        uint256 totalItems = _nftItemCount;
        NftItem[] memory allNfts = new NftItem[](totalItems);

        for (uint256 i = 0; i < totalItems; i++) {
            allNfts[i] = nftItems[i];
        }
        return allNfts;
    }

    // get all nft items linked to a single user
    function getAllUsersNftItems(
        mapping(uint256 => NftItem) storage nftItems,
        address _walletAddr,
        uint256 _nftItemCount
    ) external view returns (NftItem[] memory) {
        uint256 totalItems = _nftItemCount;
        NftItem[] memory allNfts = new NftItem[](totalItems);

        for (uint256 i = 0; i < totalItems; i++) {
            if (nftItems[i].owner == _walletAddr) {
                allNfts[i] = nftItems[i];
            }
        }
        return allNfts;
    }
}

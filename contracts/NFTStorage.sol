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
        mapping(uint256 => NftItem) storage tokenIdToItem,
        NftItem memory nftItem
    ) public {
        uint256 id = nftItem.tokenId;
        tokenIdToItem[id] = nftItem;
    }

    function getNftItem(
        mapping(uint256 => NftItem) storage tokenIdToItem,
        uint256 _tokenId
    ) public view returns (NftItem memory) {
        return tokenIdToItem[_tokenId];
    }
}

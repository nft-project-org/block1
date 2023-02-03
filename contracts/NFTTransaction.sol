// SDPX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTTransaction is ERC721 {
    event NftBought(address _seller, address _buyer, uint256 _price);

    mapping(uint256 => uint256) public tokenIdToPrice;
    mapping(uint256 => address) public tokenIdToTokenAddress;

    constructor() ERC721("NFTTransaction", "NFT") {}

    function mint(address _addr, uint256 _tokenId) public {
        _mint(_addr, _tokenId);
    }

    function checkIfTokenExists(uint256 _tokenId) public view returns (bool) {
        return _exists(_tokenId);
    }

    function verifyTokenOwner(uint256 _tokenId)
        external
        view
        returns (address)
    {
        return _ownerOf(_tokenId);
    }

    function listTokenForSale(
        uint256 _tokenId,
        uint256 _price,
        address _tokenAddress
    ) external {
        require(_price > 0, "Price can't be 0!");
        tokenIdToPrice[_tokenId] = _price;
        // check if seller actually owns the token
        require(msg.sender == ownerOf(_tokenId), "Not owner of this token");
        tokenIdToPrice[_tokenId] = _price;
        tokenIdToTokenAddress[_tokenId] = _tokenAddress;
    }

    function buyToken(uint256 _tokenId) external payable {
        uint256 price = tokenIdToPrice[_tokenId];
        require(msg.value == price, "Incorrect value");

        address seller = ownerOf(_tokenId);

        _transfer(seller, msg.sender, _tokenId);
        // set price to zero (not for sale anymore)
        tokenIdToPrice[_tokenId] = 0;
        payable(seller).transfer(msg.value); // send the payment (ETH) to the seller

        emit NftBought(seller, msg.sender, msg.value);
    }
}

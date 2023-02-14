// SDPX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract NFTTransaction is ERC721URIStorage, IERC721Receiver {
    event NFTListed(
        uint256 indexed _tokenId,
        uint256 _price,
        address indexed _lister
    );
    event NFTUnlisted(uint256 indexed _tokenId, address indexed _lister);
    event NftBought(address _seller, address _buyer, uint256 _price);

    // store token information here
    mapping(uint256 => address) public tokenIdToOwner;
    mapping(uint256 => uint256) public tokenIdToPrice;
    mapping(uint256 => string) public tokenIdToURI;
    uint256 tokenID = 1;

    constructor() ERC721("NFTTransaction", "NFT") {}

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    function createToken(uint256 _tokenId, string memory _uri) public {
        _safeMint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, _uri);
        // should use this id instead, but this would return receipt instead of value???
        tokenID++;
    }

    function checkIfTokenExists(uint256 _tokenId) public view returns (bool) {
        return _exists(_tokenId);
    }

    function getTokenOwner(uint256 _tokenId) external view returns (address) {
        return _ownerOf(_tokenId);
    }

    function getBalance(address _walletAddr) public view returns (uint256) {
        return _walletAddr.balance;
    }

    function approveToken(address _addr, uint256 _tokenId) public {
        approve(_addr, _tokenId);
    }

    function listTokenForSale(
        uint256 _tokenId,
        uint256 _price,
        string memory _tokenURI
    ) external {
        require(_price > 0, "Price can't be 0!");
        // check if seller actually owns the token
        require(msg.sender == ownerOf(_tokenId), "Not owner of this token");

        // TODO should the ownership be transferred to contract or not?
        // can be transferred to contract in test using using instance.address as contract address
        // but not back from contract, because instance.address is not valid when calling it via from:

        // transfer ownership of token to contract
        // safeTransferFrom(msg.sender, address(this), _tokenId);

        // save token information
        tokenIdToOwner[_tokenId] = msg.sender;
        tokenIdToPrice[_tokenId] = _price;
        tokenIdToURI[_tokenId] = _tokenURI;

        emit NFTListed(_tokenId, _price, msg.sender);
    }

    function unlistToken(uint256 _tokenId) public {
        // Check if person trying to unlist the NFT is the owner of the NFT
        address owner = tokenIdToOwner[_tokenId];
        require(msg.sender == owner, "You are not the owner of this NFT.");

        // transfer NFT ownership back to the original owner
        safeTransferFrom(address(this), msg.sender, _tokenId);

        // delete stored token info
        delete tokenIdToOwner[_tokenId];

        // Emit the NFTUnlisted event
        emit NFTUnlisted(_tokenId, msg.sender);
    }

    function buyToken(uint256 _tokenId) external payable {
        uint256 price = tokenIdToPrice[_tokenId];
        require(price > 0, "Token not for sale");
        require(msg.value == price, "Incorrect value");
        require(msg.sender.balance >= price, "Not enough ETH for purchase!");

        // if moving the token to contract when listing is implemented,
        // then owner at this point is contract not seller
        address seller = tokenIdToOwner[_tokenId];
        require(
            seller == ownerOf(_tokenId),
            "seller is not owner of this token"
        );

        require(
            _isApprovedOrOwner(msg.sender, _tokenId),
            "Caller is not token owner or approved"
        );

        // approve needs to be called before transfer can be made (from outside of this function)
        // transfer token to buyer (from owner)
        safeTransferFrom(ownerOf(_tokenId), msg.sender, _tokenId);
        // set price to zero (not for sale anymore)
        tokenIdToPrice[_tokenId] = 0;
        // transfer the payment (ETH) to seller
        payable(seller).transfer(msg.value);

        tokenIdToOwner[_tokenId] = msg.sender;

        emit NftBought(seller, msg.sender, msg.value);
    }

    function getTokenURI(uint256 _tokenId)
        external
        view
        returns (string memory)
    {
        return tokenURI(_tokenId);
    }
}

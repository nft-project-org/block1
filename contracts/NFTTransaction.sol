// SDPX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract NFTTransaction is ERC721URIStorage, IERC721Receiver {
    event NFTListed(
        uint256 indexed _tokenId,
        uint256 _price,
        string _tokenUri,
        address indexed _lister
    );
    event NFTUnlisted(uint256 indexed _tokenId, address indexed _lister);
    event NftBought(address _seller, address _buyer, uint256 _price);

    // store token information here
    mapping(uint256 => address) public tokenIdToOwner;
    mapping(uint256 => uint256) public tokenIdToPrice;
    mapping(uint256 => string) public tokenIdToURI;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("NFTTransaction", "NFT") {}

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    function createToken(string memory _uri) public {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _uri);
    }

    function checkIfTokenExists(uint256 _tokenId) public view returns (bool) {
        return _exists(_tokenId);
    }

    function getTokenOwner(uint256 _tokenId) external view returns (address) {
        return tokenIdToOwner[_tokenId];
    }

    function getBalance(address _walletAddr) public view returns (uint256) {
        return _walletAddr.balance;
    }

    function createAndListToken(uint256 _price, string memory _tokenUri)
        public
    {
        require(_price > 0, "Price can't be 0!");

        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenUri);

        // transfer ownership of token to contract
        _transfer(msg.sender, address(this), tokenId);

        // save token information
        tokenIdToOwner[tokenId] = msg.sender;
        tokenIdToPrice[tokenId] = _price;
        tokenIdToURI[tokenId] = _tokenUri;

        emit NFTListed(tokenId, _price, _tokenUri, msg.sender);
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

        // seller is the one who deposited the token originally
        address seller = tokenIdToOwner[_tokenId];

        // Actually transfer the token to the new owner
        _transfer(address(this), msg.sender, _tokenId);

        approve(address(this), _tokenId);

        // set price to zero (not for sale anymore)
        tokenIdToPrice[_tokenId] = 0;
        // transfer the payment (ETH) to seller
        payable(seller).transfer(msg.value);

        tokenIdToOwner[_tokenId] = msg.sender;

        emit NftBought(seller, msg.sender, msg.value);
    }

    function getTokenUri(uint256 _tokenId)
        external
        view
        returns (string memory)
    {
        return tokenURI(_tokenId);
    }
}

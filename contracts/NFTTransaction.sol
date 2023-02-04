// SDPX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract NFTTransaction is ERC721URIStorage, Ownable {
    // -----------------------------------------------------------------------
    // These are not tested
    event NFTDeposited(uint256 indexed _tokenId, address indexed _depositor);

    mapping(uint256 => address) public tokenIdToOwner;

    function depositNFT(uint256 _tokenId) public {
        // Check if the depositor is the owner of the NFT
        require(
            msg.sender == ownerOf(_tokenId),
            "You are not the owner of this NFT."
        );
        // Add the NFT to the marketplace
        addNFTToMarketplace(_tokenId);
        // Emit the NFTDeposited event
        emit NFTDeposited(_tokenId, msg.sender);
    }

    // Function to add NFT to the marketplace
    function addNFTToMarketplace(uint256 _tokenId) internal {
        // transfer the token to contract address
        // todo should probably make sure that this is succesful somehow?
        transferFrom(msg.sender, address(this), _tokenId);

        // save the owner of the token
        tokenIdToOwner[_tokenId] = msg.sender;

        // Emit the NFTAddedToMarketplace event
        emit NFTDeposited(_tokenId, msg.sender);
    }

    event NFTUnlisted(uint256 indexed _tokenId, address indexed _depositor);

    function unlistNFT(uint256 _tokenId) public {
        // Check if person trying to unlist the NFT is the owner of the NFT
        address owner = tokenIdToOwner[_tokenId];

        require(msg.sender == owner, "You are not the owner of this NFT.");
        // Add the NFT to the marketplace
        removeNFTFromMarketPlace(_tokenId);
        // Emit the NFTDeposited event
        emit NFTDeposited(_tokenId, msg.sender);
    }

    // Function to add NFT to the marketplace
    function removeNFTFromMarketPlace(uint256 _tokenId) public onlyOwner {
        // transfer the token to contract address
        // todo should probably make sure that this is succesful somehow?
        transferFrom(address(this), msg.sender, _tokenId);

        // delete stored token info
        delete tokenIdToOwner[_tokenId];

        // Emit the NFTUnlisted event
        emit NFTUnlisted(_tokenId, msg.sender);
    }

    // TODO test above events and functions
    // -----------------------------------------------------------------------

    event NftBought(address _seller, address _buyer, uint256 _price);
    uint256 tokenID = 1;

    mapping(uint256 => uint256) public tokenIdToPrice;
    mapping(uint256 => string) public tokenIdToURI;

    constructor() ERC721("NFTTransaction", "NFT") {}

    function mint(
        address _to,
        uint256 _tokenId,
        string memory _uri
    ) public {
        _safeMint(_to, _tokenId);
        _setTokenURI(_tokenId, _uri);
    }

    function createToken(string memory _uri) public {
        mint(msg.sender, tokenID, _uri);
        tokenID++;
    }

    function checkIfTokenExists(uint256 _tokenId) public view returns (bool) {
        return _exists(_tokenId);
    }

    function getTokenOwner(uint256 _tokenId) external view returns (address) {
        return _ownerOf(_tokenId);
    }

    function getBalance(address _walletAddr) public view returns (uint256) {
        return balanceOf(_walletAddr);
    }

    function listTokenForSale(
        uint256 _tokenId,
        uint256 _price,
        string memory _tokenURI
    ) external {
        require(_price > 0, "Price can't be 0!");
        tokenIdToPrice[_tokenId] = _price;
        // check if seller actually owns the token
        require(msg.sender == ownerOf(_tokenId), "Not owner of this token");
        tokenIdToPrice[_tokenId] = _price;
        tokenIdToURI[_tokenId] = _tokenURI;
    }

    function buyToken(uint256 _tokenId) external payable {
        uint256 price = tokenIdToPrice[_tokenId];
        require(price > 0, "Token not for sale");
        require(msg.value == price, "Incorrect value");
        require(balanceOf(msg.sender) >= price, "Not enough ETH for purchase!");

        address seller = ownerOf(_tokenId);

        // transfer token to buyer
        safeTransferFrom(seller, msg.sender, _tokenId);
        // set price to zero (not for sale anymore)
        tokenIdToPrice[_tokenId] = 0;
        // transfer the payment (ETH) to seller
        payable(seller).transfer(msg.value);

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

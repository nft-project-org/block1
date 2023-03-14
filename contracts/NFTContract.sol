// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "./NFTStorage.sol";
import "./UserInfo.sol";

contract NFTContract is ERC721URIStorage, IERC721Receiver {
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

    // use functions from NFTStorage lib with this mapping
    using NFTStorage for mapping(uint256 => NFTStorage.NftItem);
    mapping(uint256 => NFTStorage.NftItem) public _nftStorage;
    // use functions from UserInfo lib with this mapping
    using UserInfo for mapping(address => UserInfo.User);
    mapping(address => UserInfo.User) public _userInfo;

    using Counters for Counters.Counter;
    // counters to track amount of tokens and users
    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _userCounter;
    // keeps track of all nft items in marketplace, not just minted tokens like above
    // probably not necessary for now now, but will be if adding a existing token without minting
    Counters.Counter private _nftItemCounter;

    constructor() ERC721("NFTContract", "NFT") {}

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    function createToken(string memory _uri) public {
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _uri);
        _tokenIdCounter.increment();
    }

    function checkIfTokenExists(uint256 _tokenId) public view returns (bool) {
        return _exists(_tokenId);
    }

    function getTokenUri(
        uint256 _tokenId
    ) external view returns (string memory) {
        return tokenURI(_tokenId);
    }

    function getTokenOwner(uint256 _tokenId) external view returns (address) {
        return tokenIdToOwner[_tokenId];
    }

    function getBalance(address _walletAddr) public view returns (uint256) {
        return _walletAddr.balance;
    }

    function createAndListToken(
        uint256 _price,
        string memory _tokenUri
    ) public {
        require(_price > 0, "Price can't be 0!");

        uint256 tokenId = _tokenIdCounter.current();
        // mint the token and set the URI to the picture address
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenUri);

        // transfer ownership of token to contract
        _transfer(msg.sender, address(this), tokenId);

        // save token information
        tokenIdToOwner[tokenId] = msg.sender;
        tokenIdToPrice[tokenId] = _price;
        tokenIdToURI[tokenId] = _tokenUri;

        // create a nft item and save it
        NFTStorage.NftItem memory nftItem;
        nftItem.tokenId = tokenId;
        nftItem.uri = _tokenUri;
        nftItem.price = _price;
        // set owner to the creator, despite actually transferring it to contract
        nftItem.owner = msg.sender;
        nftItem.creator = msg.sender;
        nftItem.isListed = true;
        addNftToStorage(nftItem);

        // update user info
        _userInfo.addListedNft(msg.sender, tokenId);

        emit NFTListed(tokenId, _price, _tokenUri, msg.sender);
        _tokenIdCounter.increment();
    }

    function unlistToken(uint256 _tokenId) public {
        // Check if person trying to unlist the NFT is the owner of the NFT
        address owner = tokenIdToOwner[_tokenId];
        require(msg.sender == owner, "You are not the owner of this NFT.");

        // transfer NFT ownership back to the original owner
        _transfer(address(this), msg.sender, _tokenId);

        // delete stored token info
        delete tokenIdToOwner[_tokenId];

        _nftStorage[_tokenId].isListed = false;

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

        _nftStorage.changeNftOwner(_tokenId, address(msg.sender));

        emit NftBought(seller, msg.sender, msg.value);
    }

    // get nft item containing details about the nft, such as owner, etc.
    function getNftItem(
        uint256 _tokenId
    ) public view returns (NFTStorage.NftItem memory) {
        return _nftStorage.getNftItem(_tokenId);
    }

    // list all nft's in storage (e.g. all nft's that were added to marketplace)
    function getAllNftItems()
        public
        view
        returns (NFTStorage.NftItem[] memory)
    {
        return _nftStorage.getAllNftItems(_nftItemCounter.current());
    }

    // list all nfts linked to a single user
    function getAllUsersNftItems(
        address _walletAddr
    ) public view returns (NFTStorage.NftItem[] memory) {
        return
            _nftStorage.getAllUsersNftItems(
                _walletAddr,
                _nftItemCounter.current()
            );
    }

    function addNftToStorage(NFTStorage.NftItem memory _nftItem) public {
        _nftStorage.addNftToStorage(_nftItem, _nftItemCounter.current());
        // keep track of nft count
        _nftItemCounter.increment();
    }

    function addUser(address _walletAddr) public {
        bool exists = _userInfo[_walletAddr].walletAddr == _walletAddr;

        require(exists == false, "User already exists");
        _userCounter.increment();
        _userInfo.addUser(_walletAddr);
    }

    // details include wallet address, and different arrays containing info about ownedNfts, boughtNfts, etc.
    function getUserDetails(
        address _walletAddr
    ) public view returns (UserInfo.User memory) {
        return _userInfo.getUserDetails(_walletAddr);
    }

    function getUserCount() public view returns (uint256) {
        return _userCounter.current();
    }

    function addOwnedNft(address _walletAddr, uint256 _tokenId) public {
        _userInfo.addOwnedNft(_walletAddr, _tokenId);
    }

    function addListedNft(address _walletAddr, uint256 _tokenId) public {
        _userInfo.addListedNft(_walletAddr, _tokenId);
    }

    function addBoughtNft(address _walletAddr, uint256 _tokenId) public {
        _userInfo.addBoughtNft(_walletAddr, _tokenId);
    }

    function addFavoritedNft(address _walletAddr, uint256 _tokenId) public {
        _userInfo.addFavoritedNft(_walletAddr, _tokenId);
    }
}

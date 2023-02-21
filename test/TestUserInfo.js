const NFTContract = artifacts.require("NFTContract")
const truffleAssert = require("truffle-assertions")

contract("NFTContract", function (accounts) {
  let nftContract
  const testAddr = accounts[0]

  beforeEach(async function () {
    nftContract = await NFTContract.new()
  })

  it("should increment user counter", async function () {
    const userCountBefore = (await nftContract.getUserCount()).toNumber()
    await nftContract.addUser(testAddr)
    const userCountAfter = (await nftContract.getUserCount()).toNumber()

    assert.equal(
      userCountAfter,
      userCountBefore + 1,
      "user count should be incremented by one"
    )
  })

  it("should fail when adding user that already exists", async function () {
    await nftContract.addUser(testAddr)
    const userCountBefore = (await nftContract.getUserCount()).toNumber()

    await truffleAssert.reverts(
      nftContract.addUser(testAddr),
      "User already exists"
    )

    const userCountAfter = (await nftContract.getUserCount()).toNumber()
    assert.equal(
      userCountAfter,
      userCountBefore,
      "user count should not be incremented"
    )
  })

  it("new user's address should be correctly set", async function () {
    await nftContract.addUser(testAddr)
    const newUser = await nftContract.getUserDetails(testAddr)
    console.log("new user: ", newUser)
    const newUserWalletAddr = newUser.walletAddr
    assert.equal(
      newUserWalletAddr,
      testAddr,
      "user at this index should have the same wallet address as the added user"
    )
  })

  it("should add a new nft token", async function () {
    let newUser = await nftContract.getUserDetails(testAddr)
    console.log(newUser)
    let ownedNftArr = newUser.ownedNfts
    let listedNftArr = newUser.listedNfts
    let boughtNftArr = newUser.boughtNfts
    let favoritedNftArr = newUser.favoritedNfts
    assert.equal(ownedNftArr.length, 0)
    assert.equal(listedNftArr.length, 0)
    assert.equal(boughtNftArr.length, 0)
    assert.equal(favoritedNftArr.length, 0)

    const testTokenId = 123
    await nftContract.addOwnedNft(testAddr, testTokenId)
    await nftContract.addListedNft(testAddr, testTokenId)
    await nftContract.addBoughtNft(testAddr, testTokenId)
    await nftContract.addFavoritedNft(testAddr, testTokenId)

    newUser = await nftContract.getUserDetails(testAddr)

    ownedNftArr = newUser.ownedNfts
    listedNftArr = newUser.listedNfts
    boughtNftArr = newUser.boughtNfts
    favoritedNftArr = newUser.favoritedNfts

    // check that length is incremented by one
    assert.equal(ownedNftArr.length, 1)
    assert.equal(listedNftArr.length, 1)
    assert.equal(boughtNftArr.length, 1)
    assert.equal(favoritedNftArr.length, 1)
    // check that token in array index 0 is the token that was added
    assert.equal(ownedNftArr[0], testTokenId)
    assert.equal(listedNftArr[0], testTokenId)
    assert.equal(boughtNftArr[0], testTokenId)
    assert.equal(favoritedNftArr[0], testTokenId)
  })
})

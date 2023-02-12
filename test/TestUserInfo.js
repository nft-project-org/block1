const UserInfo = artifacts.require("UserInfo")

contract("UserInfo", function (accounts) {
  let userInfo
  const testAddr = accounts[0]

  beforeEach(async function () {
    userInfo = await UserInfo.deployed()
  })

  it("should increment user counter", async function () {
    const userCountBefore = (await userInfo.userCount()).toNumber()
    await userInfo.addUser(testAddr)
    await userInfo.addUser(testAddr)
    await userInfo.addUser(testAddr)
    await userInfo.addUser(testAddr)
    const userCountAfter = (await userInfo.userCount()).toNumber()

    assert.equal(
      userCountAfter,
      userCountBefore + 4,
      "user count should be incremented by one"
    )
  })

  it("new user's address should be correctly set", async function () {
    const newUser = await userInfo.getUserDetails(testAddr)
    const newUserWalletAddr = newUser.walletAddr
    assert.equal(
      newUserWalletAddr,
      testAddr,
      "user at this index should have the same wallet address as the added user"
    )
  })

  it("should add a new nft token", async function () {
    await userInfo.addUser(testAddr)
    let newUser = await userInfo.getUserDetails(testAddr)
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
    await userInfo.addOwnedNft(testAddr, testTokenId)
    await userInfo.addListedNft(testAddr, testTokenId)
    await userInfo.addBoughtNft(testAddr, testTokenId)
    await userInfo.addFavoritedNft(testAddr, testTokenId)

    newUser = await userInfo.getUserDetails(testAddr)

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

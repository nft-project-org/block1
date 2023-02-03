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
    const userCountAfter = (await userInfo.userCount()).toNumber()

    assert.equal(
      userCountAfter,
      userCountBefore + 1,
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

  it("should add a new nft address", async function () {
    let newUser = await userInfo.getUserDetails(testAddr)

    let ownedNftArr = newUser.ownedNfts
    let boughtNftArr = newUser.boughtNfts
    assert.equal(ownedNftArr.length, 0)
    assert.equal(boughtNftArr.length, 0)

    const testNftAddr = "0x0fe636811E78A83E9B4e2e78f1f3ec4e87c4dA61"
    await userInfo.addOwnedNft(testAddr, testNftAddr)
    await userInfo.addBoughtNft(testAddr, testNftAddr)

    newUser = await userInfo.getUserDetails(testAddr)

    ownedNftArr = newUser.ownedNfts
    boughtNftArr = newUser.boughtNfts
    assert.equal(ownedNftArr.length, 1)
    assert.equal(ownedNftArr.length, 1)
    assert.equal(boughtNftArr[0], testNftAddr)
    assert.equal(boughtNftArr[0], testNftAddr)
  })
})

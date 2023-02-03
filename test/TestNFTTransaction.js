const { expect } = require("chai")
const truffleAssert = require("truffle-assertions")
const { BN } = require("openzeppelin-test-helpers")

const NFTTransaction = artifacts.require("NFTTransaction")

contract("NFTTransaction", function (accounts) {
  let nftTransaction

  beforeEach(async function () {
    nftTransaction = await NFTTransaction.new()
  })

  describe("checkIfTokenExists", function () {
    it("should return false for non-existing tokens", async function () {
      const tokenId = new BN("123456789")
      expect(await nftTransaction.checkIfTokenExists(tokenId)).to.equal(false)
    })
  })

  describe("check token owner", function () {
    it("should return the owner of a token", async function () {
      const tokenId = new BN("123456789")
      await nftTransaction.mint(accounts[0], tokenId, "testUri")
      expect(await nftTransaction.getTokenOwner(tokenId)).to.equal(accounts[0])
    })
  })

  it("lists a token for sale", async () => {
    const instance = await NFTTransaction.deployed()

    const tokenId = 1
    const price = 100
    const tokenAddress = accounts[0]

    await instance.mint(accounts[0], tokenId, "testUri")
    await instance.listTokenForSale(tokenId, price, tokenAddress)

    const result = await instance.tokenIdToPrice(tokenId)
    assert.equal(
      result.toNumber(),
      price,
      "Token price should be equal to the listed price"
    )
  })

  it("buys a token", async () => {
    const instance = await NFTTransaction.deployed()
    const tokenId = 123
    await instance.mint(accounts[0], tokenId, "testUri")
    await instance.listTokenForSale(1, 100, accounts[0])

    const result = await instance.buyToken(1, { from: accounts[1], value: 100 })

    truffleAssert.eventEmitted(result, "NftBought", (ev) => {
      return (
        ev._seller === accounts[0] &&
        ev._buyer === accounts[1] &&
        ev._price.toNumber() === 100
      )
    })

    const owner = await instance.getTokenOwner(1)
    assert.equal(owner, accounts[1], "Token ownership not transferred")

    const price = await instance.tokenIdToPrice(1)
    assert.equal(price.toNumber(), 0, "Price not set to 0 after sale")
  })

  it("should revert if the price paid by the buyer is incorrect", async () => {
    const instance = await NFTTransaction.deployed()
    const tokenId = 456
    // Mint a token
    await instance.mint(accounts[0], tokenId, "testUri")
    // List the token for sale
    await instance.listTokenForSale(
      tokenId,
      100,
      "0x0000000000000000000000000000000000000000"
    )

    // Try to buy the token with incorrect price
    await truffleAssert.reverts(
      instance.buyToken(1, { from: accounts[1], value: 50 }),
      "Incorrect value"
    )
  })

  it("gets token URI", async () => {
    const instance = await NFTTransaction.deployed()
    const tokenId = 666
    const testUri = "testUri"
    await instance.mint(accounts[0], tokenId, "testUri")
    const expectedUri = await instance.getTokenURI(tokenId)

    assert.equal(testUri, expectedUri)
  })
})

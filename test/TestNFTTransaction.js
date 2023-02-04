const NFTTransaction = artifacts.require("NFTTransaction")
const { expect } = require("chai")
const truffleAssert = require("truffle-assertions")
const { BN } = require("openzeppelin-test-helpers")

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
    const tokenPrice = 10

    // mint the token first
    await instance.mint(accounts[0], tokenId, "testUri")
    await instance.listTokenForSale(tokenId, tokenPrice, accounts[0])

    // -------------
    // cant test this properly since initial balance is 0 in this instance
    // -------------

    // how to send funds for testing????
    let buyerBalance = await instance.getBalance(accounts[1])
    assert.isAtLeast(parseInt(buyerBalance), tokenPrice)

    const result = await instance.buyToken(tokenId, {
      from: accounts[1],
      value: tokenPrice,
    })

    // nft bought event emitted
    truffleAssert.eventEmitted(result, "NftBought", (ev) => {
      return (
        ev._seller === accounts[0] &&
        ev._buyer === accounts[1] &&
        ev._price.toNumber() === tokenPrice
      )
    })

    const owner = await instance.getTokenOwner(tokenId)
    assert.equal(owner, accounts[1], "Token ownership transferred")

    const tokenPriceAfter = await instance.tokenIdToPrice(tokenId)
    assert.equal(tokenPriceAfter.toNumber(), 0, "Price set to 0 after sale")
  })

  it("should revert if buyer has insufficient funds", async () => {
    const instance = await NFTTransaction.deployed()
    const tokenId = 69
    const tokenPrice = 10

    // mint the token first
    await instance.mint(accounts[0], tokenId, "testUri")
    await instance.listTokenForSale(tokenId, tokenPrice, accounts[0])

    const buyerBalance = await instance.getBalance(accounts[1])
    assert.isBelow(parseInt(buyerBalance), tokenPrice)

    await truffleAssert.reverts(
      instance.buyToken(tokenId, { from: accounts[1], value: tokenPrice }),
      "Not enough ETH for purchase!"
    )
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

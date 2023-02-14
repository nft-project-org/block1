const NFTTransaction = artifacts.require("NFTTransaction")
const { expect } = require("chai")
const truffleAssert = require("truffle-assertions")
const { BN } = require("openzeppelin-test-helpers")
const web3 = require("web3")

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
      const instance = await NFTTransaction.deployed()
      const tokenId = 420
      const tokenURI = "testURI"
      await instance.createToken(tokenId, tokenURI, {
        from: accounts[0],
      })
      expect(await instance.getTokenOwner(tokenId)).to.equal(accounts[0])
    })
  })

  it("lists a token for sale", async () => {
    const instance = await NFTTransaction.deployed()
    const price = 100
    const tokenURI = "testURI"
    const tokenId = 123456

    await instance.createToken(tokenId, tokenURI, {
      from: accounts[0],
    })

    await instance.listTokenForSale(tokenId, price, tokenURI, {
      from: accounts[0],
    })

    // check if the token is listed for sale
    const owner = await instance.ownerOf(tokenId)
    assert.equal(owner, accounts[0])

    const listedPrice = await instance.tokenIdToPrice(tokenId)
    assert.equal(listedPrice, price)

    const listedURI = await instance.tokenIdToURI(tokenId)
    assert.equal(listedURI, tokenURI)
  })

  it("buys a token", async () => {
    const instance = await NFTTransaction.deployed()
    const tokenId = 123
    const price = 10
    const tokenURI = "testURI"

    // mint the token first
    await instance.createToken(tokenId, tokenURI, {
      from: accounts[0],
    })

    await instance.listTokenForSale(tokenId, price, tokenURI, {
      from: accounts[0],
    })

    let buyerBalance = await instance.getBalance(accounts[1])
    buyerBalance = web3.utils.fromWei(buyerBalance, "ether")
    assert.isAtLeast(parseInt(buyerBalance), price)

    // approve the buyer to buy the token from contract
    // let tokenOwner = await instance.getTokenOwner(tokenId)
    await instance.approve(accounts[1], tokenId, {
      from: accounts[0],
    })
    const result = await instance.buyToken(tokenId, {
      from: accounts[1],
      value: price,
    })

    // nft bought event emitted
    truffleAssert.eventEmitted(result, "NftBought", (ev) => {
      return (
        ev._seller === accounts[0] &&
        ev._buyer === accounts[1] &&
        ev._price.toNumber() === price
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
    const tokenURI = "testURI"

    let buyerBalance = await instance.getBalance(accounts[1])
    buyerBalance = web3.utils.fromWei(buyerBalance, "ether")
    let price = parseInt(buyerBalance) + 100
    expect(parseInt(buyerBalance)).to.not.be.at.least(price)

    // mint the token first
    await instance.createToken(tokenId, tokenURI, {
      from: accounts[0],
    })
    await instance.listTokenForSale(tokenId, price, tokenURI, {
      from: accounts[0],
    })

    // approve the buyer to buy the token from contract
    await instance.approve(accounts[1], tokenId, {
      from: accounts[0],
    })

    // TODO why is this not failing???
    await truffleAssert.reverts(
      instance.buyToken(tokenId, { from: accounts[1], value: price }),
      "Not enough ETH for purchase!"
    )
  })

  it("should revert if the price paid by the buyer is incorrect", async () => {
    const instance = await NFTTransaction.deployed()
    const tokenId = 456
    const tokenURI = "testURI"
    const price = 10
    // Mint a token
    await instance.createToken(tokenId, tokenURI, {
      from: accounts[0],
    })
    // List the token for sale
    await instance.listTokenForSale(tokenId, price, tokenURI, {
      from: accounts[0],
    })

    // Try to buy the token with incorrect price
    await truffleAssert.reverts(
      instance.buyToken(tokenId, { from: accounts[1], value: 50 }),
      "Incorrect value"
    )
  })

  it("gets token URI", async () => {
    const instance = await NFTTransaction.deployed()
    const tokenId = 666
    const tokenURI = "testUri"
    await instance.createToken(tokenId, tokenURI, {
      from: accounts[0],
    })
    const expectedUri = await instance.getTokenURI(tokenId)

    assert.equal(tokenURI, expectedUri)
  })
})

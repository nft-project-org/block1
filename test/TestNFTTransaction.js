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

  it("lists a token for sale", async () => {
    const instance = await NFTTransaction.deployed()
    const price = 100
    const tokenUri = "testURI"

    const tx = await instance.createAndListToken(price, tokenUri, {
      from: accounts[0],
    })

    // Check that the NftListed event was emitted
    let tokenId = 0
    let listedPrice = ""
    let lister = ""
    truffleAssert.eventEmitted(
      tx,
      "NFTListed",
      (ev) => {
        tokenId = ev._tokenId
        listedPrice = ev._price
        lister = ev._lister
        return (
          ev._lister === accounts[0] &&
          ev._tokenUri === tokenUri &&
          ev._price.toNumber() === price
        )
      },
      "NftListed event should have been emitted with the correct values"
    )

    // Check that listing was successful
    // ownership should be transferred to contract addresßs
    const owner = await instance.ownerOf(tokenId)
    assert.equal(owner, instance.address)
    assert.equal(lister, accounts[0])
    assert.equal(listedPrice, price)
    const listedUri = await instance.tokenIdToURI(tokenId)
    assert.equal(listedUri, tokenUri)
  })

  it("buys a token", async () => {
    const instance = await NFTTransaction.deployed()
    const price = 10
    const tokenUri = "testURI"

    const tx = await instance.createAndListToken(price, tokenUri, {
      from: accounts[0],
    })

    let tokenId = 0
    truffleAssert.eventEmitted(
      tx,
      "NFTListed",
      (ev) => {
        tokenId = ev._tokenId
        return (
          ev._lister === accounts[0] &&
          ev._tokenUri === tokenUri &&
          ev._price.toNumber() === price
        )
      },
      "NftListed event should have been emitted with the correct values"
    )

    let buyerBalance = await instance.getBalance(accounts[1])
    buyerBalance = web3.utils.fromWei(buyerBalance, "ether")
    assert.isAtLeast(parseInt(buyerBalance), price)

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
    const tokenUri = "testURI"

    let buyerBalance = await instance.getBalance(accounts[1])
    buyerBalance = web3.utils.fromWei(buyerBalance, "ether")
    let price = parseInt(buyerBalance) + 100
    expect(parseInt(buyerBalance)).to.not.be.at.least(price)

    const tx = await instance.createAndListToken(price, tokenUri, {
      from: accounts[0],
    })

    let tokenId = 0
    truffleAssert.eventEmitted(
      tx,
      "NFTListed",
      (ev) => {
        tokenId = ev._tokenId
        return (
          ev._lister === accounts[0] &&
          ev._tokenUri === tokenUri &&
          ev._price.toNumber() === price
        )
      },
      "NftListed event should have been emitted with the correct values"
    )

    // TODO why is this not failing???
    await truffleAssert.reverts(
      instance.buyToken(tokenId, { from: accounts[1], value: price }),
      "Not enough ETH for purchase!"
    )
  })

  it("should revert if the price paid by the buyer is incorrect", async () => {
    const instance = await NFTTransaction.deployed()
    const tokenUri = "testURI"
    const price = 10

    // List the token for sale
    const tx = await instance.createAndListToken(price, tokenUri, {
      from: accounts[0],
    })

    let tokenId = 0
    truffleAssert.eventEmitted(
      tx,
      "NFTListed",
      (ev) => {
        tokenId = ev._tokenId
        return (
          ev._lister === accounts[0] &&
          ev._tokenUri === tokenUri &&
          ev._price.toNumber() === price
        )
      },
      "NftListed event should have been emitted with the correct values"
    )

    // Try to buy the token with incorrect price
    await truffleAssert.reverts(
      instance.buyToken(tokenId, { from: accounts[1], value: 50 }),
      "Incorrect value"
    )
  })

  it("gets token URI", async () => {
    const instance = await NFTTransaction.deployed()
    const tokenUri = "testUri"
    const price = 10
    const tx = await instance.createAndListToken(price, tokenUri, {
      from: accounts[0],
    })

    let tokenId = 0
    truffleAssert.eventEmitted(
      tx,
      "NFTListed",
      (ev) => {
        tokenId = ev._tokenId
        return (
          ev._lister === accounts[0] &&
          ev._tokenUri === tokenUri &&
          ev._price.toNumber() === price
        )
      },
      "NftListed event should have been emitted with the correct values"
    )
    const expectedUri = await instance.getTokenUri(tokenId)

    assert.equal(tokenUri, expectedUri)
  })
})

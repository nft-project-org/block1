const NFTStorage = artifacts.require("NFTStorage")

contract("NFTStorage", function (accounts) {
  let nftStorage

  beforeEach(async function () {
    nftStorage = await NFTStorage.deployed()
  })

  it("should add new nft item", async function () {
    const testTokenId = 123
    const uri = "myImageUrl"
    const price = 100
    const owner = "0xe9c15b62fefe3a71350e544a0c8c20320b58f10d"
    const creator = "0xe9c15b62fefe3a71350e544a0c8c20320b58f10d"
    const isListed = false

    await nftStorage.addNftToStorage({
      tokenId: testTokenId,
      uri: uri,
      price: price,
      owner: owner,
      creator: creator,
      isListed: isListed,
    })

    let nftItem = await nftStorage.getNftDetails(testTokenId)

    assert.equal(nftItem.tokenId, testTokenId)
    assert.equal(nftItem.uri, uri)
    assert.equal(nftItem.price, price)
    assert.equal(nftItem.owner.toLowerCase(), owner.toLowerCase())
    assert.equal(nftItem.creator.toLowerCase(), creator.toLowerCase())
    assert.equal(nftItem.isListed, isListed)
  })
})

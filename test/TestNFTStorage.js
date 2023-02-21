const NFTStorage = artifacts.require("NFTContract")

contract("NFTStorage", function (accounts) {
  let nftStorage

  beforeEach(async function () {
    nftStorage = await NFTStorage.deployed()
  })

  it("should add new nft item", async function () {
    const testTokenId = 0
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

    const nftItem = await nftStorage.getNftItem(testTokenId)

    assert.equal(nftItem.tokenId, testTokenId)
    assert.equal(nftItem.uri, uri)
    assert.equal(nftItem.price, price)
    assert.equal(nftItem.owner.toLowerCase(), owner.toLowerCase())
    assert.equal(nftItem.creator.toLowerCase(), creator.toLowerCase())
    assert.equal(nftItem.isListed, isListed)
  })

  it("should return all NFT items in the correct order", async () => {
    // Create some NFT items and add them to the storage
    const totalItems = 5
    for (let i = 1; i <= totalItems; i++) {
      const nftItem = {
        tokenId: i,
        uri: "testUri",
        price: i * 100,
        owner: accounts[i % 3], // Assign the item to one of the first three accounts
        creator: accounts[0], // The first account is the creator
        isListed: true,
      }
      await nftStorage.addNftToStorage(nftItem)
    }

    // Call the getAllNftItems() function and check the returned NFT items
    const nftItems = await nftStorage.getAllNftItems()
    console.log("Nft items ", nftItems)
    assert.equal(
      nftItems.length - 1, // ignore 1 item added in previous test case
      totalItems,
      "Incorrect number of NFT items returned"
    )

    for (let i = 1; i <= totalItems; i++) {
      console.log("i is", 1, "and id is", nftItems[i].tokenId)
      assert.equal(nftItems[i].tokenId, i, "Incorrect NFT item token ID")
      assert.equal(nftItems[i].uri, "testUri", "Incorrect NFT item URI")
      assert.equal(nftItems[i].price, i * 100, "Incorrect NFT item price")
      assert.equal(
        nftItems[i].owner,
        accounts[i % 3],
        "Incorrect NFT item owner"
      )
      assert.equal(
        nftItems[i].creator,
        accounts[0],
        "Incorrect NFT item creator"
      )
      assert.equal(
        nftItems[i].isListed,
        true,
        "Incorrect NFT item isListed value"
      )
    }
  })

  it("should return all NFT items linked to user", async () => {
    // Create some NFT items and add them to the storage
    const totalItems = 5
    for (let i = 1; i <= totalItems; i++) {
      const nftItem = {
        tokenId: i,
        uri: "testUri",
        price: i * 100,
        owner: accounts[0], // Assign the item to one of the first three accounts
        creator: accounts[0], // The first account is the creator
        isListed: true,
      }
      await nftStorage.addNftToStorage(nftItem)
    }

    const nftItems = await nftStorage.getAllUsersNftItems(accounts[0])
    console.log("Nft items ", nftItems)
    assert.equal(
      nftItems.length - 6, // ignore items added in previous test cases
      totalItems,
      "Incorrect number of NFT items returned"
    )

    for (let i = 6; i <= totalItems; i++) {
      assert.equal(nftItems[i].tokenId, i, "Incorrect NFT item token ID")
      assert.equal(nftItems[i].uri, "testUri", "Incorrect NFT item URI")
      assert.equal(nftItems[i].price, i * 100, "Incorrect NFT item price")
      assert.equal(nftItems[i].owner, accounts[0], "Incorrect NFT item owner")
      assert.equal(
        nftItems[i].creator,
        accounts[0],
        "Incorrect NFT item creator"
      )
      assert.equal(
        nftItems[i].isListed,
        true,
        "Incorrect NFT item isListed value"
      )
    }
  })
})

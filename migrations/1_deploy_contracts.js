const UserInfo = artifacts.require("./UserInfo.sol")
const NFTStorage = artifacts.require("./NFTStorage.sol")
const NFTTransaction = artifacts.require("./NFTTransaction.sol")

module.exports = function (deployer) {
  deployer.deploy(UserInfo)
  deployer.deploy(NFTStorage)
  deployer.deploy(NFTTransaction)
}

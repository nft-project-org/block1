const UserInfo = artifacts.require("./UserInfo.sol")
const NFTStorage = artifacts.require("./NFTStorage.sol")
const NFTContract = artifacts.require("./NFTContract.sol")

// deploy the contract and link the libraries to the contract
module.exports = function (deployer) {
  deployer
    .deploy(NFTStorage)
    .then(() => {
      return deployer.deploy(UserInfo)
    })
    .then(() => {
      deployer.link(NFTStorage, NFTContract)
      deployer.link(UserInfo, NFTContract)
      return deployer.deploy(NFTContract)
    })
}

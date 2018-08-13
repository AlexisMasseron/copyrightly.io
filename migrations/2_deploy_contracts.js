const Registry = artifacts.require("./Registry.sol");
const Proxy = artifacts.require("./AdminUpgradeabilityProxy.sol");

module.exports = async function (deployer, network, accounts) {
  deployer.deploy(Registry).then(function (registry) {
    return deployer.deploy(Proxy, registry.address)
  })
};

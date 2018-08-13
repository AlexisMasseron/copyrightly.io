const Registry = artifacts.require("./Registry.sol");
const Proxy = artifacts.require("./AdminUpgradeabilityProxy.sol");

module.exports = async function (deployer, network, accounts) {
  Proxy.deployed().then(function (proxy) {
    return deployer.deploy(Registry).then(function (registry) {
      proxy.upgradeTo(registry.address)
    });
  });
};

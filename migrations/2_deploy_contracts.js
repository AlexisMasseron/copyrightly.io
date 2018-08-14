const Registry = artifacts.require("./Registry.sol");
const Proxy = artifacts.require("./AdminUpgradeabilityProxy.sol");

module.exports = function (deployer, network, accounts) {
  const owner = accounts[0];
  const proxyAdmin = accounts[1];

  deployer.deploy(Registry, {from: owner}).then(function (registry) {
    return deployer.deploy(Proxy, registry.address, {from: proxyAdmin});
  }).then(function (proxy) {
    Registry.at(proxy.address).then(function (proxiedRegistry) {
      return proxiedRegistry.initialize(owner);
    });
  });
};

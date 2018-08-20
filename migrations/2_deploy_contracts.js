const Manifestations = artifacts.require("./Manifestations.sol");
const Proxy = artifacts.require("./AdminUpgradeabilityProxy.sol");

module.exports = function (deployer, network, accounts) {
  const owner = accounts[0];
  const proxyAdmin = accounts[1];

  deployer.deploy(Manifestations, {from: owner}).then(function (manifestations) {
    return deployer.deploy(Proxy, manifestations.address, {from: proxyAdmin});
  }).then(function (proxy) {
    Manifestations.at(proxy.address).then(function (proxiedRegistry) {
      return proxiedRegistry.initialize(owner);
    });
  });
};

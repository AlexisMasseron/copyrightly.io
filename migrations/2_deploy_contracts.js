const Manifestations = artifacts.require("./Manifestations.sol");
const ExpirableLib = artifacts.require("./ExpirableLib.sol");
const Proxy = artifacts.require("./AdminUpgradeabilityProxy.sol");

module.exports = function (deployer, network, accounts) {
  const owner = accounts[0];
  const proxyAdmin = accounts[1];
  const timeToExpiry = 60*60*24;

  deployer.deploy(ExpirableLib)
  .then(function() {
    deployer.link(ExpirableLib, [Manifestations]);
    return deployer.deploy(Manifestations, timeToExpiry, {from: owner})
  })
  .then(function (manifestations) {
    return deployer.deploy(Proxy, manifestations.address, {from: proxyAdmin});
  })
  .then(function (proxy) {
    Manifestations.at(proxy.address).then(function (proxied) {
      return proxied.initialize(owner, timeToExpiry);
    });
  });
};

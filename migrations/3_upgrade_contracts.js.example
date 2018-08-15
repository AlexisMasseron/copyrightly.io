const Registry = artifacts.require("./Registry.sol");
const Proxy = artifacts.require("./AdminUpgradeabilityProxy.sol");

module.exports = async function (deployer, network, accounts) {
  const owner = accounts[0];
  const proxyAdmin = accounts[1];

  const proxy = await Proxy.deployed();

  deployer.deploy(Registry, {from: owner}).then(function (registry) {
    return proxy.upgradeTo(registry.address, {from: proxyAdmin})
  });
};

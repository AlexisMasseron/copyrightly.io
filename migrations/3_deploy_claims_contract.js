const Proxy = artifacts.require("./AdminUpgradeabilityProxy.sol");
const Claims = artifacts.require("./Claims.sol");

module.exports = async function (deployer, network, accounts) {
  const owner = accounts[0];
  const proxy = await Proxy.deployed();

  deployer.deploy(Claims, proxy.address, {from: owner});
};

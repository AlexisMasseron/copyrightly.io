const Manifestations = artifacts.require("./Manifestations.sol");
const ExpirableLib = artifacts.require("./ExpirableLib.sol");
const Proxy = artifacts.require("./AdminUpgradeabilityProxy.sol");
const YouTubeEvicences = artifacts.require("./YouTubeEvidences.sol");

module.exports = async function(deployer, network, accounts) {
  const owner = accounts[0];
  const proxyAdmin = accounts[1];
  const timeToExpiry = 60 * 60 * 24;

  deployer.then(async () => {
    await deployer.deploy(ExpirableLib);
    await deployer.link(ExpirableLib, [Manifestations]);
    await deployer.deploy(Manifestations, timeToExpiry);
    await deployer.deploy(Proxy, Manifestations.address, {from: proxyAdmin});
    await deployer.deploy(YouTubeEvicences);

    const manifestations = await Manifestations.deployed();
    const proxy = await Proxy.deployed();
    const proxied = await Manifestations.at(proxy.address);

    return Promise.all([
      await proxied.initialize(owner, timeToExpiry)
    ]);
  });
};

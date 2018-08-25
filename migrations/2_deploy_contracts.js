const Manifestations = artifacts.require("./Manifestations.sol");
const SafeMath = artifacts.require("./SafeMath.sol");
const ExpirableLib = artifacts.require("./ExpirableLib.sol");
const Proxy = artifacts.require("./AdminUpgradeabilityProxy.sol");
const UploadableEvidences = artifacts.require("./UploadableEvidences.sol");
const YouTubeEvicences = artifacts.require("./YouTubeEvidences.sol");

module.exports = async function(deployer, network, accounts) {
  const owner = accounts[0];
  const proxyAdmin = accounts[1];
  const timeToExpiry = 60 * 60 * 24;

  deployer.then(async () => {
    await deployer.deploy(SafeMath);
    await deployer.link(SafeMath, [ExpirableLib, Manifestations]);
    await deployer.deploy(ExpirableLib);
    await deployer.link(ExpirableLib, [Manifestations]);
    await deployer.deploy(Manifestations, timeToExpiry);
    await deployer.deploy(Proxy, Manifestations.address, {from: proxyAdmin});
    await deployer.deploy(UploadableEvidences);
    await deployer.deploy(YouTubeEvicences);

    const manifestations = await Manifestations.deployed();
    const proxy = await Proxy.deployed();
    const uploadableEvidences = await UploadableEvidences.deployed();
    const youTubeEvicences = await YouTubeEvicences.deployed();
    const proxied = await Manifestations.at(proxy.address);

    return Promise.all([
      await proxied.initialize(owner, timeToExpiry),
      await proxied.addEvidenceProvider(uploadableEvidences.address),
      await proxied.addEvidenceProvider(youTubeEvicences.address)
    ]);
  });
};

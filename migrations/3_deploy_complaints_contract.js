const Proxy = artifacts.require("./AdminUpgradeabilityProxy.sol");
const Complaints = artifacts.require("./Complaints.sol");

module.exports = async function (deployer, network, accounts) {
  const owner = accounts[0];

  deployer.then(async () => {
    const proxy = await Proxy.deployed();

    return Promise.all([
      deployer.deploy(Complaints, proxy.address, {from: owner})
    ]);
  });
};

var CopyrightlyRegistry = artifacts.require("./CopyrightlyRegistry.sol");

module.exports = function(deployer) {
  deployer.deploy(CopyrightlyRegistry);
};

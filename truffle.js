/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

const HDWalletProvider = require("truffle-hdwallet-provider");
require('dotenv').config();

const fullPathBuildDirectory = `${__dirname}/src/assets/contracts`;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  contracts_build_directory: fullPathBuildDirectory,
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC,
          "https://ropsten.infura.io/" + process.env.INFURA_TOKEN, 0, 2)
      },
      network_id: 3,
      gas: 1700000,
      gasPrice: 1000000000
    }
  }
};

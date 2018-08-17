# CopyrightLY.io

Decentralized Application (ÐApp) for Copyright Management

[![Build Status](https://travis-ci.org/rogargon/copyrightly.io.svg?branch=master)](https://travis-ci.org/rogargon/copyrightly.io)

## Table of Contents

* [Features](#features)
* [Running Locally](#running-locally)
   * [Required Tools](#required-tools)
   * [Smart Contracts Deployment](#smart-contracts-deployment)
   * [Launch Web Application](#launch-web-application)
* [Testing](#testing)
   * [Registry Contract](#registry-contract)
* [Design Pattern Requirements](#design-pattern-requirements)
* [Security Tools / Common Attacks](#security-tools--common-attacks)
* [Library / EthPM](#library--ethpm)
* [Additional Requirements](#additional-requirements)
* [Stretch Goals](#stretch-goals)
   * [IPFS](#ipfs)
   * [uPort](#uport)
   * [Ethereum Name Service](#ethereum-name-service)
   * [Oracles](#oracles)
   * [Upgradable Pattern Registry or Delegation](#upgradable-pattern-registry-or-delegation)
   * [LLL / Vyper](#lll--vyper)
   * [Testnet Deployment](#testnet-deployment)

## Features

The functionality provided to the users by the ÐApp through its Web application is:

1. [Minifest Single Authorship](e2e/features/1.manifest-single-authorship.feature)
  * Scenario: Register a piece of content not previously registered
  * Scenario: Register a piece of content previously registered

2. [Search Manifestation](e2e/features/2.search-manifestation.feature)
  * Scenario: Search a piece of content previously registered
  * Scenario: Search a piece of content not registered

3. [List Own Manifestations](e2e/features/3.list-own-manifestations.feature)
  * Scenario: List when I have previously registered a piece of content

For each feature, the linked feature file specifies the steps to accomplish each scenario.
The steps are implemented in the [steps](e2e/src/steps) and [pages](e2e/src/pages) folders so 
it is possible to automatically check that the application implements the specified behaviour
using End-to-End (E2E) tests based on [Cucumber](https://cucumber.io) and [Protractor](https://www.protractortest.org). 

A report of the feature tests results is available: 
[protractor-cucumber_report](https://rawgit.com/rogargon/copyrightly.io/master/e2e/protractor-cucumber_report.html)

## Running Locally

### Required Tools

Contract deployment and testing is done via [Truffle](https://truffleframework.com/) 
and using [Ganache CLI](https://github.com/trufflesuite/ganache-cli). 

Client Web application development is based on the [Angular](https://angular.io/).

To install all the required tools, after cloning the project or downloading it:

```
npm install
```

### Smart Contracts Deployment

After npm has installed all dependencies, it is time to deploy the ÐApp smart contracts.

First, start a local development network:

```
npm run network
```

This command will start Ganache in http://127.0.0.1:8545 together with 10 sample accounts. 
These accounts are fixed using the seed 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat'.

Then, deploy the contracts from a different terminal (leave Ganache running on the previous one):

```
npm run migrate
```

If there are no errors, the contracts will be then deployed to the local development network. 

> In case the contracts have been previously deployed, and we want to force redeployment:
> 
> ```
> npm run migrate -- --reset
> ```

### Launch Web Application

Finally, to start the client Web application locally:

```
npm start
```

Once started, it will be available at: [http://localhost:4200]()

The client application provides the features listed in the [Features](#features) section above. 

It can be tested using the accounts provided by Ganache without requiring
a Web3 enabled browser. 

However, if the [MetaMask](https://metamask.io) extension is available, it can be used to 
configure custom accounts and to sign transactions. Support for uPort is pending, but other 
Web3 enabled browsers can also be used, for instance [Cipher](https://www.cipherbrowser.com) 
in mobile devices. It provides nice features like transactions signing using TouchID/FaceID on iOS 
or Fingerprint Authentication on Android.

## Testing

The Solidity smart contracts feature a set of tests that can be launched with the following command:

```
npm run soltest
```

The application contracts, and all those imported by them, are compiled before running the tests. 
Some warnings might appear, but all of them are related to the imported contracts: 
*Proxy* and *AdminUpgradeabilityProxy* from ZeppelinOs.

The following sections describe the test for each smart contract, link to the test files and list 
their expected outputs.

### Registry Contract

This contract is responsible for registering *Manifestations*, the expressions of authors ideas into
pieces of content that can be then used to prove authorship. A manifestation is based on a content hash, 
some metadata (currently just the title) and the address of the account corresponding to its
author (or a list of addresses in the case of joint authorship).

There are 4 Solidity Tests that test the fundamental behavior of the contract: that the contract
can register single and joint authorship (multiple authors for the same manifestation), that registering 
joint authorship providing just one author is equivalent to stating single authorship, and, finally, 
that the contract fails if and already registered content hash is used.

[TestRegistry.sol](test/TestRegistry.sol)
```
  TestRegistry
    ✓ testSingleAuthorRegistered (127ms)
    ✓ testJointAuthorRegistered (142ms)
    ✓ testSingleAuthorThroughJointAuthorRegistered (79ms)
    ✓ testAlreadyRegistered (56ms)
```

In addition to the previous Solidity tests, there are the following tests of the same contract but from JavaScript.
It is tested again that single and joint authorship work, and that a previously registered manifestation can be later
retrieved.

[registry.test.js](test/registry.test.js)
```
  Contract: Registry - Single Authorship
    ✓ should register a previously unregistered manifestation (57ms)
    ✓ should retrieve a previously registered manifestation
    ✓ shouldn't register a previously registered manifestation

  Contract: Registry - Joint Authorship
    ✓ should register joint authorship for unregistered manifestation (55ms)
    ✓ should retrieve a previously registered joint authorship manifestation
    ✓ shouldn't register a previously registered joint authorship manifestation
```

Then, there are tests for the behaviors inherited from the contracts extended by *Registry*. 

From OpenZeppelin's *Pausable* and *Ownable*, that the contract can be paused and resumed but just
by the contract owner.

[registry_pausable.test.js](test/registry_pausable.test.js)
```
  Contract: Registry Pausable
    ✓ shouldn't work when registry logic paused by owner (55ms)
    ✓ should work again when registry logic unpaused by owner (86ms)
    ✓ shouldn't be paused by a non-owner
```

From ZeppelinOS' *AdminUpgradeabilityProxy*, that *Registry* is upgradable and retains state after an update
after it is upgraded by the proxy admin. Then, that the proxy admin cannot use the proxy to 
call the underlying *Registry* contract, required for security reasons. Finally, that the Registry
cannot be re-initialized after it has been already initialized during the initial deployment
(migration). This behavior is required to make Registry upgradable, inherited by extending

[registry_upgradeability.test.js](test/registry_upgradeability.test.js)
```
  Contract: Registry Upgradeability
    ✓ should keep stored manifestations after upgrade (151ms)
    ✓ shouldn't work when called by admin through proxy for security
    ✓ should fail when trying to re-initialize it
```

The output of the test should end with the following statement about all 16 being successful:

```
  16 passing (2s)
```

## Design Pattern Requirements

Implemented a "Circuit Breaker / Emergency Stop" for the Registry contract using OpenZeppelin *Pausable* contract, 
[https://openzeppelin.org/api/docs/lifecycle_Pausable.html]()

What other design patterns have you used or not used?
https://consensys.github.io/smart-contract-best-practices/software_engineering/
- Speed Bumps (Delay contract actions)
- Rate Limiting
- Automatic Deprecation
- Restrict amount of Ether per user/contract

## Security Tools / Common Attacks

Explain what measures they’ve taken to ensure that their contracts are not susceptible to common attacks.
https://consensys.github.io/smart-contract-best-practices/known_attacks/
* Race Conditions
  * Reentrancy
  * Cross-function Race Conditions
  * Pitfalls in Race Condition Solutions
* Transaction-Ordering Dependence (TOD) / Front Running
* Timestamp Dependence
* Integer Overflow and Underflow
* DoS with (Unexpected) revert
* DoS with Block Gas Limit
* Forcibly Sending Ether to a Contract

## Library / EthPM

At least one of the project contracts includes an import from a library or an ethPM package. 
If none of the project contracts do, then there is a demonstration contract that does.

Imported from ZeppelinOS:
 - *AdminUpgradeabilityProxy*: the proxy contract to implement upgradeability.
 - *Initializable*: extended by upgradable contracts so they can be initialized from the corresponding proxy.
 
Imported from OpenZeppelin:
 - *Pausable*: to implement the "Circuit Breaker / Emergency Stop" design pattern. 
 It also extends *Ownable* to control that just the owner can stop it.

## Additional Requirements

Smart Contract code should be commented according to the specs in the documentation
https://solidity.readthedocs.io/en/v0.4.21/layout-of-source-files.html#comments"

## Stretch Goals

### IPFS

When a user registers a piece of content using a digital file, it is uploaded to IPFS and 
the corresponding IPFS identifier (hash) is used to register the manifestation of the content in Ethereum.

### uPort

### Ethereum Name Service

### Oracles

### Upgradable Pattern Registry or Delegation

To make contracts upgradable, the Delegation pattern has been used through a Relay or Proxy. 
Concretely, the *AdminUpgradeabilityProxy* provided by the ZeppelinOS Library, as detailed in 
[https://docs.zeppelinos.org/docs/low_level_contract.html]()

### LLL / Vyper

### Testnet Deployment

Deployments to both Ropsten and Rinkeby at the addresses detailed in the file: [deployed_addresses.txt](deployed_addresses.txt)

**Ropsten** deployment uses private HDWallet, so the owner and proxy admin accounts are not available. 
These are the contracts used by the client Web application deployed at: [https://copyrightly.io]()

**Rinkeby** using public HDWallet with mnemonic: 

    candy maple cake sugar pudding cream honey rich smooth crumble sweet treat

Therefore, anyone can test restricted methods like *pause()* or *unpause()* for the contracts' owner ( account[0] ) or 
*upgradeTo()* for the proxy contracts' admin ( accounts[1] ).

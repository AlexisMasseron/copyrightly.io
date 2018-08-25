# CopyrightLY.io

Decentralized Application (ÐApp) for Copyright Management

[![Build Status](https://travis-ci.org/rogargon/copyrightly.io.svg?branch=master)](https://travis-ci.org/rogargon/copyrightly.io)

CopyrightLY smart contracts allow content owners to register their works as what is called a 
[Manifestation](https://github.com/rhizomik/copyrightonto/tree/master/ActionsModel#overview).

Manifestations are expressions of authors ideas into pieces of content that can be then used to prove authorship.
This is done through the [Manifestations](contracts/Manifestations.sol) contract, which records
the IPFS hash of the manifestation content, its title and when it was manifested. This information can be later 
used to proof authorship as the content can be retrieved from IPFS.

However, it is not enough to register a manifestation. Some evidences should be also provided to support the
authorship claim or the manifestation will expire after one day. There are evidences based on content uploaded
(to IPFS), implemented by the [UploadEvidences](contracts/UploadEvidences.sol) contract. The uploaded
content can be anything, from a screenshot to a scanned contract in PDF format.

The might be also evidences based on having previously published the content online, for instance in YouTube.
The [YouTubeEvidences](contracts/YouTubeEvidences.sol) contract implements evidences based on having the content
available in YouTube.

Future work:
 - Make it possible to register **Claims** if someone else has registered content we own.
 - Evidences can be also added to **Claims**.
 - Implement a **[Token Curated Registry](https://medium.com/@tokencuratedregistry/a-simple-overview-of-token-curated-registries-84e2b7b19a06) (TCR)** 
 of evidences supporting **Manifestations** and **Claims**. To add an evidence, an amount of the CLY token has to be staked.
 Anyone, the curators, can also mint some CLY and stake it to support an evidence, with the opportunity of winning additional
 CLY if they support and evidence of a winning manifestation or claim... 

## Table of Contents
   
* [Table of Contents](#table-of-contents)
* [Features](#features)
* [Running Locally](#running-locally)
   * [Required Tools](#required-tools)
   * [Smart Contracts Deployment](#smart-contracts-deployment)
   * [Launch Web Application](#launch-web-application)
* [Testing](#testing)
   * [Manifestations Contract](#manifestations-contract)
   * [UploadEvidences Contract](#UploadEvidences-contract)
   * [Claims Contract](#claims-contract)
   * [ExpirableLib Library](#expirablelib-library)
   * [Evidencable Contract](#evidencable-contract)
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

### [Manifestations](contracts/Manifestations.sol) Contract

This contract is responsible for registering *Manifestations*, the expressions of authors ideas into
pieces of content that can be then used to prove authorship. A manifestation is based on a content hash, 
some metadata (currently just the title) and the address of the account corresponding to its
author (or a list of addresses in the case of joint authorship).

There are 4 Solidity Tests that test the fundamental behavior of the contract: that the contract
can register single and joint authorship (multiple authors for the same manifestation), that registering 
joint authorship providing just one author is equivalent to stating single authorship, and, finally, 
that the contract fails if and already registered content hash is used.

[TestManifestations.sol](test/TestManifestations.sol)
```
  TestManifestations
    ✓ testSingleAuthorRegistered (127ms)
    ✓ testJointAuthorRegistered (142ms)
    ✓ testSingleAuthorThroughJointAuthorRegistered (79ms)
    ✓ testAlreadyRegistered (56ms)
```

In addition to the previous Solidity tests, there are 14 additional tests of the same contract but from JavaScript.
It is tested again that single and joint authorship work, and that a previously registered manifestation can be later
retrieved.

[manifestations.test.js](test/manifestations.test.js)
```
  Contract: Manifestations - Single Authorship
    ✓ should register a previously unregistered manifestation (57ms)
    ✓ should retrieve a previously registered manifestation
    ✓ shouldn't register a previously registered manifestation

  Contract: Manifestations - Joint Authorship
    ✓ should register joint authorship for unregistered manifestation (55ms)
    ✓ should retrieve a previously registered joint authorship manifestation
    ✓ shouldn't register a previously registered joint authorship manifestation
```

Then, there are tests for the behaviors inherited from the contracts extended by *Manifestations*. 

From OpenZeppelin's *Pausable* and *Ownable*, that the contract can be paused and resumed but just
by the contract owner.

[manifestations.test.js](test/manifestations_pausable.test.js)
```
  Contract: Manifestations - Pausable
    ✓ shouldn't work when paused by owner (55ms)
    ✓ should work again when unpaused by owner (86ms)
    ✓ shouldn't be paused by a non-owner
```

From ZeppelinOS' *AdminUpgradeabilityProxy*, that *Manifestations* is upgradable and retains state after an update
after it is upgraded by the proxy admin. Then, that the proxy admin cannot use the proxy to 
call the underlying *Manifestations* contract, required for security reasons. Finally, that *Manifestations*
cannot be re-initialized after it has been already initialized during the initial deployment
(migration). This behavior is required to make *Manifestations* upgradable, inherited by extending *Initializable*.

[manifestations_upgradeability.test.js](test/manifestations_upgradeability.test.js)
```
  Contract: Manifestations - Upgradeability
    ✓ should keep stored manifestations after upgrade (151ms)
    ✓ shouldn't work when called by admin through proxy for security
    ✓ should fail when trying to re-initialize it
```

Finally, the *Manifestations* contract uses the *ExpirableLib* library and extends the *Evidencable* contract, 
detailed next, to make it possible to overwrite manifestations have not received any authorship evidence before 
an expiry time. 

The test validates that a manifestation can be re-registered after it has expired, but only if it hasn't 
received any authorship evidence. To do so, a new version of the Manifestations contract is deployed with a 
time to expiry of 2 seconds. Re-registration is possible just after more than 2 seconds, but just if no evidence 
has been added.

[manifestations_expirable.test.js](test/manifestations_expirable.test.js)
```
  Contract: Manifestations - Expirable
    ✓ should re-register just when already expired (3266ms)
    ✓ shouldn't expire if manifestation with evidences (3138ms)
```

### [UploadEvidences](contracts/UploadEvidences.sol) Contract

This contract implements the registration of evidences based on uploading content to IPFS. It behaves as an
evidence provider for the contract specified when adding the evidence. However, the contract has to be registered
as and allowed evidence provider in that contract, in the case of these tests the *Manifestations* contract.
Multiple evidences should be accumulated for the same manifestation, but just if they are new ones and if the
manifestation they are evidences for exists. Finally, only the owner of *Manifestations* can register an
evidence provider. Finally, it is tested that just the owner of *Manifestations* can register a new provider that
then can add evidences as usual.

[uploadevidences.test.js](test/uploadevidences.test.js)
```
  Contract: UploadEvidences - Manifestations accumulate evidences
    ✓ should add evidence if registered evidence provider (220ms)
    ✓ should add multiple evidences for the same manifestation (124ms)
    ✓ shouldn't add the same evidence for the same manifestation (116ms)
    ✓ shouldn't add the same evidence for a different manifestation (142ms)
    ✓ shouldn't add evidence if the manifestation does not exists (522ms)
    ✓ shouldn't add evidence if not a registered evidence provider (556ms)
    ✓ should be enforced that just the owner registers evidence providers (558ms)

```

### [Claims](contracts/Claims.sol) Contract

...

### [ExpirableLib](contracts/ExpirableLib.sol) Library

This library contains the logic for items with a creation and expiry time. With it, 
manifestations or claims can expire after a certain amount of time. It is tested in: 
[manifestations_expirable.test.js](test/manifestations_expirable.test.js)

### [Evidencable](contracts/EvidencableLib.sol) Contract

This is a contract that provides the logic for items that can accumulate evidences. Manifestations or claims
can receive evidences by extending this contract. 

The idea is that evidences are considered by curators to check the appropriateness of manifestations and claims.

Moreover, they are counted so manifestations or claims that have accumulated at least one evidence do not expire,
as tested in: [manifestations_expirable.test.js](test/manifestations_expirable.test.js)

## Design Pattern Requirements

[Details about design pattern decisions](design_pattern_decisions.md)

## Security Tools / Common Attacks

[Details about avoiding common attacks](avoiding_common_attacks.md)

## Library / EthPM

The project imports the following Libraries and Contracts from ZeppelinOs and OpenZeppelin. 
In both cases, they where imported as Node packages using NPM because the versions available 
trough EthPM are outdated.

Imported from ZeppelinOS:
 - *AdminUpgradeabilityProxy*: the proxy contract to implement upgradeability.
 - *Initializable*: extended by upgradable contracts so they can be initialized from the corresponding proxy.
 
Imported from OpenZeppelin:
 - *Pausable*: contract to implement the "Circuit Breaker / Emergency Stop" design pattern. 
 It also extends *Ownable* to control that just the owner can stop it.
 - *SafeMath*: library that avoids the integer overflow and underflow issue.

Moreover, the OraclizeAPI package has been imported using EthPM as defined in [ethpm.json](ethpm.json). 
From this package, the following contract has been used:
 - *usingOraclize*: implements the oracle used by YouTubeEvidences to check that a YouTube video is owned 
 by a particular user and linked to its manifestation.

## Additional Requirements

The smart contracts code has been commented according to the specs in the documentation
https://solidity.readthedocs.io/en/v0.4.21/layout-of-source-files.html#comments and extended using the
Ethereum Natural Specification format as documented in 
https://github.com/ethereum/wiki/wiki/Ethereum-Natural-Specification-Format 

## Stretch Goals

### IPFS

When a user registers a piece of content using a digital file, it is uploaded to IPFS and 
the corresponding IPFS identifier (hash) is used to register the manifestation of the content in Ethereum.

The same is done for evidences based on uploading a document to IPFS so it is available for anyone to verify.

### uPort

### Ethereum Name Service

### Oracles

An oracle has been used in the [YouTubeEvidences](contracts/YouTubeEvidences.sol) contract. 
This contract implements an Oracle that checks if a specific YouTube video, identified using its VIDEO_ID, has
in the description of its web page (https://www.youtube.com/watch?v=VIDEO_ID) a link to a specific content hash.

Thus, the Oracle allows a creator to assert that a manifestation is also available in YouTube as a video owned by
the same person, who should have access to edit the description of the video to include the link to the manifestation
using its hash.

The tests for this contract are currently disabled as it has not been possible to make Oraclize work in the 
Ganache test network, even after installing the [ethereum-bridge](https://github.com/oraclize/ethereum-bridge) 
as recommended in the Oraclize documentation. The tests are available from 
[youtubeevidences.test.js](test/youtubeevidences.test.js.disabled)

It also possible to test the Oraclize query online at: [http://app.oraclize.it/home/test_query]()

For example: for the query: 

    html(https://www.youtube.com/watch?v=ZwVNLDIJKVA).xpath(count(//div[contains(@id,'description')]//a[contains(@href,'QmPP8X2rWc2uanbnKpxfzEAAuHPuThQRtxpoY8CYVJxDj8')]))

The result should be **1.0** because there is a link to the proper manifestation in the video description for 
[https://www.youtube.com/watch?v=ZwVNLDIJKVA]()

### Upgradable Pattern Registry or Delegation

To make contracts upgradable, the Delegation pattern has been used through a Relay or Proxy. 
Concretely, the *AdminUpgradeabilityProxy* provided by the ZeppelinOS Library, as detailed in 
[https://docs.zeppelinos.org/docs/low_level_contract.html]()

Upgradeability is tested in [manifestations_upgradeability.test.js](test/manifestations_upgradeability.test.js)

### LLL / Vyper

A version of the *Claims* contract has been also implemented using Vyper. The result is [Claims.vy](contracts/Claims.vy), which has
been validated and compiled using the [Vyper Online Compiler](https://vyper.online/)

However, this version is not compiled and deployed by Truffle like the rest of the contracts because Vyper is not yet integrated into 
the Truffle suite.

### Testnet Deployment

Deployments to both Ropsten and Rinkeby at the addresses detailed in the file: [deployed_addresses.txt](deployed_addresses.txt)

**Ropsten** deployment uses private HDWallet, so the owner and proxy admin accounts are not available. 
These are the contracts used by the client Web application deployed at: [https://copyrightly.io]()

**Rinkeby** using public HDWallet with mnemonic: 

    candy maple cake sugar pudding cream honey rich smooth crumble sweet treat

Therefore, anyone can test restricted methods like *pause()* or *unpause()* for the contracts' owner ( account[0] ) or 
*upgradeTo()* for the proxy contracts' admin ( accounts[1] ).

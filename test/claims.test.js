const Manifestations = artifacts.require('Manifestations');
const Proxy = artifacts.require("AdminUpgradeabilityProxy");
const Claims = artifacts.require("./Claims.sol");

const web3 = require('web3');

contract('Claims - Register claims', function (accounts) {

  const OWNER = accounts[0];
  const PROXYADMIN = accounts[1];
  const MANIFESTER = accounts[2];
  const CLAIMER = accounts[3];
  const HASH1 = web3.utils.randomHex(46);
  const TITLE1 = "A nice picture";
  const HASH2 = web3.utils.randomHex(46);
  const TITLE2 = "Unmanifested picture";
  const CLAIM_HASH1 = web3.utils.randomHex(46);
  const CLAIM_HASH2 = web3.utils.randomHex(46);

  let proxy, manifestations, claims, claimer, claimHash, manifestationHashed;

  beforeEach('setup contracts for each test', async () => {
    proxy = await Proxy.deployed();
    manifestations = await Manifestations.at(proxy.address);
    claims = await Claims.deployed();
  });

  it("should register a new claim", async () => {
    await manifestations.manifestAuthorship(HASH1, TITLE1, {from: MANIFESTER});

    let eventEmitted = false;
    const event = claims.ClaimEvent();
    await event.watch((error, result) => {
      claimer = result.args.claimer;
      claimHash = result.args.claimHash;
      manifestationHashed = result.args.manifestationHashed;
      eventEmitted = true;
    });

    await claims.makeClaim(CLAIM_HASH1, HASH1, {from: CLAIMER});

    assert.equal(eventEmitted, true,
        'a proper claim should emit a ClaimEvent');
    assert.equal(manifestationHashed, web3.utils.soliditySha3(HASH1),
        'unexpected manifestation hashed');
    assert.equal(claimHash, CLAIM_HASH1,
        'unexpected claim hash');
    assert.equal(claimer, CLAIMER,
        'unexpected claimer');
  });

  it("shouldn't register a claim if already one for manifestation", async () => {
    let eventEmitted = false;
    const event = claims.ClaimEvent();
    await event.watch((error, result) => {
      eventEmitted = true;
    });

    try {
      await claims.makeClaim(CLAIM_HASH2, HASH1, {from: CLAIMER});
    } catch(e) {
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }

    assert.equal(eventEmitted, false,
      'a repited claim should not emit a ClaimEvent');
  });

  it("shouldn't allow to revoke claim if not contract owner", async () => {
    let eventEmitted = false;
    const event = claims.ClaimEvent();
    await event.watch((error, result) => {
      eventEmitted = true;
    });

    try {
      await claims.revokeClaim(HASH1, {from: CLAIMER});
    } catch(e) {
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }

    assert.equal(eventEmitted, false,
      'non-owner revoke should not emit a ClaimEvent');
  });

  it("should retrieve an existing claim", async () => {

    const claimHash = await claims.getClaimHash(HASH1, {from: CLAIMER});

    assert.equal(claimHash, CLAIM_HASH1,
      'unexpected claim hash');
  });

  it("should allow to revoke claim if contract owner", async () => {
    let eventEmitted = false;
    const event = claims.RevokeClaimEvent();
    await event.watch((error, result) => {
      claimer = result.args.claimer;
      claimHash = result.args.claimHash;
      manifestationHashed = result.args.manifestationHashed;
      eventEmitted = true;
    });

    await claims.revokeClaim(HASH1, {from: OWNER});

    assert.equal(eventEmitted, true,
      'owner revoke should emit a RevokeClaimEvent');
    assert.equal(manifestationHashed, web3.utils.soliditySha3(HASH1),
      'unexpected manifestation hashed');
    assert.equal(claimHash, CLAIM_HASH1,
      'unexpected claim hash');
    assert.equal(claimer, CLAIMER,
      'unexpected claimer');
  });

  it("shouldn't allow retrieving a revoked claim", async () => {

    try {
      await claims.getClaimHash(HASH1, {from: CLAIMER});
    } catch(e) {
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }
  });

  it("shouldn't allow retrieving an unexisting claim", async () => {

    try {
      await claims.getClaimHash(HASH2, {from: CLAIMER});
    } catch(e) {
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }
  });
});

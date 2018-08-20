const Manifestations = artifacts.require('Manifestations');
const Proxy = artifacts.require("AdminUpgradeabilityProxy");
const assert = require('assert');

contract('Manifestations - Expirable', function (accounts) {

  const OWNER = accounts[0];
  const PROXYADMIN = accounts[1];
  const MANIFESTER1 = accounts[2];
  const MANIFESTER2 = accounts[3];
  const HASH = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
  const TITLE_OLD = "A nice picture";
  const TITLE_NEW = "My nice picture";
  const timeToExpiry = 2; // Expiry 2 seconds

  let manifestations, shortExpiryManifestations, newProxy;

  beforeEach('setup contracts for each test', async () => {
    shortExpiryManifestations = await Manifestations.new(timeToExpiry);
    newProxy = await Proxy.new(shortExpiryManifestations.address, {from: PROXYADMIN});
    manifestations = await Manifestations.at(newProxy.address);
    manifestations.initialize(OWNER, timeToExpiry);
  });

  it("should re-register just when already expired", async () => {
    await manifestations.manifestAuthorship(HASH, TITLE_OLD, {from: MANIFESTER1});

    let result = await manifestations.getManifestation(HASH);

    assert.equal(result[0], TITLE_OLD,
      'unexpected manifestation title');
    assert.equal(result[1][0], MANIFESTER1,
      'unexpected first author in manifestation authors');

    await sleep(1*1000);

    try {
      await manifestations.manifestAuthorship(HASH, TITLE_NEW, {from: MANIFESTER2});
    } catch(e) {
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }

    result = await manifestations.getManifestation(HASH);
    const oldTimestamp = result[2];

    assert.equal(result[0], TITLE_OLD,
      'unexpected manifestation title');
    assert.equal(result[1][0], MANIFESTER1,
      'unexpected first author in manifestation authors');

    await sleep(2*1000);

    await manifestations.manifestAuthorship(HASH, TITLE_NEW, {from: MANIFESTER2});

    result = await manifestations.getManifestation(HASH);

    assert.equal(result[0], TITLE_NEW,
      'unexpected manifestation title');
    assert.equal(result[1][0], MANIFESTER2,
      'unexpected first author in manifestation authors');
    assert(result[2] > oldTimestamp + timeToExpiry,
      'manifestation time not properly updated');
  });
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

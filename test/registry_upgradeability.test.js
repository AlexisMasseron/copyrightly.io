const Manifestations = artifacts.require('Manifestations');
const Proxy = artifacts.require("AdminUpgradeabilityProxy");

contract('Manifestations - Upgradeability', function (accounts) {

  const OWNER = accounts[0];
  const PROXYADMIN = accounts[1];
  const MANIFESTER = accounts[2];
  const HASH1 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
  const HASH2 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnpBDg";
  const TITLE = "A nice picture";

  let proxy, manifestations;

  beforeEach('setup contracts for each test', async () => {
    proxy = await Proxy.deployed();
    manifestations = await Manifestations.at(proxy.address);
  });

  it("should keep stored manifestations after upgrade", async () => {
    const currentVersion = await proxy.implementation({from: PROXYADMIN});
    await manifestations.manifestAuthorship(HASH1, TITLE, {from: MANIFESTER});

    const newManifestations = await Manifestations.new({from: OWNER});
    await proxy.upgradeTo(newManifestations.address, {from: PROXYADMIN});

    const newVersion = await proxy.implementation({from: PROXYADMIN});
    const result = await manifestations.getManifestation(HASH1, { from: MANIFESTER });

    assert.notEqual(currentVersion, newVersion,
        'proxy implementation should be upgraded');
    assert.equal(result[0], TITLE,
        'unexpected manifestation title');
    assert.equal(result[1].length, 1,
        'unexpected amount of authors in manifestation');
    assert.equal(result[1][0], MANIFESTER,
        'unexpected first author in manifestation authors');
  });

  it("shouldn't work when called by admin through proxy for security", async () => {
    let eventEmitted = false;
    const event = manifestations.ManifestEvent();
    await event.watch(() => {
      eventEmitted = true;
    });

    try {
      await manifestations.manifestAuthorship(HASH2, TITLE, {from: PROXYADMIN});
    } catch(e) {
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }

    assert.equal(eventEmitted, false,
        'should have reverted and emit no ManifestEvent');
  });

  it("should fail when trying to re-initialize it", async () => {
    let failed = false;

    try {
      await manifestations.initialize(OWNER);
    } catch(e) {
      failed = true;
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }

    assert.equal(failed, true,
      'should have failed because already initialized during migrations');
  });
});

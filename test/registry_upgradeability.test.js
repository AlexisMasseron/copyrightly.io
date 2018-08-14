const Registry = artifacts.require('Registry');
const RegistryProxy = artifacts.require("AdminUpgradeabilityProxy");

contract('Registry Upgradeability', function (accounts) {

  const OWNER = accounts[0];
  const PROXYADMIN = accounts[1];
  const MANIFESTER = accounts[2];
  const HASH1 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
  const HASH2 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnpBDg";
  const TITLE = "A nice picture";

  let registryProxy, registry;

  beforeEach('setup contracts for each test', async () => {
    registryProxy = await RegistryProxy.deployed();
    registry = await Registry.at(registryProxy.address);
  });

  it("should keep stored manifestations after upgrade", async () => {
    const currentVersion = await registryProxy.implementation({from: PROXYADMIN});
    await registry.manifestAuthorship(HASH1, TITLE, {from: MANIFESTER});

    const newRegistry = await Registry.new({from: OWNER});
    await registryProxy.upgradeTo(newRegistry.address, {from: PROXYADMIN});

    const newVersion = await registryProxy.implementation({from: PROXYADMIN});
    const result = await registry.getManifestation(HASH1, { from: MANIFESTER });

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
    const event = registry.ManifestEvent();
    await event.watch(() => {
      eventEmitted = true;
    });

    try {
      await registry.manifestAuthorship(HASH2, TITLE, {from: PROXYADMIN});
    } catch(e) {
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }

    assert.equal(eventEmitted, false,
        'should have reverted and emit no ManifestEvent');
  });

  it("should fail when trying to re-initialize it", async () => {
    let failed = false;

    try {
      await registry.initialize(OWNER);
    } catch(e) {
      failed = true;
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }

    assert.equal(failed, true,
      'should have failed because already initialized during migrations');
  });
});

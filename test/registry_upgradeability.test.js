const Registry = artifacts.require('Registry');
const RegistryProxy = artifacts.require("AdminUpgradeabilityProxy");

contract('Registry Upgradeability', function (accounts) {

  const OWNER = accounts[0];
  const MANIFESTER = accounts[1];
  const HASH1 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
  const HASH2 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnpBDg";
  const TITLE = "A nice picture";

  it("should keep stored manifestations after upgrade", async () => {
    const registryProxy = await RegistryProxy.deployed();
    const registry = await Registry.at(registryProxy.address);
    const currentVersion = await registryProxy.implementation();
    await registry.manifestAuthorship(HASH1, TITLE, {from: MANIFESTER});

    const newRegistry = await Registry.new();
    await registryProxy.upgradeTo(newRegistry.address, {from: OWNER});

    const newVersion = await registryProxy.implementation();
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

  it("shouldn't work when called by owner through proxy for security", async () => {
    const registryProxy = await RegistryProxy.deployed();
    const registry = await Registry.at(registryProxy.address);

    let eventEmitted = false;
    const event = registry.ManifestEvent();
    await event.watch(() => {
      eventEmitted = true;
    });

    try {
      await registry.manifestAuthorship(HASH2, TITLE, {from: OWNER});
    } catch(e) {
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }

    assert.equal(eventEmitted, false,
        'manifesting a previously registered hash shouldn\'t emit a ManifestEvent');
  });
});

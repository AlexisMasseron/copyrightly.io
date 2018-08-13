const Registry = artifacts.require('Registry');
const RegistryProxy = artifacts.require("AdminUpgradeabilityProxy");

contract('Registry Pausable', function (accounts) {

  const OWNER = accounts[0];
  const MANIFESTER = accounts[1];
  const HASH1 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
  const HASH2 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnpBDg";
  const TITLE = "A nice picture";

  it("shouldn't work when registry logic paused by owner", async () => {
    const registryProxy = await RegistryProxy.deployed();
    const registry = await Registry.at(await registryProxy.implementation());

    let eventEmitted = false;
    const event = registry.Pause();
    await event.watch(() => {
      eventEmitted = true;
    });

    await registry.pause();

    try {
      await registry.manifestAuthorship(HASH1, TITLE, {from: MANIFESTER});
    } catch(e) {
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }

    assert.equal(eventEmitted, true,
        'should have emitted the Pause() event on pause');
  });
});

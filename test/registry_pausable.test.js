const Registry = artifacts.require('Registry');
const RegistryProxy = artifacts.require("AdminUpgradeabilityProxy");

contract('Registry Pausable', function (accounts) {

  const OWNER = accounts[0];
  const MANIFESTER = accounts[2];
  const HASH1 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
  const HASH2 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnpBDg";
  const TITLE = "A nice picture";

  let registryProxy, registry;

  beforeEach('setup contracts for each test', async () => {
    registryProxy = await RegistryProxy.deployed();
    registry = await Registry.at(registryProxy.address);
  });

  it("shouldn't work when registry logic paused by owner", async () => {
    let eventEmitted = false;
    let event = registry.Pause();
    await event.watch(() => {
      eventEmitted = true;
    });

    await registry.pause({from: OWNER});

    assert.equal(eventEmitted, true,
      'should have emitted the Pause() event on pause');

    eventEmitted = false;
    event = registry.ManifestEvent();
    await event.watch((error, result) => {
      eventEmitted = true;
    });

    try {
      await registry.manifestAuthorship(HASH1, TITLE, {from: MANIFESTER});
    } catch(e) {
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }

    assert.equal(eventEmitted, false,
      'shouldn\'t have emitted a ManifestEvent');
  });

  it("should work again when registry logic unpaused by owner", async () => {
    let eventEmitted = false;
    let event = registry.Unpause();
    await event.watch(() => {
      eventEmitted = true;
    });

    await registry.unpause({from: OWNER});

    assert.equal(eventEmitted, true,
      'should have emitted the Unpause() event on pause');

    eventEmitted = false;
    event = registry.ManifestEvent();
    await event.watch((error, result) => {
      manifestHash = result.args.hash;
      manifestTitle = result.args.title;
      manifestAuthors = result.args.authors;
      manifestManifester = result.args.manifester;
      eventEmitted = true;
    });

    await registry.manifestAuthorship(HASH2, TITLE, {from: MANIFESTER});

    assert.equal(eventEmitted, true,
      'manifesting authorship should emit a ManifestEvent');
    assert.equal(manifestHash, HASH2,
      'unexpected manifest event hash');
    assert.equal(manifestTitle, TITLE,
      'unexpected manifest event title');
    assert.equal(manifestAuthors.length, 1,
      'unexpected amount of authors in manifest event');
    assert.equal(manifestAuthors[0], MANIFESTER,
      'unexpected first author in manifest event authors');
    assert.equal(manifestManifester, MANIFESTER,
      'unexpected manifest event manifester');
  });

  it("shouldn't be paused by a non-owner", async () => {
    let eventEmitted = false;
    const event = registry.Pause();
    await event.watch(() => {
      eventEmitted = true;
    });

    try {
      await registryImpl.pause({from: MANIFESTER});
    } catch(e) {
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }

    assert.equal(eventEmitted, false,
      'shouldn\'t have emitted the Pause() event on pause');
  });
});

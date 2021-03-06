const Manifestations = artifacts.require('Manifestations');
const Proxy = artifacts.require("AdminUpgradeabilityProxy");

contract('Manifestations - Single Authorship', function (accounts) {

  const OWNER = accounts[0];
  const PROXYADMIN = accounts[1];
  const MANIFESTER = accounts[2];
  const HASH = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
  const TITLE = "A nice picture";

  let manifestHash, manifestTitle, manifestManifester;
  let proxy, manifestations;

  beforeEach('setup contracts for each test', async () => {
    proxy = await Proxy.deployed();
    manifestations = await Manifestations.at(proxy.address);
  });

  it("should register a previously unregistered manifestation", async () => {
    let eventEmitted = false;
    const event = manifestations.ManifestEvent();
    await event.watch((error, result) => {
      manifestHash = result.args.hash;
      manifestTitle = result.args.title;
      manifestManifester = result.args.manifester;
      eventEmitted = true;
    });

    await manifestations.manifestAuthorship(HASH, TITLE, {from: MANIFESTER});

    assert.equal(eventEmitted, true,
        'manifesting authorship should emit a ManifestEvent');
    assert.equal(manifestHash, HASH,
        'unexpected manifest event hash');
    assert.equal(manifestTitle, TITLE,
        'unexpected manifest event title');
    assert.equal(manifestManifester, MANIFESTER,
        'unexpected manifest event manifester');
  });

  it("should retrieve a previously registered manifestation", async () => {
    const result = await manifestations.getManifestation(HASH);

    assert.equal(result[0], TITLE,
        'unexpected manifestation title');
    assert.equal(result[1].length, 1,
        'unexpected amount of authors in manifestation');
    assert.equal(result[1][0], MANIFESTER,
        'unexpected first author in manifestation authors');
  });

  it("shouldn't register a previously registered manifestation", async () => {
    let eventEmitted = false;
    const event = manifestations.ManifestEvent();
    await event.watch(() => {
      eventEmitted = true;
    });

    try {
      await manifestations.manifestAuthorship(HASH, TITLE, {from: MANIFESTER});
    } catch(e) {
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }

    assert.equal(eventEmitted, false,
        'manifesting a previously registered hash shouldn\'t emit a ManifestEvent');
  });
});

contract('Manifestations - Joint Authorship', function (accounts) {

  const OWNER = accounts[0];
  const PROXYADMIN = accounts[1];
  const MANIFESTER = accounts[2];
  const ADDITIONAL_AUTHORS = [accounts[3], accounts[4], accounts[5]];
  const HASH = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
  const TITLE = "A nice picture";

  let manifestHash, manifestTitle, manifestAuthors, manifestManifester;
  let proxy, manifestations;

  beforeEach('setup contracts for each test', async () => {
    proxy = await Proxy.deployed();
    manifestations = await Manifestations.at(proxy.address);
  });

  it("should register joint authorship for unregistered manifestation", async () => {
    let eventEmitted = false;
    const event = manifestations.ManifestEvent();
    await event.watch((error, result) => {
      manifestHash = result.args.hash;
      manifestTitle = result.args.title;
      manifestManifester = result.args.manifester;
      eventEmitted = true;
    });

    await manifestations.manifestJointAuthorship(
      HASH, TITLE, ADDITIONAL_AUTHORS, {from: MANIFESTER});

    assert.equal(eventEmitted, true,
      'manifesting authorship should emit a ManifestEvent');
    assert.equal(manifestHash, HASH,
      'unexpected manifest event hash');
    assert.equal(manifestTitle, TITLE,
      'unexpected manifest event title');
    assert.equal(manifestManifester, MANIFESTER,
      'unexpected manifest event manifester');
  });

  it("should retrieve a previously registered joint authorship manifestation", async () => {
    const result = await manifestations.getManifestation(HASH);

    assert.equal(result[0], TITLE,
      'unexpected manifestation title');
    assert.equal(result[1].length, 4,
      'unexpected amount of authors in manifestation');
    assert.equal(result[1][0], MANIFESTER,
      'unexpected first author in manifestation authors');
    assert.equal(result[1][1], accounts[3],
      'unexpected second author in manifest event authors');
    assert.equal(result[1][2], accounts[4],
      'unexpected third author in manifest event authors');
    assert.equal(result[1][3], accounts[5],
      'unexpected fourth author in manifest event authors');
  });

  it("shouldn't register a previously registered joint authorship manifestation", async () => {
    let eventEmitted = false;
    const event = manifestations.ManifestEvent();
    await event.watch(() => {
      eventEmitted = true;
    });

    try {
      await manifestations.manifestJointAuthorship(
        HASH, TITLE, ADDITIONAL_AUTHORS, {from: MANIFESTER});
    } catch(e) {
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }

    assert.equal(eventEmitted, false,
      'manifesting a previously registered hash shouldn\'t emit a ManifestEvent');
  });
});

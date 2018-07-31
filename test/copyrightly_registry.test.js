var Registry = artifacts.require('Registry');

contract('Registry - Single Authorship', function (accounts) {

  const MANIFESTER = accounts[0];
  const HASH = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
  const TITLE = "A nice picture";

  let manifestHash, manifestTitle, manifestAuthors, manifestManifester;

  it("should register a previously unregistered manifestation", async () => {
    const registry = await Registry.deployed();
    let eventEmitted = false;
    const event = registry.ManifestEvent();
    await event.watch((error, result) => {
      manifestHash = result.args.hash;
      manifestTitle = result.args.title;
      manifestAuthors = result.args.authors;
      manifestManifester = result.args.manifester;
      eventEmitted = true;
    });

    await registry.manifestAuthorship(HASH, TITLE, {from: MANIFESTER});

    assert.equal(eventEmitted, true,
        'manifesting authorship should emit a ManifestEvent');
    assert.equal(manifestHash, HASH,
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

  it("should retrieve a previously registered manifestation", async () => {
    const registry = await Registry.deployed();

    const result = await registry.getManifestation(HASH);

    assert.equal(result[0], TITLE,
        'unexpected manifestation title');
    assert.equal(result[1].length, 1,
        'unexpected amount of authors in manifestation');
    assert.equal(result[1][0], MANIFESTER,
        'unexpected first author in manifestation authors');
  });

  it("shouldn't register a previously registered manifestation", async () => {
    const registry = await Registry.deployed();
    let eventEmitted = false;
    const event = registry.ManifestEvent();
    await event.watch(() => {
      eventEmitted = true;
    });

    try {
      await registry.manifestAuthorship(HASH, TITLE, {from: MANIFESTER});
    } catch(e) {
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }

    assert.equal(eventEmitted, false,
        'manifesting a previously registered hash shouldn\'t emit a ManifestEvent');
  });
});

contract('Registry - Joint Authorship', function (accounts) {

  const MANIFESTER = accounts[0];
  const ADDITIONAL_AUTHORS = [accounts[1], accounts[2], accounts[3]];
  const HASH = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
  const TITLE = "A nice picture";

  let manifestHash, manifestTitle, manifestAuthors, manifestManifester;

  it("should register joint authorship for unregistered manifestation", async () => {
    const registry = await Registry.deployed();
    let eventEmitted = false;
    const event = registry.ManifestEvent();
    await event.watch((error, result) => {
      manifestHash = result.args.hash;
      manifestTitle = result.args.title;
      manifestAuthors = result.args.authors;
      manifestManifester = result.args.manifester;
      eventEmitted = true;
    });

    await registry.manifestJointAuthorship(
      HASH, TITLE, ADDITIONAL_AUTHORS, {from: MANIFESTER});

    assert.equal(eventEmitted, true,
      'manifesting authorship should emit a ManifestEvent');
    assert.equal(manifestHash, HASH,
      'unexpected manifest event hash');
    assert.equal(manifestTitle, TITLE,
      'unexpected manifest event title');
    assert.equal(manifestAuthors.length, 4,
      'unexpected amount of authors in manifest event');
    assert.equal(manifestAuthors[0], MANIFESTER,
      'unexpected first author in manifest event authors');
    assert.equal(manifestAuthors[1], accounts[1],
      'unexpected second author in manifest event authors');
    assert.equal(manifestAuthors[2], accounts[2],
      'unexpected third author in manifest event authors');
    assert.equal(manifestAuthors[3], accounts[3],
      'unexpected fourth author in manifest event authors');
    assert.equal(manifestManifester, MANIFESTER,
      'unexpected manifest event manifester');
  });

  it("should retrieve a previously registered joint authorship manifestation", async () => {
    const registry = await Registry.deployed();

    const result = await registry.getManifestation(HASH);

    assert.equal(result[0], TITLE,
      'unexpected manifestation title');
    assert.equal(result[1].length, 4,
      'unexpected amount of authors in manifestation');
    assert.equal(result[1][0], MANIFESTER,
      'unexpected first author in manifestation authors');
    assert.equal(result[1][1], accounts[1],
      'unexpected second author in manifest event authors');
    assert.equal(result[1][2], accounts[2],
      'unexpected third author in manifest event authors');
    assert.equal(result[1][3], accounts[3],
      'unexpected fourth author in manifest event authors');
  });

  it("shouldn't register a previously registered joint authorship manifestation", async () => {
    const registry = await Registry.deployed();
    let eventEmitted = false;
    const event = registry.ManifestEvent();
    await event.watch(() => {
      eventEmitted = true;
    });

    try {
      await registry.manifestJointAuthorship(
        HASH, TITLE, ADDITIONAL_AUTHORS, {from: MANIFESTER});
    } catch(e) {
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }

    assert.equal(eventEmitted, false,
      'manifesting a previously registered hash shouldn\'t emit a ManifestEvent');
  });
});

var CopyrightlyRegistry = artifacts.require('CopyrightlyRegistry');

contract('CopyrightlyRegistry', function (accounts) {

  const manifester = accounts[0];
  const HASH = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
  const TITLE = "A nice picture";

  let manifestHash, manifestTitle, manifestAuthors, manifestManifester;

  it("should manifest a previously unregistered piece of content", async () => {
    const registry = await CopyrightlyRegistry.deployed();
    let eventEmitted = false;
    const event = registry.ManifestEvent();
    await event.watch((error, result) => {
      manifestHash = result.args.hash;
      manifestTitle = result.args.title;
      manifestAuthors = result.args.authors;
      manifestManifester = result.args.manifester;
      eventEmitted = true;
    });

    await registry.manifestAuthorship(HASH, TITLE, {from: manifester});

    assert.equal(eventEmitted, true,
        'manifesting authorship should emit a ManifestEvent');
    assert.equal(manifestHash, HASH,
        'unexpected manifest event hash');
    assert.equal(manifestTitle, TITLE,
        'unexpected manifest event title');
    assert.equal(manifestAuthors.length, 1,
        'unexpected amount of authors in manifest event');
    assert.equal(manifestAuthors[0], manifester,
        'unexpected first author in manifest event authors');
    assert.equal(manifestManifester, manifester,
        'unexpected manifest event manifester');
  });

  it("should allow retrieving an previously registered manifestation", async () => {
    const registry = await CopyrightlyRegistry.deployed();

    const result = await registry.getManifestation(HASH);

    assert.equal(result[0], TITLE,
        'unexpected manifestation title');
    assert.equal(result[1].length, 1,
        'unexpected amount of authors in manifestation');
    assert.equal(manifestAuthors[0], manifester,
        'unexpected first author in manifestation authors');
  });

  it("shouldn't manifest a previously registered piece of content", async () => {
    const registry = await CopyrightlyRegistry.deployed();
    let eventEmitted = false;
    const event = registry.ManifestEvent();
    await event.watch(() => {
      eventEmitted = true;
    });

    try {
      await registry.manifestAuthorship(HASH, TITLE, {from: manifester});
    } catch(e) {
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }

    assert.equal(eventEmitted, false,
        'manifesting a previously registered hash shouldn\'t emit a ManifestEvent');
  });
});

const Evidences = artifacts.require("UploadEvidences");
const Manifestations = artifacts.require('Manifestations');
const Proxy = artifacts.require("AdminUpgradeabilityProxy");

const web3 = require('web3');

contract('UploadEvidences - Manifestations accumulate evidences', function (accounts) {

  const OWNER = accounts[0];
  const NOT_OWNER = accounts[1];
  const MANIFESTER = accounts[2];
  const HASH1 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
  const TITLE1 = "A nice picture";
  const HASH2 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnpBDg";
  const TITLE2 = "Unmanifested picture";
  const HASH3 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPBDG";
  const EVIDENCE_HASH1 = "QmPP8X2rWc2uanbnKpxfzEAAuHPuThQRtxpoY8CYVJxDj8";
  const EVIDENCE_HASH2 = "QmPP8X2rWc2uanbnKpxfzEAAuHPuThQRtxpoY8CYVjXdJ8";

  let evidences, proxy, manifestations, registry,
    evidencedIdHash, evidenceHash, evidencer;

  beforeEach('setup contracts for each test', async () => {
    proxy = await Proxy.deployed();
    manifestations = await Manifestations.at(proxy.address);
    evidences = await Evidences.deployed();
    manifestations.addEvidenceProvider(evidences.address);
  });

  it("should add evidence if registered evidence provider", async () => {
    await manifestations.manifestAuthorship(HASH1, TITLE1, {from: MANIFESTER});

    let eventEmitted = false;
    const event = evidences.UploadEvidenceEvent();
    await event.watch((error, result) => {
      registry = result.args.registry;
      evidencedIdHash = result.args.evidencedIdHash;
      evidenceHash = result.args.evidenceHash;
      evidencer = result.args.evidencer;
      eventEmitted = true;
    });

    await evidences.addEvidence(manifestations.address, HASH1, EVIDENCE_HASH1, {from: MANIFESTER});

    const evidenceCount = await manifestations.getEvidenceCount(HASH1);

    assert.equal(evidenceCount, 1,
        'The manifestation should accumulate 1 evidence');
    assert.equal(eventEmitted, true,
        'Registering an uploadable evidence should emit an UploadableEvidenceEvent');
    assert.equal(registry, manifestations.address,
        'the contract receiving the evidence should be the manifestations');
    assert.equal(evidencedIdHash, web3.utils.soliditySha3(HASH1),
        'the manifestation receiving the evidence should be the manifested one');
    assert.equal(evidenceHash, EVIDENCE_HASH1,
        'the hash of the evidence should be the registered one');
    assert.equal(evidencer, MANIFESTER,
        'the account providing the evidence should be the same than the manifester');
  });

  it("should add multiple evidences for the same manifestation", async () => {
    let eventEmitted = false;
    const event = evidences.UploadEvidenceEvent();
    await event.watch((error, result) => {
      registry = result.args.registry;
      evidencedIdHash = result.args.evidencedIdHash;
      evidenceHash = result.args.evidenceHash;
      evidencer = result.args.evidencer;
      eventEmitted = true;
    });

    await evidences.addEvidence(manifestations.address, HASH1, EVIDENCE_HASH2, {from: MANIFESTER});

    const evidenceCount = await manifestations.getEvidenceCount(HASH1);

    assert.equal(evidenceCount, 2,
      'The manifestation should accumulate 2 evidences');
    assert.equal(eventEmitted, true,
      'Registering an uploadable evidence should emit an UploadableEvidenceEvent');
    assert.equal(registry, manifestations.address,
      'the contract receiving the evidence should be the manifestations');
    assert.equal(evidencedIdHash, web3.utils.soliditySha3(HASH1),
      'the manifestation receiving the evidence should be the manifested one');
    assert.equal(evidenceHash, EVIDENCE_HASH2,
      'the hash of the evidence should be the registered one');
    assert.equal(evidencer, MANIFESTER,
      'the account providing the evidence should be the same than the manifester');
  });

  it("shouldn't add the same evidence for the same manifestation", async () => {
    let eventEmitted = false;
    const event = evidences.UploadEvidenceEvent();
    await event.watch((error, result) => {
      eventEmitted = true;
    });

    try {
      await evidences.addEvidence(manifestations.address, HASH1, EVIDENCE_HASH1, {from: MANIFESTER});
    } catch(e) {
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }

    const evidenceCount = await manifestations.getEvidenceCount(HASH1);

    assert.equal(evidenceCount, 2,
      'The manifestation should accumulate 3 evidences');
    assert.equal(eventEmitted, false,
      'Registering the same evidence should not emit an UploadableEvidenceEvent');
  });

  it("shouldn't add the same evidence for a different manifestation", async () => {
    await manifestations.manifestAuthorship(HASH2, TITLE2, {from: MANIFESTER});

    let eventEmitted = false;
    const event = evidences.UploadEvidenceEvent();
    await event.watch((error, result) => {
      eventEmitted = true;
    });

    try {
      await evidences.addEvidence(manifestations.address, HASH2, EVIDENCE_HASH1, {from: MANIFESTER});
    } catch(e) {
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }

    const evidenceCount = await manifestations.getEvidenceCount(HASH2);

    assert.equal(evidenceCount, 0,
      'The manifestation should accumulate 1 evidence');
    assert.equal(eventEmitted, false,
      'Registering the same evidence should not emit an UploadableEvidenceEvent');
  });

  it("shouldn't add evidence if not a registered evidence provider", async () => {
    const unregisteredEvidences = await Evidences.new();

    let eventEmitted = false;
    const event = unregisteredEvidences.UploadEvidenceEvent();
    await event.watch((error, result) => {
      eventEmitted = true;
    });

    try {
      await unregisteredEvidences.addEvidence(manifestations.address, HASH1, EVIDENCE_HASH1, {from: MANIFESTER});
    } catch(e) {
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }

    const evidenceCount = await manifestations.getEvidenceCount(HASH1);

    assert.equal(evidenceCount, 2,
      'The manifestation should accumulate 3 evidences');
    assert.equal(eventEmitted, false,
      'No evidence if not registered evidence provider so no UploadableEvidenceEvent');
  });

  it("shouldn't add evidence if the manifestation does not exists", async () => {
    const evidences = await Evidences.new();
    manifestations.addEvidenceProvider(evidences.address);

    let eventEmitted = false;
    const event = evidences.UploadEvidenceEvent();
    await event.watch((error, result) => {
      eventEmitted = true;
    });

    try {
      await evidences.addEvidence(manifestations.address, HASH3, EVIDENCE_HASH1, {from: MANIFESTER});
    } catch(e) {
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }

    const evidenceCount = await manifestations.getEvidenceCount(HASH3);

    assert.equal(evidenceCount, 0,
      'An unexisting manifestation should not accumulate evidences');
    assert.equal(eventEmitted, false,
      'No evidence if the manifestation does not exist, so no UploadableEvidenceEvent');
  });

  it("should be enforced that just the owner registers evidence providers", async () => {
    const unregisteredEvidences = await Evidences.new();

    try {
      await manifestations.addEvidenceProvider(unregisteredEvidences.address, {from: NOT_OWNER});
    } catch(e) {
      assert(e.message, "Error: VM Exception while processing transaction: revert");
    }

    await manifestations.addEvidenceProvider(unregisteredEvidences.address, {from: OWNER});

    let eventEmitted = false;
    const event = unregisteredEvidences.UploadEvidenceEvent();
    await event.watch((error, result) => {
      eventEmitted = true;
    });

    await unregisteredEvidences.addEvidence(manifestations.address, HASH1, EVIDENCE_HASH1, {from: MANIFESTER});

    const evidenceCount = await manifestations.getEvidenceCount(HASH1);

    assert.equal(evidenceCount, 3,
      'The new UploadEvidences contract allows registering EVIDENCE_HASH1 again');
    assert.equal(eventEmitted, true,
      'The evidence should registered and emit UploadableEvidenceEvent');
  });
});

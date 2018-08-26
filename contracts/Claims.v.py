
ClaimEvent: event({
    claimer: indexed(address),
    claimHash: bytes[46],
    manifestationHashed: indexed(bytes32)})

RevokeClaimEvent: event({
    claimer: indexed(address),
    claimHash: bytes[46],
    manifestationHashed: indexed(bytes32)})

claims: {
    claimer: address,
    claimHash: bytes[46],
    active: bool
}[bytes[46]]

owner: address
manifestations: address

@public
def __init__(_manifestations: address):
    self.owner = msg.sender
    self.manifestations = _manifestations

# Retrieve the IPFS hash of the claim content for the input manifestation
@public
@constant
def getClaimHash(manifestationHash: bytes[46]) -> bytes[46]:
    assert self.claims[manifestationHash].active
    return self.claims[manifestationHash].claimHash

# Retrieve the account that made the claim for the input manifestation hash
@public
@constant
def getClaimer(manifestationHash: bytes[46]) -> address:
    assert self.claims[manifestationHash].active
    return self.claims[manifestationHash].claimer

# Register a claim using the IPFS hash of the claim content and the hash identifying the
# manifestation claimed. Just one unexpired claim for the same manifestation hash allowed
@public
def makeClaim(claimHash: bytes[46], manifestationHash: bytes[46]):
    assert not(self.claims[manifestationHash].active)
    self.claims[manifestationHash].claimer = msg.sender
    self.claims[manifestationHash].claimHash = claimHash
    self.claims[manifestationHash].active = True
    log.ClaimEvent(msg.sender, claimHash, keccak256(manifestationHash))

# Remove the claim for the input manifestation.
# Just the contract owner can remove claims
@public
def revokeClaim(manifestationHash: bytes[46]):
    assert self.owner == msg.sender
    log.RevokeClaimEvent(self.claims[manifestationHash].claimer,
        self.claims[manifestationHash].claimHash, keccak256(manifestationHash))
    self.claims[manifestationHash].active = False

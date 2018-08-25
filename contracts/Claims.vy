ClaimEvent: event({claimer: indexed(address), claimHash: bytes[46], manifestationHashed: indexed(bytes32)})

claims: {
    claimer: address,
    claimHash: bytes[46]
}[bytes[46]]

@public
@constant
def getClaimHash(manifestationHash: bytes[46]) -> bytes[46]:
    return self.claims[manifestationHash].claimHash

@public
@constant
def getClaimer(manifestationHash: bytes[46]) -> address:
    return self.claims[manifestationHash].claimer

@public
def makeClaim(claimHash: bytes[46], manifestationHash: bytes[46]):
    assert self.claims[manifestationHash].claimer == 0x0000000000000000000000000000000000000000
    self.claims[manifestationHash].claimer = msg.sender
    self.claims[manifestationHash].claimHash = claimHash
    log.ClaimEvent(msg.sender, claimHash, keccak256(manifestationHash))

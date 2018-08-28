
ComplaintEvent: event({
    complainer: indexed(address),
    complaintHash: bytes[46],
    manifestationHashed: indexed(bytes32)})

RevokeComplaintEvent: event({
    complainer: indexed(address),
    complaintHash: bytes[46],
    manifestationHashed: indexed(bytes32)})

complaints: {
    complainer: address,
    complaintHash: bytes[46],
    active: bool
}[bytes[46]]

owner: address
manifestations: address

@public
def __init__(_manifestations: address):
    self.owner = msg.sender
    self.manifestations = _manifestations

# Retrieve the IPFS hash of the complaint content for the input manifestation
@public
@constant
def getComplaintHash(manifestationHash: bytes[46]) -> bytes[46]:
    assert self.complaints[manifestationHash].active
    return self.complaints[manifestationHash].complaintHash

# Retrieve the account that made the complaint for the input manifestation hash
@public
@constant
def getComplainter(manifestationHash: bytes[46]) -> address:
    assert self.complaints[manifestationHash].active
    return self.complaints[manifestationHash].complainer

# Register a complaint using the IPFS hash of the complaint content and the hash identifying the
# manifestation complainted. Just one unexpired complaint for the same manifestation hash allowed
@public
def makeComplaint(complaintHash: bytes[46], manifestationHash: bytes[46]):
    assert not(self.complaints[manifestationHash].active)
    self.complaints[manifestationHash].complainer = msg.sender
    self.complaints[manifestationHash].complaintHash = complaintHash
    self.complaints[manifestationHash].active = True
    log.ComplaintEvent(msg.sender, complaintHash, keccak256(manifestationHash))

# Remove the complaint for the input manifestation.
# Just the contract owner can remove complaints
@public
def revokeComplaint(manifestationHash: bytes[46]):
    assert self.owner == msg.sender
    log.RevokeComplaintEvent(self.complaints[manifestationHash].complainer,
        self.complaints[manifestationHash].complaintHash, keccak256(manifestationHash))
    self.complaints[manifestationHash].active = False

pragma solidity ^0.4.24;

import "./Evidencable.sol";

/// @title Contract to register evidences based on uploading content to IPFS
/// @author Roberto García (http://rhizomik.net/~roberto/)
contract UploadEvidences {

    mapping(string => bool) private existingEvidences;

    event UploadEvidenceEvent(address indexed registry, bytes32 indexed evidencedIdHash,
      string evidenceHash, address indexed evidencer);

    constructor() public {}

    /// @notice Add evidence for item in `registry` identified by `evidencedId`. The evidence
    /// has `evidenceHash` and registered by `msg.sender`.
    /// @dev The address of the registry containing the evidenced item is required to update
    /// its evidence count. Evidences are stored just in the log as UploadEvidenceEvent events.
    /// Note: the evidenceId is hashed using keccak256 before emitting the event so it can be indexed.
    /// @param registry The address of the contract holding the items evidenced
    /// @param evidencedId The identifier used by the registry contract for the item receiving evidence
    /// @param evidenceHash Hash of the uploaded content to be used as evidence, for instance IPFS Base58 Hash
    function addEvidence(address registry, string evidencedId, string evidenceHash) public {
        require(!existingEvidences[evidenceHash], "The evidence has been already registered");
        Evidencable(registry).addEvidence(evidencedId);
        existingEvidences[evidenceHash] = true;
        emit UploadEvidenceEvent(registry, keccak256(evidencedId), evidenceHash, msg.sender);
    }
}

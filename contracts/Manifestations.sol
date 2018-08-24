pragma solidity ^0.4.24;

import "zos-lib/contracts/migrations/Initializable.sol";
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "zos-lib/contracts/upgradeability/AdminUpgradeabilityProxy.sol";
import "./ExpirableLib.sol";
import "./EvidencableLib.sol";

/// @title Contract for copyright authorship registration through creations manifestations
/// @author Roberto García (http://rhizomik.net/~roberto/)
contract Manifestations is Pausable, Initializable {

    using ExpirableLib for ExpirableLib.TimeAndExpiry;
    using EvidencableLib for EvidencableLib.Evidentiality;

    struct Manifestation {
        string title;
        address[] authors;
        ExpirableLib.TimeAndExpiry time;
        EvidencableLib.Evidentiality evidentiality;
    }

    uint32 public timeToExpiry;
    mapping(string => Manifestation) private manifestations;

    event ManifestEvent(string hash, string title, address indexed manifester);
    event AddedEvidence(uint8 evidenceCount);

    constructor(uint32 _timeToExpiry) public {
        timeToExpiry = _timeToExpiry;
    }

    /// @dev To be used when proxied (upgradeability) to initialize proxy storage
    function initialize(address _owner, uint32 _timeToExpiry) public isInitializer {
        owner = _owner;
        timeToExpiry = _timeToExpiry;
    }

    /// @dev Modifier implementing the common logic for single and joint authorship.
    /// Checks title and that hash not registered or expired. Then stores title and sets expiry.
    /// Finally, emits ManifestEvent
    modifier registerIfAvailable(string hash, string title) {
        require(bytes(title).length > 0, "A title is required");
        require(manifestations[hash].authors.length == 0 || (manifestations[hash].time.isExpired()
                && manifestations[hash].evidentiality.isUnevidenced()),
            "Already registered and not expired or with evidences");
        _;
        manifestations[hash].title = title;
        manifestations[hash].time.setExpiry(timeToExpiry);
        emit ManifestEvent(hash, title, msg.sender);
    }

    /// @notice Register single authorship for `msg.sender` of the manifestation with title `title`
    /// and hash `hash`. Requires hash not previously registered or expired.
    /// @dev To be used when there is just one author, which is considered to be the message sender
    /// @param hash Hash of the manifestation content, for instance IPFS Base58 Hash
    /// @param title The title of the manifestation
    function manifestAuthorship(string hash, string title)
    public registerIfAvailable(hash, title) whenNotPaused() {
        address[] memory authors = new address[](1);
        authors[0] = msg.sender;
        manifestations[hash].authors = authors;
    }

    /// @notice Register joint authorship for `msg.sender` plus additional authors
    /// `additionalAuthors` of the manifestation with title `title` and hash `hash`.
    /// Requires hash not previously registered or expired and at most 64 authors,
    /// including the one registering.
    /// @dev To be used when there are multiple authors
    /// @param hash Hash of the manifestation content, for instance IPFS Base58 Hash
    /// @param title The title of the manifestation
    /// @param additionalAuthors The additional authors,
    /// including the one registering that becomes the first author
    function manifestJointAuthorship(string hash, string title, address[] additionalAuthors)
    public registerIfAvailable(hash, title) whenNotPaused() {
        require(additionalAuthors.length < 64, "Joint authorship limited to 64 authors");
        address[] memory authors = new address[](additionalAuthors.length + 1);
        authors[0] = msg.sender;
        for (uint8 i = 0; i < additionalAuthors.length; i++)
            authors[i+1] = additionalAuthors[i];
        manifestations[hash].authors = authors;
    }

    /// @notice Retrieve the title and authors of the manifestation with content hash `hash`.
    /// @param hash Hash of the manifestation content, for instance IPFS Base58 Hash
    /// @return The title and authors of the manifestation
    function getManifestation(string hash) public constant
    returns (string, address[], uint256, uint256) {
        return (manifestations[hash].title,
                manifestations[hash].authors,
                manifestations[hash].time.creationTime,
                manifestations[hash].time.expiryTime);
    }

    function addEvidence(string hash) public {
        manifestations[hash].evidentiality.addEvidence();
        emit AddedEvidence(manifestations[hash].evidentiality.evidenceCount);
    }
}

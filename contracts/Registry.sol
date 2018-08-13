pragma solidity ^0.4.24;

import "zos-lib/contracts/migrations/Initializable.sol";


/// @title Copyrightly Registry contract for copyright registration and authorship evidence storage
/// @author Roberto García (http://rhizomik.net/~roberto/)
contract Registry is Initializable {

    struct Manifestation {
        string title;
        address[] authors;
    }

    event ManifestEvent(string hash, string title, address[] authors, address indexed manifester);

    mapping(string => Manifestation) private manifestations;

    function initialize() public isInitializer { }

    /// @notice Register single authorship for `msg.sender` of the manifestation with title `title`
    /// and hash `hash`. Requires hash not previously registered.
    /// @dev To be used when their is just one author, which is considered to be the message sender
    /// @param hash Hash of the manifestation content, for instance IPFS Base58 Hash
    /// @param title The title of the manifestation
    function manifestAuthorship(string hash, string title) public {
        require(manifestations[hash].authors.length == 0, "Manifestation already registered");
        address[] memory authors = new address[](1);
        authors[0] = msg.sender;
        Manifestation memory manifestation = Manifestation(title, authors);
        manifestations[hash] = manifestation;
        emit ManifestEvent(hash, title, authors, msg.sender);
    }

    /// @notice Register joint authorship for `msg.sender` plus additional authors
    /// `additionalAuthors` of the manifestation with title `title` and hash `hash`.
    /// Requires hash not previously registered and at most 256 authors, including the one registering.
    /// @dev To be used when their is just one author, which is considered to be the message sender
    /// @param hash Hash of the manifestation content, for instance IPFS Base58 Hash
    /// @param title The title of the manifestation
    /// @param additionalAuthors The additional authors,
    /// including the one registering that becomes the first author
    function manifestJointAuthorship(string hash, string title, address[] additionalAuthors) public {
        require(manifestations[hash].authors.length == 0, "Manifestation already registered");
        require(additionalAuthors.length < 256, "Joint authorship limited to 256 authors");
        address[] memory authors = new address[](additionalAuthors.length + 1);
        authors[0] = msg.sender;
        for (uint8 i = 0; i < additionalAuthors.length; i++)
            authors[i+1] = additionalAuthors[i];
        Manifestation memory manifestation = Manifestation(title, authors);
        manifestations[hash] = manifestation;
        emit ManifestEvent(hash, title, authors, msg.sender);
    }

    /// @notice Retrieve the title and authors of the manifestation with content hash `hash`.
    /// @param hash Hash of the manifestation content, for instance IPFS Base58 Hash
    /// @return The title and authors of the manifestation
    function getManifestation(string hash) public constant
    returns (string title, address[] authors) {
        return (manifestations[hash].title, manifestations[hash].authors);
    }

    /// TODO: Change ownership, ruled by external oracle with role judge. Can change title and authors
}

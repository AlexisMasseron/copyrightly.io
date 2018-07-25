pragma solidity ^0.4.24;

/// @title Copyrightly Registry contract for copyright registration and authorship evidence storage
/// @author Roberto García (roberto@rhizomik.net)
contract CopyrightlyRegistry {

    struct Multihash {
        bytes32 hash;
        uint8 hashFunction;
        uint8 size;
    }

    struct Manifestation {
        Multihash content;
        string title;
        address[] authors;
    }

    event ManifestEvent(Manifestation manifestation);

    mapping (bytes32 => Manifestation) private manifestations;

    /// @notice Register single authorship for `msg.sender` of the manifestation with title `title`
    /// and content hash `hash`, hash function `hashFunction` and hash size `size`.
    /// @dev To be used when their is just one author, which is considered to be the message sender
    /// @param hash Hash part of the content multihash
    /// @param hashFunction Hash function of the content multihash
    /// @param size Sike of the content multihash
    /// @param title The title of the manifestation
    function manifestAuthorship(bytes32 hash, uint8 hashFunction, uint8 size, string title) public {
        bytes32 index = keccak256(hash, hashFunction, size);
        Multihash memory content = Multihash(hash, hashFunction, size);
        Manifestation memory manifestation = Manifestation(content, title);
        manifestation.authors.push(msg.sender);
        manifestations[index] = manifestation;
        emit ManifestEvent(manifestation);
    }

    /// @notice Retrieve the title and stake of manifestation with content
    /// hash `hash`, hash function `hashFunction` and hash size `size`.
    /// @param hash Hash part of the content multihash
    /// @param hashFunction Hash function of the content multihash
    /// @param size Sike of the content multihash
    /// @return The title and stake of the manifestation
    function getManifestation(bytes32 hash, uint8 hashFunction, uint8 size) public constant
    returns (string title, address[] authors) {
        bytes32 index = keccak256(hash, hashFunction, size);
        return (manifestations[index].title, manifestations[index].authors);
    }
}
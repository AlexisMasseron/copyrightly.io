pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Registry.sol";


contract TestRegistry {
    Registry private registry = Registry(DeployedAddresses.Registry());

    string constant HASH1 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
    string constant HASH2 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPBDG";
    string constant HASH3 = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnpBDg";
    string constant TITLE = "A nice picture";

    // Testing that manifest authorship of single author works
    function testSingleAuthorRegistered() public {
        address expectedAuthor = this;
        string memory title;
        address[] memory authors;

        registry.manifestAuthorship(HASH1, TITLE);
        (title, authors) = registry.getManifestation(HASH1);

        Assert.equal(title, TITLE, "The title of manifestation should match the registered one");
        Assert.equal(authors[0], expectedAuthor, "First author should be the expected one");
        Assert.equal(authors.length, 1, "There should be just one author");
    }

    // Testing that manifest joint authorship with 3 additional authors works
    function testJointAuthorRegistered() public {
        address[] memory ADDITIONAL_AUTHORS = new address[](3);
        ADDITIONAL_AUTHORS[0] = address(0x1);
        ADDITIONAL_AUTHORS[0] = address(0x2);
        ADDITIONAL_AUTHORS[0] = address(0x3);
        address firstAuthor = this;
        string memory title;
        address[] memory authors;

        registry.manifestJointAuthorship(HASH2, TITLE, ADDITIONAL_AUTHORS);
        (title, authors) = registry.getManifestation(HASH2);

        Assert.equal(title, TITLE, "The title of manifestation should match the registered one");
        Assert.equal(authors.length, 4, "There should 4 authors");
        Assert.equal(authors[0], firstAuthor, "First author should be the expected one");
        Assert.equal(authors[1], ADDITIONAL_AUTHORS[0], "Second author should be the expected one");
        Assert.equal(authors[2], ADDITIONAL_AUTHORS[1], "Third author should be the expected one");
        Assert.equal(authors[3], ADDITIONAL_AUTHORS[2], "Fourth author should be the expected one");
    }

    // Testing that manifest joint authorship with 0 additional authors works
    function testSingleAuthorThroughJointAuthorRegistered() public {
        address[] memory ADDITIONAL_AUTHORS = new address[](0);
        address firstAuthor = this;
        string memory title;
        address[] memory authors;

        registry.manifestJointAuthorship(HASH3, TITLE, ADDITIONAL_AUTHORS);
        (title, authors) = registry.getManifestation(HASH3);

        Assert.equal(title, TITLE, "The title of manifestation should match the registered one");
        Assert.equal(authors.length, 1, "There should 4 authors");
        Assert.equal(authors[0], firstAuthor, "First author should be the expected one");
    }

    // Testing that trying to re-register content fails
    function testAlreadyRegistered() public {
        ThrowProxy throwProxy = new ThrowProxy(address(registry));

        Registry(address(throwProxy)).manifestAuthorship(HASH1, TITLE);
        bool r = throwProxy.execute.gas(200000)();

        Assert.isFalse(r, "Should be false, as it should be reverted if already registered");
    }
}


// Proxy contract for testing reverts
contract ThrowProxy {
    address private target;
    bytes private data;

    constructor(address _target) public {
        target = _target;
    }

    //prime the data using the fallback function.
    function() public {
        data = msg.data;
    }

    function execute() public returns (bool) {
        return target.call(data);
    }
}

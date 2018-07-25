pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CopyrightlyRegistry.sol";

contract TestCopyrightlyRegistry {
    CopyrightlyRegistry private registry =
        CopyrightlyRegistry(DeployedAddresses.CopyrightlyRegistry());

    string constant HASH = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
    string constant TITLE = "A nice picture";

    // Testing that manifest authorship of single author works
    function testSingleAuthorRegistered() public {
        address expectedAuthor = this;
        string memory title;
        address[] memory authors;

        registry.manifestAuthorship(HASH, TITLE);
        (title, authors) = registry.getManifestation(HASH);

        Assert.equal(title, TITLE, "The title of manifestation should match the registered one.");
        Assert.equal(authors[0], expectedAuthor, "First author should be the expected one.");
        Assert.equal(authors.length, 1, "There should be just one author.");
    }

    // Testing that trying to re-register content fails
    function testAlreadyRegistered() public {
        ThrowProxy throwProxy = new ThrowProxy(address(registry));

        CopyrightlyRegistry(address(throwProxy)).manifestAuthorship(HASH, TITLE);
        bool r = throwProxy.execute.gas(200000)();

        Assert.isFalse(r, "Should be false, as it should be reverted");
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
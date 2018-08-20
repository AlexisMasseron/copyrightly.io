pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";


/// @title Library to implement expirable items
/// @author Roberto García (http://rhizomik.net/~roberto/)
library ExpirableLib {
    using SafeMath for uint;

    struct TimeAndExpiry {
        uint256 creationTime;
        uint256 expiryTime;
    }

    function isExpired(TimeAndExpiry storage self) internal constant returns(bool) {
        return (self.expiryTime > 0 && self.expiryTime < now);
    }

    function setExpiry(TimeAndExpiry storage self, uint256 duration) internal {
        self.creationTime = now;
        self.expiryTime = now.add(duration);
    }
}

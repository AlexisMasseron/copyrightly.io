pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";


/// @title Library to implement items that can accumulate evidences
/// @author Roberto García (http://rhizomik.net/~roberto/)
library EvidencableLib {
    using SafeMath for uint8;

    struct Evidentiality {
        uint8 evidenceCount;
    }

    /// @notice Check if the `self` Evidentiality struct has no evidences yet.
    /// @dev Used to check if the corresponding item evidences count is 0.
    /// @param self Evidentiality struct
    function isUnevidenced(Evidentiality storage self) internal constant returns(bool) {
        return (self.evidenceCount == 0);
    }

    /// @notice Add one to the `self` Evidentiality struct evidence count.
    /// @dev To be called from contracts that add evidences.
    /// @param self Evidentiality struct
    function addEvidence(Evidentiality storage self) internal {
        self.evidenceCount = uint8(self.evidenceCount.add(1));
    }
}

## Design Pattern Decisions

The project implements a "Circuit Breaker / Emergency Stop" for the *Manifestations* contract using OpenZeppelin *Pausable* contract, 
[https://openzeppelin.org/api/docs/lifecycle_Pausable.html]()

This pattern is tested in [manifestations.test.js](test/manifestations_pausable.test.js)

Moreover, a pattern similar to "Automatic Deprecation" has been implemented for the registered manifestations. This way, if a
user registers manifestations but does not provide evidences, the manifestations expire after a given amount of time fixed during
deployment o the *Manifestations* contract. Expiration in this case means that the manifestation can be overwritten by another user.

This pattern is implemented as a library in [ExpirableLib](contracts/ExpirableLib.sol), to facilitate its reuse. 
It has been tested in [manifestations_expirable.test.js](test/manifestations_expirable.test.js)

Overall, the contracts have been designed favouring modularity and reusability. Thus, the previous expiration functionality has been
implemented as a Solidity Library. There is also the "evidencable" functionality, that makes a item capable of accumulating evidences
supporting it, that has been also implemented using a Solidity Library [EvidencableLib](contracts/EvidencableLib.sol). This facilitates
making manifestations capable of accumulating evidences supporting them, but also reusing this same behaviour for claims. Moreover,
making this functionality available as a library reduces deployment costs.

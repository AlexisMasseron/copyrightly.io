pragma solidity ^0.4.24;

import "oraclize-api/usingOraclize.sol";

contract YouTubeEvidences is usingOraclize {
    string constant HTML = "html(https://www.youtube.com/watch?v=";
    string constant XPATH = ").xpath(count(//div[contains(@id,'description')]//a[contains(@href,'";

    mapping(bytes32=>YouTubeEvidence) public evidences;

    struct YouTubeEvidence {
        string hash;
        string videoId;
        bool isPending;
        bool isVerified;
    }

    event OraclizeQuery(string query);
    event YouTubeEvidenceEvent(bytes32 evidenceId, string indexed hash, string indexed videoId);

    constructor() {
        OAR = OraclizeAddrResolverI(0x9515d3C99AFa4CdF9a8CE6674e5ce1cFcb6eA88b);
    }

    function __callback(bytes32 evidenceId, string properLinksCount) {
        require(msg.sender == oraclize_cbAddress());
        require(evidences[evidenceId].isPending);
        if (parseInt(properLinksCount) > 0) {
            evidences[evidenceId].isVerified = true;
            emit YouTubeEvidenceEvent(evidenceId, evidences[evidenceId].hash, evidences[evidenceId].videoId);
        }
        evidences[evidenceId].isPending = false;
    }

    function check(string hash, string videoId) public payable returns (bytes32) {
        require(oraclize_getPrice("URL") > this.balance, "Not enough funds to run Oraclize query");
        string memory query = strConcat(HTML, videoId, XPATH, hash, "')]))");
        bytes32 evidenceId = oraclize_query("URL", query);
        evidences[evidenceId] = YouTubeEvidence(hash, videoId, true, false);
        return evidenceId;
    }
}

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
        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
    }

    /// @notice Callback for the oracle for query `evidenceId` including the `properLinksCount
    /// amount of links to the manifestation hash from the YouTube video description.
    /// @dev There should be at least one proper link for the YouTubeEvidence to be verified.
    /// @param evidenceId The identifier of the oracle query
    /// @param properLinksCount The amount of proper links in the YouTube video description
    function __callback(bytes32 evidenceId, string properLinksCount) {
        require(msg.sender == oraclize_cbAddress());
        require(evidences[evidenceId].isPending);
        if (parseInt(properLinksCount) > 0) {
            evidences[evidenceId].isVerified = true;
            emit YouTubeEvidenceEvent(evidenceId, evidences[evidenceId].hash, evidences[evidenceId].videoId);
        }
        evidences[evidenceId].isPending = false;
    }

    /// @notice Check using an oracle if the YouTube `videoId` is linked to the manifestation `hash`.
    /// @dev The oracle checks if the YouTube page for the video contains a link in its description
    /// pointing to the manifestation hash.
    /// @param hash The hash of the manifestation to be checked
    /// @param videoId The identifier of a YouTube video to be checked
    function check(string hash, string videoId) public payable returns (bytes32) {
        require(oraclize_getPrice("URL") > this.balance, "Not enough funds to run Oraclize query");
        string memory query = strConcat(HTML, videoId, XPATH, hash, "')]))");
        bytes32 evidenceId = oraclize_query("URL", query);
        evidences[evidenceId] = YouTubeEvidence(hash, videoId, true, false);
        return evidenceId;
    }
}

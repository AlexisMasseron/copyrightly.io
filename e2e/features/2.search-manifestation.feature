Feature: Search Manifestation
  In order to check authorship claims on content
  As a user
  I want to search if a piece of content is registered using its hash

  Scenario: Search a piece of content previously registered
    Given I'm on the home page and authenticated
    When I click submenu option "Search" in menu "Registry"
    And I fill the search form with content hash "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"
    And I click the "Search" button
    Then I see a result with "Title" "A nice picture"
    And I see a result with "Authors" "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"

  Scenario: Search a piece of content not registered
    Given I go to the home page
    When I click submenu option "Search" in menu "Registry"
    And I fill the search form with content hash "QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ"
    And I click the "Search" button
    Then I see alert with text "Content hash not found, unregistered" and close it

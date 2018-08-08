Feature: List Own Manifestations
  In order to keep track of ownership claims
  As a creator
  I want to list all the manifestation I have registered so far

  Scenario: List when I have previously registered a piece of content
    Given I'm on the home page and authenticated
    When I click submenu option "List" in menu "Registry"
    Then I see 1 result
    And I see a result with "Title" "A nice picture"
    And I see a result with "Authors" "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"

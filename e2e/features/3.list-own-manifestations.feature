Feature: List Own Manifestations
  In order to keep track of ownership claims
  As a creator
  I want to list all the manifestation I have registered so far

  Scenario: List when I have previously registered a piece of content
    Given I'm on the home page and authenticated
    When I click submenu option "List" in menu "Manifestations"
    Then I see 1 result
    And I see a result with "Title" "Te Hoho Rock"
    And I see a result with "Registerer" "0x6273...Ef57"

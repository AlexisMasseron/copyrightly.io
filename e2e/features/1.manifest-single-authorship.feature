Feature: Manifest Single Authorship
  In order to claim single authorship on a work
  As a creator
  I want to register its manifestation as a piece of content plus some descriptive metadata

  Scenario: Register a piece of content not previously registered
    Given I'm on the home page and authenticated
    When I click submenu option "Register" in menu "Registry"
    And I fill the register form with title "Te Hoho Rock at Cathedral Cove" and content hash "QmaY5GUhbc4UTFi5rzgodUhK3ARHmSkw7vGgULniYERyzv"
    And I click the "Register" button
    Then I see alert with text "Te Hoho Rock at Cathedral Cove" and close it
    And I see alert with text "Registration submitted, waiting for confirmation..." and close it

  Scenario: Register a piece of content previously registered
    Given I'm on the home page and authenticated
    When I click submenu option "Register" in menu "Registry"
    And I fill the register form with title "My Te Hoho Rock" and content hash "QmaY5GUhbc4UTFi5rzgodUhK3ARHmSkw7vGgULniYERyzv"
    Then The "Register" button is disabled
    And I see validation feedback for hash input with text 'Content already registered with title "Te Hoho Rock at Cathedral Cove"'

  @slow @disabled
  Scenario: Register a piece of content not previously registered (using hash from IPFS)
    Given I'm on the home page and authenticated
    When I click submenu option "Register" in menu "Registry"
    And I fill the register form with title "Smiling Sphinx Rock" and content file "Smiling Sphinx Rock.jpg"
    And I wait till finished uploading
    And I click the "Register" button
    Then I see alert with text "Smiling Sphinx Rock" and close it
    And I see alert with text "Registration submitted, waiting for confirmation..." and close it

  @slow @disabled
  Scenario: Register a piece of content previously registered (using hash from IPFS)
    Given I'm on the home page and authenticated
    When I click submenu option "Register" in menu "Registry"
    And I fill the register form with title "My Smiling Sphinx Rock" and content file "Smiling Sphinx Rock.jpg"
    And I wait till finished uploading
    Then The "Register" button is disabled
    And I see validation feedback for hash input with text 'Content already registered with title "TSmiling Sphinx Rock"'

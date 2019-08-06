Feature: Usefull exceptions should be throwed when incorrect step definitions detected

  Scenario: Define step with empty body

    Given incorrect step definition:

      """
      """

    Then error named GherkinStepsParseError should be throwed

  Scenario: Define step with non-Gherkin syntax

    Given incorrect step definition:

      """
      puts "Hello from Ruby!"
      """

    Then error named CompositeParserException should be throwed

  Scenario: Define Feature without Scenarios

    Given incorrect step definition:

      """
      Feature: some feature
      """

    Then error named GherkinStepsParseError should be throwed

  Scenario: Define Scenario with incorrect name

    Given incorrect step definition:

      """
      Feature: some feature
        Scenario: some scenario
      """

    Then error named GherkinStepsParseError should be throwed
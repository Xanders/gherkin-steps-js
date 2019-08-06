Feature: Programmer is able to write step definitions with Gherkin syntax

  Scenario: Try to use step defined with Gherkin syntax in a simple case

     When I put 4 into storage
     Then I should have 4 in the storage

  Scenario: Try to use steps with arguments

    Given a step with 1 argument that works
     Then step with 2 arguments should work too

  Scenario: Try to use steps with complex parameter types

    Given a step which parse and store heavy object 007
     Then I should see heavy object 007 in the storage

  Scenario: Try to use step with strange syntax

    Given a very strange Cucumber Expression with 1 argument and non-escaped `{` sign

  Scenario: Try to use more steps defined with Gherkin syntax

     Then I check acceptance step works
      And I check custom helpers works

  Scenario: Try to use Gherkin step defined with regular expression

    Given some great regexp

  Scenario: Try to use state manipulation steps

    Given great state tests

  Scenario: Try to use additional parameter types

    # Some types already checked in state tests
    Given human-readable arrays and numbers
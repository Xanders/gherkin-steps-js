# This is example from README.md
# I just want to be sure my example works properly

Feature: User can update profile on the site

  Scenario: User Alice updates her phone number

    Given user Alice
      And profile page
     When Alice enters new phone number
      And reloads the page
     Then she see new phone number
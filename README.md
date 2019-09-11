# Gherkin Steps

Write Cucumber step definitions with Gherkin – Cucumber features syntax.

It is like calling steps from steps, but Good™, not Evil™.

* [Show me the code](#show-me-the-code)
* [Why?](#why)
* [What to do?](#what-to-do)
* [Why not to call steps from steps?](#why-not-to-call-steps-from-steps)
* [How to use?](#how-to-use)
* [Reference](#reference)
  * [Basics](#basics)
  * [Regexp Syntax](#regexp-syntax)
  * [Params](#params)
  * **TODO:** [Doc Strings](#doc-strings)
  * **TODO:** [Data Tables](#data-tables)
  * **TODO:** [Timeouts](#timeouts)
  * [State](#state)
  * [Acceptance](#acceptance)
  * **TODO:** [Iterations](#iterations)
  * **TODO:** [Conditions](#conditions)
  * **TODO:** [Sequences](#sequences)
  * [Custom Helpers](#custom-helpers)
  * [Additional Parameter Types](#additional-parameter-types)
  * **TODO:** [Formatters](#formatters)
  * **TODO:** [Snippets](#snippets)
* [Changelog](https://github.com/Xanders/gherkin-steps-js/tree/master/CHANGELOG.md)

## Show me the code

This is usual feature:

**features/update_profile.feature**

```gherkin
Feature: User can update profile on the site

  Scenario: User Alice updates her phone number

    Given user Alice
      And profile page
     When Alice enters new phone number
      And reloads the page
     Then she see new phone number
```

And there are steps defined with Gherkin:

**features/step_definitions/update_profile.steps**

```gherkin
Feature: Steps for profile updating feature

  # Idea for refactoring: split to `users.steps` and `navigation.steps`

  Scenario: Given user {word}

    When I send request GET /
     And click on "Sign in" button
     And enter "~param~" into input[name="nickname"]
     And enter "I Love Bob" into input[name="password"]
     And click on "Enter" button

  Scenario: Given profile page

    When I send request GET /profile

  Scenario: When {}enters new phone number

    When I enter "~next phone number~" into input[name="phone_number"]
     And click on "Update" button

  Scenario: When {}reloads the page

    When I send request GET ~state $.current_url~

  Scenario: Then he/she see new phone number

    Then '~value from input[name="phone_number"]~' should be equal to "~last phone number~"
```

Here:

* `~param~` and `~state ...~` – built-in *step helpers*
* `~next ...~` and `~last ...~` – sequences step helpers
* `~value from ...~` – custom step helper, defined below
* `should be equal to` – built-in step for acceptance

Gherkin Steps defined no new syntax constructions with except of step helpers.
Also Gherkin Steps defined a few step definitions and parameter types, described below.

And usual basic steps:

**features/step_definitions/basic_steps.js**

```javascript
const { Given, When, Then } = require('cucumber');

When('I send request {word} {string}', function(verb, url) {
  // Request logic should be here, for example:
  //   this.currect_page = engine.send(verb, url);
  this.current_url = url;
});

When('(I )click on {string} button', function(label) {
  // Click logic should be here, for example:
  //   engine.find('button', label).click();
});

When('(I )enter {string} into {element}', function(value, element) {
  // Value enter logic should be here, for example:
  //    element.setValue(value);
});
```

Custom step helpers may be defined in following way:

**features/support/step_helpers.js**

```javascript
const { defineHelper, callHelper } = require('gherkin-steps');

defineHelper('value from {element}', async function(element) {
  // Get value logic should be here, for example:
  //   return element.value();
  return await callHelper('last phone number', this);
});
```

And also usual parameter type to complete the example:

**features/support/parameter_types.js**

```javascript
const { defineParameterType } = require('cucumber');

defineParameterType({
  name: 'element',
  regexp: /input\[name="\w+"\]/, // for example: engine.PATH_REGEXP
  transformer: path => path // for example: path => engine.find(path)
});
```

## Why?

**To write less code on underlying language, while keeping features short and readable.**

There are two common problems in my Cucumber practice:

1) Programmers writes Cucumber specifications. They likes their programming language, so they writes a lot of code.
   In the end we have beautiful **features/update_profile.feature** and huge messy imperative **features/step_definitions/thousands_of_steps.js**.
   Team grew, QA engineers arrived, they hate programmer's language and break their heads when trying to understand step definitions.
   Every time you say them: "you need to write a new step", the day of "I want to **rewrite all the things** or lay me off" become closer.

2) QA engineers writes Cucumber specifications. On every hard step definition they call for programmers to help.
   Programmers hates to be distracted. They write several very basic steps and say: "You have basic blocks, you can build any feature with them".
   Features grew. Brave ones can read them. Nobody except for last old QA engineer can write them. Nobody can call it "specification".
   In the end we have beautiful **features/step_definitions/basic_steps.js** and huge messy imperative **features/step_definitions/i_am_not_sure_what_is_this.feature**:

```gherkin
Feature: User can update profile on the site

  # TODO: refactor it (2009.07.03: urgently!)

  # 2014.11.27: Is this feature about users or profiles or requests or DOM elements? Anybody know?

  # 2017.01.30: DO NOT CHANGE ANYTHING! DRAGONS WAS HERE!

  Scenario: User Alice (maybe) updates her phone number

    Given I send request with successfull response and page store GET /
    Given I click on "Sign in" button with disable check
    Given I enter "Alice" into input[name="nickname"]
    Given I enter "I Love Bob" into input[name="password"]
    Given I click on "Enter" button with disable check
    Given I send request with successfull response and page store and URL store GET /profile
     When I generate random from template "phone_number"
     When I enter "last_generated_random" into input[name="phone_number"]
     When I click on "Update" button with disable check
     When I send request with substitution from current_url with successfull response and page store GET /fake_url_see_substitution
     Then I find element input[name="phone_number"]
     Then I check "last_found_element" is equal to "last_generated_random"
```

In a worst case you have both problems. Good luck!

## What to do?

**Gherkin Steps** are here for the rescue!

Features are still **features**: short, declarative, readable for anyone. *Specifications*.

Steps are still **steps**: knowing about implementation, close to "bare metal".
But writable for both QA engineers and programmers of any language.
Built from basic blocks. Debuggable.

**Batteries included:**
* [Params](#params)
* [State](#state)
* [Acceptance](#acceptance)
* **TODO:** [Iterations](#iterations)
* **TODO:** [Conditions](#conditions)
* **TODO:** [Sequences](#sequences) powered by [faker.js](https://github.com/marak/faker.js)
* [Custom Helpers](#custom-helpers)
* [Additional Parameter Types](#additional-parameter-types) (like array, JSON, JSONPath, generic number)
* **TODO:** [Formatters](#formatters) for simple debugging
* **TODO:** [Snippets](#snippets) (someone use them?)

Standard Gherkin features are also supported:
* [Cucumber Expressions](#basics) ([what is it?](https://cucumber.io/blog/announcing-cucumber-expressions))
* [Regexp Syntax](#regexp-syntax)
* **TODO:** [Doc Strings](#doc-strings)
* **TODO:** [Data Tables](#data-tables)
* **TODO:** [Timeouts](#timeouts)

In any moment you can move Cucumber backend to any other underlying language without pain: only few steps should be re-written (and target language should support Gherkin Steps).

**Note:** Gherkin Steps are only supported on JavaScript for now, sorry! But volunteers are welcome. :D

## Why not to call steps from steps?

Because it is Evil™:
https://cucumber.io/docs/guides/anti-patterns/#support-for-conjunction-steps

And why not "to use the features of your programming language" as said in the article? See [Why?](#why) section above for an answer.

## How to use?

Oh, you know:

```bash
npm install --save-dev gherkin-steps
```

Or with [Yarn](https://yarnpkg.com):

```bash
yarn add gherkin-steps --dev
```

Then in `package.json` scripts:

```json
{
  ...
  "scripts": {
    ...
    "test": "cucumber-js --require-module gherkin-steps/register --require 'features/support/world.js' --require 'features/**/*.js' --require 'features/**/*.steps'",
    ...
  },
  ...
}
```

Or in `cucumber.js`:

```javascript
let arguments = [
  "--require-module gherkin-steps/register", // for Gherkin Steps support
  "--require 'features/support/world.js'", // load World at first
  "--require 'features/**/*.js'", // load basic steps and support files
  "--require 'features/**/*.steps'", // load steps with Gherkin syntax
  // formatters and other options
].join(' ');

module.exports = {
  default: arguments
};
```

Then just add some files with `.steps` extension into `step_definitions` folder.

Refer to [features](https://github.com/Xanders/gherkin-steps-js/tree/master/features) folder in this repo for examples.

**Important:** Requiring `gherkin-steps/register` module will add support for syntax only. In order to use additional features like [State](#state), [Acceptance](#acceptance) or [Additional Parameter Types](#additional-parameter-types), please add following line to your `features/support/world.js`:

```javascript
require('gherkin-steps/all');
```

You also can include certain features only, like this:

```javascript
require('gherkin-steps/lib/state');
require('gherkin-steps/lib/acceptance');
require('gherkin-steps/lib/parameter_types');
require('gherkin-steps/lib/parameter_types/json'); // or even more granular
```

Make sure to require World before other support files.

**Note:** Cucumber.js `5.x.x` only supported for now. Volunteers are welcome!

## Reference

### Basics

Every `.steps` file should follow standard Gherkin structure:
* `Feature` keyword on the top
* One or more `Scenario` keywords under `Feature`
* Any number of `Given`/`When`/`Then`/`And`/`But` keywords under each `Scenario`
* Optional comments, started with `#`

There are some differences from the `.feature` file:
* `Feature` description is ignored by the library
* `Rule` keyword is ignored by the library
* `Scenario Outline` and `Background` keywords are not allowed (please create [issue](https://github.com/Xanders/gherkin-steps-js/issues) if you have ideas how to use them)

`Scenario` description should start with `Given`, `When` or `Then` keyword. Then *Cucumber Expression* (see introduction [here](https://cucumber.io/blog/announcing-cucumber-expressions) and reference [here](https://cucumber.io/docs/cucumber/cucumber-expressions)) or *Regular Expression* (see details [below](#regexp-syntax)) should follow. This expression will be used for step definition.

`Scenario` description *may* have ` (X params)` postfix. It is not part of the expression. See [params](#params) section for details.

`Scenario` body may consist of both steps defined with Gherkin and steps defined with basic language. So be careful:

```gherkin
Feature: This description will be ignored, so I can write silly things

  Scenario: Given cucumber expression here

    Given cucumber expression here

    # TODO: make this recursion executed by random to make debugging funnier
```

You can use non-English language in `.steps`, just like in the `.features`. But, unfortunately, params postfix and built-in step helpers are available only in English for now. Volunteers are welcome!

### Params

Steps defined with Gherkin may have arguments – `params` in this library terms.

To define params you can use same techniques as in any usual step definition: `{parameter_types}` for *Cucumber Expressions* and captured `(groups)` for *Regular Expressions*.

To use arguments in steps you should use one of step helpers:
* `~param~` if there was only one argument in the definition
* `~param 1~`, `~param 2~`, `~param 3~`, etc. if there was several arguments in the definition

**Note 1**: For semantic purposes you cannot use `~param~` when there are several arguments and `~param 1~` when there is one argument.

Example:

```gherkin
  Scenario: Given a step with {int} argument that works

    Then ~param~ should be equal to 1

  Scenario: Then step with {int} arguments should {word} too

    Then ~param 1~ should be equal to 2
     And "~param 2~" should be equal to "work"
```

Usage:

```gherkin
  Scenario: Try to use steps with arguments

    Given a step with 1 argument that works
     Then step with 2 arguments should work too
```

There is no rules to use `"~param~"` instead of `~param~` – step helper does not know anything about quotes, they will be added to the step text "as is". They used in this example for semantic purposes.

**Note 2**: When parser see step helper in the step text, it will just replace helper call with the call result in the text. If helper returns non-string value, it will be converted to string. At first, library searches for `toCucumberString` function – it should be sync or Promise-based async (including defined with `async` keyword), have no arguments and return string. If such function is not defined, library will just call usual `toString` function.
So if you want to use some Parameter Types with non-`s => s` transformer, be sure to provide `toCucumberString` function to the result of transformation to keep consistency between step calls:

```javascript
const { defineParameterType } = require('cucumber');

defineParameterType({
  name: 'heavy_object',
  regexp: /heavy object (\d+)/,
  transformer: id => ({ id: Number(id), toCucumberString: () => `heavy object ${id}` })
});
```

This will work great with step:

```gherkin
  Scenario: Given a step which parse and store {heavy_object}

    When I save ~param~ in the storage
```

**Note 3**: Gherkin Steps cannot always determine params number correctly. For example:

```gherkin
  Scenario: Given a very strange Cucumber Expression with {int} argument and non-escaped `{` sign

  # Error "function uses multiple asynchronous interfaces" will be thrown
```

In this case you can add special postfix to help library understand correct params number. Possible postfixes are:
* ` (no params)`
* ` (1 param)`
* ` (X params)`, where `X` is integer >= 2

This postfix will be removed from scenario description before expression parsing, so do not include it in the step call.

Correct example:

```gherkin
  Scenario: Given a very strange Cucumber Expression with {int} argument and non-escaped `{` sign (1 param)

  # Works!
```

### Regexp Syntax

While *Cucumber Expression* are recommended, you can still use old good *Regular Expressions*. Just start and end expression after `Given`, `When` or `Then` keyword in `Scenario` description with `/`:

```gherkin
  Scenario: Given /^some (great|ugly) regexp$/

    Then "~param~" should be equal to "great"
```

If you want to add ` (X params)` postfix, it should be placed *after* trailing `/`:

```gherkin
  Scenario: Given /(?!hardcore )regexp without params/ (no params)

  # Note: This example won't work since lookahead/lookbehind does not supported by Cucumber
```

Gherkin Steps params parser can determine number of arguments when using usual `(groups)`, named `(?<name>groups)` (names just ignored by Cucumber) and non-captured `(?:groups)`, but not other group kinds like lookahead/lookbehind groups, but they are not supported by Cucumber anyway. So you'll not need the postfix in most of cases. Please refer to [params](#params) section for details about this postfix.

### Doc Strings

**This function is under development yet.** Create [issue](https://github.com/Xanders/gherkin-steps-js/issues) if you want to help or vote for priority.

### Data Tables

**This function is under development yet.** Create [issue](https://github.com/Xanders/gherkin-steps-js/issues) if you want to help or vote for priority.

### Timeouts

**This function is under development yet.** Create [issue](https://github.com/Xanders/gherkin-steps-js/issues) if you want to help or vote for priority.

### State

Most of tests should store some state between steps and common way to do it is to use World object. Gherkin Steps have built-in instruments to manage a state in the World object.

First of all, this library uses JSONPath [concept](https://goessner.net/articles/JsonPath) and [library](https://github.com/dchester/jsonpath) to perform any operations with a state. Please, follow given links if you're not familiar with them.

There are three ways to interact with state in Gherkin Steps:
1) **Step** `Then {structured_type} should be stored as {}` to set new state
2) **Parameter Types** `{jsonpath}` and `{jsonpath_array}` to pass state values into definition
3) **Step Helpers** `~state {jsonpath}~` and `~state {jsonpath_array}~` to insert state values into step text before expression matching

See [Additional Parameter Types](#additional-parameter-types) section for details about `{structured_type}`, `{jsonpath}` and `{jsonpath_array}`.

Example:

```gherkin
  Scenario: Given {word} state tests
  # Hint: the word should be "great"

    Then {"some": "great", "json": [1, 2, 3, 4]} should be stored as $.fixtures
     And $.fixtures..[?(@ == "~param~")] should exists
     And [$.fixtures.json[?(@ > 3)]] should not be empty
     And {"an_answer": ~state $.fixtures.json[(@.length - 1)]~~state $.fixtures.json[1]~} should be equal to {"an_answer": 42}
     And [~state [$.fixtures.json[:2]]~] should be equal to [1, 2]
```

The main difference between `{jsonpath}` and `~state {jsonpath}~` is the moment of parsing:
* In the first case JSONPath expression included in the step text, so you should use `{jsonpath}` Parameter Type in the step definition, but also you can use step helpers like `~param X~` in the JSONPath query.
  It is useful when you need a value itself.
* In the second case step text will be modified before matching, so you can use final types like `{number}` or `{string}` in the step definition, but you cannot use step helpers inside step helpers.
  It is useful when a value is the part of other object.

It is recommended to name keys in state with `underscore_notation`, not `camelCasedNotation` for two reasons:
* Better readability for humans, which is priority for Cucumber
* Better consistency between implementations, easier to change underlying language

### Acceptance

Acceptance steps allows you to check values without custom steps in underlying language at all.

Following acceptance steps are built-in:

* `Then {structured_type} should be equal to {structured_type}`
* `Then {structured_type} should not be equal to {structured_type}`
* `Then {jsonpath} should exists`
* `Then {jsonpath} should not exists`
* `Then {jsonpath_array} should be empty`
* `Then {jsonpath_array} should not be empty`

See [Additional Parameter Types](#additional-parameter-types) section for details about `{structured_type}`, `{jsonpath}` and `{jsonpath_array}`.

Use the power of JSONPath to filter out any data you want before pass to acceptance step. See examples and links to JSONPath docs in [State](#state) section.

Feel free to create an [issue](https://github.com/Xanders/gherkin-steps-js/issues) if you have any questions for existing or ideas for new acceptance steps.

### Iterations

**This function is under development yet.** Create [issue](https://github.com/Xanders/gherkin-steps-js/issues) if you want to help or vote for priority.

Iterations will let you control the execution flow.

### Conditions

**This function is under development yet.** Create [issue](https://github.com/Xanders/gherkin-steps-js/issues) if you want to help or vote for priority.

Conditions will let you control the execution flow.

### Sequences

**This function is under development yet.** Create [issue](https://github.com/Xanders/gherkin-steps-js/issues) if you want to help or vote for priority.

Sequences in a separated module will provide helpers to generate fake data with [faker.js](https://github.com/marak/faker.js).

### Custom Helpers

You can add own helpers to use in step definitions.
They works only in `.steps` files, not in `.features`, and only in step body (under `Scenario` keyword), not in step title (right after `Scenario` keyword).
Use tilde (`~`) symbol to call helper. You can escape tilde inside and outside helper with backslash (`\`). There is no way to escape backslash before tilde, please create [issue](https://github.com/Xanders/gherkin-steps-js/issues) if you need such feature.

For example, you want to be able to sum numbers:

```gherkin
    Then ~sum of 2 and 2~ should be equal to 4
```

Use `defineHelper` function of the package to define the helper.
It is recommended to place such definitions into `features/support/step_helpers.js`. If you has several groups of helpers, use the `step_helpers` folder and files with `_helpers` postfix instead: `features/support/step_helpers/users_helpers.js`.

`defineHelper` function receives two arguments:
* `pattern` – can be both Cucumber Expression and regexp, just like in a step definition
* `callback` – can be both sync or async function

**Note:** Only Promise-based async functions are supported (including defined with `async` keyword). Callback-based async functions are not planned to be supported.

```javascript
const { defineHelper } = require('gherkin-steps');

defineHelper('sum of {number} and {number}', (a, b) => a + b);
```

In `callback` function keyword `this` will refer to current `World` unless this function was an arrow function (which does not have own `this`).

It is recommended to write the helper's pattern as close to native language as possible. Spaces are welcome, underscores are not. You can use non-English patterns too, of course.

If several patterns will match for one helper call, exception will be thrown.

---

There is also public `callHelper` function in the package. It can be useful in case when you want to call one helper from another.

For example, you can make a workaround for Cucumber Expressions limitation: parameter type cannot be optional.

```javascript
const { defineHelper } = require('gherkin-steps');

defineHelper('param( {int})', (position = 1) => ...); // => Error: Parameter types cannot be optional
```

Instead, just define two helpers:

```javascript
const { defineHelper, callHelper } = require('gherkin-steps');

defineHelper('param {int}', position => ...);
defineHelper('param', () => callHelper('param 1'));
```

`callHelper` function receives two arguments:
* `text` – to match helper pattern
* `world` – to pass into helper callback and parameter types transformers (make no sense when they are arrow functions)

The return value is always `Promise`.

### Additional Parameter Types

This library provides following built-in [parameter types](https://cucumber.io/docs/cucumber/cucumber-expressions/#parameter-types):
* `json` to match JSON objects like `{"some": "json"}` or `["army", "of", 2]`
* `jsonpath` to match JSONPath queries like `$.key[0]` and return first matched value
* `jsonpath_array` to return all matched values, use square brackets around query like this: `[$.key[*]]`
* `number` to match human-readable forms of numbers: both integers and floats, and also some named numbers like `-5`, `3.14`, `.5`, `Two`, `zero` (which has alias `no`, for example: `Then Alice has no bytes left to encrypt`)
* `array` to match human-readable form of arrays: `Alice and Bob`, `1, 2, 3` (numbers will be parsed with human-readable parser from `number` parameter type), `A, B and C` (or `A, B, and C` – you can use comma before "and" when there is three or more elements)
* `structured_type` to match any of `jsonpath_array`, `jsonpath`, `json`, `string` (built-in Cucumber type, string with quotes), `number` or `array` types

### Formatters

**This is feature proposal.** Create [issue](https://github.com/Xanders/gherkin-steps-js/issues) if you want to help or vote for implementation.

Custom formatters will help you with debugging.

### Snippets

**This is feature proposal.** Create [issue](https://github.com/Xanders/gherkin-steps-js/issues) if you want to help or vote for implementation.

Custom snippets for code examples in case of unknown step.
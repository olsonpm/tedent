# Tedent

Keep your multi-line templated strings lookin' good :sunglasses:

<br>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of Contents**

- [What is it?](#what-is-it)
- [What does the name stand for?](#what-does-the-name-stand-for)
- [Why create it?](#why-create-it)
- [Simple Usage](#simple-usage)
- [How the indentation works](#how-the-indentation-works)
- [Important Usage Notes](#important-usage-notes)
  - [edge-cases and input requirements](#edge-cases-and-input-requirements)
- [Test](#test)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<br>

### What is it?

- A function similar to [dedent](https://github.com/dmnd/dedent) just with
  different semantics

<br>

### What does the name stand for?

- `Te`mplate string
- in`dent`ation

names are hard

<br>

### Why create it?

- dedent didn't handle the following case like I wanted

```js
//
// any multi-line indented string will do, but stringifying an object is the
//   common case for me
//
const boroughs = ['Brooklyn', 'Manhattan'],
  boroughsString = JSON.stringify(boroughs, null, 2)

console.log(
  dedent(`
    New York boroughs
    ${boroughs}
  `)
)

/*
expected:
New York boroughs
[
  "Brooklyn",
  "Manhattan"
]

actual:
New York boroughs
  [
"Brooklyn",
"Manhattan"
]
*/
```

<br>

### Simple Usage

```js
import tedent from 'tedent'

console.log(
  tedent(`
    This will be indented
      as you expect
  `)
)

// writes:
// This will be indented
//   as you expect
```

<br>

### How the indentation works

The indentation scheme is simple. `tedent` takes the second line in the string
and sets the number of leading spaces as the 'anchor'. All lines are then
indented according to the anchor using the rules:

- if the number of leading spaces is greater or equal to the anchor, then
  indent `numLeadingSpaces - anchor`
- if it's less, then indent `numLeadingSpaces`

Keep in mind the above rules are catered to multiline variables. The result will
look weird if you manually expand the variables

i.e. this is expected

```js
const moreInfo = 'more\ninfo'
tedent(`
    Some string
    ${moreInfo}
`)
```

not this

```js
tedent(`
    Some string
    more
info
`)
```

`tedent` will handle both the same obviously, but the first one reads
as intended

<br>

### Important Usage Notes

- First of all, this library doesn't handle tabs. I will accept a PR
  with support

- Secondly, if you always use `tedent` like the following

  ```js
  tedent(`
    at least one line
  `)
  ```

  then you shouldn't run into any issues. However we all know input can be
  tricky so `tedent` has a few edge-cases built-in as well as input requirements

#### edge-cases and input requirements

- if the first argument is anything but `undefined` or `typeof 'string'` then an error will be thrown
- if you pass `undefined` an empty string is returned
- if you pass a string with three or more lines, then
  - the first and last lines must contain only whitespace
  - the second line must contain a non-whitespace character
  - _an error will be thrown if the above two conditions are not met_
- if you pass a string with fewer than 3 lines
  - if they only contain whitespace then an empty string is returned
  - otherwise an error is thrown
- finally, all trailing whitespace from the result is trimmed

I didn't feel it necessary to explain the reasons for my choices in handling
edge-cases, but if you have questions please ask via github issues.

<br>

### Test

`./run test`

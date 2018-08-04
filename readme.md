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

The indentation logic is fairly convoluted in order to make the following work

```js
const jstring = anObject => JSON.stringify(anObject, null, 2)

console.log(
  tedent(`
    header

      object 1: ${jstring(object1)}

      object 2: ${jstring(object2)}
  `)
)

//---------
// outputs
//---------
// header
//
//   object 1: {
//     ...properly indented object1 contents...
//   }
//
//   object 2: {
//     ...properly indented object2 contents...
//   }
//
```

Because the indentation logic is both young and convoluted, please refer to
[the code](index.js) and [tests](test.js) for details. The library is not that
big and if you have any questions please create a github issue.

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

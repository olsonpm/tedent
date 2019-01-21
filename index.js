//------//
// Init //
//------//

const areOnlyWhitespace = isOnlyWhitespace,
  {
    invalidFirstOrLastLine,
    invalidSecondLine,
    invalidFewerThan3Lines,
    unsupportedArgument,
  } = getErrorMessages(),
  onlyWhitespaceRe = /^\s*$/

//
//------//
// Main //
//------//

const tedent = aString => {
  if (aString === undefined) return ''
  else if (typeof aString !== 'string') throw new Error(unsupportedArgument)

  // first validate first and last line have only whitespace
  const allLines = aString.split('\n')

  // handling less than 3 lines requires special treatment
  if (allLines.length < 3) {
    if (all(areOnlyWhitespace)(allLines)) return ''
    else throw new Error(invalidFewerThan3Lines)
  }

  const firstLine = allLines[0],
    secondLine = allLines[1],
    lastLine = allLines[allLines.length - 1]

  if (!all(isOnlyWhitespace)([firstLine, lastLine])) {
    throw new Error(invalidFirstOrLastLine)
  } else if (isOnlyWhitespace(secondLine)) {
    throw new Error(invalidSecondLine)
  }

  // valid input woo woo !

  const anchor = getNumberOfLeadingSpaces(secondLine)

  // allLines is being mutated for performance
  return passThrough(allLines, [
    removeFirstAndLast,
    indentWith(anchor),
    trimLastLines,
    joinWith('\n'),
  ])
}

//
//------------------//
// Helper Functions //
//------------------//

function joinWith(separator) {
  return arrayOfStrings => arrayOfStrings.join(separator)
}

function isOnlyWhitespace(aString) {
  return onlyWhitespaceRe.test(aString)
}

//
// - removes any tailing lines which only contain whitespace
// - last line with a non-whitespace character has tailing whitespace removed
//
// TODO: after new 'fes' is written, utilize a new method 'discardLastWhile'.
//   This for loop below is bugly
//
function trimLastLines(arrayOfStrings) {
  let i = arrayOfStrings.length - 1

  for (; i >= 0; i -= 1) {
    if (isOnlyWhitespace(arrayOfStrings[i])) {
      arrayOfStrings.pop()
    } else {
      const currentString = arrayOfStrings[i]
      let j = currentString.length - 1
      for (; j >= 0; j -= 1) {
        if (currentString[j] !== ' ') break
      }
      arrayOfStrings[i] = currentString.slice(0, j + 1)
      break
    }
  }

  return arrayOfStrings
}

function removeFirstAndLast(allLines) {
  allLines.pop()
  allLines.shift()
  return allLines
}

function passThrough(argument, arrayOfFunctions) {
  return arrayOfFunctions.reduce(
    (result, aFunction) => aFunction(result),
    argument
  )
}

function indentWith(anchor) {
  return allLines => {
    if (anchor === 0) return allLines

    let runningIndent = 0

    for (let i = 0; i < allLines.length; i += 1) {
      const oldLine = allLines[i]

      allLines[i] = adjustWhitespace(allLines[i], anchor, runningIndent)
      runningIndent = passThrough(oldLine, [
        getNumberOfLeadingSpaces,
        updateIndent(runningIndent),
      ])
    }

    return allLines
  }

  // helper function scoped to 'indentWith'

  function updateIndent(runningIndent) {
    return leadingSpaces => {
      const maybeNewIndent = leadingSpaces - anchor

      if (maybeNewIndent === 0) return 0
      else if (maybeNewIndent > 0) return maybeNewIndent
      else return runningIndent
    }
  }
}

function adjustWhitespace(line, anchor, runningIndent) {
  const numberOfLeadingSpaces = getNumberOfLeadingSpaces(line),
    lineWithoutLeadingSpace = discardFirst(numberOfLeadingSpaces)(line),
    currentIndent = numberOfLeadingSpaces - anchor

  let newLeadingSpace = 0

  if (currentIndent > 0) newLeadingSpace = currentIndent
  else if (currentIndent < 0)
    newLeadingSpace = numberOfLeadingSpaces + runningIndent

  return createStringOfSpaces(newLeadingSpace) + lineWithoutLeadingSpace
}

function discardFirst(n) {
  return line => line.slice(n)
}

function getNumberOfLeadingSpaces(line) {
  let i = 0
  for (; i < line.length; i += 1) {
    if (line[i] !== ' ') break
  }
  return i
}

function all(predicate) {
  return anArrayLike => {
    for (let i = 0; i < anArrayLike.length; i += 1) {
      if (!predicate(anArrayLike[i], i, anArrayLike)) return false
    }
    return true
  }
}

//
// implementation thanks to Jon Schlinkert
//
/*!
 * repeat-string <https://github.com/jonschlinkert/repeat-string>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

function createStringOfSpaces(desiredLength) {
  // cover common, quick use cases
  if (desiredLength === 0) return ''
  else if (desiredLength === 1) return ' '
  else if (desiredLength === 2) return '  '

  const max = ' '.length * desiredLength
  let result = '',
    spaces = ' '

  while (max > result.length && desiredLength > 1) {
    if (desiredLength & 1) {
      result += spaces
    }

    desiredLength >>= 1
    spaces += spaces
  }

  result += spaces
  result = result.substr(0, max)

  return result
}

function getErrorMessages() {
  const expectedUsage =
    'Expected usage:\ntedent(`\n  Some string\n  ${here}\n`)'

  return {
    invalidFirstOrLastLine: `The first and last lines are only allowed to contain whitespace\n${expectedUsage}`,
    invalidSecondLine: `The second line must have a non-whitespace character\n${expectedUsage}`,
    invalidFewerThan3Lines:
      'tedent expects a string with three or more lines.  When fewer are' +
      '\n  passed then they must contain only whitespace for this error not' +
      `\n  to be thrown.\n${expectedUsage}`,
    unsupportedArgument: `tedent requires a string or 'undefined' argument\n${expectedUsage}`,
  }
}
//
//---------//
// Exports //
//---------//

module.exports = tedent

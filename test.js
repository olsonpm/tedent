//---------//
// Imports //
//---------//

const chai = require('chai'),
  m = require('./index')

//
//------//
// Init //
//------//

chai.should()

const { expect } = chai

//
//------//
// Main //
//------//

suite('simple', () => {
  test('no indentation', () => {
    m(`
      first
      second
    `).should.equal('first\nsecond')
  })

  test('second line indented beyond anchor', () => {
    m(`
      first
        second
    `).should.equal('first\n  second')
  })

  test('second line indented behind anchor', () => {
    m(`
      first\n  second
    `).should.equal('first\n  second')
  })

  test('trailing empty line removed', () => {
    m(`
      first\n  second

    `).should.equal('first\n  second')
  })

  test('trailing space in last line removed', () => {
    m(`
      first\n  second${' '}${' '}
    `).should.equal('first\n  second')
  })

  test('indent affects subsequent lines', () => {
    // indent is relative to prior line
    m(`
      first
        second\n  third\n    fourth
    `).should.equal('first\n  second\n    third\n      fourth')
  })

  test('only indent subsequent lines with less leading space than the anchor', () => {
    m(`
      first
        second
        third\n  fourth
    `).should.equal('first\n  second\n  third\n    fourth')
  })
})

suite('complex', () => {
  //
  // I generally prefer to keep a 'catch all' in case combinations of units have
  //   unexpected results
  //
  test('catch all', () => {
    m(`
      first
        second
        third\n  fourth
      fifth

    `).should.equal('first\n  second\n  third\n    fourth\nfifth')
  })
})

suite('obscure', () => {
  test('undefined', () => {
    m().should.equal('')
  })
  test('empty string', () => {
    m('').should.equal('')
  })
  test('two lines', () => {
    m('\n').should.equal('')
  })
})

suite('errors', () => {
  test('invalid first line', () => {
    expect(() =>
      m(`invalid

    `)
    ).to.throw('The first and last lines')
  })
  test('invalid last line', () => {
    expect(() =>
      m(`

      invalid`)
    ).to.throw('The first and last lines')
  })
  test('invalid less than 3 lines', () => {
    expect(() => m(`invalid`)).to.throw('tedent expects a string with three')
  })
})

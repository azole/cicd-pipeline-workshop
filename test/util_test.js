var expect = require('chai').expect;
var calculator = require('../src/utils/calculator');

describe('Add Calculator', function () {
  it('Add two positive numbers', function () {
    let sum = calculator.add(1, 4);
    expect(sum).to.equal(5);
  });
});

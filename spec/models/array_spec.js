var expect = require('expect.js');
var Xikitita = require('../../app/models/xikitita.js');

describe('Array', function() {
  before(function() {
    Xikitita
      .init
  });

  it('#toJson', function () {
    expect([].toJson).to.be('[]');
  });

  it('#asJson', function () {
    expect([].asJson).to.be.a(Object);
  });

});
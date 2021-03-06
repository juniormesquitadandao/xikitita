var expect = require('expect.js');
var Xktta = require('../../temp/xktta.js');

describe('Class', function() {

  before(function() {
    Xktta
      .init
      .I18n('en', {
        classes: {
          customer: {
            member: 'One Customer',
            collection: 'Many Customers',
            attributes: {
              name: 'Name'
            }
          },
          user: {
            member: 'One User',
            collection: 'Many Users',
            attributes: {
              email: 'Email'
            }
          },
          permission: {
            member: 'One Permission',
            collection: 'Many Permissions',
            attributes: {
              customers: 'Customers'
            }
          },
          stub: {
            member: 'One Stub',
            collection: 'Many Stub'
          }
        }
      })
      .Class('Customer', function(){
        attrAccessor('id', 'name', 'phone');
      })
      .Class('User', function(){
        attrAccessor('id', 'email', 'customer', 'permission');
      })
      .Class('Permission', function(){
        attrAccessor('id', 'name', 'customers');
      })
      .Class('Stub', function(){

        attrAccessor('id');

        def('objectMethod', function(){
          return object;
        });

        defClass('classMethod', function(){
          return __class__.name;
        });

      });
  });

  it('::name', function () {
    expect(Customer.name).to.be('Customer');
    expect(User.name).to.be('User');
    expect(Permission.name).to.be('Permission');
    expect(Stub.name).to.be('Stub');
  });

  it('::def', function() {
    expect(new Stub().objectMethod().toJson).to.be('{"id":null}');
  });

  it('::defClass', function() {
    expect(Stub.classMethod()).to.be('Stub');
  });

  it('#toJson', function () {
    expect(new Stub().toJson).to.be('{"id":null}');
  });

  it('#asJson', function () {
    expect(new Stub().asJson).to.be.a(Object);
  });

  it('#new', function () {
    expect(Stub).withArgs({two: 'value'}).to.throwException(function (exception) {
      expect(exception).to.be.a(TypeError);
      expect(exception.message).to.be('stub.two is not a attribute');
    })

    Xktta
      .Class('Stub', function(){
        attrAccessor('id', 'one', 'two');
      })

    expect(new Stub().toJson).to.be('{"id":null,"one":null,"two":null}');
    expect(new Stub({}).toJson).to.be('{"id":null,"one":null,"two":null}');
    expect(new Stub('{}').toJson).to.be('{"id":null,"one":null,"two":null}');

    expect(new Stub({one: 'value'}).toJson).to.be('{"id":null,"one":"value","two":null}');
    expect(new Stub({'one': 0}).toJson).to.be('{"id":null,"one":0,"two":null}');

    expect(new Stub('{"one": "value"}').toJson).to.be('{"id":null,"one":"value","two":null}');
    expect(new Stub('{"one": 0}').toJson).to.be('{"id":null,"one":0,"two":null}');
  });


  it('primaryKey', function () {
    Xktta
      .Class('Stub', function(){
        attrAccessor('id_stub');
      })

    expect(new Stub().toJson).to.be('{"id_stub":null}');
    expect(new Stub({id_stub: 1}).toJson).to.be('{"id_stub":1}');
  });

  it('foreingKey', function () {
    Xktta
      .Class('Stub', function(){
        attrAccessor('id');
      })
      .Class('Stub2', function(){
        attrAccessor('id', 'stub');
      })

    expect(new Stub2({ stub: new Stub({id: 1}) }).toJson).to.be('{"id":null,"stub":{"id":1}}');
    expect(new Stub2({ stub: new Stub({id: 1}) }).stub).to.be.a(Stub);
  });

  it('attrAccessor', function () {
    expect(new Customer().toJson).to.be('{"id":null,"name":null,"phone":null}');
  });

  it('::toHuman', function () {
    expect(Customer.toHuman.member).to.be('One Customer');
    expect(User.toHuman.member).to.be('One User');
    expect(Permission.toHuman.member).to.be('One Permission');
    expect(Stub.toHuman.member).to.be('One Stub');

    expect(Customer.toHuman.collection).to.be('Many Customers');
    expect(User.toHuman.collection).to.be('Many Users');
    expect(Permission.toHuman.collection).to.be('Many Permissions');
    expect(Stub.toHuman.collection).to.be('Many Stub');
  });

  it('#toHuman', function () {
    expect(new Customer().toHuman.name).to.be('Name');
    expect(new User().toHuman.email).to.be('Email');
    expect(new Permission().toHuman.customers).to.be('Customers');
  });

  it('#reset', function () {
    var customer = new Customer({name: 'Name', phone: '0000'});

    customer.name = null;
    customer.phone = null;
    customer.reset

    expect(customer.toJson).to.be('{"id":null,"name":"Name","phone":"0000"}');
  });

  it('#changes', function () {
    Xktta
      .Class('Stub', function(){
        attrAccessor('id_stub', 'one', 'two', 'stub2');
      })
      .Class('Stub2', function(){
        attrAccessor('id');
      });

    var stub = new Stub({stub2: new Stub2() });

    stub.one = 'One';
    stub.two = 'Two';

    expect(stub.changes.toJson).to.be('{"one":[null,"One"],"two":[null,"Two"]}');
    expect(stub.changes_id_stub.toJson).to.be('[]');
    expect(stub.changes_one.toJson).to.be('[null,"One"]');
    expect(stub.changes_two.toJson).to.be('[null,"Two"]');
  });

  it('#changed', function () {
    Xktta
      .Class('Stub', function(){
        attrAccessor('id_stub', 'one', 'two')
      })

    var stub = new Stub();

    expect(stub.changed).to.be(false);
    expect(stub.changed_id_stub).to.be(false);
    expect(stub.changed_one).to.be(false);
    expect(stub.changed_two).to.be(false);

    stub.id_stub = 1;

    expect(stub.changed).to.be(true);
    expect(stub.changed_id_stub).to.be(true);
    expect(stub.changed_one).to.be(false);
    expect(stub.changed_two).to.be(false);
  });

});
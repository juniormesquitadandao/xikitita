var expect = require('expect.js');
var Xktta = require('../../temp/xktta.js');

describe('Xktta', function() {

  before(function() {

    Xktta
      .init
      .Inflection(function(){
        irregular('fish', 'fish');
        irregular('person', 'people');

        irregular('stub1', 'stubs1');
        irregular('stub2', 'stubs2');
        irregular('stub3', 'stubs3');
      })
      .I18n('en', {
        date: {
          abbrDayNames: [
            'Sun',
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat'
          ],
          abbrMonthNames: [
            null,
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
          ],
          dayNames: [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
          ],
          formats: {
            default: '%Y-%m-%d',
            long: '%B %d, %Y',
            short: '%b %d',
            custom: function(value){
              return 'use external lib to format date';
            }
          },
          monthNames: [
            null,
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
          ]
        },
        time: {
          am: 'am',
          formats: {
            default: '%H:%M:%S %z',
            long: '%H:%M',
            meridiem: '%h:%M:%S %p %z',
            meridiemLong: '%h:%M %p',
            custom: function(value){
              return 'use external lib to format time';
            }
          },
          pm: 'pm'
        },
        datetime: {
          am: 'am',
          formats: {
            default: '%a, %d %b %Y %H:%M:%S %z',
            long: '%B %d, %Y %H:%M',
            short: '%d %b %H:%M',
            custom: function(value){
              return 'use external lib to format datetime';
            }
          },
          pm: 'pm'
        },
        integer: {
          formats: {
            default: function(value){
              return 'use external lib to format integer';
            }
          }
        },
        decimal: {
          formats: {
            default: function(value){
              return 'use external lib to format decimal';
            }
          }
        },
        logic: {
          formats: {
            default: {
              true: 'Yes',
              false: 'No'
            }
          }
        },
        errors: {
          format: '%{attribute} %{message}',
          messages: {
            blank: 'can\'t be blank',
            too_long: {
              one: 'is too long (maximum is 1 character)',
              other: 'is too long (maximum is %{count} characters)'
            },
            too_short: {
              one: 'is too short (minimum is 1 character)',
              other: 'is too short (minimum is %{count} characters)'
            },
            wrong_length: {
              one: 'is the wrong length (should be 1 character)',
              other: 'is the wrong length (should be %{count} characters)'
            },
            newRecord: 'can\'t be new record'
          }
        }
      })
      .I18n('pt-BR', {
        date: {
          abbrDayNames: [
            'Dom',
            'Seg',
            'Ter',
            'Qua',
            'Qui',
            'Sex',
            'Sáb'
          ],
          abbrMonthNames: [
            null,
            'Jan',
            'Fev',
            'Mar',
            'Abr',
            'Mai',
            'Jun',
            'Jul',
            'Ago',
            'Set',
            'Out',
            'Nov',
            'Dez'
          ],
          dayNames: [
            'Domingo',
            'Segunda-feira',
            'Terça-feira',
            'Quarta-feira',
            'Quinta-feira',
            'Sexta-feira',
            'Sábado'
          ],
          formats: {
            default: '%d/%m/%Y',
            long: '%d de %B de %Y',
            short: '%d de %B',
            custom: function(value){
              return 'usar lib externa para formatar data';
            }
          },
          monthNames: [
            null,
            'Janeiro',
            'Fevereiro',
            'Março',
            'Abril',
            'Maio',
            'Junho',
            'Julho',
            'Agosto',
            'Setembro',
            'Outubro',
            'Novembro',
            'Dezembro'
          ]
        },
        time: {
          am: 'am',
          formats: {
            default: '%H:%M:%S %z',
            long: '%H:%M',
            meridiem: '%h:%M:%S %p %z',
            meridiemLong: '%h:%M %p',
            custom: function(value){
              return 'usar lib externa para formatar hora';
            }
          },
          pm: 'pm'
        },
        datetime: {
          am: 'am',
          formats: {
            default: '%a, %d de %B de %Y, %H:%M:%S %z',
            long: '%d de %B de %Y, %H:%M',
            short: '%d de %B, %H:%M',
            custom: function(value){
              return 'usar lib externa para formatar data/hora';
            }
          },
          pm: 'pm'
        },
        integer: {
          formats: {
            default: function(value){
              return 'usar lib externa para formatar inteiro';
            }
          }
        },
        decimal: {
          formats: {
            default: function(value){
              return 'usar lib externa para formatar decimal';
            }
          }
        },
        logic: {
          formats: {
            default: {
              true: 'Sim',
              false: 'Não'
            }
          }
        },
        errors: {
          format: '%{attribute} %{message}',
          messages: {
            blank: 'não pode ficar em branco',
            too_long: {
              one: 'é muito longo (máximo é 1 caractere)',
              other: 'é muito longo (máximo: %{count} caracteres)'
            },
            too_short: {
              one: 'é muito curto (mínimo é 1 caractere)',
              other: 'é muito curto (mínimo: %{count} caracteres)'
            },
            wrong_length: {
              one: 'não possui o tamanho esperado (deve ter 1 caractere)',
              other: 'não possui o tamanho esperado (%{count} caracteres)'
            },
            newRecord: 'não pode ser novo registro'
          }
        }
      })
      .Class('Stub', function(){
        attrAccessor('id', 'one', 'two');

        validatesLengthOf('one', {in: [1, 10]});
        validatesLengthOf('two', {is: 5});
      })
      .Class('Stub1', function(){
        attrAccessor('id_stub1', 'stub2', 'stub3');
      })
      .Class('Stub2', function(){
        attrAccessor('id_stub2', 'stub1', 'stub3');
      })
      .Class('Stub3', function(){
        attrAccessor('id_stub3', 'stubs1', 'stubs2');
      })
      .Class('Customer', function(){
        attrAccessor('id', 'name', 'lastName', 'document', 'street', 'district', 'phone', 'user');

        validatesPresenceOf('name', 'lastName');
        validates('document', {
          presence: true
        });
        validatesLengthOf('street', 'district', {
          in: [8, 16],
          allowNull: true}
        );
        validates('phone', {
          presence: true,
          length: {
            minimum: 9
          }
        });
        validate('user', function(){
          return {
            success: object.user && typeof object.user.id === 'number',
            fail: {
              messageName: 'newRecord'
            }
          };
        });

        def('fullName', function(){
          return '#{name} #{lastName}'.interpolate(object);
        });

        defClass('className', function(){
          return __class__.name;
        });
      })
      .Class('User', function(){
        attrAccessor('id', 'email', 'customer', 'persona');

        validatesPresenceOf('email', 'persona');
      })
      .Class('Persona', function(){
        attrAccessor('id', 'name', 'users');

        validatesPresenceOf('name');
      });

  });

  it('Inflection', function(){
    expect('customer'.pluralize).to.be('customers');
    expect('user'.pluralize).to.be('users');
    expect('persona'.pluralize).to.be('personas');
    expect('fish'.pluralize).to.be('fish');
    expect('person'.pluralize).to.be('people');

    expect('customers'.singularize).to.be('customer');
    expect('users'.singularize).to.be('user');
    expect('personas'.singularize).to.be('persona');
    expect('fish'.singularize).to.be('fish');
    expect('people'.singularize).to.be('person');
  });

  it('I18n', function(){
    var date = new Date('Sun, 15 Nov 2015 00:00:00 GMT-0300 (BRT)');

    expect(I18n.locale).to.be('en');
    I18n.locale = 'pt-BR';
    expect(I18n.locale).to.be('pt-BR');

    expect(I18n.l(date)).to.be('15/11/2015');
    expect(I18n.l(date, {format: 'long'})).to.be('15 de Novembro de 2015');
    expect(I18n.l(date, {format: 'short'})).to.be('15 de Novembro');
    expect(I18n.l(date, {format: 'custom'})).to.be('usar lib externa para formatar data');

    expect(I18n.l(date, {dateType: 'time'})).to.be('00:00:00 GMT-0300 (BRT)');
    expect(I18n.l(date, {dateType: 'time', format: 'long'})).to.be('00:00');
    expect(I18n.l(date, {dateType: 'time', format: 'meridiem'})).to.be('12:00:00 am GMT-0300 (BRT)');
    expect(I18n.l(date, {dateType: 'time', format: 'meridiemLong'})).to.be('12:00 am');
    expect(I18n.l(date, {dateType: 'time', format: 'custom'})).to.be('usar lib externa para formatar hora');

    expect(I18n.l(date, {dateType: 'datetime'})).to.be('Dom, 15 de Novembro de 2015, 00:00:00 GMT-0300 (BRT)');
    expect(I18n.l(date, {dateType: 'datetime', format: 'long'})).to.be('15 de Novembro de 2015, 00:00');
    expect(I18n.l(date, {dateType: 'datetime', format: 'short'})).to.be('15 de Novembro, 00:00');
    expect(I18n.l(date, {dateType: 'datetime', format: 'custom'})).to.be('usar lib externa para formatar data/hora');

    expect(I18n.l(0)).to.be('usar lib externa para formatar inteiro');
    expect(I18n.l(0.0)).to.be('usar lib externa para formatar inteiro');
    expect(I18n.l(0.0, {forceDecimal: true})).to.be('usar lib externa para formatar decimal');
    expect(I18n.l(true)).to.be('Sim');
    expect(I18n.l(false)).to.be('Não');


    I18n.locale = 'en';
    expect(I18n.locale).to.be('en');

    expect(I18n.l(date)).to.be('2015-11-15');
    expect(I18n.l(date, {format: 'long'})).to.be('November 15, 2015');
    expect(I18n.l(date, {format: 'short'})).to.be('Nov 15');
    expect(I18n.l(date, {format: 'custom'})).to.be('use external lib to format date');

    expect(I18n.l(date, {dateType: 'time'})).to.be('00:00:00 GMT-0300 (BRT)');
    expect(I18n.l(date, {dateType: 'time', format: 'long'})).to.be('00:00');
    expect(I18n.l(date, {dateType: 'time', format: 'meridiem'})).to.be('12:00:00 am GMT-0300 (BRT)');
    expect(I18n.l(date, {dateType: 'time', format: 'meridiemLong'})).to.be('12:00 am');
    expect(I18n.l(date, {dateType: 'time', format: 'custom'})).to.be('use external lib to format time');

    expect(I18n.l(date, {dateType: 'datetime'})).to.be('Sun, 15 Nov 2015 00:00:00 GMT-0300 (BRT)');
    expect(I18n.l(date, {dateType: 'datetime', format: 'long'})).to.be('November 15, 2015 00:00');
    expect(I18n.l(date, {dateType: 'datetime', format: 'short'})).to.be('15 Nov 00:00');
    expect(I18n.l(date, {dateType: 'datetime', format: 'custom'})).to.be('use external lib to format datetime');

    expect(I18n.l(0)).to.be('use external lib to format integer');
    expect(I18n.l(0.0)).to.be('use external lib to format integer');
    expect(I18n.l(0.0, {forceDecimal: true})).to.be('use external lib to format decimal');
    expect(I18n.l(true)).to.be('Yes');
    expect(I18n.l(false)).to.be('No');
  });

  it('Stub', function(){
    var stub = new Stub();

    expect(stub).to.be.a(Stub);
    expect(stub.isValid).to.be(false);
    expect(stub.errors.toJson).to.be('{"one":["is too short (minimum is 1 character)"],"two":["is the wrong length (should be 5 characters)"]}');
  });

  it('Customer', function(){
    var customer = new Customer();
    expect(customer).to.be.a(Customer);
    expect(customer.toJson).to.be('{"id":null,"name":null,"lastName":null,"document":null,"street":null,"district":null,"phone":null,"user":null}');
    expect(customer.user).to.be(null);

    expect(customer.isValid).to.be(false);
    expect(customer.errors.toJson).to.be('{"name":["can\'t be blank"],"lastName":["can\'t be blank"],"document":["can\'t be blank"],"phone":["can\'t be blank","is too short (minimum is 9 characters)"],"user":["can\'t be new record"]}');
    expect(customer.user).to.be(null);

    customer = new Customer({name: '', lastName: '', document: '', street: '', district: '', phone: ''});
    expect(customer.isValid).to.be(false);
    expect(customer.errors.toJson).to.be('{"name":["can\'t be blank"],"lastName":["can\'t be blank"],"document":["can\'t be blank"],"street":["is too short (minimum is 8 characters)"],"district":["is too short (minimum is 8 characters)"],"phone":["can\'t be blank","is too short (minimum is 9 characters)"],"user":["can\'t be new record"]}');
    expect(customer.user).to.be(null);

    customer = new Customer({name: 'Name', lastName: 'Last Name', document: '000000000000000'});
    expect(customer.isValid).to.be(false);
    expect(customer.errors.toJson).to.be('{"phone":["can\'t be blank","is too short (minimum is 9 characters)"],"user":["can\'t be new record"]}');
    expect(customer.user).to.be(null);

    customer.phone = '0';
    expect(customer.isValid).to.be(false);
    expect(customer.errors.toJson).to.be('{"phone":["is too short (minimum is 9 characters)"],"user":["can\'t be new record"]}');
    expect(customer.user).to.be(null);

    customer.phone = '000000000';
    customer.street = 'xxxxxxxxxxxxxxxxx';
    customer.district = 'xxxxxxxxxxxxxxxxx';
    expect(customer.isValid).to.be(false);
    expect(customer.errors.toJson).to.be('{"street":["is too long (maximum is 16 characters)"],"district":["is too long (maximum is 16 characters)"],"user":["can\'t be new record"]}');
    expect(customer.user).to.be(null);

    customer = new Customer('{"name": "Name", "lastName": "lastName", "document": "0", "street": "xxxxxxxx", "district": "xxxxxxxx", "phone": "000000000"}');
    expect(customer.isValid).to.be(false);
    expect(customer.errors.toJson).to.be('{"user":["can\'t be new record"]}');
    expect(customer.user).to.be(null);

    customer = new Customer('{"name": "Name", "lastName": "lastName", "document": "0", "street": "xxxxxxxx", "district": "xxxxxxxx", "phone": "000000000"}');
    expect(customer.isValid).to.be(false);
    expect(customer.errors.toJson).to.be('{"user":["can\'t be new record"]}');
    expect(customer.user).to.be(null);

    customer.user = {id: 0};
    expect(customer.isValid).to.be(true);
    expect(customer.errors.toJson).to.be('{}');
    expect(customer.toJson).to.be('{"id":null,"name":"Name","lastName":"lastName","document":"0","street":"xxxxxxxx","district":"xxxxxxxx","phone":"000000000","user":{"id":0}}');

    expect(customer.fullName()).to.be('Name lastName');
    expect(customer.className).to.be(undefined);

    expect(Customer.fullName).to.be(undefined);
    expect(Customer.className()).to.be('Customer');

    customer = new Customer({id: 1, name: 'Name', user: {id: 0}});
    expect(customer.toJson).to.be('{"id":1,"name":"Name","lastName":null,"document":null,"street":null,"district":null,"phone":null,"user":{"id":0}}');

    customer = new Customer({id: 1, name: "Name"});
    expect(customer.toJson).to.be('{"id":1,"name":"Name","lastName":null,"document":null,"street":null,"district":null,"phone":null,"user":null}');
    expect(customer.user).to.be(null);
    expect(customer.changes.toJson).to.be('{}');
    expect(customer.changes_name.toJson).to.be('[]');
    expect(customer.changes_user.toJson).to.be('[]');

    customer.name = null;
    customer.user = {id: 0};
    expect(customer.toJson).to.be('{"id":1,"name":null,"lastName":null,"document":null,"street":null,"district":null,"phone":null,"user":{"id":0}}');
    expect(customer.changes.toJson).to.be('{"name":["Name",null],"user":[null,{"id":0}]}');
    expect(customer.changes_name.toJson).to.be('["Name",null]');
    expect(customer.changes_user.toJson).to.be('[null,{"id":0}]');

    customer.reset;
    expect(customer.toJson).to.be('{"id":1,"name":"Name","lastName":null,"document":null,"street":null,"district":null,"phone":null,"user":null}');
    expect(customer.user).to.be(null);
    expect(customer.changes.toJson).to.be('{}');
    expect(customer.changes_name.toJson).to.be('[]');
    expect(customer.changes_user.toJson).to.be('[]');
  });

  it('User', function(){
    var user = new User();
    expect(user).to.be.a(User);
    expect(user.toJson).to.be('{"id":null,"email":null,"customer":null,"persona":null}');
    expect(user.isValid).to.be(false);
    expect(user.errors.toJson).to.be('{"email":["can\'t be blank"],"persona":["can\'t be blank"]}');

    user.email = 'email';
    expect(user.toJson).to.be('{"id":null,"email":"email","customer":null,"persona":null}');
    expect(user.isValid).to.be(false);
    expect(user.errors.toJson).to.be('{"persona":["can\'t be blank"]}');
    expect(user.customer).to.be(null);
    expect(user.persona).to.be(null);

    user.persona = {id: 1};
    expect(user.toJson).to.be('{"id":null,"email":"email","customer":null,"persona":{"id":1}}');
    expect(user.isValid).to.be(true);
    expect(user.errors.toJson).to.be('{}');
    expect(user.customer).to.be(null);

    var user = new User({customer: new Customer()});
    expect(user.toJson).to.be('{"id":null,"email":null,"customer":{"id":null,"name":null,"lastName":null,"document":null,"street":null,"district":null,"phone":null,"user":null},"persona":null}');
    expect(user.customer.toJson).to.be('{"id":null,"name":null,"lastName":null,"document":null,"street":null,"district":null,"phone":null,"user":null}');
    expect(user.customer).to.be.a(Customer);

    var user = new User({id: 0, customer: new Customer({id: 1}), persona: {id: 2} });
    expect(user.toJson).to.be('{"id":0,"email":null,"customer":{"id":1,"name":null,"lastName":null,"document":null,"street":null,"district":null,"phone":null,"user":null},"persona":{"id":2}}');
    expect(user.customer.toJson).to.be('{"id":1,"name":null,"lastName":null,"document":null,"street":null,"district":null,"phone":null,"user":null}');
    expect(user.customer).to.be.a(Customer);

    user = new User({id: 0, email: "email", customer: new Customer({id: 1}) });
    expect(user.toJson).to.be('{"id":0,"email":"email","customer":{"id":1,"name":null,"lastName":null,"document":null,"street":null,"district":null,"phone":null,"user":null},"persona":null}');
    expect(user.customer.toJson).to.be('{"id":1,"name":null,"lastName":null,"document":null,"street":null,"district":null,"phone":null,"user":null}');
    expect(user.persona).to.be(null);
    expect(user.changes.toJson).to.be('{}');
    expect(user.changes_email.toJson).to.be('[]');
    expect(user.changes_customer.toJson).to.be('[]');
    expect(user.changes_persona.toJson).to.be('[]');

    user.email = null;
    user.customer = null;
    user.persona = {id: 2};
    expect(user.toJson).to.be('{"id":0,"email":null,"customer":null,"persona":{"id":2}}');
    expect(user.customer).to.be(null);
    expect(user.changes.toJson).to.be('{"email":["email",null],"customer":[{"id":1,"name":null,"lastName":null,"document":null,"street":null,"district":null,"phone":null,"user":null},null],"persona":[null,{"id":2}]}');
    expect(user.changes_email.toJson).to.be('["email",null]');
    expect(user.changes_customer.toJson).to.be('[{"id":1,"name":null,"lastName":null,"document":null,"street":null,"district":null,"phone":null,"user":null},null]');
    expect(user.changes_persona.toJson).to.be('[null,{"id":2}]');

    user.reset;
    expect(user.toJson).to.be('{"id":0,"email":"email","customer":{"id":1,"name":null,"lastName":null,"document":null,"street":null,"district":null,"phone":null,"user":null},"persona":null}');
    expect(user.customer.toJson).to.be('{"id":1,"name":null,"lastName":null,"document":null,"street":null,"district":null,"phone":null,"user":null}');
    expect(user.persona).to.be(null);
    expect(user.changes.toJson).to.be('{}');
    expect(user.changes_email.toJson).to.be('[]');
    expect(user.changes_customer.toJson).to.be('[]');
    expect(user.changes_persona.toJson).to.be('[]');
  });

  it('Persona', function(){
    var persona = new Persona();
    expect(persona).to.be.a(Persona);
    expect(persona.toJson).to.be('{"id":null,"name":null,"users":null}');
    expect(persona.users).to.be(null);
    expect(persona.isValid).to.be(false);
    expect(persona.errors.toJson).to.be('{"name":["can\'t be blank"]}');

    persona.name = 'Name';
    expect(persona.toJson).to.be('{"id":null,"name":"Name","users":null}');
    expect(persona.isValid).to.be(true);
    expect(persona.errors.toJson).to.be('{}');

    persona.users = [new User()];
    expect(persona.toJson).to.be('{"id":null,"name":"Name","users":[{"id":null,"email":null,"customer":null,"persona":null}]}');
    expect(persona.isValid).to.be(true);
    expect(persona.errors.toJson).to.be('{}');
    expect(persona.users.toJson).to.be('[{"id":null,"email":null,"customer":null,"persona":null}]');
    expect(persona.users[0]).to.be.a(User);

    var persona = new Persona({id: 0, name: 'Name', users: [new User({id: 1, email: 'email', persona: {id: 0} }), new User({id: 2, email: 'email2', persona: {id: 0} }) ]});
    expect(persona.toJson).to.be('{"id":0,"name":"Name","users":[{"id":1,"email":"email","customer":null,"persona":{"id":0}},{"id":2,"email":"email2","customer":null,"persona":{"id":0}}]}');
    expect(persona.isValid).to.be(true);
    expect(persona.errors.toJson).to.be('{}');
    expect(persona.users.toJson).to.be('[{"id":1,"email":"email","customer":null,"persona":{"id":0}},{"id":2,"email":"email2","customer":null,"persona":{"id":0}}]');
    expect(persona.users[0]).to.be.a(User);

    persona = new Persona({id: 1, name: "Name"});
    expect(persona.toJson).to.be('{"id":1,"name":"Name","users":null}');
    expect(persona.changes.toJson).to.be('{}');
    expect(persona.changes_name.toJson).to.be('[]');
    expect(persona.changes_users.toJson).to.be('[]');

    persona.name = null;
    persona.users = [new User({id: 1, email: 'email', persona: {id: 1} }), new User({id: 2, email: 'email2', persona: {id: 1} }) ];
    expect(persona.toJson).to.be('{"id":1,"name":null,"users":[{"id":1,"email":"email","customer":null,"persona":{"id":1}},{"id":2,"email":"email2","customer":null,"persona":{"id":1}}]}');
    expect(persona.users.toJson).to.be('[{"id":1,"email":"email","customer":null,"persona":{"id":1}},{"id":2,"email":"email2","customer":null,"persona":{"id":1}}]');
    expect(persona.users[0].persona.toJson).to.be('{"id":1}');
    expect(persona.changes.toJson).to.be('{"name":["Name",null],"users":[null,[{"id":1,"email":"email","customer":null,"persona":{"id":1}},{"id":2,"email":"email2","customer":null,"persona":{"id":1}}]]}');
    expect(persona.changes_name.toJson).to.be('["Name",null]');
    expect(persona.changes_users.toJson).to.be('[null,[{"id":1,"email":"email","customer":null,"persona":{"id":1}},{"id":2,"email":"email2","customer":null,"persona":{"id":1}}]]');

    persona.reset;
    expect(persona.toJson).to.be('{"id":1,"name":"Name","users":null}');
    expect(persona.users).to.be(null);
    expect(persona.changes.toJson).to.be('{}');
    expect(persona.changes_name.toJson).to.be('[]');
    expect(persona.changes_users.toJson).to.be('[]');
  });

  it('Stub1', function(){
    var stub1 = new Stub1();
    expect(stub1.toJson).to.be('{"id_stub1":null,"stub2":null,"stub3":null}');
    expect(stub1.stub2).to.be(null);
    expect(stub1.stub3).to.be(null);

    stub1.id_stub1 = 1;
    stub1.stub2 = new Stub2({id_stub2: 2});
    stub1.stub3 = {id_stub3: 3};
    expect(stub1.stub2.toJson).to.be('{"id_stub2":2,"stub1":null,"stub3":null}');
    expect(stub1.stub3.toJson).to.be('{"id_stub3":3}');

    var stub1 = new Stub1({id_stub1: 1, stub2: new Stub2({id_stub2: 2}), stub3: {id_stub: 3}});
    expect(stub1.toJson).to.be('{"id_stub1":1,"stub2":{"id_stub2":2,"stub1":null,"stub3":null},"stub3":{"id_stub":3}}');
    expect(stub1.stub2.toJson).to.be('{"id_stub2":2,"stub1":null,"stub3":null}');
    expect(stub1.stub3.toJson).to.be('{"id_stub":3}');

    var stub1 = new Stub1({id_stub1: 1, stub2: new Stub2({id_stub2: 2}), stub3: {id_stub: 3}});
    expect(stub1.toJson).to.be('{"id_stub1":1,"stub2":{"id_stub2":2,"stub1":null,"stub3":null},"stub3":{"id_stub":3}}');
    expect(stub1.stub2.toJson).to.be('{"id_stub2":2,"stub1":null,"stub3":null}');
    expect(stub1.stub3.toJson).to.be('{"id_stub":3}');
  });

  it('Stub2', function(){
    var stub2 = new Stub2();
    expect(stub2.toJson).to.be('{"id_stub2":null,"stub1":null,"stub3":null}');
    expect(stub2.stub1).to.be(null);
    expect(stub2.stub3).to.be(null);

    stub2.id_stub2 = 2;
    stub2.stub1 = {id_stub1: 1};
    stub2.stub3 = {id_stub3: 3};
    expect(stub2.toJson).to.be('{"id_stub2":2,"stub1":{"id_stub1":1},"stub3":{"id_stub3":3}}');
    expect(stub2.stub1.toJson).to.be('{"id_stub1":1}');
    expect(stub2.stub3.toJson).to.be('{"id_stub3":3}');

    var stub2 = new Stub2({id_stub2: 2, stub1: {id_stub1: 1}, stub3: {id_stub3: 3} });
    expect(stub2.toJson).to.be('{"id_stub2":2,"stub1":{"id_stub1":1},"stub3":{"id_stub3":3}}');
    expect(stub2.stub1.toJson).to.be('{"id_stub1":1}');
    expect(stub2.stub3.toJson).to.be('{"id_stub3":3}');
  });

  it('Stub3', function(){
    var stub3 = new Stub3();
    expect(stub3.toJson).to.be('{"id_stub3":null,"stubs1":null,"stubs2":null}');
    expect(stub3.stubs1).to.be(null);
    expect(stub3.stubs2).to.be(null);

    stub3.id_stub3 = 3;
    stub3.stubs1 = [ new Stub1({id_stub1: 1}) ];
    stub3.stubs2 = [ new Stub2({id_stub2: 2}) ];
    expect(stub3.toJson).to.be('{"id_stub3":3,"stubs1":[{"id_stub1":1,"stub2":null,"stub3":null}],"stubs2":[{"id_stub2":2,"stub1":null,"stub3":null}]}');
    expect(stub3.stubs1.toJson).to.be('[{"id_stub1":1,"stub2":null,"stub3":null}]');
    expect(stub3.stubs2.toJson).to.be('[{"id_stub2":2,"stub1":null,"stub3":null}]');

    var stub3 = new Stub3({id_stub3: 3, stubs1: [new Stub1({id_stub1: 1})], stubs2: [new Stub2({id_stub2: 2})]});
    expect(stub3.toJson).to.be('{"id_stub3":3,"stubs1":[{"id_stub1":1,"stub2":null,"stub3":null}],"stubs2":[{"id_stub2":2,"stub1":null,"stub3":null}]}');
    expect(stub3.stubs1.toJson).to.be('[{"id_stub1":1,"stub2":null,"stub3":null}]');
    expect(stub3.stubs2.toJson).to.be('[{"id_stub2":2,"stub1":null,"stub3":null}]');
  });

});
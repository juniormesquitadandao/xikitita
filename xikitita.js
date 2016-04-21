/*! 315 Xikitita - v1.0 - 2016-04-01
 * http://juniormesquitadandao.github.io/315_xikitita
 *
 * Copyright (c) 2016 Marcelo Junior
 */
;(function(window){
'use strict';

var Xikitita = {
  window: this,
  afterInit: [],
  defineProperties: function(prototype, properties){
    var __this__ = this;

    Object.keys(properties).forEach(function(property){
      __this__.defineProperty(prototype, property, properties[property]);
    });

  },
  defineProperty: function(prototype, property, body){
   
    if(!prototype.hasOwnProperty(property)){
      Object.defineProperty(prototype, property, body);
    } 

  }
};

Object.defineProperty(Xikitita, 'init', {
  get: function(){

    this.classes = {};
    this.inflection = { singular: {}, plural: {} };
    this.translations = {};
    this.validators = {};

    this.afterInit.forEach(function(body){
      body();
    });

    return this;
  }
});
Xikitita.Inflection = function(body){
  var __this__ = this;

  var irregular = function(singular, plural){
    __this__.inflection.singular[singular] = plural; 
    __this__.inflection.plural[plural] = singular;
  }

  eval("new function (){\n\
      var irregular = #{irregular};\n\
      (#{body})(this);\n\
    };"
    .interpolate({
      irregular: irregular.toString(),
      body: body.toString()
    })
  );

  return __this__;
}

Xikitita.I18n = function(locale, translations){
  this.translations[locale] = translations || {};
  return this;
}

Xikitita.afterInit.push(function(){
  var __this__ = Xikitita;

  eval.call(__this__.window, "var I18n;");

  I18n = {
    locale: 'en',
    translate: function(path, params){
      var translation = path;
      var translations = __this__.translations[I18n.locale] || {};
      path.split('.').forEach(function(key){
        translations = translations[key] || {};
      });

      if(typeof translations  === 'string'){
        translation = translations;
        params = params || {};
        translation = translation.interpolate(params, '%');
      }else if(typeof translations === 'object' && translations.constructor.name === 'Array'){
        translation = translations;
      } else {
        translation = '#{locale}.#{path}'.interpolate({locale: I18n.locale, path: path});
      }

      return translation;
    },
    localize: function(value, options){
      options = options || {};

      var format = options.format || 'default';
      var dateType = options.dateType || 'date';
      var formatted = value;

      if(typeof value === 'object' && value.constructor.name === 'Date'){
        var dayWeak = value.getDay();
        var month = value.getMonth() + 1;
        var dayMonth = value.getDate();
        var year = value.getFullYear();
        var hours = value.getHours();
        var minutes = value.getMinutes();
        var seconds = value.getSeconds();
        var meridiem = hours < 12 ? 'am' : 'pm';
        var zone = value.toString().match(/([A-Z]+[\+-][0-9]+.*)/)[1];

        formatted = __this__.translations[I18n.locale][dateType].formats[format];

        var formatBy = {
          function: function(){
            formatted = formatted(value);
          },
          string: function(){
            var to = {
              date: function(){
                formatted = formatted
                  .interpolate({
                    a: I18n.t('date.abbrDayNames')[dayWeak],
                    A: I18n.t('date.dayNames')[dayWeak],
                    m: new String(month + 100).toString().substr(1),
                    b: I18n.t('date.abbrMonthNames')[month],
                    B: I18n.t('date.monthNames')[month],
                    d: new String(dayMonth + 100).toString().substr(1),
                    Y: year
                  }, '%', false);
              },
              time: function(){
                formatted = formatted
                  .interpolate({
                    h: new String( (hours || 24) - 12 + 100 ).toString().substr(1),
                    H: new String(hours + 100).toString().substr(1),
                    M: new String(minutes + 100).toString().substr(1),
                    S: new String(seconds + 100).toString().substr(1),
                    p: I18n.t(['time', meridiem].join('.')),
                    z: zone
                  }, '%', false);
              },
              datetime: function(){
                this.date();
                this.time();
              }
            }
            to[dateType]();
          }
        }

        formatBy[typeof formatted]();
      }
      else if(typeof value === 'number'){

        var functionFormat = __this__.translations[I18n.locale].integer.formats[format];
        if(/\./.test(value) || options.forceDecimal){
          functionFormat = __this__.translations[I18n.locale].decimal.formats[format];
        }
        formatted = functionFormat(value);

      }
      else if(typeof value === 'boolean'){
        formatted = __this__.translations[I18n.locale].logic.formats[format][value];
      }

      return formatted;
    }
  }

  I18n.t = I18n.translate
  I18n.l = I18n.localize

});
Xikitita.Error = function(className){
  var __this__ = this;
  var __className__ = className;

  Object.defineProperties(__this__, {

    add: {
      value: function(attrName, message){
        __this__[attrName] = __this__[attrName] || [];
        __this__[attrName].push(message);
      }
    },
    clear: {
      get: function(){
        for (var attrName in __this__) delete __this__[attrName];
      }
    },
    messages: {
      get: function(){
        var messages = [];

        Object.keys(__this__).forEach(function(attrName){
          
          __this__[attrName].forEach(function(message){
            messages.push(message);
          });

        });

        return messages;
      }
    },
    fullMessages: {
      get: function(){
        var fullMessages = [];

        Object.keys(__this__).forEach(function(attrName){
          var path = ['classes', __className__, 'attributes', attrName].join('.');
          var attrNameTranslated = I18n.t(path);

          __this__[attrName].forEach(function(message){
            var fullMessage = I18n
              .t('errors.format')
              .interpolate({
                attribute: attrNameTranslated,
                message: message
              }, '%');

            fullMessages.push(fullMessage);
          });

        });

        return fullMessages;
      }
    }
  });
}

Xikitita.Class = function(name, body){

  eval.call(Xikitita.window, "function #{name}(){\n\
      var Xikitita = Xikitita;\n\
      var __class__ =  #{name};\n\
      var __attrAccessor__ = [];\n\
      \n\
      var object = this;\n\
      var attrAccessor = #{attrAccessor};\n\
      \n\
      var __afterNew__ = [];\n\
      \n\
      var __errors__ = new #{Error}(__class__.name.toLowerCase());\n\
      var __validations__ = [];\n\
      Object.defineProperties(object, {\n\
        'errors': {get: #{errors}, enumerable: false },\n\
        'isValid': {get: #{isValid}, enumerable: false }\n\
      });\n\
      \n\
      var validate = #{validate};\n\
      \n\
      var validates = #{validates};\n\
      \n\
      var def = #{def};\n\
      var defClass = #{defClass};\n\
      \n\
      #{validatesOf}\n\
      \n\
      (#{body})(object);\n\
      attrAccessor();\n\
      \n\
      var __initAttributes__ =  Array.prototype.slice.call(arguments).shift() || {};\n\
      (#{new})(object);\n\
      \n\
      Object.defineProperties(object, {\n\
        'reset': {get: #{reset}, enumerable: false },\n\
        'changes': {get: #{changes}, enumerable: false },\n\
        'changed': {get: #{changed}, enumerable: false },\n\
        'toHuman': {get: #{toHuman}, enumerable: false }\n\
      });\n\
    };"
    .interpolate({
      name: name,
      attrAccessor: Xikitita.attrAccessor.toString(),
      Error: Xikitita.Error.toString(),
      errors: Xikitita.errors.toString(),
      isValid: Xikitita.isValid.toString(),
      validate: Xikitita.validate.toString(),
      validates: Xikitita.validates.toString(),
      def: Xikitita.def.toString(),
      defClass: Xikitita.defClass.toString(),
      validatesOf: Xikitita.validatesOf(),
      body: body.toString(),
      new: Xikitita.new.toString(),
      reset: Xikitita.reset.toString(),
      changes: Xikitita.changes.toString(),
      changed: Xikitita.changed.toString(),
      toHuman: Xikitita.toHuman.toString()
    })
  );
  var Class = eval(name);

  Object.defineProperty(Class, 'toHuman', {
    get: function(){
      var className = Class.name.toLowerCase();
      var pathMember = ['classes', className, 'member'].join('.');
      var pathCollection = ['classes', className, 'collection'].join('.');

      return {
        member: I18n.t(pathMember),
        collection: I18n.t(pathCollection)
      }
    }
  });

  Object.defineProperties(Class.prototype, {
    Xikitita: { get: function () { return Xikitita; } }
  });

  this.classes[name] = Class;
  return this;
}

Xikitita.attrAccessor = function(){
  var attrNames = Array.prototype.slice.call(arguments);

  attrNames.forEach(function(attrName){
    object[attrName] = null;
    __attrAccessor__.push(attrName);
  });
};

Xikitita.new = function(){
  function defineChangesToAttrName(attrName){
    var changes_attrName = ['changes', attrName].join('_');
    if(!object.hasOwnProperty(changes_attrName)){
      Object.defineProperty(object, changes_attrName, {
        get: function(){
          return this.changes[attrName] || [];
        }
      });
    }
  }

  function defineChangedToAttrName(attrName){
    var changes_attrName = ['changes', attrName].join('_');
    var changed_attrName = ['changed', attrName].join('_');
    if(!object.hasOwnProperty(changed_attrName)){
      Object.defineProperty(object, changed_attrName, {
        get: function(){
          return this[changes_attrName].isAny;
        }
      });
    }
  }

  if(typeof __initAttributes__ === 'string'){
    __initAttributes__ = JSON.parse(__initAttributes__);
  }

  __attrAccessor__.forEach(function(attrName){
    __afterNew__.push(function(){
      defineChangesToAttrName(attrName);
      defineChangedToAttrName(attrName);
    });
  });

  __attrAccessor__.forEach(function(attrName){
    if(Object.keys(__initAttributes__).indexOf(attrName) < 0){
      __initAttributes__[attrName] = null;
    }
  });

  Object.keys(__initAttributes__).forEach(function(attrName){
    if(__attrAccessor__.indexOf(attrName) < 0){
      throw new TypeError(__class__.name.toLowerCase() + '.' + attrName + ' is not a attribute');
    }
    object[attrName] = __initAttributes__[attrName];
  });

  __afterNew__.forEach(function(callback){
    callback();
  });
};

Xikitita.reset = function(){
  Object.keys(object).forEach(function(attrName){
    object[attrName] = __initAttributes__[attrName];
  });

  __afterNew__.forEach(function(callback){
    callback();
  });
};

Xikitita.changes = function(){
  var changes = {};

  __attrAccessor__.forEach(function(attrName){

      var initialValue = __initAttributes__[attrName];
      var actualValue = object[attrName];

      if(initialValue === null && actualValue !== null){
        changes[attrName] = [initialValue, actualValue];
      } else if(initialValue !== null && actualValue === null){
        changes[attrName] = [initialValue, actualValue];
      } else if(initialValue !== null && actualValue !== null && initialValue.toJson !== actualValue.toJson){
        changes[attrName] = [initialValue, actualValue];
      }

  });

  return changes;
};

Xikitita.changed = function(){
  return this.changes.isAny;
};

Xikitita.def = function(name, body){
  Object.defineProperty(object, name, {
    value: body,
    enumerable: false
  });
};

Xikitita.defClass = function(name, body){
  __class__[name] = __class__[name] || body;
};

Xikitita.toHuman = function(){
  var attributes = {};
  var className = __class__.name.toLowerCase();

  __attrAccessor__.forEach(function(attrName){

    Object.defineProperty(attributes, attrName, {

      get: function(){

        var path = ['classes', className, 'attributes', attrName].join('.');

        return I18n.t(path);

      }

    });

  });

  return attributes;
};
Xikitita.validate = function(attrName, body){

  __validations__.push(function(){
    var result = body.call();

    if (!result.success) {
      var messageName = result.fail.messageName;
      var path = ['errors', 'messages', messageName].join('.');
      var params = result.fail.params || {};

      __errors__.add(attrName, I18n.t(path, params));
    };
  });

};

Xikitita.validates = function(attrName, optionsValidators){
  Object.keys(optionsValidators).forEach(function(validatorName){
    var options = {};
    if (typeof optionsValidators[validatorName] === 'object') {
      options = optionsValidators[validatorName];
    }

    __validations__.push(function(){
      var value = object[attrName];
      var result = object.Xikitita.validators[validatorName](value, attrName, object, options);

      if (!result.success) {
        var messageName = result.fail.messageName;
        var path = ['errors', 'messages', messageName].join('.');
        var params = result.fail.params || {};

        __errors__.add(attrName, I18n.t(path, params));
      };
    });
  });
};

Xikitita.validatesOf = function(){
  var validatesOf = [];

  Object.keys(Xikitita.validators).forEach(function(validator){

    validatesOf.push('var validates#{validator}Of = ' 
        .interpolate({
          validator: validator.capitalize
        })
      + function(){

          var attrNames = Array.prototype.slice.call(arguments);
          var last = attrNames.pop();

          var validatorName = '#{validatorName}';
          var options = {};
          options[validatorName] = true;

          if(typeof last === 'object'){
            options[validatorName] = last;
          }else{
            attrNames.push(last);          
          }

          attrNames.forEach(function(attrName){
            validates(attrName, options);
          });

        }.toString()
        .interpolate({
          validatorName: validator
        })
      + ';'
    );

  });

  return validatesOf.join('\n');
};

Xikitita.errors = function(){
  return __errors__;
};

Xikitita.isValid = function(){
  __errors__.clear;

  __validations__.forEach(function(validation){
    validation();
  });

  return __errors__.isEmpty;
};

Xikitita.Validator = function(name, body){
  this.validators[name.toLowerCase()] = body;
  return this;
}

Xikitita.afterInit.push(function(){

  Xikitita
    .Validator('Presence', function(value, attrName, object, options){
      
      return {
        success: value ? value.isAny : ['number', 'boolean'].indexOf(typeof value) > -1,
        fail: {
          messageName: 'blank'
        }
      };
    })
    .Validator('Length', function(value, attrName, object, options){
      var validators = {
        maximum: function(maxValue){
          return {
            success: value ? value.length <= maxValue : false,
            fail: {
              messageName: maxValue === 1 ? 'too_long.one' : 'too_long.other',
              params: {
                count: maxValue 
              }
            }
          };
        },
        minimum: function(minValue){
          return {
            success: value ? value.length >= minValue: false,
            fail: {
              messageName: minValue === 1 ? 'too_short.one' : 'too_short.other',
              params: {
                count: minValue
              }
            }
          };
        },
        in: function(inValues){
          var result = this.minimum(inValues[0]);
          if (result.success){
            return this.maximum(inValues[1]);
          }
          return result;
        },
        is: function(isValue){
          return {
            success: value ? value.length === isValue : false,
            fail: {
              messageName: isValue === 1 ? 'wrong_length.one' : 'wrong_length.other',
              params: {
               count: isValue
              }
            }
          };
        }
      };

      var lastResult = {success: true};
      Object.keys(validators).forEach(function(validator){

        var validatorValue = options[validator] || null;
        if(validatorValue){

          var actualResult = validators[validator](validatorValue);
          if(options.allowNull && value === null){
            actualResult.success = true;
          }

          if(!actualResult.success){

            lastResult = actualResult;
          }
        }

      });

      return lastResult;
    });

});
Xikitita.afterInit.push(function(){

  Xikitita.defineProperties(Object.prototype, {
    toJson: {
      get: function () {
        var __toJson__ = this;
        if(typeof this !== 'string'){
          __toJson__ = JSON.stringify(__toJson__);
        }
        return __toJson__; 
      }
    },
    asJson: {
      get: function () { 
        return JSON.parse(this.toJson); 
      } 
    },
    isAny: {
      get: function () {
        return (this.constructor.name === 'Number' && this > 0) || (this.constructor.name === 'Boolean' && this) || this.constructor.name === 'Date' || Object.keys(this).length > 0;
      }
    },
    isEmpty: { 
      get: function () { 
        return !this.isAny;
      }
    }
  });

});

Xikitita.afterInit.push(function(){

  Xikitita.defineProperties(String.prototype, {
    capitalize: { 
      get: function(){
        return this.replace(/(\w)/, function($1){ return $1.toUpperCase(); });
      }
    },
    pluralize: { 
      get: function(){
        var irregular = this;
        var regex = irregular;
        var replace = Xikitita.inflection.singular[irregular] || null;

        if(!replace){
          regex = /$/;
          replace = 's';
        }

        return this.replace(regex, replace);
      }
    },
    singularize: { 
      get: function(){
        var irregular = this;
        var regex = irregular;
        var replace = Xikitita.inflection.plural[irregular] || null;

        if(!replace){
          regex = /s$/;
          replace = '';
        }

        return this.replace(regex, replace);
      }
    },
    interpolate: { 
      value: function(params, identifier, isBoundary){
        identifier = identifier || '#';
        isBoundary = isBoundary === undefined ? true : isBoundary;

        var boundary = !isBoundary ? '  ' : '{}';
        var interpolated = this;

        Object.keys(params).forEach(function(param){
          var regex = [identifier, boundary[0].trim(), param, boundary[1].trim()].join('');
          interpolated = interpolated.replace(new RegExp(regex, 'g'), params[param]);
        });

        return interpolated;
      }
    }
  });

});
Xikitita.afterInit.push(function(){

  Xikitita.defineProperties(Date.prototype, {
    localize: {
      value: function (options) {
        return this.l(options); 
      }
    },
    l: {
      value: function (options) {
        return I18n.l(this, options); 
      }
    },
  });

});

Xikitita.afterInit.push(function(){

  Xikitita.defineProperties(Number.prototype, {
    localize: {
      value: function (options) {
        return this.l(options); 
      }
    },
    l: {
      value: function (options) {
        return I18n.l(this, options); 
      }
    },
  });

});

Xikitita.afterInit.push(function(){

  Xikitita.defineProperties(Boolean.prototype, {
    localize: {
      value: function (options) {
        return this.l(options); 
      }
    },
    l: {
      value: function (options) {
        return I18n.l(this, options); 
      }
    },
  });

});

window.Xikitita = Xikitita;
})(window);

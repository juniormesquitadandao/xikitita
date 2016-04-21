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
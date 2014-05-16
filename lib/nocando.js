var FastSet = require('collections/fast-set');

var IdentityMonad = function(value) {
    this.value = value;

    return {
        bind : function(fn){
          return fn(this.value);
        }
    };
};

/**
 * A Maybe Monad - Allows chainable calls and encapsulates empty/null/undefined values verification
 * @see http://sean.voisen.org/blog/2013/10/intro-monads-maybe/
 *
 * @param value Some value of any type
 * @return MaybeMonad Can be 'something' or 'nothing'
 */
var MaybeMonad = function(value){
    var nothing = {

        /**
         * 
         *
         */
        bind : function(fn){
            return this;
        },

        /**
         *
         * @param def A default value to be returned in case of nothing
         * @param fn A transformation to be applied over the value in case of something 
         */
         maybe : function(def, fn){
          return def;
        }
    };

    /**
     * 
     *@param value 
     *@return 
     */
    var something = function(value){
        return {
            /**
             *
             *
             */
            bind : function(fn){
                MaybeMonad(fn.call(this, value));
            },
            
            /**
             *
             *
             */
            maybe : function(def, fn){
                fn = (fn === undefined) ? function(v){return v;} : fn;
                return fn.call(this, value);
            }
        };
    };

    if(value === false || value === null || value === undefined || typeof value === 'undefined' || value.length && value.length <= 0)
      return nothing;

    return something(value);
};


var AuthMonad = function(value){
    this.value = value;
    var that = this;
    return {
        can : function(action, target, authorization, resource_provider, authorized_resource_provider){
            return new AuthMonad(
                saveAuthorization(that.value, action, target, authorization,
                    resource_provider, authorized_resource_provider)
            );
            
        },

        /**
         *
         *
         */
        revoke : function(action, target){

        },

        /**
         *
         *
         */
        override : function(action, target, authorization, resource_provider, authorized_resource_provider){

        },

        /**
         *
         *@param action
         *@param context
         *@param user
         *@param app_context
         *
         *@return MaybeMonad
         */
        authorize : function(action, target, user, context){
              return new MaybeMonad(can_i(that.value, action, target, user, context));
        }
    };
};

var makeKey = function(action, context){
    return context + '-' + action;
};

/**
 *
 *@param a - Stored Auth
 *@param b - Key or Auth to be Stored
 */
var equals = function(a, b){
    var keyA = makeKey(a.value.action, a.value.context);
    return a.key === (b.key || b) || isStarKey(a.key, b.key || b);
};

var isStarKey = function(a, b){
    var keyB = b.split('-');
    var keyA = a.split('-');

    if(keyA[0] == keyB[0] && keyA[1] == '*'){
      return true;
    }

    return false;
};

var hash = function(a){
    return makeKey(a.action, a.context);
};

var Auth = function(key, action, context, authorization, authorization_resource_provider, authorized_resource_provider){
    this.key = key;
    this.value = {
      context : context,
      action : action,
      auth : authorization,
      brp :  authorization_resource_provider,
      arp :  authorized_resource_provider
    };
};

var saveAuthorization = function(list, action, context, authorization, authorization_resource_provider, authorized_resource_provider){
    var key = makeKey(action, context);
    var auth =new Auth(key, action, context, authorization, authorization_resource_provider, authorized_resource_provider);

    if(!list.has(auth.key)){
        list.add(auth);        
        return list;
    } else {
        auth = list.get(auth.key);
        throw new Exception('Repeated authorization.The  key:' + key + ' is already stored as key:' + auth.key);
    }
};

/**
 *
 *
 *@param action
 *@param context
 *@param authorization
 *@param resource_provider
 *@param authorized_resource_provider
 */
var can = function(action, context, authorization, resource_provider, authorized_resource_provider){
    var fastSet = new FastSet(
      null,
      equals,
      hash
    );

    return new AuthMonad(
        saveAuthorization(fastSet, action, context,
            authorization, resource_provider, authorized_resource_provider)
    );   
};

/**
 *
 *
 */
var and = function(){
    var methods = arguments;
    return function(user, context, resource){
        return Object.keys(methods).reduce(function(acc, curr){
            return acc && methods[curr](user, context, resource);
        }, true);
    };
};

/**
 *
 *
 */
var or = function(){
    var methods = arguments;
    return function(user, context, resource){
        return Object.keys(methods).reduce(function(acc, curr){
            return acc || methods[curr](user, context, resource);
        }, false);
    };
};


/**
 *
 *
 */
var not = function(authorization){
    return function(user, context, resource){
        return true && !authorization(user, context, resource);
    };
};


/**
 *
 *
 */
var can_i = function(list, action, target, user, context){
    var auth = list.get(makeKey(action, target));
    if(auth){
        var brp = auth.value.brp || false;
        var resource = brp && brp(user, context);
        if(auth.value.auth(user, context, resource)){
            var arp = auth.value.arp || false;
            return (arp && arp(user, context, resource)) || true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

module.exports.can = can;
module.exports.and = and;
module.exports.or = or;
module.exports.not = not;

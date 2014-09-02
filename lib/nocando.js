var FastSet = require('collections/fast-set'),
    RSVP = require('rsvp');

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
       /**
        *Registers one more authorization
        *
        *@param action
        *@param target
        *@param authorization
        *@param before_authorization
        *@param after_authorization
        *
        *@return AuthMonad The same object for chained calls
        */
        can : function(action, target, authorization, before_authorization, after_authorization){
            return new AuthMonad(
                saveAuthorization(that.value, action, target, authorization,
                    before_authorization, after_authorization)
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
        override : function(action, target, authorization, before_authorization, after_authorization){

        },

        /**
         *
         *@param action
         *@param context
         *@param user
         *@param app_context
         *@param callback function(err, data) OPTIONAL Used when some provider or authorization must be done asyncronously
         *
         *@return MaybeMonad
         */
        authorize : function(action, target, user, context, callback){
//            return new MaybeMonad(can_i(that.value, action, target, user, context, callback));
            return new RSVP.Promise(function(resolve, reject){
                var result = can_i(that.value, action, target, user, context, callback);
                if(result) {
                    resolve(result);
                } else {
                    reject(result);
                }
            });
        }
    };
};


var Auth = function(key, action, context, authorization, before_authorization, after_authorization){
    var cancallback = function(err, result){
        
    };

    var beforecallback = function(err, data){

    };

    var  aftercallback = function(err, data){

    };

    this.key = key;
    this.value = {
      context : context,
      action : action,
      auth : authorization,
      cancallback : cancallback,
      before :  before_authorization,
      beforecallback : beforecallback,
      after :  after_authorization,
      aftercallback : aftercallback
    };
};

var saveAuthorization = function(list, action, context, authorization, before_authorization, after_authorization){
    var key = makeKey(action, context);
    var auth = new Auth(key, action, context, authorization, before_authorization, after_authorization);

    if(!list.has(auth.key)){
        list.add(auth);        
        return list;
    } else {
        auth = list.get(auth.key);
        throw new Error('Repeated authorization. The key: ' + key + ' is already stored as key: ' + auth.key);
    }
};

var makeKey = function(action, context){
    return context + '-' + action;
};

/**
 *Registers an authorization for the first time
 *
 *@param action
 *@param context
 *@param authorization
 *@param before_authorization
 *@param after_authorization
 *
 *@return AuthMonad 
 */
var can = function(action, context, authorization, before_authorization, after_authorization){

    /**
     *
     *@param a - Stored Auth
     *@param b - Key or Auth to be Stored
     */
    var equals = function(a, b){
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

    var fastSet = new FastSet(
      null,
      equals,
      hash
    );

    return new AuthMonad(
        saveAuthorization(fastSet, action, context,
            authorization, before_authorization, after_authorization)
    );   
};

/**
 * AND boolean operator for authorization functions aggregation. 
 * Short circuited: Stops on first false.
 *
 * @param function(u, c, r)+ A set of authorizations
 * @return function(u, c, r) A combined authorization
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
 * OR boolean operator for authorization functions aggregation.
 * Short circuited: Stops on first true.
 *
 * @param function(u, c, r )+ A set of authorizations
 * @return function(u, c, r) A combined authorization
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
 * NOT boolean operator for authorization functions.
 *
 * @param function(u, c, r) An authorization
 * @return function(u, c, r) A negated authorization
 */
var not = function(authorization){
    return function(user, context, resource){
        return true && !authorization(user, context, resource);
    };
};

/**
 * Checks if an action can be performed.
 *
 * @return true|false|resource
 */
var can_i = function(list, action, target, user, context){
    var auth = list.get(makeKey(action, target));
    if(auth){
        var before = auth.value.before || false,
            cancallback = auth.value.cancallback,
            beforecallback = auth.value.beforecallback,
            aftercallback = auth.value.aftercallback,
            resource = before && before(user, context, beforecallback);

        if(auth.value.auth(user, context, resource)){
            var after = auth.value.after || false;
            return (after && after(user, context, resource, aftercallback)) || true;
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

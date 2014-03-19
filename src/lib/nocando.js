

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
                return fn.call(this, value);
            }
        };
    };

    if(value === null || value === undefined || typeof value === 'undefined' || value.lenght && value.lenght <= 0)
      return nothing;

    return something(value);
};

var StateMonad = function(value){


}


/**
 *
 *
 *@param action
 *@param context
 *@param authorization
 *@param app_context_provider
 *@param app_resource_provider
 */
var can = function(action, context, authorization, app_context_provider, app_resource_provider){

};

/**
 *
 *
 */
var cannot = function(action, context, authorization, app_context_provider, app_resource_provider){

};


/**
 *
 *
 */
var and = function(auth_set){
    return function(user, app_context, app_resource){
        return auth_set.reduce(function(acc, curr){
            return acc && curr(user, app_context, app_resource);
        }, auth_set, true);
    };
};

/**
 *
 *
 */
var or = function(auth_set){
    return function(user, app_context, app_resource){
        return auth_set.reduce(function(acc, curr){
            return acc || curr(user, app_context, app_resource);
        }, auth_set, false);
    };
};


/**
 *
 *
 */
var not = function(authorization){
    return function(user, app_context, app_resource){
        return true && !authorization(user, app_context, app_resource);
    };
};

/**
 *
 *
 */
var revoke = function(action, context){};

/**
 *
 *
 */
var override = function(action, context, app){

};

/**
 *
 *
 */
var can_i = function(action, context, user, app_context){

    return {
        result : true,
        

    };
};

/**
 *
 *
 *@param action
 *@param context
 *@param user
 *@param app_context
 *
 *@return MaybeMonad
 */
var authorize = function(action, context, user, app_context){
        
    
    
    return MaybeMonad(resource);
};




exports.authorize = authorize;
exports.can = can;
exports.cannot = cannot;
exports.and = and;
exports.or = or;
exports.not = not;
exports.revoke = revoke;
exports.override = override;

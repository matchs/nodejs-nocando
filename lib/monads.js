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


};


module.exports.State = StateMonad;
module.exports.Maybe = MaybeMonad;

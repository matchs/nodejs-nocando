var assert = require('assert');
var nocando = require('../lib/nocando');


var tautology = function(){
    return true;
};

var contradiction = function(){
    return false;
};

describe('Boolean Operators', function(){
    it('not', function(){
      var negation = nocando.not(tautology);

      assert.equal(false, negation());
    });

    it('or', function(){
      var result = nocando.or(
          tautology,
          contradiction
      );
      
      assert.equal(true, result());
    });

    it('and', function(){
      var result = nocando.and(
          tautology,
          contradiction
      );
      
      assert.equal(false, result());
    });
});

describe('Monads', function(){
    it('MaybeMonad', function(){

    });

    if('StateMonad', function(){

    });
});

describe('Registering authorizations', function(){
    it('saveAuthorization', function(){

    });

    it('can', function(){

    });

    it('revoke', function(){

    });

    it('override', function(){

    });
});


describe('Authorizing', function(){
  

});

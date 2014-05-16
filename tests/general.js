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





describe('Registering authorizations', function(){
    var allow_to_all = function(u, c, r){
        return true;
    };

    var deny_to_all = function(u, c, r){
        return false;
    };

    var dummy_resource_provider = function(u, c){
        return {
            name : 'dummy'
        };
    };

    var dummy_auth_resource_provider = function(u, c, r){
        r.profile = 'dummy_profile';
        return r;
    };

    it("`can` authorizedi with resource provider", function(){
        var Auth = nocando.can('a', 'b', 
            allow_to_all, 
            dummy_resource_provider, 
            dummy_auth_resource_provider);

        var Maybe = Auth.authorize('a', 'b');

        assert.equal('dummy', Maybe.maybe(false).name);
        assert.equal('dummy_profile', Maybe.maybe(false).profile);
    });

    it("`can` not authorized", function(){
        var Auth = nocando.can('a', 'b', 
            allow_to_all, 
            dummy_resource_provider, 
            dummy_auth_resource_provider);

        var Maybe = Auth.authorize('a', 'c');

        assert.equal(false, Maybe.maybe(false, function(v){
            return v.name;
        }));
    });

    it("`can` with * action authorized", function(){
        var Auth = nocando.can('*', 'b', 
            allow_to_all, 
            dummy_resource_provider, 
            dummy_auth_resource_provider);

        var Maybe = Auth.authorize('a', 'b');

        assert.equal("dummy", Maybe.maybe(false, function(v){
            return v.name;
        }));
    });

    it("`can` with * action not authorized", function(){
        var Auth = nocando.can('*', 'b', 
            allow_to_all, 
            dummy_resource_provider, 
            dummy_auth_resource_provider);

        var Maybe = Auth.authorize('a', 'c');

        assert.equal(false, Maybe.maybe(false, function(v){
            return v.name;
        }));
    });

    it('revoke', function(){

    });

    it('override', function(){

    });
});


describe('Authorizing', function(){
  

});

var assert = require('assert'),
    nocando = require('../lib/nocando'),
    RSVP = require('rsvp');


describe('Boolean Operators', function(){
    var tautology = function(){
        return true;
    };

    var contradiction = function(){
        return false;
    };

    it('not', function(){
      assert.equal(false, nocando.not(tautology)());
      assert.equal(true, nocando.not(contradiction)());
    });

    it('or', function(){
      assert.equal(true, nocando.or(
          tautology,
          contradiction
      )());

      assert.equal(true, nocando.or(
          tautology,
          tautology
      )());

      assert.equal(false, nocando.or(
          contradiction,
          contradiction
      )());
    });

    it('and', function(){
      assert.equal(false, nocando.and(
          tautology,
          contradiction
      )());

      assert.equal(true, nocando.and(
          tautology,
          tautology
      )());
    });
});

describe('Registering authorizations:', function(){
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

    var dummy_async_resource_provider = function(u, c, callback){
        setTimeout(function(){
            callback({
                name : 'dummy'
            });
        }, 3); 
    };

    var dummy_async_auth_resource_provider = function(u, c, r, callback){
        setTimeout(function(){
            callback({
                name : 'dummy'
            });
        }, 3); 
    };

    var async_allow_to_all = function(u, c, async_r, callback){
        async_r(function(e, r){
            callback(e, r);
        });
    };

    var async_deny_to_all = function(u, c, async_r, callback){
        async_r(function(e, r){
            callback(e, false);
        });
    };

    it("`can` authorized without resource provider", function(done){
        var Auth = nocando.can('a', 'b', allow_to_all); 

        Auth.authorize('a', 'b')
            .then(function(value){
                assert.equal(true, value);
                done();
            });
    });

    it("`can` authorized with resource provider", function(done){
        var Auth = nocando.can('a', 'b', allow_to_all, 
                   dummy_resource_provider, 
                   dummy_auth_resource_provider);

        Auth.authorize('a', 'b')
            .then(function(value){
                assert.equal('dummy', value.name);
                assert.equal('dummy_profile', value.profile);
                done();
            });
    });

    it("`can` not authorized", function(done){
        var Auth = nocando.can('a', 'b', 
                   allow_to_all, 
                   dummy_resource_provider, 
                   dummy_auth_resource_provider);

        Auth.authorize('a', 'c')
            .catch(function(value){
                assert.equal(false, value);
                done();
            });

    });

    it("`can` with * action authorized", function(done){
        var Auth = nocando.can('*', 'b', 
                   allow_to_all, 
                   dummy_resource_provider, 
                   dummy_auth_resource_provider);

        Auth.authorize('a', 'b')
            .then(function(value){
                assert.equal("dummy", value.name);
                done();
            });
    });

    it("`can` with * action not authorized", function(done){
        var Auth = nocando.can('*', 'b', 
                   allow_to_all, 
                   dummy_resource_provider, 
                   dummy_auth_resource_provider);

        Auth.authorize('a', 'c')
            .catch(function(value){
                assert.equal(false, value);
                done();
            });
    });

    it("`can` chained calls", function(done){
        var Auth = nocando
            .can('a0', 'b', 
                allow_to_all, 
                dummy_resource_provider, 
                dummy_auth_resource_provider)

            .can('a1', 'b', allow_to_all, 
                 function(){
                     return {
                         name : "dummy2"
                     };
                 }, 
                 dummy_auth_resource_provider);

        var results = [];

        results.push(Auth.authorize('a0', 'b'));
        results.push(Auth.authorize('a1', 'b'));

        RSVP.all(results)
          .then(function(values){
                assert.equal("dummy", values[0].name);
                assert.equal("dummy2", values[1].name);
                done();              
          });
    });

    it('`can` try register duplicated authorization', function(){
        var Auth = nocando.can('a', 'b', allow_to_all);
        assert.throws(function(){
            Auth.can('a', 'b', allow_to_all);
        }, Error);
    });

    it('`can` try register duplicated authorization with *', function(){
        var Auth = nocando.can('*', 'b', allow_to_all);
        assert.throws(function(){
            Auth.can('a', 'b', allow_to_all);
        }, Error);
    });

    it('`can` async resource provider', function(done){
        //TODO
        done(); 
    });

    it('`can` async authorized resource provider', function(done){
        //TODO
        done(); 
    });

    it('revoke', function(){
        //TODO
    });

    it('override', function(){
        //TODO
    });
});


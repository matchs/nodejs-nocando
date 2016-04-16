var exports = module.exports

var Rule = exports.Rule = function(who, does, what, condition, resources) {
    this.check = function(who, does, what) {
        return new Promise((accepts, rejects) =>
            condition(who, does, what, accepts, rejects, resources))
    }
}

var Ruler = exports.Ruler = function() {
    this._rules = [];
    this.can = function(does, what, condition, resources) {
        this._rules.append(new Rule(who, does, what, condition, resources));
        return this;
    }

    this.authorize = function(who, does, what) {
        return Promise.all(this._rules.map((r) => r.check(who, does, what)));
    }
}

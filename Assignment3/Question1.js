/**
 * Created by courtneywright on 11/7/16.
 */

//takes environment and returns a new environment that is a child
// of given environment with a random name, and no bindings
function createEnv(parent) {
    var env = {
        name: Math.random(),
        bindings: {},
        parent: parent
    };
    return env;
}

//takes a binding and an environment and searches that
//environment and every parent environment for the binding
function lookup(name, env) {
    if (env.bindings[name] !== null && env.bindings[name] !== undefined) {
        return env.bindings[name];
    } else if(env.parent){
        return lookup(name, env.parent);
    } else {
        return null;
    }
}
/**
 * Created by courtneywright on 11/7/16.
 */

function createEnv(parent) {
    var env = {
        name: Math.random(),
        bindings: {},
        parent: parent
    };
    return env;
}

function lookup(name, env) {
    if (env.bindings[name] !== null && env.bindings[name] !== undefined) {
        return env.bindings[name];
    } else if(env.parent){
        return lookup(name, env.parent);
    } else {
        return null;
    }
}
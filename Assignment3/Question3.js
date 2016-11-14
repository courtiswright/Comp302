/**
 * Created by courtneywright on 11/7/16.
 */

function isDefined(obj) {
    return obj !== null && obj !== undefined;
}

function evalWML(ast, env) {
    return evalOuterText(ast, env);
}

function evalOuterText (ast, env){
    if(ast) {
        var result;
        if(isDefined(ast.OUTERTEXT)) {
            result = ast.OUTERTEXT;
        } else if (ast.templateinvocation) {
            result = evalTemplateInvocation(ast.templateinvocation, env);
        } else if (ast.templatedef) {
            evalTemplateDefinition(ast.templatedef, env);
            result = ""; //do not print stringified closures
        }
        var rest = evalOuterText(ast.next, env);
        return result + rest;
    } else {
        return "";
    }
}

function evalTemplateInvocation(ast, env) {
    if(ast) {
        function getArgumentList(targs) {
            if(targs) {
                var list = getArgumentList(targs.next);
                list.unshift(targs.itext);
                return list;
            } else {
                return [];
            }
        }
        var params = getArgumentList(ast.targs);

        var name = evalInvocationText(ast.itext, env);

        if(name === "#if") {
            var cond = params[0];
            var body = params[1];
            return HashtagIf(cond, body, env);
        } else if (name === "#ifeq") {
            var var1     = params[0];
            var var2     = params[1];
            var thenBody = params[2];
            var elseBody = params[3];
            return HashtagIfEq(var1, var2, thenBody, elseBody, env);
        } else if (name === "#expr") {
            return HashtagExpr(params[0], env);
        } else {
            var closure, newEnv;
            if(env.bindings[name]) {
                closure = unstringify(env.bindings[name]);
                newEnv = createEnv(closure.env);
                newEnv.bindings[name] = env.bindings[name];

            } else { // @name is actually a lambda
                closure = unstringify(name);
                newEnv = createEnv(closure.env);
            }

            if(params.length !== closure.params.length) {
                throw "Wrong number of params to " + name + ". expected: " + closure.params.length + ", actual: " + params.length;
            }

            for(var i = 0; i < params.length; i++) {
                var key = evalDefinitionText(closure.params[i], closure.env);
                var value = evalInvocationText(params[i], env);
                newEnv.bindings[key] = value;
            }

            return evalDefinitionText(closure.body, newEnv);
        }
    } else {
        throw "AST was null";
    }
}

/*
function evalTemplateInvocation(ast, env) {
    if(ast) {
        var argValues = ast.targs;
        var name = evalInvocationText(ast.itext, env);
        if(name === "#if") {
            var cond = ast.targs.itext;
            var body = ast.targs.next.itext;
            return HashtagIf(cond, body, env);
        } else if (name === "#ifeq") {
            var var1     = ast.targs.itext;
            var var2     = ast.targs.next.itext;
            var thenBody = ast.targs.next.next.itext;
            var elseBody = ast.targs.next.next.next.itext;
            return HashtagIfEq(var1, var2, thenBody, elseBody, env);
        } else if (name === "#expr") {
            return HashtagExpr(ast.targs.itext, env);
        } else {
            var argNames = lookup(name, env);
            if(argNames === undefined) {
                throw "Could not find function " + name;
            }

            var newEnv = createEnv(env);
            function evalTemplateInvocationHelper(argNames, argValues) {
                if (argValues && argNames.next) {
                    var key = evalDefinitionText(argNames.dtext, env);
                    var value = evalInvocationText(argValues.itext, env);
                    newEnv.bindings[key] = value;
                    return evalTemplateInvocationHelper(argNames.next, argValues.next);
                } else {
                    if(argValues) {
                        throw "too many arguments to " + name;
                    }
                    if(argNames.next) {
                        throw "not enough arguments to " + name;
                    }

                    return evalDefinitionText(argNames.dtext, newEnv);
                }
            }
            return evalTemplateInvocationHelper(argNames, argValues);
        }
    } else {
        throw "no";
    }
}
*/

function HashtagIf(cond, body, env) {
    if(cond) {
        return evalInvocationText(body, env);
    } else {
        return "";
    }
}

function HashtagIfEq(var1, var2, thenBody, elseBody, env) {
    if (evalInvocationText(var1, env) === evalInvocationText(var2, env)) {
        return evalInvocationText(thenBody, env);
    } else {
        return evalInvocationText(elseBody, env);
    }
}

function HashtagExpr(body, env) {
    var evalString = evalInvocationText(body, env);
    return String(eval(evalString));
}

function evalTemplateArgs(ast, env) {
    if (ast) {
        var result;
        if (ast.itext) {
            result = evalInvocationText(ast.itext, env);
        }
        var rest = evalTemplateArgs(ast.next, env);
        return result + rest;
    } else {
        return "";
    }
}

function evalInvocationText(ast, env) {
    if(ast) {
        var result;
        if(isDefined(ast.INNERTEXT)) {
            result = ast.INNERTEXT;
        } else if(ast.templateinvocation) {
            result = evalTemplateInvocation(ast.templateinvocation, env);
        } else if(ast.templatedef) {
            result = evalTemplateDefinition(ast.templatedef, env);
        } else if(ast.tparam) {
            result = evalTemplateParameters(ast.tparam, env);
        }
        var rest = evalInvocationText(ast.next, env);
        return result + rest;
    } else{
        return "";
    }
}

function evalTemplateDefinition(ast, env) {
    if(ast) {
        var name = evalDefinitionText(ast.dtext, env);

        function getBody(params) {
            if(params.next) {
                return getBody(params.next);
            } else {
                return params.dtext;
            }
        }

        var body = getBody(ast.dparams);

        function getParamsList(params) {
            if(params.next) {
                var result = getParamsList(params.next);
                params.next = undefined;
                result.unshift(params.dtext);
                return result;
            } else {
                return [];
            }
        }

        var params = getParamsList(ast.dparams);

        var stringified = stringify({
            params: params,
            body: body,
            env: env
        });

        if (name !== "‘") {
            env.bindings[name] = stringified;
        }

        return stringified;
    }
    else {
        throw "AST was null";
    }
}

function evalDefinitionText(ast, env) {
    if(ast) {
        var result;
        if (isDefined(ast.INNERDTEXT)) {
            result = ast.INNERDTEXT;
        } else if (ast.templateinvocation) {
            result = evalTemplateInvocation(ast.templateinvocation, env);
        } else if (ast.templatedef) {
            result = evalTemplateDefinition(ast.templatedef, env);
        } else if (ast.tparam) {
            result = evalTemplateParameters(ast.tparam, env);
        } else {
            throw "what";
        }
        var rest = evalDefinitionText(ast.next, env);
        return result + rest;
    } else {
        return "";
    }
}
function evalTemplateParameters(ast, env) {
    var paramVal = lookup(ast.pname, env);
    if(isDefined(paramVal)) {
        if(typeof paramVal === "string") {
            return paramVal;
        } else if(paramVal.name === "itext") {
            evalInvocationText(paramVal, env);
        } else if (paramVal.name === "dtext") {
            evalDefinitionText(paramVal, env);
        } else {
            throw "looked up a tparam but obtained something weird";
        }
    } else {
        throw "undefined name " + ast.pname;
    }
}
/**
 * Created by courtneywright on 11/10/16.
 */

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
            result = evalTemplateDefinition(ast.templatedef, env);
        }
        var rest = evalOuterText(ast.next, env);
        return result + rest;
    } else {
        return "";
    }
}

function evalTemplateInvocation(ast, env) {
    if(ast) {
        var argValues = ast.targs;
        var name = evalInvocationText(ast.itext, env);
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
    } else {
        throw "no";
    }
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
            resulte = evalTemplateDefinition(ast.templatedef, env);
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
        var params = ast.dparams;
        env.bindings[name] = params;
        return "";
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
    if(paramVal) {
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
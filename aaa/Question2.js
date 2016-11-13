/**
 * Created by courtneywright on 11/7/16.
 */

function evalWML(ast, env) {
    return evalOuterText(ast, env);
}

function evalOuterText (ast, env){
    if(ast) {
        var result;
        if(ast.OUTERTEXT) {
            result = ast.OUTERTEXT;
        } else if (ast.templateinvocation) {
            result = evalTemplateInvocation(ast, env);
        } else if (ast.templatedef) {
            result = evalTemplateDefinition(ast, env);
        }
        var rest = evalOuterText (ast.next, env);
        return result + rest;
    } else {
        return "";
    }
}

function evalTemplateInvocation(ast, env) {}
function evalTemplateArgs(ast, env) {}
function evalInvocationText(ast, env) {}

function evalTemplateDefinition(ast, env) {
    if(ast) {
        var name = ast.dtext;
        var params = ast.dparams;
        env.bindings[name] = function (env) {

        }
    }
    else {
        throw "no";
    }
    return "";
}
function evalDefinitionText(ast, env) {
    if(ast) {
        var result;
        if (ast.INNERDTEXT) {
            result = ast.INNERDTEXT;
        } else if (ast.templateinvocation) {
            result = evalTemplateInvocation(ast, env);
        } else if (ast.templatedef) {
            result = evalTemplateDefinition(ast, env);
        } else if (ast.tparam) {
            throw "TODO";
        } else {
            throw "what";
        }
        var rest = evalTemplateDefinition(ast, env);
        return result + rest;
    } else {
        return "";
    }
}
function evalTemplateParameters(ast, env) {}
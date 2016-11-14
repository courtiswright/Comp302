/**
 * Created by courtneywright on 11/7/16.
 *
 * THIS IS QUESTIONS 2-4 MERGED INTO ONE BECAUSE 3 & 4 RELY ON 2
 */

//needed due to JS typing issue in which if(var)
//returns false if var is of type empty string
function isDefined(obj) {
    return obj !== null && obj !== undefined;
}

//just like calling evalOuter directly. Similar to
//order used to parse in A2 where you look at the outertext
//before anything else because it is on the root node
function evalWML(ast, env) {
    return evalOuter(ast, env);
}

//evaluates zero or more outer nodes. Each time a new node is
//evaluated, the function determines what it is (an OUTERTEXT,
//templateinvocation, or templatedef, and evaluates them as
//needed. Once done, everything evaulated is returned with
//an empty string at the end.
function evalOuter (ast, env){
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
        var rest = evalOuter(ast.next, env);
        return result + rest;
    } else {
        return "";
    }
}

//evaluates exactly one templateinvocation
function evalTemplateInvocation(ast, env) {
    if(ast) {

        //creates argument list by adding a spot in the
        //list for each targ that exists and adding the
        //itext of that targ to the lsit
        function getArgumentList(targs) {
            if(targs) {
                var list = getArgumentList(targs.next);
                list.unshift(targs.itext);
                return list;
            } else {
                return [];
            }
        }

        //calls getArgumentList
        var params = getArgumentList(ast.targs);

        //sets name of function to be first itext
        var name = evalInvocationText(ast.itext, env);

        //defines parameters to pass HashtagIf as condition, thenBody, and elseBody
        //by taking the first param as cond and second as thenBody. The third param
        //(elseBody) is set to the second param if one exists, or empty string if one
        //does not exist.
        if(name === "#if") {
            var cond = params[0];
            var thenBody = params[1];
            var elseBody;
            if(isDefined(params[2])) {
                elseBody=params[2];
            } else {
                elseBody=null;
            }
            return HashtagIf(cond, thenBody, elseBody, env);
        }

        //defines parameters to pass HashtagIfEq as var1, var1, thenBody,
        //elseBody by taking params in order of appearance described in
        //built in function template given in class
        else if (name === "#ifeq") {
            var var1     = params[0];
            var var2     = params[1];
            var thenBody = params[2];
            var elseBody = params[3];
            return HashtagIfEq(var1, var2, thenBody, elseBody, env);
        }

        //defines parameter to pass HashtagExpr by taking first param
        //to match built in function template
        else if (name === "#expr") {
            return HashtagExpr(params[0], env);
        }

        //if not a built in function, evaluate
        else {
            var closure, newEnv;

            //if there is a binding in the current environment, reconstuct AST of
            //binding using unstringify adn create a new environment with parent being
            //environment of reconstufcted AST. Add bindings to new environment
            var stringified = lookup(name, env);
            if(stringified) {
                closure = unstringify(stringified);
                newEnv = createEnv(closure.env);
                newEnv.bindings[name] = stringified;
            }
            //if no bidning, then name is a function, so reconstuct AST of that function
            //and create a new environment with parent being reconstructed AST
            else {
                closure = unstringify(name);
                newEnv = createEnv(closure.env);
            }

            //make sure same number of parameters in reconstructed AST
            if(params.length !== closure.params.length) {
                throw "Wrong number of params to " + name + ". expected: " + closure.params.length + ", actual: " + params.length;
            }

            //create bindings between parameter names found in reconstructed
            //definition AST and parameter values found in invocation AST
            for(var i = 0; i < params.length; i++) {
                var key = evalDefinitionText(closure.params[i], closure.env);
                var value = evalInvocationText(params[i], env);
                newEnv.bindings[key] = value;
            }

            //return evaluated (in new env) operations of function within body
            return evalDefinitionText(closure.body, newEnv);
        }
    } else {
        throw "AST was null";
    }
}

//evaluates built in #if function by evaluating itext if condition is true.
//if condition is not true, and there was no elseBody return empty string,
// otherwise evaluate itext of elseBody
function HashtagIf(cond, thenBody, elseBody, env) {
    if(cond) {
        return evalInvocationText(thenBody, env);
    } else if(elseBody === null){
        return "";
    } else{
        return evalInvocationText(elseBody, env);
    }
}

//evaluates built in #ifeq function by evaluating first itext (then body) if
//var1 and var2 are equal, or else body if they are not
function HashtagIfEq(var1, var2, thenBody, elseBody, env) {
    if (evalInvocationText(var1, env) === evalInvocationText(var2, env)) {
        return evalInvocationText(thenBody, env);
    } else {
        return evalInvocationText(elseBody, env);
    }
}

//evaluates built in #expr function by calling JS eval function (how #eval was defined in class)
//on evaluated itext and making sure it is a string
function HashtagExpr(body, env) {
    var evalString = evalInvocationText(body, env);
    return String(eval(evalString));
}

//evaluates zero or more targs. Each time a node is evaluated, checks
//if there is an itext. If there is, it evals that and adds it to what
//we are returning, then checks the next node in the ast to see if it
//is also a targ. If there are no targs, an empty string is returned.
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

//evaluates zero or more itext. Each time a node is evaluated, it checks
//if it is an itext, and if so which of the four options within the definition
//of itext this node is, and evaluates the node for the type it is found to
//be. This is added to what is returned until there are no more nodes, in
//which case an empty string is appended to the end of what is being returned
//and it is returned. If there are no itext, only an empty string is returned
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

//evaluates exactly one tempatedef
function evalTemplateDefinition(ast, env) {
    if(ast) {

        //define name of function as first dtext
        var name = evalDefinitionText(ast.dtext, env);

        //get body of funciton by getting last dtext in definition
        function getBody(params) {
            if(params.next) {
                return getBody(params.next);
            } else {
                return params.dtext;
            }
        }

        //set variable body as output of getBody function
        var body = getBody(ast.dparams);

        //creates parameter list by adding a spot in the
        //list for each param that exists and adding that to the list
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

        //set variable params to list of parameters
        var params = getParamsList(ast.dparams);

        //turn function into a string using given stringify
        //fucntion so that functions can called only defined
        // in environment as `
        var stringified = stringify({
            params: params,
            body: body,
            env: env
        });

        //if this fucntion is defined as ` (only defined in
        // current environment), set binding right away
        if (name !== "`") {
            env.bindings[name] = stringified;
        }

        //return function as a string
        return stringified;
    }
    else {
        throw "AST was null";
    }
}

//evaluates zero or more dtext. If there are zero, returns an empty string.
//Otherwise, checks which this node is within the definition of dtext and
//evaluates it as that, appending this evaluation to the return.
function evalDefinitionText(ast, env) {
    if(ast) {
        var result;
        if (isDefined(ast.INNERDTEXT)) {
            result = ast.INNERDTEXT;
        } else if (ast.templateinvocation) {
            result = evalTemplateInvocation(ast.templateinvocation, env);
        } else if (ast.templatedef) {
            evalTemplateDefinition(ast.templatedef, env);
            result = "";
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

//evaluates one tparam. Looks for name of param (pname) using lookup from
//Q1. If param binding is found, checks if it is a string or a function
//(itext node) and returns the string or evaluates the node.
function evalTemplateParameters(ast, env) {
    var paramVal = lookup(ast.pname, env);
    if(isDefined(paramVal)) {
        if(typeof paramVal === "string") {
            return paramVal;
        } else if(paramVal.name === "itext") {
            return evalInvocationText(paramVal, env);
        } else {
            throw "looked up a tparam but obtained something weird";
        }
    } else {
        throw "undefined name " + ast.pname;
    }
}
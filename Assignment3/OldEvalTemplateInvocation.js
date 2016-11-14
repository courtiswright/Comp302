/**
 * Created by courtneywright on 11/14/16.
 */


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
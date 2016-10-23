/**
 * Created by courtneywright on 10/20/16.
 * Worked with Veronica Nasseem, ID 260654054
 */

function printAST(ast) {
    if(!ast) {
        return "";
    } else if(ast.name === "outer") {
        var result;
        if(ast.OUTERTEXT != null) {
            result = ast.OUTERTEXT;
        } else if (ast.templateinvocation) {
            result = printAST(ast.templateinvocation);
        } else if (ast.templatedef) {
            result = printAST(ast.templatedef);
        } else {
            throw "malformed outer node";
        }
        return result + printAST(ast.next);
    } else if(ast.name === "templateinvocation") {
        return "{{" + printAST(ast.itext) + printAST(ast.targs) + "}}";
    } else if(ast.name === "targs") {
        var result = "|" + printAST(ast.itext);
        return result + printAST(ast.next);
    } else if(ast.name === "itext") {
        var result;
        if(ast.INNERTEXT != null) {
            result = ast.INNERTEXT;
        } else if (ast.templateinvocation) {
            result = printAST(ast.templateinvocation);
        } else if (ast.templatedef) {
            result = printAST(ast.templatedef);
        } else if (ast.tparam) {
            result = printAST(ast.tparam);
        } else {
            throw "malformed dtext node";
        }
        return result + printAST(ast.next);
    } else if(ast.name === "templatedef") {
        var result = "{:";

        function extractdtext(ast.dtext) {
            if(!ast.next) {
                return printAST(ast);
            } else {
                return printAST(ast.dtext) + "|" + extractdtext(ast.next);
            }
        }

        result += extractdtext(ast);
        result += ":}";
        return result;

    } else if(ast.name === "dtext") {
        var result;
        if(ast.INNERDTEXT != null) {
            result = ast.INNERDTEXT;
        } else if (ast.templateinvocation) {
            result = printAST(ast.templateinvocation);
        } else if (ast.templatedef) {
            result = printAST(ast.templatedef);
        } else if (ast.tparam) {
            result = printAST(ast.tparam);
        } else {
            throw "malformed dtext node";
        }
        return result + printAST(ast.next);
    } else if(ast.name === "tparam") {
        return "{{{" + ast.PNAME + "}}}";
    }
}
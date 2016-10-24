/**
 * Created by courtneywright on 10/20/16.
 * Worked with Veronica Nasseem, ID 260654054
 */

/**
 * @param ast: gets tree from parse function (or can be passed directly in theory).
 * @returns {*}
 */
function printAST(ast) {

    //if there is no tree, return null
    if(!ast) {
        return "";
    }

    /**
     * otherwise, if we have matched <outer> while parsing, check which part of <outer> was matched to find text
     * and call print function recursively to print definition that was matched.
     */
    else if(ast.name === "outer") {
        var text;
        if(ast.OUTERTEXT != null) {
            text = ast.OUTERTEXT;
        } else if (ast.templateinvocation) {
            text = printAST(ast.templateinvocation);
        } else if (ast.templatedef) {
            text = printAST(ast.templatedef);
        } else {
            throw "malformed outer node";
        }
        return text + printAST(ast.next);
    }

    /**
     * otherwise, if we have matched <templateinvocation> while parsing, call print function recursively
     * on <itext> and <targs>, where we know there is INNERTEXT, and surround that by TSTART and TEND.
     */
    else if(ast.name === "templateinvocation") {
        return "{{" + printAST(ast.itext) + printAST(ast.targs) + "}}";
    }

    /**
     * otherwise, if we have matched <targs> while parsing, call print function recursively on <itext>
     * where we know there is INNERTEXT, and add a pipe to the beginning.
     */
    else if(ast.name === "targs") {
        return "|" + printAST(ast.itext) + printAST(ast.next);
    }

    /**
     * otherwise, if we have matched <itext> while parsing, check which part of <itext> was matched to find
     * text and call print function recursively to print definition that was matched.
     */
    else if(ast.name === "itext") {
        var text;
        if(ast.INNERTEXT != null) {
            text = ast.INNERTEXT;
        } else if (ast.templateinvocation) {
            text = printAST(ast.templateinvocation);
        } else if (ast.templatedef) {
            text = printAST(ast.templatedef);
        } else if (ast.tparam) {
            text = printAST(ast.tparam);
        } else {
            throw "malformed dtext node";
        }
        return text + printAST(ast.next);
    }

    /**
     * otherwise, if <templatedef> was matched while parsing, add DSTART to text. Then, check for <dtext
     * and add string of PIPE + <dtext> as long as there are more, to text. Then, add DEND and return text.
     */
    else if(ast.name === "templatedef") {
        var text = "{:";

        function extractdtext(ast) {
            if(!ast.next) {
                return printAST(ast);
            } else {
                return printAST(ast) + "|" + extractdtext(ast.next);
            }
        }

        text += extractdtext(ast.dtext);
        text += ":}";
        return text;

    }

    /**
     * otherwise, if we have matched <dtext> while parsing, check which part of <dtext> was matched to find
     * text and call print function recursively to print definition that was matched.
     */
    else if(ast.name === "dtext") {
        var text;
        if(ast.INNERDTEXT != null) {
            text = ast.INNERDTEXT;
        } else if (ast.templateinvocation) {
            text = printAST(ast.templateinvocation);
        } else if (ast.templatedef) {
            text = printAST(ast.templatedef);
        } else if (ast.tparam) {
            text = printAST(ast.tparam);
        } else {
            throw "malformed dtext node";
        }
        return text + printAST(ast.next);
    }

    /**
     * otherwise, if <tparam> was matched while parsing, return PSTART, PNAME, and PEND.
     */
    else if(ast.name === "tparam") {
        return "{{{" + ast.PNAME + "}}}";
    }
}
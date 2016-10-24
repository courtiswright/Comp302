/**
 * Created by courtneywright on 10/20/16.
 * Worked with Veronica Nasseem, ID 260654054
 */


//FIRST SECTION: NON-REPEATING DEFINITIONS (<taparam> and <templateinvocation>)

/**
 * @param s: takes current value of string s as input.
 *
 *  Calls scan on string passed, checking if there is a PSTART in the string. If there is, shortens
 *  new string to start immediately after PSTART. Calls scan on new string, checking for PNAME. If it
 *  exists, shortens new string to start immediately after PNAME. Calls scan on new string, checking
 *  for PEND. If it exists, shortens new string to start immediately after PEND.
 *
 * @returns {{subtree: {name: string, PNAME: (*|string|Number)}, remaining: *}}:
 *  Knowing only PNAME is text based on definitions given, return it in subtree. Also, return remaining s
 *  so that the rest of the very first string (passed by user) can continue to be parsed.
 *
 */
function parseTParam(s) {
    var start = scan(s, { PSTART: true });
    s = s.substring(start.value.length);
    var name = scan(s, { PNAME: true });
    s = s.substring(name.value.length);
    var end = scan(s, { PEND: true });
    s = s.substring(end.value.length);
    return { subtree: { name: "tparam", PNAME: name.value }, remaining: s };
}

/**
 * @param s: takes current value of string s as input.
 *
 *  Same concept as parseTParam(s). Since each given definition has its own function, when a different
 *  definition is described inside <tempateinvocation>, call that function on current s. From what is
 *  returned from called function, we get the new subtree and new string.
 *
 * @returns {{subtree: {name: string, itext: *, targs: *}, remaining: (string|*)}}
 *  Knowing <itext> and <targs> both contain text from definitions given, return them in subtree.
 *  Also, return remaining s so that the rest of the very first string (passed by user) can continue to be parsed.
 */
function parseTemplateInvocation(s) {
    var start = scan(s, { TSTART: true });
    s = s.substring(start.value.length);
    var itextresult = parseIText(s);
    var itext = itextresult.subtree;
    s = itextresult.remaining;
    var targsresult = parseTArgs(s);
    var targs = targsresult.subtree;
    s = targsresult.remaining;
    var end = scan(s, { TEND: true });
    s = s.substring(end.value.length);
    return { subtree: { name: "templateinvocation", itext: itext, targs: targs }, remaining: s};
}


//SECOND SECTION: REPEATING DEFINITIONS

/**
 * @param s: each takes current value of string s as input.
 *
 *  Each of these functions executes the call for definitions with a '*' at the end.
 *  The way this works is recursive inside the matchSeveral function (explained below).
 *  The parse___Once functions, defined below, parse a string once looking for the specified definition.
 *  These function calls are simply to call the recursive function on the parse___Once functions so that
 *  this recursive function can check for one or more occurences. parseOuter is different becasue OUTERTEXT
 *  is the last thing that you will check for at the end of an input string. That is why this returns
 *  object subtree.
 */
function parseOuter(s) {
    var outerresult = matchSeveral(parseOuterOnce, s);
    return outerresult.subtree;
}
function parseTArgs(s) {
    return matchSeveral(parseTArgsOnce, s);
}
function parseIText(s) {
    return matchSeveral(parseITextOnce, s);
}
function parseDText(s) {
    return matchSeveral(parseDTextOnce, s);
}

//used if '*' or '+' to match 0+ or 1+ occurences of the token(s) in question
/**
 *
 * @param f: takes a function (one of the parse___Once functions)
 * @param s: also takes a string (whatever s is at this point)
 * @returns {*}: as long as s can be parsed by the f,
 *      if OUTERTEXT, INNERTEXT, AND INNERDTEXT are all empty strings, return right away
 *      otherwise, recursively call matchSeveral function on shortened s to create subtree, then return it.
 *  if s can't be parsed by f, return null subtree, showing that token does not exist in f.
 */
function matchSeveral(f, s) {
    var headresult = f(s);
    if(headresult) {
        if(headresult.subtree.OUTERTEXT === "" || headresult.subtree.INNERTEXT === "" || headresult.subtree.INNERDTEXT === "") {
            return { subtree: headresult.subtree, remaining: headresult.remaining };
        }
        var head = headresult.subtree;
        s = headresult.remaining;
        var tailresult = matchSeveral(f, s);
        head.next = tailresult.subtree;
        return { subtree: head, remaining: tailresult.remaining };
    } else {
        return { subtree: null, remaining: s };
    }
}

/**
 * @param s: takes current value of string s as input.
 *
 *  Similar to parseTemplateInvocation(s) and parseTParam(s). Checks if there is a PIPE, if not returns null.
 *  Otherwise, shortens new string to start immediately after PIPE. Call parseIText(s) to check if there is
 *  <itext>.
 *
 * @returns {*}: Knowing <itext> contains text from definitions given, return it in subtree. Also, return
 * remaining s so that the rest of the very first string (passed by user) can continue to be parsed.
 */
function parseTArgsOnce(s) {
    var pipe = scan(s, { PIPE: true });
    if (!pipe) {
        return null;
    } else {
        s = s.substring(pipe.value.length);
        var itextresult = parseIText(s);
        var itext = itextresult.subtree;
        return { subtree: { name: "targs", itext: itext }, remaining: s };
    }
}

/**
 * @param s: takes current value of string s as input.
 *
 * We know that OUTERTEXT contains text. We also know that within <templateinvocation> and <templatedef> we will
 * be returned subtrees that may contain text. Therefore, we create an object to return that will hold each of those.
 * The rest is similar to parseTArgsOnce(s). The function first scans to see if s contains TSTART, DSTART,
 * or OUTERTEXT. This is becasue OUTERTEXT will match OUTERTEXT, <templateinvocation> will match TSTART, and
 * <templatedef> will match DSTART so by looking for these, I am essentially looking for <outer> as defined.
 * If none is found, returns null. Ohterwise checks for each if the one before is not found and edits s as needed.
 * This represents the "or"s in the definition of <outer>.
 *
 * @returns {*}: returns subtree held in outer varible created at beginning and edited s.
 */
function parseOuterOnce(s) {
    var outer = {
        name: "outer",
        OUTERTEXT: null,
        templateinvocation: null,
        templatedef: null
    };
    var first = scan(s, { TSTART: true, DSTART: true, OUTERTEXT: true });
    if (!first) {
        return null;
    } else if (first.name === "OUTERTEXT") {
        outer.OUTERTEXT = first.value;
        s = s.substring(first.value.length);
        return { subtree: outer, remaining: s };
    } else if (first.name === "TSTART") {
        var templateinvocationresult = parseTemplateInvocation(s);
        outer.templateinvocation = templateinvocationresult.subtree;
        s = templateinvocationresult.remaining;
        return { subtree: result, remaining: s };
    } else if (first.name === "DSTART") {
        var templatedefresult = parseTemplateDef(s);
        outer.templatedef = templatedefresult.subtree;
        s = templatedefresult.remaining;
        return { subtree: outer, remaining: s };
    } else {
        throw "Bad choice in parseITextOnce";
    }
}

/**
 * @param s: takes current value of string s as input.
 *
 * Pretty much identical to parseOuterOnce(s) except for <itext> definition.
 *
 * @returns {*}: returns subtree stored in itext variable created at beginning of method.
 */
function parseITextOnce(s) {
    var itext = {
        name: "itext",
        INNERTEXT: null,
        templateinvocation: null,
        templatedef: null,
        tparam: null
    };
    var first = scan(s, { TSTART: true, DSTART: true, PSTART: true, INNERTEXT: true });
    if (!first) {
        return null;
    } else if(first.name === "INNERTEXT") {
        itext.INNERTEXT = first.value;
        s = s.substring(first.value.length);
        return { subtree: itext, remaining: s };
    } else if (first.name === "TSTART") {
        var templateinvocationitext = parseTemplateInvocation(s);
        itext.templateinvocation = templateinvocationitext.subtree;
        s = templateinvocationitext.remaining;
        return { subtree: itext, remaining: s };
    } else if (first.name === "DSTART") {
        var templatedefitext = parseTemplateDef(s);
        itext.templatedef = templatedefitext.subtree;
        s = templatedefitext.remaining;
        return { subtree: itext, remaining: s };
    } else if (first.name === "PSTART") {
        var tparamitext = parseTParam(s);
        itext.tparam = tparamitext.subtree;
        s = tparamitext.remaining;
        return { subtree: itext, remaining: s };
    } else {
        throw "Bad choice in parseITextOnce";
    }
}

/**
 * @param s: takes current value of string s as input.
 *
 * Pretty much identical to parseOuterOnce(s) and parseITextOnce(s) except for <dtext> definition.
 *
 * @returns {*}: returns subtree stored in dtext variable created at beginning of method.
 */
function parseDTextOnce(s) {
    var dtext = {
        name: "dtext",
        INNERDTEXT: null,
        templateinvocation: null,
        templatedef: null,
        tparam: null
    };
    var first = scan(s, { TSTART: true, DSTART: true, PSTART: true, INNERDTEXT: true });
    if (!first) {
        return null;
    } else if(first.name === "INNERDTEXT") {
        dtext.INNERDTEXT = first.value;
        s = s.substring(first.value.length);
        return { subtree: dtext, remaining: s };
    } else if (first.name === "TSTART") {
        var templateinvocationdtext = parseTemplateInvocation(s);
        dtext.templateinvocation = templateinvocationdtext.subtree;
        s = templateinvocationdtext.remaining;
        return { subtree: dtext, remaining: s };
    } else if (first.name === "DSTART") {
        var templatedefdtext = parseTemplateDef(s);
        dtext.templatedef = templatedefdtext.subtree;
        s = templatedefdtext.remaining;
        return { subtree: dtext, remaining: s };
    } else if (first.name === "PSTART") {
        var tparamdtext = parseTParam(s);
        dtext.tparam = tparamdtext.subtree;
        s = tparamdtext.remaining;
        return { subtree: dtext, remaining: s };
    } else {
        throw "Bad choice in parseDTextOnce";
    }
}

/**
 * @param s: takes current value of string s as input.
 *
 * Most complicated of parsing functions created due to '+' in given definition. Starts by checking DSTART in
 * same way as parseTParam(s) and parseTemplateInvocation(s). Next, checks for <dtext>. Next, checks for at
 * lesta one PIPE followed by a <dtext> by calling pipedText(s). This function then calls the matchSeveral function
 * on pipedTextOnce and s. If matchSeveral retuns a null subtree, that means no matches were found. Since we want
 * one or more matches, that is an error, which is thrown. Then checks for DEND.
 *
 * @returns {{subtree: {name: string, dtext: *}, remaining: (string|*)}}: returns subtree containing all possible
 *      text and current value of s.
 */
function parseTemplateDef(s) {
    var start = scan(s, { DSTART: true });
    s = s.substring(start.value.length);
    var textresult = parseDText(s);
    var head = textresult.subtree;
    s = textresult.remaining;

    function pipedTextOnce(s) {
        var pipe = scan(s, { PIPE: true });
        if(!pipe) {
            return null;
        } else {
            s = s.substring(pipe.value.length);
            var dtextresult = parseDText(s);
            var dtext = dtextresult.subtree;
            s = dtextresult.remaining;
            return { subtree: dtext, remaining: s };
        }
    }

    function pipedText(s) {
        var result = matchSeveral(pipedTextOnce, s);
        if(result.subtree === null) {
            throw "TemplateDef without pipes + dtexts";
        }
        return result;
    }

    var tailresult = pipedText(s);
    var tail = tailresult.subtree;
    s = tailresult.remaining;
    head.next = tail;

    var end = scan(s, { DEND: true });
    s = s.substring(end.value.length);

    return { subtree : { name: "templatedef", dtext: head }, remaining: s }
}
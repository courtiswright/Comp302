/**
 * Created by courtneywright on 10/20/16.
 * Worked with Veronica Nasseem
 */

function parseOuter(s) {
    var outerresult = kleenestar(parseOuterOnce, s);
    return outerresult.subtree;
}
function parseTArgs(s) { return kleenestar(parseTArgsOnce, s); }
function parseIText(s) { return kleenestar(parseITextOnce, s); }
function parseDText(s) { return kleenestar(parseDTextOnce, s); }

function kleenestar(f, s) {
    var headresult = f(s);
    if(headresult) {
        if(
            headresult.subtree.OUTERTEXT === ""
            || headresult.subtree.INNERTEXT === ""
            || headresult.subtree.INNERDTEXT === ""
        ) {
            return { subtree: headresult.subtree, remaining: headresult.remaining };
        }
        var head = headresult.subtree;
        s = headresult.remaining;
        var tailresult = kleenestar(f, s);
        head.next = tailresult.subtree;
        return { subtree: head, remaining: tailresult.remaining };
    } else {
        return { subtree: null, remaining: s };
    }
}

function parseOuterOnce(s) {
    var result = {
        name: "outer",
        OUTERTEXT: null,
        templateinvocation: null,
        templatedef: null,
    };
    var first = scan(s, { TSTART: true, DSTART: true, OUTERTEXT: true });
    if (!first) {
        return null;
    } else if (first.name === "OUTERTEXT") {
        result.OUTERTEXT = first.value;
        s = s.substring(first.value.length);
        return { subtree: result, remaining: s };
    } else if (first.name === "TSTART") {
        var templateinvocationresult = parseTemplateInvocation(s);
        result.templateinvocation = templateinvocationresult.subtree;
        s = templateinvocationresult.remaining;
        return { subtree: result, remaining: s };
    } else if (first.name === "DSTART") {
        var templatedefresult = parseTemplateDef(s);
        result.templatedef = templatedefresult.subtree;
        s = templatedefresult.remaining;
        return { subtree: result, remaining: s };
    } else {
        throw "Bad choice in parseITextOnce";
    }
}

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

function parseITextOnce(s) {
    var result = {
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
        result.INNERTEXT = first.value;
        s = s.substring(first.value.length);
        return { subtree: result, remaining: s };
    } else if (first.name === "TSTART") {
        var templateinvocationresult = parseTemplateInvocation(s);
        result.templateinvocation = templateinvocationresult.subtree;
        s = templateinvocationresult.remaining;
        return { subtree: result, remaining: s };
    } else if (first.name === "DSTART") {
        var templatedefresult = parseTemplateDef(s);
        result.templatedef = templatedefresult.subtree;
        s = templatedefresult.remaining;
        return { subtree: result, remaining: s };
    } else if (first.name === "PSTART") {
        var tparamresult = parseTParam(s);
        result.tparam = tparamresult.subtree;
        s = tparamresult.remaining;
        return { subtree: result, remaining: s };
    } else {
        throw "Bad choice in parseITextOnce";
    }
}

function parseDTextOnce(s) {
    var result = {
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
        result.INNERDTEXT = first.value;
        s = s.substring(first.value.length);
        return { subtree: result, remaining: s };
    } else if (first.name === "TSTART") {
        var templateinvocationresult = parseTemplateInvocation(s);
        result.templateinvocation = templateinvocationresult.subtree;
        s = templateinvocationresult.remaining;
        return { subtree: result, remaining: s };
    } else if (first.name === "DSTART") {
        var templatedefresult = parseTemplateDef(s);
        result.templatedef = templatedefresult.subtree;
        s = templatedefresult.remaining;
        return { subtree: result, remaining: s };
    } else if (first.name === "PSTART") {
        var tparamresult = parseTParam(s);
        result.tparam = tparamresult.subtree;
        s = tparamresult.remaining;
        return { subtree: result, remaining: s };
    } else {
        throw "Bad choice in parseDTextOnce";
    }
}

function parseTemplateDef(s) {
    var start = scan(s, { DSTART: true });
    s = s.substring(start.value.length);
    var textresult = parseDText(s);
    var head = textresult.subtree;
    s = textresult.remaining;

    function pipedtextOnce(s) {
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

    function pipedtext(s) {
        var result = kleenestar(pipedtextOnce, s);
        if(result.subtree === null) {
            throw "TemplateDef without pipes + dtexts";
        }
        return result;
    }

    var tailresult = pipedtext(s);
    var tail = tailresult.subtree;
    s = tailresult.remaining;
    head.next = tail;

    var end = scan(s, { DEND: true });
    s = s.substring(end.value.length);

    return { subtree : { name: "templatedef", dtext: head }, remaining: s }
}

function parseTParam(s) {
    var start = scan(s, { PSTART: true });
    s = s.substring(start.value.length);
    var name = scan(s, { PNAME: true });
    s = s.substring(name.value.length);
    var end = scan(s, { PEND: true });
    s = s.substring(end.value.length);
    return { subtree: { name: "tparam", PNAME: name.value }, remaining: s };
}

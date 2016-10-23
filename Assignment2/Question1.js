/**
 * Created by courtneywright on 10/20/16.
 * Worked with Veronica Nasseem, ID 260654054
 */

// var TSTART = new RegExp();
var TSTART = /^{{(?!{)/;
var TEND = /^}}(?!})/;
var PIPE = /^\|/;
var OUTERTEXT = /^[^({{|{:)]*/;
var INNERTEXT = /^[^({{|{:|{{{|\||}})]*/;
var DSTART = /^{:/;
var DEND = /^:}/;
var INNERDTEXT = /^[^({{|{:|{{{|\||:})]*/;
var PSTART = /^{{{/;
var PEND = /^}}}/;
var PNAME = /^[^(\||:})]*/;

var tokens = {
    TSTART: TSTART,
    DSTART: DSTART,
    PSTART: PSTART,
    PEND: PEND,
    TEND: TEND,
    DEND: DEND,
    PIPE: PIPE,
    OUTERTEXT: OUTERTEXT,
    INNERTEXT: INNERTEXT,
    INNERDTEXT: INNERDTEXT,
    PNAME: PNAME
};

console.log("TSTART: " + TSTART.exec("{{abc"));

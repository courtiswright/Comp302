/**
 * Created by courtneywright on 10/20/16.
 * Worked with Veronica Nasseem, ID 260654054
 */

/**
 * all regex was based off of MDN regex standard for javascript found online
 */

/**
 * TSTART and TEND are the only two that have lookaheads
 * this is becasue I check to see if there is a third bracket
 * after the first two and only match if there is not, as to not
 * confuse TSTART and PSTART, and TEND and PEND.
 */
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

//object made of each token above to be assigned a value (true or false) that can be passed to scan
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

// console.log("TSTART: " + TSTART.exec("{{abc"));

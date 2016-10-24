/**
 * Created by courtneywright on 10/20/16.
 * Worked with Veronica Nasseem, ID 260654054
 */

/**
 * will check the given string to see if a token exists at the beginning of said string.
 * only checks for tokens passed with a value of "true". The parser is the one that decides
 * which tokens to assign "true" to based on the given definitions.
 */
function scan(s, tokenSet) {
    var tokenNames = Object.keys(tokenSet)
    for(var i=0; i<tokenNames.length;i++){
        var currentToken = tokenNames[i];
        var regexDef = tokens[currentToken];
        var match = regexDef.exec(s);
        if (match) {
            var regexFound = {name: tokenName, value: match[0]};
            return regexFound;
        }
    }
    return null;
}

// console.log("SCAN: " + scan("{{abc", {TSTART:true}));
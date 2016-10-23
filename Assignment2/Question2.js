/**
 * Created by courtneywright on 10/20/16.
 * Worked with Veronica Nasseem, ID 260654054
 */
//use scan function to check first and only pass necessary tokens

function scan(s, tokenSet) {
    var tokenNames = Object.keys(tokenSet)
    for(var i=0; i<tokenNames.length;i++){
        var tokenName = tokenNames[i];
        var regexToken = tokens[tokenName];
        var match = regexToken.exec(s);
        if (match) {
            return {name: tokenName, value: match[0]};
        }
    }
    return null;
}
/**
 * Created by courtneywright on 10/2/16.
 */


function makeXXX (tree, s) {
    var string;
    var key;

    //checks the child nodes of each node to see if they contain s
    function makeXXXHelper(node) {

        //marks node discovered
        key[node] == true;

        //return if string is matched
        if (node == s) {
            return string;

            //if no child nodes, delete last char added to c
            // and call function on parent node
        } else if (node.hasChildNodes() !== true) {
            string.slice(0, -1);
            makeXXXHelper(node.parent);

            //if the node has a left child node that hasn't been discovered
            //add d to the string keeping track of car/cdr
            //and call function on this node
        } else if (node.left != null && key[node.left] != false) {
            string = string + "d";
            makeXXXHelper(node.left());

            //same as previous else/if except with right node/car
        } else if (node.right != null && key[node.right] != false) {
            string = string + "a";
            makeXXXHelper(node.right());
        }
    }
}

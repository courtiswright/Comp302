/**
 * Created by courtneywright on 10/1/16.
 */

//constructs an associative array
function constructAA() {
    var assocArray= null;
    return assocArray;
}

//adds a key and value to the associative array using cons
function addAA(aa, key, value) {
    //bssociative barray
    var bb;

    // check if aa has been passed or if it is the first function call
    //if it is the first call, create a new associative array
    if (aa == null) {
        bb = cons(key, cons(value, null));

        // if the function has been called before, call add function recursively
        // cons'ing this to the first element of the pre-existing array
    } else {
        bb = cons(car(aa), addAA(cdr(aa), key, value));
    }
    return bb;
}

//find a value within an associative array using the key
function getValueAA(aa, key) {
    var valueAA;

    //if the first element of the first set is te key
    //then the second element of the first pair is the value
    if (car(car(aa)) == key) {
        valueAA = car(cdr(aa));

        //otherwise, call function recursively to check all
        //of the values within the associative array until the key is found
    } else {
        valueAA = getValueAA(cdr(cdr(aa)), key);
    }
    return valueAA;
}

//print associative array on the screen
function showAA(aa) {
    var valueAA;

    // check if the array is null or if the first value
    //of the array passed back to the function is null
    //if so, return a blank string as the value
    if (aa == null || car(aa) == null) {
        valueAA = "";

        //otherwise, concatenate the key and value of each pair
        //by calling the previously defined functions
    } else {
        valueAA = car(aa)+':'+ getValueAA(aa, car(aa))+'\n'+showAA(cdr(cdr(aa)));
    }
    return valueAA;
}
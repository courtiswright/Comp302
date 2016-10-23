/**
 * Created by courtneywright on 10/1/16.
 */

function partition(list, functions) {

    //sorts list elements for which the current function returns true
    function sortList (list, currentFunction, consStructure) {

        //return structure build of cons if list value is null
        if(list == null) {
            return consStructure;

            //if the function you're examining returns true for the right most list element,
            //call sorting function recursively, going through the list until done
            //then insert null to finish cons structure that has been built
        } else if (currentFunction(list[list.length-1]) == true)  {
            return sortList(list.slice(0,-1), currentFunction, cons(list[list.length-1], list.length < 1 ? null : consStructure));
        } else if (currentFunction(list[list.length-1]) == false) {
            return sortList(list.slice(0,-1), currentFunction, list.length < 1 ? null : consStructure);
        }
    }

    //put together sub lists with corresponding functions
    function makeLists (list, functionList, trueElements) {

        //return the true elements of the list if there are no functions
        if(functionList == null) {
            return trueElements;

            //otherwise, create a list that corresponds to the function being examine
            //by recursively calling the makeList function and constructing a cons structure
            //using the sortList function
        } else {
            return makeLists(list, functionList.slice(0,-1), cons(sortList(list, functionList[functionList.length-1]), trueElements));
        }
    }
    return makeLists(list, functions, null);
}
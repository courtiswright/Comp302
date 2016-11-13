// function f()
// {
// 	var x = "hello";
// 	return function()
// 	{
// 		return x;
// 	}
// }

// // (f())(); returns hello

// // var g = f();
// // g(); also returns hello








// function multByConst(c)
// {
// 	return function(n)
// 	{
// 		return n * c;
// 	}
// }

// var mult10 = multByConst(10);
// mult10(3); //returns 30

// var mult7 = multByConst(7);
// mult7(8); //returns 56

// mult7(mult10(8)); //returns 560






// function makeNameStore()
// {
// 	var name = "";
// 	return
// 	{
// 		getName: function() { return name; },
// 		setName: function(n) { name = n; }
// 	};
// }

// var n1 = makeNameStore();
// n1.setName("clark");
// n1.getName();









// var a = "";
// function addToA(s)
// {
// 	a += s;
// 	return a;
// }
// a = "abc";
// addToA("d"); //returns abcd


// var addToA = (function() { var a = ""; return function(s) { a += s; return a;}; })(); //var a is private, not accessible to an outer context











var words = [ "hello", "hi", "yo", "hey there"];
function helloMaker()
{
	var helloF = [];
	for (var i = 0; i < 3; i++)
	{
		helloF[i] = function() { return words[i];};
	}
	return helloF;
}



// This is a simple javascript tutorial
// that will teach you the basics of JS.

// I would recommend that you have a look
// at this tutorial, only if you are interested
// in adding more features your site.

// There are other tutorials, but this is a very
// simple one that you can read at your own pace.
// If you know javascript, you can skip all of this.

/* Variables and Constants */
// Variables are used to store information.
// They are the largest part of all programming languages.
var myName = 'John';

// Constants are used to store information that cannot be changed.
const interest = 'programming';

// If we try to do 'interest = `music`', we will get an error, because interest cannot be changed.


/* Data Types */
// There are different data types that can be used to store information.
// The main ones are:
// - Integer/Float (number)
// - String (text)
// - Boolean (yes/no)
// - Array (list)

// When we create a variable, its type is dynamic to the data that is stored in it.
// Therefor, when we create this variable below, it will be an integer:
var myNumber = 3;

// We can log information to the console using the console.log() function.
// Lets print out our name and interest:
console.log("Hi there. My name is " + myName + " and I am interested in " + interest + ".");

// We can also use the console.error() function to print out an error message.

// Another useful function is 'for', which is used to loop through a list of items.
// Lets print out the numbers 1 to 10:
for (var i = 1; i <= 10; i++) {
    console.log(i);
}

// If we break it down, it will look like this:
/*
(
    var i = 1; -> i is the variable, and 1 is the starting value.
    i <= 10; -> If i is less than or equal to 10, then continue.
                We can also use '<' to only check if i is less than 10.
    i++; -> Increment i by 1 (i = i + 1).
) {
    console.log(i); -> Print out i.
}
*/

// We can also use 'while', to loop while a condition is true.
// Using while, we can do the same as the for loop above as shown below:
var i = 1;
while (i <= 10) {
    console.log(i);
    i++;
}

// I recommend using the for loop for most cases, smaller and faster (although a while loop is faster for large lists).

// We can also use the 'if' statement to check if a condition is true.
// If the condition is true, then execute the code inside the brackets.
// If the condition is false, then do nothing unless we use the 'else' statement.
// Lets check if our name is 'John': (if it is, then print out 'Hello John!')
if (myName === 'John') {
    console.log('Hello John!');
} else {
    console.log('You are not John!');
}
// Since myName is already defined, this will always be true.

// We can also use the 'else if' statement to check if a condition is true if the previous condition is false.
/*
if (myName === 'John') {
    console.log('Hello John!');
} else if (myName === 'Jane') {
    console.log('Hello Jane!');
}
*/

// There are also 'switch' and 'ternary operator' functions that do the same thing, but we will learn about them later.


/* Functions */
// Functions are used to do something when we call them.
// We can define a function using the 'function' keyword.
// We can also use the 'return' keyword to return a value.

// Lets define a function called 'hello' that prints out 'Hello World!':
function hello() {
    console.log('Hello World!');
}

// We can call the function using the '()' brackets.
hello();

// We can also define a function that takes in arguments.
// Lets define a function called 'helloName' that takes in a name as an argument.
function helloName(name) {
    console.log('Hello, ' + name + '!');
}

// Now, we can call the function using the '()' brackets and passing in our name.
helloName('John'); // Prints "Hello, John!"

// Lets define a function that adds two numbers.
function add(num1, num2) {
    return num1 + num2;
}

// Now, lets add 3 and 4.
var sum = add(3, 4);
console.log(sum); // Prints 7


/* Arrays */
// Arrays are used to store multiple values in a single variable.
// We can use the '[]' brackets to define an array.

// Lets define an array called 'myArray' that stores the values 1, 2, 3, 4, 5.
var myArray = [1, 2, 3, 4, 5];
// Note: We can store different data types in an array, not just numbers.

// We can access the values in the array using the '[]' brackets once again.
// Lets print out the value at index 2.
console.log(myArray[2]); // Prints 3

// You would probably think that that would print out 4,
// but arrays start at 0, not 1.
// Therefore, the value at index 0 is 1, and the value at index 4 is 5.
// Talk about confusing!

// There are many functions that can be used with arrays, like 'length' and 'push'.
// Length does as you might expect, and push adds a value to the end of the array.
// Lets add a value to the end of our array.
myArray.push(6); // Adds 6 to the end of the array.
console.log(myArray); // Prints [1, 2, 3, 4, 5, 6]


/* JSON Objects */
// JSON objects are one of the most useful features of JavaScript.
// They are used to store data in a structured way.
// JSON can also be stored in a file, which we can read and write from the server (backend).

// Lets define a JSON object called 'myObject' that stores the values 'name' and 'age'.
var myObject = {
    name: 'John',
    age: 30
};

// We can access the values in the object using the '.' (dot) operator.
// Lets print out the value of 'name'.
console.log(myObject.name); // Prints 'John'

// We can also use the '[]' brackets to access the values in the object, via a string.
// I would only recommend this if you are accessing a value by a variable's value.
console.log(myObject['name']);

// We can also parse a JSON object into a string, using the 'JSON.stringify()' function.
// Lets parse our object into a string, then print it out.
var myJSONString = JSON.stringify(myObject);
console.log(myJSONString); // Prints '{"name":"John","age":30}'

// We can also add tabs indentation to the JSON string:
myJSONString = JSON.stringify(myObject, null, 4 /* Amount of spaces to indent by */);
console.log(myJSONString); // Prints it out nicely, with tab indentation.

// Then, we can turn it back:
var myNewObject = JSON.parse(myJSONString);


/* Promises and Async/Await */
// Promises are used to handle asynchronous operations.
// They are used to make sure that the code is executed in the correct order.
// We can use the 'Promise' keyword to define a promise.

// Async is a function option that tells the JavaScript engine to execute the code asynchronously.
// Await is a keyword that tells the JavaScript engine to wait for the promise to be resolved.

// Lets make an asynchronous function called 'getData' that returns a promise.
async function getData() {
    console.log(await new Promise(function (resolve, reject) {
        console.log('Getting data...');
        setTimeout(function () {
            resolve('Example Data');
        }, 1000);
    }));
    // This is pretty complicated, but basically it is saying:
    // 1. Print 'Getting data...'
    // 2. Wait 1 second
    // 3. Print 'Example Data'

    // It wraps all of this in a promise, so we can use the 'await'.
    // If there is no await, then the code will keep running while the setTimeout is running.
};

// Now, lets call the function.
getData();

// setTimeout is a function that is used to delay the execution of code.
// We can use it to wait for the promise to be resolved, or to wait for an event to happen.

// Lets wait 1000 milliseconds (1 second) before we print 'Hello World!'.
setTimeout(function () {
    console.log('Hello World!');
}, 1000);

// Keep in mind that because this is an asynchronous function, the code will keep running
// while the setTimeout is running. (It will not wait for the setTimeout to finish)

// Function arguments in javascript are pretty daunting at first,
// but make much more sense when you break it down.
// Format:
/*
setTimeout(
    // Function to run
    function () {
        // Code to run
    },
    // Time to wait before running the function
    1000
);

We could also do:
setTimeout(() => { console.log('hello') }, 1000);
If we wanted to be compact, or even call a function:
setTimeout(myFunction, 1000);
*/


/* Frontend Handling */
// Frontend handling allows us to handle and modify the website.
// It is a giant topic, and we will cover it in more detail later.

// Lets make an event listener that prints 'Hello World!' when a button is clicked.
// Firstly we need to create the button:
var button = document.createElement('button');
button.innerHTML = 'Click Me';

// Now, lets set its ID to 'myButton'.
button.id = 'myButton';

// Then, create the listener:
button.addEventListener('click', function () {
    alert('Hello World!'); // Alert is a function that creates a popup window at the top of the screen.
});

// Now, lets add the button to the page.
document.body.appendChild(button);

// The body is the main part of the website.
// The document is the site itself.


/* HTML structure */
// HTML is structured with parent-child relationships.
// The parent is the element that contains the child.
// The child is the element that is contained within the parent.
// The top-level parent of all elements is the document.


/* Numbers */
// Numbers have different types:
// Firstly, an integer is a whole number, without a decimal point.
// A float is a number with a decimal point.
// A double is a float with more precision.
// A long is a large double.
// A byte is a small integer.
// A short is a small integer.

// Once again, these are automatically defined by the language.
// Do not worry about them, unless you need a specific type.


// That's basically all you need to know about JavaScript for now.
// You will most likely learn more as you go on.
// Keep in mind that this is a very basic introduction to JavaScript,
// and only supplies a small amount of functionality.
// Good luck!
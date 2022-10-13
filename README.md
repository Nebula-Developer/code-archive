# Iolite documentation

## This is a small file containing each of the features included in iolite.

<br/><br/>

## Include
To include a file in iolite, use the 'import' keyword:

```c
import "path/to/file";
```

To import a C header, use the 'cimport' keyword, or 'climport' for a local c file:

```c
cimport "stdio.h";
climport "my_header.h";
```

<br/><br/>

## Functions
To define a function, use the 'func' keyword:

```c
func my_function(int arg1, string arg2) -> int {
    // do stuff
}
```

Broken down, it looks like this:

```c
func <name>(<args>) -> <return type> {
    <content>
}
```

You can also define a function without a return type, which will fallback to void:

```c
func my_function(int arg1, string arg2) {
    // do stuff
}
```

Another feature of functions which branches off of C is the ability to declare a function for later use, or presence in a header:

```c
func my_function(int arg1, string arg2) -> int;
```

<br/><br/>

## String comparison
To compare strings, use the 's==' and 's!=' operators:

```c
if (my_string s== "hello") {
    printf("Wow!\n");
}
```

<br/><br/>

## Classed functions
To define a function which is a member of a mocked-class, simply append the class name and a '.' separator to the function name:

```c
func my_class.my_function() -> void {
    // do stuff
}

// Call:
my_class.my_function();
```

<br/><br/>

# 

## That's all for now, but more features are being added all the time.
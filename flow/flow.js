/* @flow */

function add(num1, num2) {
    return num1 + num2
}
add(2, '0')     // 20

// flow flow check

// found 0 errors

/* @flow */
function add(num1: number ,num2: number) {
    return num1 + num2
}
add(2, '0') 

// flow flow check

// function call errors
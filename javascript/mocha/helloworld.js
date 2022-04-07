
console.log("hello js world!");

function pow(x, n) {
    let p = 1
    for (let i = 0; i < n; i++) {
        p = x * p ;
    }
    return p;
}

console.log(pow(10, 5))
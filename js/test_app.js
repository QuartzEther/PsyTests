function getCounter() {
    let counter = 0;
    let counter1 = 0;
    return function() {
        return counter++;
    }
}
let count = getCounter();

console.log(count());
console.log(count());
console.log(count());
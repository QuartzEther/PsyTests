function getCounter() {
    let arr = [1,4,5,3,6,7,8,4,4,443];
    let counter = 0;

    function sum(){
        return arr[counter]*counter++;
    }
    return sum;
}

let count = getCounter();

console.log(count());
console.log(count());
console.log(count());
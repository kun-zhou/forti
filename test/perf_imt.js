var { Map } = require('immutable')
var map1 = Map()
var map2 = Map()
var start


for (var i = 0; i < 100000; i++) {
    map1 = map1.set(i,i**2)
}
for (var j = 0; j < 1000000; j++) {
    map2 = map2.set(j,j**2)
}

console.log('start 1')
start = Number(new Date())/1000
var a1 = map1.keySeq()
console.log('10000: ' + String(Number(new Date())/1000- start))

console.log('start 2')
start =  Number(new Date())/1000
var a2 = map2.keySeq()
console.log('100000: ' + String(Number(new Date())/1000- start))


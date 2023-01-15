const Interfaces = require('./Interfaces')
const CanSmeller = require('./CanSmeller')

const test = new CanSmeller("can0")

test.buttonFind()

setTimeout(() => {
    console.log("checking button")
    test.beginChecking()
    setTimeout(() => {
        test.finishButton()
    }, 1000)
}, 25000)

setInterval(() => {
    test.syncCounts()
    console.log(test.stats)

}, 1000)


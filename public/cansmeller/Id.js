const {EventEmitter} = require('events')
class Id extends EventEmitter{
    constructor(name, checking=false) {
        super()
        this.name = name
        this.bytes = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
            7: []
        }
        this.potentialCandidates = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
            7: []
        }
        this.checking = checking;
    }

    feedData(data) {
        if(!this.checking) {
            for(let i=0; i<data.length;i++) {
                if(!(this.bytes[i].includes(data[i]))) {
                    this.bytes[i].push(data[i])
                    this.emit("new-value")
                }
            }
        } else {
            this.checkChange(data)
        }
    }

    checkChange(data) {
        for(let i=0; i<data.length;i++) {
            //console.log("checking if", data[i], " is in: ", this.bytes[i])
            if(!(this.bytes[i].includes(data[i]))) {
                console.log("candidate found")
                this.potentialCandidates[i].push(data[i])
                this.emit("new-candidate", {id: this.name, byte: i, value:data[i]})
            }
        }
    }

    set enableChecking(value) {
        this.checking = value;
    }
}

module.exports = Id
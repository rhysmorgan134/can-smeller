const {EventEmitter} = require('events')
const Id = require('./Id')
let can = require('socketcan')

class CanSmeller extends EventEmitter{
    constructor(canInterface) {
        super();
        this.channel = can.createRawChannel(canInterface);

        this.ids = {}
        this.foundIds = []
        this._stats = {
            taughtCountBytes: 0,
            prevTaughtBytes: 0,
            taughtBytesInterval: 0,
            taughtCountIds: 0,
            prevTaughtIds: 0,
            taughtIdsInterval: 0,
            candidateCount: 0,
        }
        this.potentialIds = []
        this.startedAt = null
        this.results = []
        this.firstRun=true;
        this.running = false;
        this.channel.start();
        this.filters = [];
        this.snifferRunning = false;

    }

    buttonFind() {

        this.potentialIds = []
        this.startedAt = new Date()
        this.running = true
        if(Object.keys(this.ids).length > 0) {
            Object.keys(this.ids).forEach(id => this.ids[id].enableChecking = false)
        }
        console.log("bringing up channel")
        if(this.firstRun) {
            this.channel.addListener('onMessage', (msg) => {
                if(this.running) {
                    if(!(this.foundIds.includes(msg.id))) {
                        this.foundIds.push(msg.id)
                        this._addTaughtId()
                        this.ids[msg.id] = new Id(msg.id)
                        this._attachListeners(msg.id)
                        this.ids[msg.id].feedData(msg.data)
                    } else {
                        this.ids[msg.id].feedData(msg.data)
                    }
                } else if (this.snifferRunning) {
                    if(this.filters.includes(msg.id)) {
                        this.emit('snifferUpdate', msg)
                    }
                }
        })}

        this.emit('learning', true)
    }

    _attachListeners(id) {

        this.ids[id].on('new-value', () => {
            this._addTaughtByte()
        })

        this.ids[id].on('new-candidate', (data) => {
            console.log("candidate found", data)
            this.potentialIds.push({...data, timeDelta: new Date() - this.startedAt})
        })
    }

    _addTaughtByte() {
        this._stats.taughtCountBytes += 1
    }

    _addTaughtId() {
        this._stats.taughtCountIds += 1
    }

    syncCounts() {
        this._stats.taughtBytesInterval = this._stats.taughtCountBytes - this._stats.prevTaughtBytes
        this._stats.taughtIdsInterval = this._stats.taughtCountIds - this._stats.prevTaughtIds
        this._stats.prevTaughtIds = this._stats.taughtCountIds
        this._stats.prevTaughtBytes = this._stats.taughtCountBytes
    }

    beginChecking() {
        Object.keys(this.ids).forEach(id => this.ids[id].enableChecking = true)
        this.emit('checkingActive')
    }

    finishButton() {
        this.emit("learning", false)
        if(this.results.length > 0) {
            this.compareResults(this.potentialIds.filter((v,i,a)=>a.findIndex(v2=>['id','byte', 'value'].every(k=>v2[k] ===v[k]))===i))
        } else {
            this.results =(this.potentialIds.filter((v,i,a)=>a.findIndex(v2=>['id','byte', 'value'].every(k=>v2[k] ===v[k]))===i))
        }
        console.log("potential IDs were: ", this.results)
        this.emit("complete", this.results)
        this.running = false
    }

    compareResults(data) {
        let tempResults = []
        console.log(data, this.results)
        this.results.forEach((e) => {
            data.forEach((f) => {
                if(e.id === f.id && e.byte === f.byte && e.value === f.value) {
                    tempResults.push(e)
                    console.log("match found")
                }

            })
        })
        console.log("first pass: ", this.results.length, "second pass: ", tempResults.length)
        this.results = tempResults
    }

    beginSniffer(filters) {
        this.filters = filters
        this.snifferRunning = true;
    }

    endSniffer() {
        this.filters = []
        this.snifferRunning = false
    }

    get stats() {
        return this._stats
    }


}

module.exports = CanSmeller
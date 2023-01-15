const si = require('systeminformation');
class Interfaces {
    constructor() {
        this._interfaces = null;
        this._getInterfaces()
    }

    _getInterfaces() {
        // console.log(si.canInterfaces(() => {return null}))
        this.interfaces = ['vcan0']
    }

    get interfaces() {
        return this._interfaces
    }
}

module.exports = Interfaces
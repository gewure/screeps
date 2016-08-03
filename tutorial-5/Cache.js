export default class Cache {
    constructor() {
        this._cacheMap = {};
        this.randomId = parseInt(Math.random() * (10000 + (Math.random() * 50)));
    }

    get(key) {
        return this._cacheMap[key + '_' + this.randomId];
    }

    set(key, value) {
        this._cacheMap[key + '_' + this.randomId] = value;

        return this.get(key);
    }

    forget(key) {
        delete this._cacheMap[key + '_' + this.randomId];
    }

    remember(key, callback, ...args) {
        let value = this.get(key);

        if (value === undefined) {
            return this.set(key, callback.apply(null, args));
        }

        return value;
    }

    memoryGet(key) {
        return Memory[key];
    }

    memorySet(key, value) {
        Memory[key] = value;

        return this.get(key);
    }

    memoryForget(key) {
        delete Memory[key];
    }

    memoryRemember(key, callback, ...args) {
        let value = this.get(key);

        if (value === undefined) {
            return this.set(key, callback.apply(null, args));
        }

        return value;
    }
}

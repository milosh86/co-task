function task(gen) {
    if (typeof gen !== 'function' || typeof gen().next !== 'function') {
        return Promise.reject(new TypeError('Invalid argument, expecting generator function.'));
    }

    var g = gen(),
        ret,
        lastValue,
        lastError;

    function setValue(val) {
        lastValue = val;
        lastError = null;
    }

    function setError(err) {
        lastValue = null;
        lastError = err;
    }

    function next() {
        return lastError ?
            g.throw(lastError) :
            g.next(lastValue);
    }

    return new Promise(function (resolve, reject) {
        (function run() {
            try {
                ret = next();
            } catch (e) {
                return reject(e);
            }

            if (ret.done) {
                return resolve(ret.value)
            }

            if (typeof ret.value.then !== 'function') {
                setValue(ret.value)
                return run();
            }

            ret.value.then(function succes(value) {
                setValue(value)
                return run();
            }, function error(err) {
                setError(err);
                return run();
            });
        })();
    });
}
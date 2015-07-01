/*global $, QUnit */

QUnit.module('Cooperative Tasks');
QUnit.test("Simple addition of results from 2 Promise based async operations", function (assert) {
    "use strict";
    var done = assert.async();

    task(function* () {
        var x, y;

        x = yield pAsyncFn(1);
        y = yield pAsyncFn(2);

        return x + y;
    }).then(function (result) {
        assert.equal(result, 3, 'Got correct result...3');
        done();
    });
});

QUnit.test("Handling operations which might reject with try-catch", function (assert) {
    "use strict";
    var done = assert.async();

    task(function* () {
        var x, y;

        x = yield pAsyncFn(1);
        
        try {
            y = yield pAsyncFn(10); // argument 10 rejects with 'operation failed' error
        } catch (e) {
            assert.equal(e, 'operation failed', 'error catched!');
            y = 20;
        }
        

        return x + y;
    }).then(function (result) {
        assert.equal(result, 21, 'Got 21');
        done();
    });
});

QUnit.test("Unhandled errors (async rejects) are catched in task's error handler", function (assert) {
    "use strict";
    var done = assert.async();

    task(function* () {
        var x, y;

        x = yield pAsyncFn(1);

        y = yield pAsyncFn(10); // argument 10 rejects with 'operation failed' error
          

        return x + y;
    }).then(function (result) {
        assert.ok(false, 'should not be called!');
    }).catch(function (err) {
        assert.equal(err, 'operation failed', 'Catched unhandled error');
        done();
    });
});

QUnit.test("throws in sync operations are handled the same way as in rejects in async ops", function (assert) {
    "use strict";
    var done = assert.async();

    task(function* () {
        var x, y;

        x = yield pAsyncFn(1);

        y = yield pAsyncFn(2);
        
        throw 'operation failed';

        return x + y;
    }).then(function (result) {
        assert.ok(false, 'should not be called!');
    }).catch(function (err) {
        assert.equal(err, 'operation failed', 'Catched unhandled error');
        done();
    });
});

QUnit.test("can compose multiple tasks within each other", function (assert) {
    "use strict";
    var done = assert.async();
    
    function* getX() {
        return yield pAsyncFn(1);
    };
    
    function* getY() {
        return yield pAsyncFn(2);
    };

    task(function* () {
        var x, y;

        x = yield task(getX);

        y = yield task(getY);

        return x + y;
    }).then(function (result) {
        assert.equal(result, 3, 'Got correct result...3');
        done();
    });
});

QUnit.test("can use generator delegation instead of nesting tasks", function (assert) {
    "use strict";
    var done = assert.async();
    
    function* getX() {
        var a = yield pAsyncFn(1);
        var b = yield pAsyncFn(2);
        return a + b;
    };
    
    function* getY() {
        return yield pAsyncFn(3);
    };

    task(function* () {
        var x, y;

        x = yield* getX();

        y = yield* getY();

        return x + y;
    }).then(function (result) {
        assert.equal(result, 6, 'Got correct result...6');
        done();
    });
});
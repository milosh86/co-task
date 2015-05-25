# co-task
Simple implementation of cooperative tasks.

Generators, one of the most important additions to EcmaScript standard in ES6, have couple of interesting use cases. One of them is simplified iterator implementation (generators are both iterators and iterables) and the second one is simplification of async code. Generators introduced cooperative concurrency model in JS. When this is combined with Promises, we get extremely powerful way of handling async operations in JS. Here, I tried to implement this concept by myself for practicing purposes. 

# Examples
See tests for more examples.

```
task(function* () {
    var x, y;

    x = yield pAsyncFn(1);
    y = yield pAsyncFn(2);

    return x + y;
}).then(function (result) {
    // Got 3 as a result...
 
});

// callback based alternative
pAsyncFn(1, function (err, result1) {
    pAsyncFn(2, function (err, result2) {
        handleResult(result1 + result2);
    });
});

// promise based alternative
var x, y;
pAsyncFn(1)
    .then(function (result1) {
        x = result1;
        return pAsyncFn(2)
    })
    .then(function (result2) {
        y = result2;
        return x + y;
    })
    .then(function (result) {
        handleResult(result);
    });
```

```    
// we can now catch errors like in synchronous code
task(function* () {
  var x, y, z;
  
  x = yield asyncOp1(); // Promise based async operation
  doSomethingWithX(x);
  
  try {
    y = yield asyncOPMayReject(); // Promise based async operation
  } catch (e) {
    y = fallback();
  }
  doSomethingWithX(x);
  z = yield asyncOp2(); // Promise based async operation
  
  ifThrowItWIllbeCatchedInErrorHandler();
  
  return y + z;
})
.then(function successHandler (result) {
    // task completed successfuly, got result 
})
.catch(function errorHandler(error) {
    // task failed, handle error...
});
```

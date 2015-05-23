# co-task
Simple implementation of cooperative tasks, an interesting way of handling async operations in JS. Developed for learning purposes only.

# Examples
task(function* () {
  var x = asyncOp1();
  
  var y = asyncOp2();
  
  return x + y;
}).then(function (result) {
  console.log("Result: ", result);
});

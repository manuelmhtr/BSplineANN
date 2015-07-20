// X-OR Example

// Require the library
var BSplineANN = require("./../lib/bsplineann");

// Create the vectors that will
var splines = [
  [
    [-0.3,-0.1,0.1,0.3],
    [-0.3,-0.1,0.1,0.3]
  ],
  [
    [-0.1,0.3,0.7,1.1],
    [-0.1,0.3,0.7,1.1]
  ],
  [
    [0.7,0.9,1.1,1.3],
    [0.7,0.9,1.1,1.3]
  ]
];

// Build the network:
// 2 inputs
// The spline vectors
// 1 output
var network = new BSplineANN(2, splines, 1);
var results, error;

// Train the network for X-OR
for (var i = 0; i < 100; i++) {
  results = network.activate([0,0]);
  error = (0 - results[0]); // Should be 0
  network.propagate([error]);

  results = network.activate([1,0]);
  error = (1 - results[0]); // Should be 1
  network.propagate([error]);

  results = network.activate([0,1]);
  error = (1 - results[0]); // Should be 1
  network.propagate([error]);

  results = network.activate([1,1]);
  error = (0 - results[0]); // Should be 0
  network.propagate([error]);
}

// Print the results
console.log(network.activate([0,0]) + " should be near to 0");
console.log(network.activate([1,0]) + " should be near to 1");
console.log(network.activate([0,1]) + " should be near to 1");
console.log(network.activate([1,1]) + " should be near to 0");

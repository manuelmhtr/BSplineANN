# BSplineANN

BSplineANN is a Javascript library to create B-Spline Artificial Neural Networks.

### Installation

```
npm install --save bsplineann
```

### Example (X-OR)

```
// Require the library
var BSplineANN = require('bsplineann');

// Create the vectors that will define the splines
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
```

### Licence

The MIT License (MIT)

Copyright (c) 2015 Manuel de la Torre

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

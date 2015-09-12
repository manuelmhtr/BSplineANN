var Neuron = require("./Neuron.js");
var Layer = require("./layer");
var _ = require("lodash");
var BSplineANN;

/**
 * Creates a BSpline Artificial Neural Network.
 * @param inputsNumber
 * @param splineVectors
 * @param outputsNumber
 * @param learnRate
 * @constructor
 */
BSplineANN = function (inputsNumber, splineVectors, outputsNumber, learnRate) {

  this.layers = [];

  this.learnRate = learnRate || 0.1;

  /**
   * Returns an array of neurons that forms the input layer.
   * @returns {Layer}
   */
  function getInputLayer() {
    var layer = new Layer();

    for (var i = 0; i < inputsNumber; i++) {
      var neuron = new Neuron();
      layer.pushNeuron(neuron);
    }

    return layer;
  }

  /**
   * Returns an array of neurons that forms the hidden layer (that one that contains the splines).
   * @returns {Layer}
   */
  function getSplinesLayer() {
    var layer = new Layer();

    for (var i = 0; i < splineVectors.length; i++) {
      if (!_.isArray(splineVectors[i]) || splineVectors[i].length !== inputsNumber) {
        throw new Error("splineVectors must be an array of arrays with length equal inputsNumber");
      }
      var neuron = new Neuron();
      neuron.activate = getBaseFunctionMulti(splineVectors[i]);
      layer.pushNeuron(neuron);
    }

    return layer;
  }

  /**
   * Returns an array of neurons that forms the output layer.
   * @returns {Layer}
   */
  function getOutputLayer() {
    var layer = new Layer();

    for (var i = 0; i < outputsNumber; i++) {
      var neuron = new Neuron();
      neuron.propagate = function(error, learningRate, previousInputs) {
        var denominator = 0;
        var backErrors = [];

        previousInputs.forEach(function(previous) {
          denominator += (previous * previous);
        });
        denominator = denominator || learningRate;

        var factor = learningRate * error / denominator;

        this.weights = this.weights.map(function(weight, index) {
          backErrors.push((error - weight * previousInputs[index]) / weight);
          return weight + factor * previousInputs[index];
        });

        return backErrors;
      };
      layer.pushNeuron(neuron);
    }

    return layer;
  }

  // Build network
  var inputLayer = getInputLayer();
  var splinesLayer = getSplinesLayer();
  var outputLayer = getOutputLayer();

  inputLayer.project(splinesLayer);
  splinesLayer.project(outputLayer);

  this.layers.push(inputLayer);
  this.layers.push(splinesLayer);
  this.layers.push(outputLayer);
};

/**
 * Activates the neural network.
 * @param inputs
 * @returns {*}
 */
BSplineANN.prototype.activate = function(inputs) {
  var previousOutputs = inputs;

  this.layers.forEach(function(layer, index) {
    layer.activate(previousOutputs, index === 0);
    previousOutputs = layer.outputs;
  });

  return previousOutputs;
};

/**
 * Propagates backwards the error of the network.
 * @param errors
 */
BSplineANN.prototype.propagate = function(errors) {
  this.layers[this.layers.length-1].propagate(errors, this.learnRate);
};

module.exports = BSplineANN;

// Support function

/**
 * Returns a multi variable spline.
 * @param lambdasArray
 * @returns {Function}
 */
function getBaseFunctionMulti(lambdasArray) {
  var baseFunctionsMono = [];
  lambdasArray.forEach(function(lambdas) {
    baseFunctionsMono.push(getBaseFunctionMono(lambdas));
  });
  return function(x) {
    var result = 1;
    baseFunctionsMono.forEach(function(fBase, index) {
      result = result * fBase(x[index]);
    });
    return result;
  }
}

function getBaseFunctionMono(lambdas) {
  var fBase = function(x,k,j) {
    j = (j === undefined) ? lambdas.length - 1 : j;
    k = (k === undefined) ? j : k;

    if (k === 1) {
      return (x >= lambdas[j-1] && x < lambdas[j]) ? 1 : 0;
    }

    var step1 = ((x - lambdas[j-k]) / (lambdas[j-1] - lambdas[j-k])) * fBase(x, k-1, j-1);
    var step2 = ((lambdas[j] - x) / (lambdas[j] - lambdas[j-k+1])) * fBase(x, k-1, j);
    return step1 + step2;
  };

  return fBase;
}

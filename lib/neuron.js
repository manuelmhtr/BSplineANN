var Neuron;
var defaultWeightValue = 1;

Neuron = function() {
  this.projectedNeurons = [];

  this.weights = [];
};

Neuron.prototype.pushInput = function(input) {
  this.inputs.push(input);
};

Neuron.prototype.activate = function(inputs) {
  var neuron = this;
  var result = 0;

  if (inputs === undefined) {
    inputs = neuron.inputs;
  }

  inputs.forEach(function(input, index) {
    if (neuron.weights[index] === undefined) {
      neuron.weights[index] = defaultWeightValue;
    }

    result += neuron.activationFunction(neuron.weights[index] * input);
  });

  return result;
};

Neuron.prototype.activationFunction = function(input) {
  return input;
};

Neuron.prototype.propagate = function(error, learningRate, previousInputs) {
  var backErrors = [];

  this.weights.forEach(function(weight, index) {
    backErrors.push((error - weight * previousInputs[index]) / weight);
  });

  return backErrors;
};

Neuron.prototype.project = function(neuron) {
  this.projectedNeurons.push(neuron);
};

module.exports = Neuron;

var Layer;

Layer = function() {
  this.neurons = [];

  this.outputs = [];

  this.inputs = [];
};

Layer.prototype.pushNeuron = function(neuron) {
  this.neurons.push(neuron);
};

Layer.prototype.activate = function(inputs, isInputLayer) {
  var layer = this;

  layer.inputs = inputs;
  layer.outputs = [];

  layer.neurons.forEach(function(neuron, index) {
    if (isInputLayer) {
      layer.outputs.push(neuron.activate([inputs[index]]));
    } else {
      layer.outputs.push(neuron.activate(inputs));
    }
  });

};

Layer.prototype.project = function(nextLayer) {
  var layer = this;

  layer.neurons.forEach(function(neuron) {
    nextLayer.neurons.forEach(function(nextNeuron) {
      neuron.project(nextNeuron);
    });
  });

};

Layer.prototype.propagate = function(errors, learningRate) {
  var layer = this;

  layer.neurons.forEach(function(neuron, index) {
    neuron.propagate(errors[index], learningRate, layer.inputs);
  });

};

module.exports = Layer;
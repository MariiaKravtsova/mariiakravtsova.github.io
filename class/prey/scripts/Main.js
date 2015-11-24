

// Setting up easy access to localStorage
Storage.prototype.setObj = function(key, obj) {
	return this.setItem(key, JSON.stringify(obj));
}

Storage.prototype.getObj = function(key) {
	return JSON.parse(this.getItem(key))
}

// local storage function
function saveValues(prey, predator, sim) {
	console.log(prey, predator, sim);
	localStorage.setObj('savedSimulationValues', {prey, predator, sim})
}
// Max values for all the different rates
var _preyGMax = 3.5;
var _preyDMax = .1;
var _predatorGMax = .01;
var _predatorDMax = 1;

var _prevSimulation;
var graph;

// init function
$(document).ready(function() {
	$( function()
	{
		// Display a message for our friends.
		console.log('test');

		// Initialize the jQuery UI sliders
		initSliders();


	});

// Load Values
	$('#load-values').on('click', function() {
		var storedValues = localStorage.getObj('savedSimulationValues');
		var preyValues = storedValues.prey;
		var predValues = storedValues.predator;
		var simValues = storedValues.sim;
		console.log(preyValues, predValues, simValues);

		$('#prey-growth-rate').val(preyValues.growthRate);
		$('#prey-death-rate').val(preyValues.deathRate);
		$('#prey-initial-population').val(preyValues.initialPopulation);

		$('#predator-growth-rate').val(predValues.growthRate),
		$('#predator-death-rate').val(predValues.deathRate),
		$('#predator-initial-population').val(predValues.initialPopulation)

		$('#generations').val(simValues.generations);
		$('#time-step').val(simValues.timeStep);

	})

// Save Values
	$('#save-values').on("click", function() {
		var preyValues = {
			'growthRate': $('#prey-growth-rate').val(),
			'deathRate': $('#prey-death-rate').val(),
			'initialPopulation': $('#prey-initial-population').val()
		};
		var predatorValues = {
			'growthRate': $('#predator-growth-rate').val(),
			'deathRate': $('#predator-death-rate').val(),
			'initialPopulation': $('#predator-initial-population').val()
		};
		var simOptions = {
			'generations': $('#generations').val(),
			'timeStep': $('#time-step').val()
		};
		saveValues(preyValues, predatorValues, simOptions);
	});

// Initializing Values
	function initSliders()
	{
		// Prey sliders
		$( "#prey-growth-slider" ).slider({
			value:50,
			slide: function( event, ui ) {
				var pgr = (ui.value / 100) * _preyGMax;
				$("#prey-growth-rate").val(pgr.toFixed(3));
			}
		});
		var pgr = .5 * _preyGMax;
		$("#prey-growth-rate").val(pgr.toFixed(3));

		$( "#prey-death-slider" ).slider({
			value:50,
			slide: function( event, ui ) {
				var pdr = (ui.value / 100) * _preyDMax;
				$("#prey-death-rate").val(pdr.toFixed(3));
			}
		});
		var pdr = .5 * _preyDMax;
		$("#prey-death-rate").val(pdr.toFixed(3));


		// Predator sliders
		$( "#predator-growth-slider" ).slider({
			value:50,
			slide: function( event, ui ) {
				var pgr = (ui.value / 100) * _predatorGMax;
				$("#predator-growth-rate").val(pgr.toFixed(3));
			}
		});
		var pgr = .5 * _predatorGMax;
		$("#predator-growth-rate").val(pgr.toFixed(3));

		$( "#predator-death-slider" ).slider({
			value:50,
			slide: function( event, ui ) {
				var pdr = (ui.value / 100) * _predatorDMax;
				$("#predator-death-rate").val(pdr.toFixed(3));
			}
		});
		var pdr = .5 * _predatorDMax;
		$("#predator-death-rate").val(pdr.toFixed(3));
	}

	$('#simulate-button').on('click', function() {
		// Create a Graph object in the div with given id if not already created
		if (!graph)
		graph = new LineGraph("canvas-div");
		else
		graph.reset();

		// Create the preyModel with the values specified by user.
		var preyModel = new AnimalModel("Rabbits",
		parseFloat($("#prey-initial-population").val()),
		parseFloat($("#prey-growth-rate").val()),
		parseFloat($("#prey-death-rate").val())
	);

	// Create the predator model
	var predatorModel = new AnimalModel("Foxes",
	parseFloat($("#predator-initial-population").val()),
	parseFloat($("#predator-growth-rate").val()),
	parseFloat($("#predator-death-rate").val())
);

	// Create and run the simulation with the given parameters
	var simulation = new LotkaVolterra(preyModel, predatorModel);
	simulation.simulate(
		parseFloat($("#generations").val()),
		parseFloat($("#time-step").val())
	);

	// Set styles for the lines.
	simulation.getPreyDataSet().setColor("rgba(255,0,0,1)");
	simulation.getPreyDataSet().setLineWidth(3);
	simulation.getPredatorDataSet().setColor("rgba(0,0,255,1)");
	simulation.getPredatorDataSet().setLineWidth(3);

	// Add the Lotka-Volterra Graphables to a line graph.
	graph.addDataSet(simulation.getPreyDataSet());
	graph.addDataSet(simulation.getPredatorDataSet());

	if (shouldDrawPrevious()) {
		_prevSimulation.getPreyDataSet().setColor("rgba(255,0,0,.25)");
		_prevSimulation.getPreyDataSet().setLineWidth(3);
		_prevSimulation.getPredatorDataSet().setColor("rgba(0,0,255,.25)");
		_prevSimulation.getPredatorDataSet().setLineWidth(3);
		graph.addDataSet(_prevSimulation.getPreyDataSet());
		graph.addDataSet(_prevSimulation.getPredatorDataSet());
	}

	graph.draw();

	_prevSimulation = simulation;
	});


	function shouldDrawPrevious() {
		return $('#compare-to-checkbox').is(':checked');
	}


	$('#save-graph').on('click', function() {
		graph.saveImage();
	});
});

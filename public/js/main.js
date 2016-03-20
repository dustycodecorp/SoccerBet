var app = angular.module('quinielaApp', [ 'socket.io' ]);

app.config(function ($socketProvider) {
	$socketProvider.setConnectionUrl('');
});

app.controller('MatchesController', function Ctrl($scope, $socket) {

	//Declaring variables
	$scope.matches = [];

	//On events
	$socket.on('fetch matches', function (data) {
		$scope.matches = data; 
	});

	$socket.on('refresh matches', function (data) {
		console.log('on addmatches function');
		if ($scope.matches.$.indexOf(data) == -1) {
			$scope.matches.push(data); 
		}
	});

	//Emit events

	$scope.emitMatch = function emitMatch(data) {
		console.log('echo event emited');
		$socket.emit('addMatch', data);
	};


	$scope.saveMatch = function () {
		home      =	$scope.home_team; 
		away      = $scope.away_team;

		var data = {
			home: home,
			away: away
		}

		$scope.emitMatch(data);

		// $scope.join = function() {
		// 	console.log("aqui");
		// 	$socket.emit('addMatch', data);
		// };

		$("#addMatchModal").modal('hide');
	}


});


//probar esto --> http://stackoverflow.com/questions/31040770/socket-io-express-node-angular-notifications
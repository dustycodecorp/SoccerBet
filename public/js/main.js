var app = angular.module('soccerApp', [ 'socket.io' ]);

app.config(function ($socketProvider) {
	$socketProvider.setConnectionUrl('');
});

app.controller('MatchesController', function Ctrl($scope, $socket) {

	//Declaring variables
	$scope.matches 		= [];
	$scope.home_team 	= '';
	$scope.away_team 	= '';
	$scope.predictions 	= [];

	//On events
	$socket.on('fetch matches', function (data) {
		$scope.matches = data; 
	});

	$socket.on('refresh matches', function (data) {
		console.log('on addmatches function');
		if ($scope.matches.indexOf(data) == -1) {
			$scope.matches.push(data); 
		}
	});

	$socket.on('display_details',function(data) {
        console.log("Reach display_details socket on -- hell yeah!");
        $scope.home_team = data.home_team;
        $scope.away_team = data.away_team;

        console.log(data);
    });

    $socket.on('display_predictions',function(data) {
        console.log("Reach display_predictions socket on -- hell yeah!");
        $scope.predictions = data;

        console.log(data);
    });

	//Emit events
	$scope.matchDetails = function matchDetails(data) {
		$socket.emit('getMatchDetails', data);
	};

	// showDetails = function showDetails(match_id) {
    //     socket.emit('getMatchDetails',match_id);
    //   }



});


//probar esto --> http://stackoverflow.com/questions/31040770/socket-io-express-node-angular-notifications
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
		if ($scope.matches.indexOf(data) == -1) {
			$scope.matches.push(data);
		}
	});

	$socket.on('display_details',function(data) {
        $scope.home_team = data.home_team;
        $scope.away_team = data.away_team;
				$scope.match_id  = data.id;
    });

	$socket.on('refresh_predictions', function(data) {
		var updated = false;
		angular.forEach($scope.predictions,function(value, index) {
			if (value.id == data.id) {
				updated = true;
				$scope.predictions[index] = data;
			}
		});

		if (updated != true && $scope.predictions.indexOf(data) == -1) {
			$scope.predictions.push(data);
		}
	});

    $socket.on('display_predictions',function(data) {
        $scope.predictions = data;
    });

    $socket.on('delete_prediction', function(data) {
    	angular.forEach($scope.predictions,function(value, index) {
			if (value.id == data.id) {
				$scope.predictions.splice(index, 1); 
			}
		});
	});

	//Emit events
	$scope.matchDetails = function matchDetails(data) {
		$socket.emit('getMatchDetails', data);
	};

	$scope.submit = function addPrediction(pre) {

		var data  = {
			match_id: $scope.match_id,
			username: pre.user_name,
			home_score: pre.home_team_score,
			away_score: pre.away_team_score,
			did_pay: pre.did_pay,
		}

		$socket.emit('addPrediction', data);

		//reset variables
		pre.user_name = "";
		pre.home_team_score = "";
		pre.away_team_score = "";
		pre.did_pay = "";
	}

	$scope.changePayment = function(prediction, sync = false) {

		if (prediction.did_pay == 1) {
			prediction.did_pay = 0;
		} else {
			prediction.did_pay = 1;
		}

		if (sync) {
			$socket.emit('updatePrediction', prediction);
		}
	}

	$scope.deletePrediction = function(prediction) {
		$socket.emit('deletePrediction', prediction);
	}

});

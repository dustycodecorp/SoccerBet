//add prediction form controller
angular.module('soccerApp').controller('predictionFormController', function ($scope, $socket) {

		$scope.submit = function () {
			console.log($scope);
			var data  = {
				username: $scope.username,
				home_score: $scope.home_score,
				away_score: $scope.away_score,
				did_pay: $scope.did_pay,
			}
			console.log(data);
			// $socket.emit('addPrediction', data);
		}
});
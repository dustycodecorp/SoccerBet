//add match modal controller
angular.module('soccerApp').controller('addMatchModal', function ($scope, $socket) {
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
			$("#addMatchModal").modal('hide');
		}
});

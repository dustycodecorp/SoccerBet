var socket = io();
var app = angular.module('quinielaApp', []);

app.controller('MatchesController', ['$scope', function($scope) {
	$scope.spice = 'very';

    $scope.chiliSpicy = function() {
        $scope.spice = 'chili';
    };

    $scope.jalapenoSpicy = function() {
        $scope.spice = 'jalapeño';
    };

    $scope.saveMatch = function () {
    	console.log($scope.home_team);
    	console.log($scope.away_team);
    }

}]);
var app = angular.module('soccerApp', [ 'socket.io', 'ngMaterial']);

app.config(function ($socketProvider) {
	$socketProvider.setConnectionUrl('');
});

app.config(function($mdThemingProvider) {

    $mdThemingProvider.theme('default')
          .primaryPalette('blue')
          .accentPalette('indigo')
          .warnPalette('red')
          .backgroundPalette('grey');

    $mdThemingProvider.theme('custom')
          .primaryPalette('grey')
          .accentPalette('deep-purple')
          .warnPalette('green')

    //create yr own palette 
    $mdThemingProvider.definePalette('amazingPaletteName', {
        '50': 'ffebee',
        '100': 'ffcdd2',
        '200': 'ef9a9a',
        '300': 'e57373',
        '400': 'ef5350',
        '500': 'f44336',
        '600': 'e53935',
        '700': 'd32f2f',
        '800': 'c62828',
        '900': 'b71c1c',
        'A100': 'ff8a80',
        'A200': 'ff5252',
        'A400': 'ff1744',
        'A700': 'd50000',
        'contrastDefaultColor': 'light',    // whether, by default, text         (contrast)
                                    // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
         '200', '300', '400', 'A100'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });
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
				$scope.match_id  = data.id;

        console.log(data);
    });

    $socket.on('refresh_predictions', function(data) {
			if ($scope.predictions.indexOf(data) == -1) {
				$scope.predictions.push(data);
			}
    });

    $socket.on('display_predictions',function(data) {
        console.log("Reach display_predictions socket on -- hell yeah!");
        $scope.predictions = data;

        // console.log(data);
    });

	//Emit events
	$scope.matchDetails = function matchDetails(data) {
		$socket.emit('getMatchDetails', data);
	};

	$scope.submit = function addPrediction() {
		var data  = {
			match_id: $scope.match_id,
			username: this.user_name,
			home_score: this.home_team_score,
			away_score: this.away_team_score,
			did_pay: this.did_pay,
		}

		$socket.emit('addPrediction', data);

		//reset variables
		this.user_name = "";
		this.home_team_score = "";
		this.away_team_score = "";
		this.did_pay = "";
	}

	// showDetails = function showDetails(match_id) {
    //     socket.emit('getMatchDetails',match_id);
    //   }



});


//probar esto --> http://stackoverflow.com/questions/31040770/socket-io-express-node-angular-notifications

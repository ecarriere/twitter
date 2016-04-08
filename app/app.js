var tweetTrade = angular
    .module('tweetTrade',['ngRoute', 'ngSanitize', 'ngResource'])  
    .config(function($routeProvider, $httpProvider){

	

	$routeProvider

	.when('/', {
		controller: 'TwitterController as ctrl',
		templateUrl: '/views/home.ejs'
	})
	.when('/about', {
		controller: 'TwitterController as ctrl',
		templateUrl: '/views/about.html'
	})
	.otherwise({
		redirectTo: '/'
	})
});
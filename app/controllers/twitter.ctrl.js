tweetTrade.controller('TwitterController', TwitterController);

var bodyParser = require('body-parser')

function TwitterController($scope, $resource, $timeout, tweetService){

    //this.tweetService = tweetService;


    /**
     * init controller and set defaults
     */
    function init () {

      // set a default username value
      $scope.username = "growthaces";
      
      // empty tweet model
      $scope.tweetsResult = [];

      // initiate masonry.js
      // $scope.msnry = new Masonry('#tweet-list', {
      //   columnWidth: 320,
      //   itemSelector: '.tweet-item',
      //   transitionDuration: 0,
      //   isFitWidth: true
      // });

      // layout masonry.js on widgets.js loaded event
      // twttr.events.bind('loaded', function () {
      //   $scope.msnry.reloadItems();
      //   $scope.msnry.layout();
      // });

      $scope.getTweets();
    }

    /**
     * requests and processes tweet data
     */
    function getTweets (paging) {

      

      var params = {
        action: 'user_timeline',
        user:   $scope.username
      };

      if ($scope.maxId) {
        params.max_id = $scope.maxId;
      }

      // create Tweet data resource
      $scope.tweets = $resource('/tweets/:action/:user', params);
      

      // GET request using the resource
      $scope.tweets.query( { }, function (res) {

        if( angular.isUndefined(paging) ) {
          $scope.tweetsResult = [];

        }

        $scope.tweetsResult = $scope.tweetsResult.concat(res) 
        

        JSON.stringify($scope.tweetsResult);
        JSON.parse($scope.tweetsResult);

        console.log($scope.tweetsResult);
        
        // $scope.tweets.get({tweetsResult: $scope.tweetsResult},function(eventDetail){
        // //on success callback function
        // console.log(tweetsResult);
        // console.log(tweetsResult[0].text);
        // });




        //tweetService.tweetsBefore = $scope.tweetsResult;
        //console.log(tweetService.tweetsBefore)
        

        // for paging - https://dev.twitter.com/docs/working-with-timelines
        $scope.maxId = res[res.length - 1].id;

        // render tweets with widgets.js
        $timeout(function () {
          twttr.widgets.load();
        }, 30);




      });
    }

    /**
     * binded to @user input form
     */
    $scope.getTweets = function () {
      $scope.maxId = undefined;
      getTweets();
    }

    /**
     * binded to 'Get More Tweets' button
     */
    $scope.getMoreTweets = function () {
      getTweets(true);
    }

    init();


    



}




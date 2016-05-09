tweetTrade.controller('TwitterController', TwitterController);



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

        $scope.tweetsResult = $scope.tweetsResult.concat(res); 


        // Loop over Results
        var tweetsTotal = $scope.tweetsResult.length;

        for(var i = 0; i<tweetsTotal ; i++){
            var totalOrders = [];
            var order = [];


            console.log($scope.tweetsResult[i].text);

            // Find $ for trading pair
            // find() $ ; record everything thats followed by this

            var tradingPair = "";
            if ($scope.tweetsResult[i].text.indexOf('$') != -1) {
                var indexA = $scope.tweetsResult[i].text.indexOf('$');
                tradingPair = $scope.tweetsResult[i].text.substr(indexA+1, 6);
                console.log(tradingPair)
            }
            

            // Find LONG or SHORT
            // find()/search() long / short ; record

            var type = "";
            if ($scope.tweetsResult[i].text.toLowerCase().indexOf('long') != -1) {
                type = 'long';
                console.log(type)
              } else if ($scope.tweetsResult[i].text.toLowerCase().indexOf('short') != -1) {
                type = 'short';
                console.log(type)
              }
                
            
            // Find Price
            // find() price if numbers followed record

            var price = "";
            var httpFind = $scope.tweetsResult[i].text.indexOf('http');
            var priceTest = $scope.tweetsResult[i].text.substr(0, httpFind);
            var priceOpen = "";
            var priceOpCk = false;
            var priceClose = "";

            for (var a = 0; a < priceTest.length; a++){
                var findNum = parseInt(priceTest[a]);

                if (isNaN(findNum) === false) {
                  price += findNum
                  if (priceTest[a+1] === '.') {
                    price += '.' ;
                    a++;
                    } else if (
                         priceTest[a+1] === ','
                      || priceTest[a+1] === '-'
                      || priceTest[a+1] === ')'
                    ) {
                       if (priceOpCk === false) {
                          priceOpen = price;
                          price = "";
                          priceOpCk = true;
                          a++;
                       } else {
                            priceClose = price;
                            price = "";
                            priceOpCk = false;
                            break
                    }
                  }
                }
              }
              console.log('priceOpen: ' + priceOpen);
              console.log('priceClose: ' + priceClose);

            
            //remove https portion (which often contains numbers), then find numbers
            
            var priceString = ''; 

            //test for numbers



            // Find target (opt)
            var target = "";


            // Find Stoploss (opt)
            var stop = "";

            }

      
        // for paging - https://dev.twitter.com/docs/working-with-timelines
        $scope.maxId = res[res.length - 1].id;

        // render tweets with widgets.js
        $timeout(function () {
          twttr.widgets.load();
        }, 5);




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




tweetTrade.controller('TwitterController', TwitterController);



function TwitterController($scope, $resource, $timeout, tweetService){

    //this.tweetService = tweetService;


    /**
     * init controller and set defaults
     */
    function init () {

      // set a default username value
      $scope.username = "growthaces";
      //$scope.username = "tweettradetest";
      
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
              //find $ then loop over next characters max 6 times
                  var indexA = $scope.tweetsResult[i].text.indexOf('$');
                  for (var t=0; t<7; t++){
                    if ($scope.tweetsResult[i].text.charAt(indexA+1) == ' '
                      ||$scope.tweetsResult[i].text.charAt(indexA+1) == ':'
                      ){
                    //break at space or :
                      break
                    } else {
                        tradingPair += $scope.tweetsResult[i].text.charAt(indexA+1);
                        indexA++
                }
              }
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


          //remove http string which often contains numbers
            var httpFind = $scope.tweetsResult[i].text.indexOf('http');
            var priceTest = $scope.tweetsResult[i].text.substr(0, httpFind);

          //isolate price, target and stoploss from rest of tweet  
            var priceId = $scope.tweetsResult[i].text.toLowerCase().indexOf('price');
            // if the word price is not found we grab the number following the word 'at'
              if (priceId == -1) {
                priceId = $scope.tweetsResult[i].text.toLowerCase().indexOf('at');
              } else {
            // if no 'price' or 'at' use index 0  
                  priceId = 0;
              }

            //if stoploss or target are not present in tweet we set equal to 140
            //i.e. index of last character in the string

            var targetId = $scope.tweetsResult[i].text.toLowerCase().indexOf('target');
              if (targetId == -1) {
                targetId = 140;
              }
            var stoplossId = $scope.tweetsResult[i].text.toLowerCase().indexOf('stoploss');
              if (stoplossId == -1) {
                stoplossId = 140;
              }

            // only grab text relevant to each value
            var priceSub = $scope.tweetsResult[i].text.substr(priceId, (targetId - priceId));
            var targetSub = $scope.tweetsResult[i].text.substr(targetId, (stoplossId - targetId));
            var stoplossSub = $scope.tweetsResult[i].text.substr(stoplossId);

            price = grabPrice(priceSub);
            if (targetId != -1){
              target = grabPrice(targetSub);
            }
            if (stoplossId != -1){
              stoploss = grabPrice(stoplossSub);
            }            
            //only set value for target and stoploss if you find those words in the tweet

// Old            var priceOpen = "";
// Old            var priceClose = "";
// Old            var priceOpCk = false;

            function grabPrice (sub) {
              var priceStr = "";
                for (var b = 0; b < sub.length; b++){
                    if (sub[b].match(/[0-9]/)){
                      priceStr += sub[b];
                      if (sub[b+1] === '.') {
                        priceStr += '.' ;
                        b++;
                        } else if (sub[b+1] === ' '
                                   || sub[b+1] === ','
                                   || sub[b+1] === '-'
                                   || sub[b+1] === ')' )
                                  {break}
                                }
                              }
              return priceStr
                            }

              console.log('price:' + price);
              console.log('target:' + target);
              console.log('stoploss:' + stoploss);


  // Old Price Open //      priceTest[a+1] === ','
  // Price Close    //   || priceTest[a+1] === '-'
  // Test           //   || priceTest[a+1] === ')'
  // Works for      //  ) {
  // GrowthAces     //    if (priceOpCk === false) {
                    //       priceOpen = price;
                    //       price = "";
                    //       priceOpCk = true;
                    //       a++;
                    //    } else {
                    //         priceClose = price;
                    //         price = "";
                    //         priceOpCk = false;
                    //         break

              //       }
              //     }
              //   }
              // }
              // console.log('priceOpen: ' + priceOpen);
              // console.log('priceClose: ' + priceClose);




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




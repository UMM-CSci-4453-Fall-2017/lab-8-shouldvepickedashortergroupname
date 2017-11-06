angular.module('register',[])
  .controller('registerCtrl',RegisterCtrl)
  .factory('registerApi',registerApi)
  .constant('apiUrl','http://localhost:1337'); // CHANGED for the lab 2017!

function RegisterCtrl($scope,registerApi){
  // Button intialization
   $scope.buttons=[]; //Initially all was still
   $scope.errorMessage='';
   $scope.isLoading=isLoading;
   $scope.refreshButtons=refreshButtons;
   $scope.buttonClick=buttonClick;

// Line intialization
   $scope.lines=[]; //Initially all was still
   $scope.errorMessage='';
   $scope.isLoading=isLoading;
   $scope.refreshLines=refreshLines;
   $scope.lineClick=lineClick;
   $scope.total = 0;

// Universal
   var loading = false;

   function isLoading(){
    return loading;
   }

   // Button functions
  function refreshButtons(){
    loading=true;
    $scope.errorMessage='';
    registerApi.getButtons()
      .success(function(data){
         $scope.buttons=data;
         loading=false;
      })
      .error(function () {
          $scope.errorMessage="Unable to load Buttons:  Database request failed";
          loading=false;
      });
 }

 function refreshLines(){
   loading=true;
   $scope.errorMessage='';
   registerApi.getLines()
     .success(function(data){
        $scope.lines=data;
        decimalinator();
        console.dir($scope.lines);
        totalPrice();
        loading=false;
     })
     .error(function () {
         $scope.errorMessage="Unable to load Lines:  Database request failed";
         loading=false;
     });
}

  function buttonClick($event){
     $scope.errorMessage='';
     registerApi.clickButton($event.target.id)
        .success(function(){
          totalPrice();
          refreshLines();
        })
        .error(function(){$scope.errorMessage="Unable to click";});
  }
  refreshButtons();  //make sure the buttons are loaded
  //refreshLines();


  function totalPrice(){
    $scope.totalPrice = 0;
    for(var i = 0; i < $scope.lines.length; i++)
    {
      $scope.totalPrice += $scope.lines[i].price * $scope.lines[i].quantity;
    }

    $scope.totalPrice =  $scope.totalPrice + "";

    if($scope.totalPrice.substring($scope.totalPrice.length - 3, $scope.totalPrice.length - 2) != ".")
    {
      if($scope.totalPrice.substring($scope.totalPrice.length - 2, $scope.totalPrice.length - 1) == ".")
      {
        $scope.totalPrice += "0";
      }
      else {
        $scope.totalPrice += ".00";
      }
    }
  }

  function decimalinator()
  {
    for(var i = 0; i < $scope.lines.length; i++)
    {
      price = ($scope.lines[i].price * $scope.lines[i].quantity) + "";
      console.log("test");
      if(price.substring(price.length - 3, price.length - 2) != ".")
      {
        if(price.substring(price.length - 2, price.length - 1) == ".")
        {
          price += "0";
        }
        else {
          price += ".00";
        }
      }
      $scope.lines[i].displayPrice = price;
    }

  }

  function lineClick($event){
     $scope.errorMessage='';
     registerApi.clickLine($event.target.parentElement.id)
        .success(function(){
          totalPrice();
          refreshLines();
        })
        .error(function(){$scope.errorMessage="Unable to click";});
  }
  refreshLines();  //make sure the lines are loaded

}

function registerApi($http,apiUrl){
  return{
    getButtons: function(){
      var url = apiUrl + '/buttons';
      return $http.get(url);
    },
    clickButton: function(id){
      var url = apiUrl+'/click?id='+id;
      return $http.get(url); // Easy enough to do this way
    },
    getLines: function(){
      var url = apiUrl + '/list';
      return $http.get(url);
    },
    clickLine: function(id){
      var url = apiUrl+'/click?id='+id;
      return $http.get(url); // Easy enough to do this way
    }
 };
}

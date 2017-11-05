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
  function buttonClick($event){
     $scope.errorMessage='';
     registerApi.clickButton($event.target.id)
        .success(function(){})
        .error(function(){$scope.errorMessage="Unable to click";});
  }
  refreshButtons();  //make sure the buttons are loaded

  function totalPrice(){
    $scope.totalPrice = 0;
    for(var i = 0; i < $scope.lines.length; i++)
    {
      $scope.totalPrice += $scope.lines[i].price;
    }
  }

  function refreshLines(){
    loading=true;
    $scope.errorMessage='';
    registerApi.getLines()
      .success(function(data){
         $scope.lines=data;
         // TODO: write function converting to price format
         totalPrice();
         loading=false;
      })
      .error(function () {
          $scope.errorMessage="Unable to load Lines:  Database request failed";
          loading=false;
      });
 }
  function lineClick($event){
     $scope.errorMessage='';
     registerApi.clickLine($event.target.parentElement.id)
        .success(function(){
          var lineHTMLID = $event.target.parentElement.id;
          var lineID = lineHTMLID.substring(5,lineHTMLID.length);
          var linePrice = parseFloat($scope.lines[lineID - 1].price);
          var tableBody = document.getElementById("tableBody");
          var tableLine = document.getElementById(lineHTMLID);
          tableBody.removeChild(tableLine);
          $scope.totalPrice = $scope.totalPrice - linePrice;
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
//      console.log("Attempting with "+url);
      return $http.get(url); // Easy enough to do this way
    },
    getLines: function(){
      var url = apiUrl + '/list';
      return $http.get(url);
    },
    clickLine: function(id){
      var url = apiUrl+'/click?id='+id;
//      console.log("Attempting with "+url);
      return $http.get(url); // Easy enough to do this way
    }
 };
}

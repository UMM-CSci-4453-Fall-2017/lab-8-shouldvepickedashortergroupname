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
        .success(function(){
          var buttonHTMLID = $event.target.id;
          var buttonID = buttonHTMLID.substring(7,buttonHTMLID.length);
          var itemIndex = inScope(buttonID);
          if(itemIndex != -1)
          {
            $scope.lines[itemIndex].quantity += 1;
            // TODO: update quantity and price of existing line
          }
          else {
            var button = $scope.buttons[findButtonID(buttonID)];
            var lineToBeAdded = {lineID: $scope.lines[$scope.lines.length -1].lineID + 1, label: button.label, quantity: 1, price: button.price};
            $scope.lines.push(lineToBeAdded);
            htmlAddLine(lineToBeAdded);
            // TODO: ask professor
            totalPrice();
          }
        })
        .error(function(){$scope.errorMessage="Unable to click";});
  }
  refreshButtons();  //make sure the buttons are loaded

  function htmlAddLine(lineToBeAdded)
  {
    var tableBody = document.getElementById("tableBody");
    var labelField = document.createElement("td");
    labelField.textContent = lineToBeAdded.label;
    var quantityField = document.createElement("td");
    quantityField.textContent = lineToBeAdded.quantity;
    var priceField = document.createElement("td");
    priceField.textContent = "$" + lineToBeAdded.price;
    var newLine = document.createElement("tr");
    newLine.id = "line_" + lineToBeAdded.lineID;

    newLine.appendChild(labelField);
    newLine.appendChild(quantityField);
    newLine.appendChild(priceField);
    newLine.classList.add("listLine");
    tableBody.appendChild(newLine);
  }

  function totalPrice(){
    $scope.totalPrice = 0;
    for(var i = 0; i < $scope.lines.length; i++)
    {
      $scope.totalPrice += $scope.lines[i].price * $scope.lines[i].quantity;
    }
  }

  function findLineID(lineID) {
    for(var i = 0; i < $scope.lines.length; i++)
    {
      if($scope.lines[i].lineID == lineID)
      {
        return i;
      }
    }

    return -1;
  }

  function findButtonID(buttonID) {
    for(var i = 0; i < $scope.buttons.length; i++)
    {
      if($scope.buttons[i].buttonID == buttonID)
      {
        return i;
      }
    }

    return -1;
  }

  function inScope(buttonID) {
    for(var i = 0; i < $scope.lines.length; i++)
    {
      if($scope.lines[i].buttonID == buttonID)
      {
        return i;
      }
    }
    return -1;
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
          var linePrice = parseFloat($scope.lines[findLineID(lineID)].price);
          var tableBody = document.getElementById("tableBody");
          var tableLine = document.getElementById(lineHTMLID);
          tableBody.removeChild(tableLine);
          $scope.totalPrice = $scope.totalPrice - linePrice;
          $scope.lines.splice(findLineID(lineID), 1);
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

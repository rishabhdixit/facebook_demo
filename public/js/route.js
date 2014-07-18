var myapp = angular.module("myapp", ['ngRoute']);
myapp.config(function ($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/home', {
            templateUrl: 'home.html',
            controller: 'mainController'
        }).otherwise(
        {redirectTo: "/home"});
});

myapp.controller("mainController", ['$scope', '$http', function ($scope, $http) {
    console.log('main Controller');
    $scope.enterStatus = "";
    $scope.viewStatus = "";
    $scope.updateStatus = function () {

        $scope.viewStatus = $scope.enterStatus;
    }
    //$scope.init = function () {
    $scope.image = "file:///home/rishabh/Downloads/leaveimg.jpg";

    /*var cookie = document.cookie;
     console.log(cookie);*/

    var mail = decodeURIComponent(getCookie("user_id"));

    var url = "http://localhost:7777/user/" + mail;
    console.log(url)
    $http.get(url)
        .success(function (data) {
            $scope.image = data.Img;
        }).error(function (data) {
            console.log(data)
        });
    $scope.userLogout = function (){

        var url = "http://localhost:7777/logout/";
        $http.get(url)
            .success(function(data){
                console.log(data);
            })

    }
    //}
    // $scope.init();

}]);

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}


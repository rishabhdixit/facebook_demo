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

    var mail = decodeURIComponent(getCookie("user_id"));
    $scope.updateStatus = function () {
        var url = "http://localhost:7777/updateStatus/"+$scope.enterStatus;
        $http.get(url)
            .success(function(data){
               console.log('success');
            })
        $scope.viewStatus = $scope.enterStatus;
    }

    var url = "http://localhost:7777/user/" + mail;
    console.log(url)
    $http.get(url)
        .success(function (data) {
            $scope.image = 'http://localhost:7777/images/'+data._id+'.jpg';
            $scope.viewStatus = data.Status;
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


}]);

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

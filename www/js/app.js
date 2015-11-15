// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'//
var todo=angular.module('todo', ['ionic','ngCordova'])

.run(function($ionicPlatform,$cordovaStatusbar) {//
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    //if(window.StatusBar) {
    //  StatusBar.styleDefault();
    //}
    $cordovaStatusbar.overlaysWebView(true)

    //$cordovaStatusBar.style(1) //Light
    $cordovaStatusBar.style(2) //Black, transulcent
    //$cordovaStatusBar.style(3) //Black, opaque

  });
});

/**cordova插件应该在ready里用*/
//document.addEventListener("deviceready", function () {
// // $cordovaPlugin.someFunction().then(success, error);
//}, false);

// OR with IONIC

//$ionicPlatform.ready(function() {
 // $cordovaPlugin.someFunction().then(success, error);
//});

 todo .controller('TodoCtrl',['$scope','$ionicModal','$timeout','Projects','$ionicSideMenuDelegate','$cordovaDialogs',function($scope,$ionicModal,$timeout,Projects,$ionicSideMenuDelegate,$cordovaDialogs){

   // A utility function for creating a new project
   // with the given projectTitle
   var createProject = function(projectTitle) {
     var newProject = Projects.newProject(projectTitle);
     $scope.projects.push(newProject);
     Projects.save($scope.projects);
     $scope.selectProject(newProject, $scope.projects.length-1);
   };

   // Load or initialize projects
   $scope.projects = Projects.all();

   // Grab the last active, or the first project
   $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

   // Called to create a new project
   $scope.newProject = function() {
     //var projectTitle = prompt('项目名称');
     var  projectTitle='';
     $cordovaDialogs.prompt('请输入你的项目名称', '项目名称', ['取消','确定'])
     .then(function(result) {
       var input = result.input1;
       // no button = 0, 'OK' = 1, 'Cancel' = 2
       var btnIndex = result.buttonIndex;
         if(btnIndex==2){
           projectTitle=input;
           if(projectTitle) {
             createProject(projectTitle);
           }
         }
     });
   };

   // Called to select the given project
   $scope.selectProject = function(project, index) {
     $scope.activeProject = project;
     Projects.setLastActiveIndex(index);
     $ionicSideMenuDelegate.toggleLeft(false);
   };

   $scope.toggleProjects = function() {
     $ionicSideMenuDelegate.toggleLeft();
   };


   // Try to create the first project, make sure to defer
   // this by using $timeout so everything is initialized
   // properly
   $timeout(function() {
     if($scope.projects.length == 0) {
       while(true) {
         var projectTitle = '';
         $cordovaDialogs.prompt('创建第一个项目', '项目名称', ['取消','确定'])
           .then(function(result) {
             var inputText = result.input1;
             // no button = 0, 'OK' = 1, 'Cancel' = 2
             var btnIndex = result.buttonIndex;
             if(btnIndex==2){
               projectTitle=inputText;
               if(projectTitle) {
                 createProject(projectTitle);
               }
             }
           });

       }
     }
   });

   // Create and load the Modal
   $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
     $scope.taskModal = modal;
   }, {
     scope: $scope,
     animation: 'slide-in-up'
   });

   // Called when the form is submitted
   $scope.createTask = function(task) {
     if(!$scope.activeProject || !task) {
       return;
     }
     $scope.activeProject.tasks.push({
       title: task.title
     });
     $scope.taskModal.hide();
     // Inefficient, but save all the projects
     Projects.save($scope.projects);
     task.title = "";
   };

   // Open our new task modal
   $scope.newTask = function() {
     $scope.taskModal.show();
   };

   // Close the new task modal
   $scope.closeNewTask = function() {
     $scope.taskModal.hide();
   };

  }]);


todo.factory('Projects', function() {
  return {
    all: function() {
      var projectString = window.localStorage['projects'];
      if(projectString) {
        return angular.fromJson(projectString);
      }
      return [];
    },
    save: function(projects) {
      window.localStorage['projects'] = angular.toJson(projects);
    },
    newProject: function(projectTitle) {
      // Add a new project
      return {
        title: projectTitle,
        tasks: []
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveProject']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveProject'] = index;
    }
  }
});


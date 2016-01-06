(function (angular) {
    'use strict';

    angular
        .module('application', [

            /* vendors */
            'angular-loading-bar',
            'pascalprecht.translate',
            'ui.router',
            'ui.bootstrap',
            'ngResource',
            'application.page'

        ])
        .factory('MessageStore', function(){
            return {
                newMessages: []
            }
        })
        .directive('pagination', function() {
            return function($scope, element, attrs) {

            }
        })
        .config(config);
        // factory для создания о

    //
    function config($stateProvider,
                    $locationProvider,
                    $translateProvider) {
        $locationProvider.html5Mode(true);

        //
        $stateProvider
            .state('application', {
                url: '/',
                controller: AppCtrl,
                controllerAs: "appCtrl",
                templateUrl: 'application/application.html',
                resolve:  {
                 //   newMessages :  MessageStore()
                }
            });

        $translateProvider.useStaticFilesLoader({
            prefix: '/translates/',
            suffix: '.json'
        });

        $translateProvider.useSanitizeValueStrategy(null);
        $translateProvider.preferredLanguage('ru-RU');

    }

    // Controller for state - Application
    function AppCtrl() {

        var appCtrl = this;

        // show form for adding new message
        appCtrl.showForm = function () {
            appCtrl.checked = !appCtrl.checked;
        };

        // add new message
        appCtrl.addMessage = function () {
            // validation
            var validate = true;

            // check all field of form
            for (var field in appCtrl.form) {

                if (appCtrl.form[field] === "") {
                    validate = false;
                    break;
                }
            }

            if (validate) {
                var message = appCtrl.form;

                // add in local storage
                appCtrl.saveMessage(message);

                // add in begining of local model
                appCtrl.messages.splice(0, 0, message);

                // remove
                appCtrl.form = {};

            }
        };

        // save message in local storage
        appCtrl.saveMessage = function (message) {
            var scopeName = "guestBook";
            var messages;

            var temp = localStorage.getItem(scopeName);
            if (temp != null) {
                messages = JSON.parse(temp);
                console.log(messages);
            }
            else {
                messages = [];
            }

            messages.push(message);

            // save in local storage
            localStorage.setItem(scopeName, JSON.stringify(messages));

            //disable form
            appCtrl.showForm();
        };

        // edit message from guestBook
        appCtrl.editMessage = function (message) {
            // get id from data
            // edit in modal-window
            // change information in localstorage
            appCtrl.form = message;

        };

        // delete message from guestBook
        appCtrl.deleteMessage = function (message) {
            var scopeName = "guestBook";
            // get index of element, which we want to delete
            var index = appCtrl.messages.indexOf(message);
            // delete element from array
            appCtrl.messages.splice(index, index + 1);
            // delete from localstorage
            localStorage.setItem(scopeName, JSON.stringify(appCtrl.messages));
        };

        // get all messages
        appCtrl.getMessages = function () {
            var scopeName = "guestBook";
            var result = [];

            var temp = localStorage.getItem(scopeName);

            if(temp != null) {
                result = JSON.parse(temp);
            }

            appCtrl.messages = result;
        };

        appCtrl.init = function () {
            // object for containg data from form
            appCtrl.form = {
                name: "",
                text: ""
            };

            // flag for showing form of adding new comment
            appCtrl.checked = false;

            // all messages, which was added by user
            appCtrl.messages = [];
            appCtrl.getMessages();
        };

        appCtrl.pagination = function() {

        };

        // initialize function
        appCtrl.init();
    }


})(angular);

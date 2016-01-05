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
        .config(config);


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
                templateUrl: 'application/application.html'
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

        // object for containg data from form
        appCtrl.form = {
            name : "",
            text : ""
        };

        appCtrl.checked = false;

        // all messages, which was added by users
        //appCtrl.messages = this.getMessages();
        appCtrl.messages = [];

        // show form for adding new message
        appCtrl.showForm = function () {
            appCtrl.checked  = !appCtrl.checked;
            console.log(appCtrl.checked);
        };


        // add new message
        appCtrl.addMessage = function () {
            // validation
            var validate = true;

            // check all field of form
            for(var field in appCtrl.form) {

                if(appCtrl.form[field] === "") {
                    validate = false;
                    break;
                }
            }

            if(validate) {
                var message = appCtrl.form;


                // add in local storage
                appCtrl.saveMessage(message);

                // add in local model
                appCtrl.messages.push(message);

                appCtrl.form = {};

            }
        };

        // save message in local storage
        this.saveMessage = function(message) {
            var scopeName = "guestBook";
            var messages = [];

            if(JSON.parse(localStorage.getItem(scopeName)) != null) {
                messages = JSON.parse(localStorage.getItem(scopeName));
            }

            messages.push(message);

            // save in local storage
            localStorage.setItem(scopeName, JSON.stringify(messages));
        };


        // edit message from guestBook
        appCtrl.editMessage = function(message) {
            // get id from data
            // edit in modal-window
            // change information in localstorage
            appCtrl.form = message;

        };

        // delete message from guestBook
        appCtrl.deleteMessage = function(message) {
            var scopeName = "guestBook";
            // get index of element, which we want to delete
            var index = appCtrl.messages.indexOf(message);
            // delete element from array
            appCtrl.messages.splice(index, index+1);
            // delete from localstorage
            localStorage.setItem(scopeName, JSON.stringify(appCtrl.messages));
        };

        // get all messages
        appCtrl.getMessages = function () {
            var scopeName = "guestBook";
            var result = [];

            result = JSON.parse(localStorage.getItem(scopeName));

            appCtrl.messages = result;
        };

    }


})(angular);

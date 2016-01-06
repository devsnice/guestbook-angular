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

            var messageStore = this;
            var scopeName = "guestBook";

            messageStore.messages = [];
            messageStore.page = 1;
            messageStore.countPage = 5;

            // save messages in localstorage
            messageStore.saveMessages = function(data) {
                localStorage.setItem(scopeName, angular.toJson(data));
                messageStore.setCurrentMessages();
            };

            // get all messages from localstorage
            messageStore.getMessages = function() {
                var temp = localStorage.getItem(scopeName) || '[]';
                return angular.fromJson(temp);
            };


            // get amount messages
            messageStore.getAmountMessages = function() {
                var temp = messageStore.getMessages();
                return temp.length;
            };

            // set count page
            messageStore.setPage = function(page) {
                messageStore.page = page;
                messageStore.setCurrentMessages();
            };

            messageStore.setCurrentMessages = function() {
                var temp = messageStore.getMessages();

                messageStore.messages = temp.slice((messageStore.page - 1) * messageStore.countPage, messageStore.page * messageStore.countPage);

            };

            // чтобы не ломалась связь
            messageStore.get = function(){
                return messageStore.messages
            };

             messageStore.setCurrentMessages();

            return {
                messages: messageStore.get,
                saveMessages: messageStore.saveMessages,
                getMessages: messageStore.getMessages,
                getAmountMessages: messageStore.getAmountMessages,
                setPage: messageStore.setPage
            }
        })
        .directive('paginationMsg', function() {
            return {
                templateUrl: 'application/pagination.html',
                replace: true,
                restrict: 'A',
                bindToController: true,
                controller: PaginationCtrl,
                controllerAs: 'paginationCtrl'
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
                templateUrl: 'application/application.html'
            });

        $translateProvider.useStaticFilesLoader({
            prefix: '/translates/',
            suffix: '.json'
        });

        $translateProvider.useSanitizeValueStrategy(null);
        $translateProvider.preferredLanguage('ru-RU');

    }

    //
    function PaginationCtrl(MessageStore, $scope){
        var paginationCtrl = this;

        // amount - count msg on the one page
        paginationCtrl.countPage = 0;
        paginationCtrl.onPage = 5;
        paginationCtrl.pages = [];
        paginationCtrl.totalItems = MessageStore.getAmountMessages();

        // calculate count page
        paginationCtrl.calculateCountPage = function() {
            var allElements = MessageStore.getAmountMessages();
            var result;

            if((allElements % paginationCtrl.onPage) != 0) {
                result = parseInt(allElements / paginationCtrl.onPage) + 1;
                console.log(result);
            }
            else {
                result = paginationCtrl.countPage = parseInt(allElements / paginationCtrl.onPage);
            }



            return result;
        };

        // watcher
        $scope.$on('messages:add', function(newValue){
            paginationCtrl.countPage = paginationCtrl.calculateCountPage();
            createRepeatObject(paginationCtrl.countPage);
        });



        // view page
        paginationCtrl.viewPage = function(page) {
            MessageStore.setPage(page);
        };

        function createRepeatObject(count) {
            if(count > 1) {
                for (var i = 0; i < count; i++) {
                    paginationCtrl.pages[i] = i + 1;
                }
            }
        }

        paginationCtrl.countPage = paginationCtrl.calculateCountPage();
        createRepeatObject(paginationCtrl.countPage);
    }


    // Controller for state - Application
    function AppCtrl(MessageStore, $rootScope) {

        var appCtrl = this;

        function validation() {
            // validation
            var validate = true;

            // check all field of form
            for (var field in appCtrl.form) {

                if (appCtrl.form[field] === "") {
                    validate = false;
                    break;
                }
            }

            return validate;
        }

        // show form for adding new message
        appCtrl.showForm = function () {
            appCtrl.checked = !appCtrl.checked;
        };

        // replace the message, thich was edited
        appCtrl.editOldMessage = function() {
            if(validation()) {
                var message = appCtrl.form;

                appCtrl.messages.splice(appCtrl.idOfEdit, 1, message);
                MessageStore.saveMessages(appCtrl.messages);

                //
                appCtrl.addMode = 'add';

                //
                appCtrl.form = {};
                appCtrl.showForm();
            }
        };


        // add new message
        appCtrl.addMessage = function () {
            if (validation()) {
                var message = appCtrl.form;

                // add in begining of local model
                appCtrl.messages.splice(0, 0, message);

                // add in local storage
                appCtrl.saveMessage(appCtrl.messages);

                //
                appCtrl.form = {};
                appCtrl.showForm();
                $rootScope.$broadcast('messages:add');
            }
        };

        // save message in local storage
        appCtrl.saveMessage = function (message) {

            // save in local storage
            MessageStore.saveMessages(message);

        };

        // edit message from guestBook
        appCtrl.editMessage = function (message) {
            // get index of element, which we want to edit
            var index = appCtrl.messages.indexOf(message);

            appCtrl.addMode = 'edit';
            appCtrl.form = message;
            appCtrl.idOfEdit = index;
            appCtrl.showForm();

        };

        // delete message from guestBook
        appCtrl.deleteMessage = function (message) {
            // get index of element, which we want to delete

            console.log("try to delete: ",appCtrl.messages);
            var index = appCtrl.messages.indexOf(message);
            console.log(index);
            // delete element from array
            appCtrl.messages.splice(index, index + 1);
            // delete from localstorage
           MessageStore.saveMessages(appCtrl.messages);
            console.log("after delete: ",appCtrl.messages);
        };


        appCtrl.init = function () {
            // object for containg data from form
            appCtrl.form = {
                name: "",
                text: ""
            };

            appCtrl.addMode = 'add';

            // flag for showing form of adding new comment
            appCtrl.checked = false;


            appCtrl.messages = MessageStore.getMessages();

        };

        appCtrl.getMessages = function(){
            return MessageStore.messages();
        };


        // initialize function
        appCtrl.init();
    }

})(angular);

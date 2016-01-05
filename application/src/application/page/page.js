(function (angular) {
    'use strict';

    angular
        .module('application.page', [

        ])
        .config(config);

    //
    function config(
        $stateProvider
    ) {
        $stateProvider
            .state('application.page', {
                url: 'page',
                templateUrl: 'application/page/page.html'
            });

    }


})(angular);

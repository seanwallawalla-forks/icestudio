/* eslint-disable no-unused-vars */

var ICEpm = new IcePlugManager();

angular
  .module('icestudio', ['ui.bootstrap', 'ngRoute', 'gettext'])
  .config([
    '$routeProvider',
    function ($routeProvider) {
      'use strict';
      $routeProvider
        .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl',
        })
        .otherwise({
          redirectTo: '/',
        });
    },
  ])
  .run(function (
    profile,
    project,
    tools,
    utils,
    boards,
    collections,
    gettextCatalog,
    $timeout
  ) {
    'use strict';
    $timeout(function () {
      $('body').addClass('waiting');
    }, 0);
    // Load boards
    boards.loadBoards();
    // Load profile
    utils.loadProfile(profile, function () {
      // Load collections
      collections.loadAllCollections();
      // Load language
      utils.loadLanguage(profile, function () {
        if (profile.get('board') === '') {
          // Select board for the first time
          utils.selectBoardPrompt(function (selectedBoard) {
            // Initialize selected board
            var newBoard = boards.selectBoard(selectedBoard);
            profile.set('board', newBoard.name);
            alertify.success(
              gettextCatalog.getString('Board {{name}} selected', {
                name: utils.bold(newBoard.info.label),
              })
            );
            // Check if the toolchain is installed
            tools.checkToolchain();
          });
        } else {
          // Initialize selected board
          profile.set('board', boards.selectBoard(profile.get('board')).name);
          // Check if the toolchain is installed
          tools.checkToolchain();
        }

        $('html').attr('lang', profile.get('language'));
        // Rearrange collections
        collections.sort();
        // Initialize title
        project.updateTitle(gettextCatalog.getString('Untitled'));
        $('body').removeClass('waiting');
      });
    });
  })
  .config([
    '$compileProvider',
    function ($compileProvider) {
      'use strict';
      $compileProvider.aHrefSanitizationWhitelist(
        /^\s*(https?|local|data|chrome-extension):/
      );
      $compileProvider.imgSrcSanitizationWhitelist(
        /^\s*(https?|local|data|chrome-extension):/
      );
    },
  ]);

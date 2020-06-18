// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service.

/* eslint-disable camelcase */

angular
  .module('icestudio')
  .controller('PrefCtrl', function (
    $log,
    $scope,
    $uibModalInstance,
    collections,
    common,
    gettextCatalog,
    graph,
    gui,
    nodeFs,
    profile,
    project,
    tools,
    utils
  ) {
    'use strict';

    const _tcStr = function (str, args) {
      return gettextCatalog.getString(str, args);
    };

    $scope.tabs = {
      collections: {icon: 'cubes', title: 'Collections'},
      plugins: {icon: 'exchange', title: 'Plugins', headonly: true},
      remote: {icon: 'at', title: 'Remote', headonly: true},
      language: {
        icon: 'language',
        title: 'Language',
      },
      theme: {
        icon: 'snowflake-o',
        title: 'UI Themes',
        headonly: true,
      },
      toolchain: {
        icon: 'gear',
        title: 'Toolchain',
        disabled: !common.showToolchain(),
      },
    };

    $scope.done = function () {
      $uibModalInstance.close();
    };

    console.log(common);

    //---

    var resultAlert = null;

    $scope.common = common;
    $scope.profile = profile;
    $scope.tools = tools;

    $scope.externalPath = profile.get('externalCollections');

    $scope.languages = {
      ca_ES: 'Catalan',
      cs_CZ: 'Czech',
      de_DE: 'German',
      el_GR: 'Greek',
      en: 'English',
      es_ES: 'Spanish',
      eu_ES: 'Basque',
      fr_FR: 'French',
      gl_ES: 'Galician',
      it_IT: 'Italian',
      ko_KR: 'Korean',
      nl_NL: 'Dutch',
      ru_RU: 'Russian',
      zh_CN: 'Chinese',
    };

    $scope.themes = [
      ['dark', 'Dark'],
      ['light', 'Light'],
    ];

    $scope.addCollections = function () {
      utils.openDialog('#input-add-collection', '.zip', function (filepaths) {
        filepaths = filepaths.split(';');
        tools.addCollections(filepaths);
      });
    };

    $scope.reloadCollections = function () {
      collections.loadAllCollections();
    };

    $scope.removeCollection = function (collection) {
      alertify.confirm(
        _tcStr('Do you want to remove the {{name}} collection?', {
          name: utils.bold(collection.name),
        }),
        function () {
          tools.removeCollection(collection);
          utils.rootScopeSafeApply();
        }
      );
    };

    $scope.removeAllCollections = function () {
      if (common.internalCollections.length > 0) {
        alertify.confirm(
          _tcStr(
            'All stored collections will be lost. Do you want to continue?'
          ),
          function () {
            tools.removeAllCollections();
            utils.rootScopeSafeApply();
          }
        );
      } else {
        alertify.warning(_tcStr('No collections stored'), 5);
      }
    };

    $scope.setExternalCollections = function () {
      var externalCollections = profile.get('externalCollections');
      utils.renderForm(
        [
          {
            type: 'text',
            title: _tcStr('Enter the external collections path'),
            value: externalCollections || '',
          },
        ],
        function (evt, values) {
          var newExternalCollections = values[0];
          if (resultAlert) {
            resultAlert.dismiss(false);
          }
          if (newExternalCollections !== externalCollections) {
            if (
              newExternalCollections === '' ||
              nodeFs.existsSync(newExternalCollections)
            ) {
              profile.set('externalCollections', newExternalCollections);
              collections.loadExternalCollections();
              utils.rootScopeSafeApply();
              alertify.success(_tcStr('External collections updated'));
            } else {
              evt.cancel = true;
              resultAlert = alertify.error(
                _tcStr(
                  'Path {{path}} does not exist',
                  {path: newExternalCollections},
                  5
                )
              );
            }
          }
        }
      );
    };

    $scope.showCollectionData = function (collection) {
      const cname = collection.name;
      $log.debug('[menu.showCollectionData] cname:', cname);
      var readme = collection.content.readme;
      $log.debug('[menu.showCollectionData] content:', collection.content);
      if (!readme) {
        alertify.error(
          _tcStr('Info of collection &lt;{{collection}}&gt; is undefined', {
            collection: cname,
          }),
          5
        );
        return;
      }
      if (!nodeFs.existsSync(readme)) {
        alertify.error(
          _tcStr('README of collection &lt;{{collection}}&gt; does not exist', {
            collection: cname,
          }),
          5
        );
        return;
      }
      _openWindow(
        'resources/viewers/markdown/readme.html?readme=' + escape(readme),
        'Collection: ' + cname
      );
    };

    function _openWindow(url, title) {
      $log.log(url);
      return gui.Window.open(url, {
        title: title,
        focus: true,
        //toolbar: false,
        resizable: true,
        width: 700,
        height: 400,
        min_width: 300,
        min_height: 300,
        icon: 'resources/images/icestudio-logo.png',
      });
    }

    $scope.setExternalPlugins = function () {
      var externalPlugins = profile.get('externalPlugins');
      utils.renderForm(
        [
          {
            type: 'text',
            title: _tcStr('Enter the external plugins path'),
            value: externalPlugins || '',
          },
        ],
        function (evt, values) {
          var newExternalPlugins = values[0];
          if (resultAlert) {
            resultAlert.dismiss(false);
          }
          if (newExternalPlugins !== externalPlugins) {
            if (
              newExternalPlugins === '' ||
              nodeFs.existsSync(newExternalPlugins)
            ) {
              profile.set('externalPlugins', newExternalPlugins);
              alertify.success(_tcStr('External plugins updated'));
            } else {
              evt.cancel = true;
              resultAlert = alertify.error(
                _tcStr(
                  'Path {{path}} does not exist',
                  {path: newExternalPlugins},
                  5
                )
              );
            }
          }
        }
      );
    };

    $scope.setRemoteHostname = function () {
      var current = profile.get('remoteHostname');
      alertify.prompt(
        _tcStr('Enter the remote hostname user@host'),
        '',
        current ? current : '',
        function (evt, remoteHostname) {
          profile.set('remoteHostname', remoteHostname);
        },
        function () {}
      );
    };

    $(document).on('langChanged', function (evt, lang) {
      $scope.selectLanguage(lang);
    });

    $scope.selectLanguage = function (language) {
      if (profile.get('language') !== language) {
        profile.set('language', graph.selectLanguage(language));
        // Reload the project
        project.update(
          {
            deps: false,
          },
          function () {
            graph.loadDesign(project.get('design'), {
              disabled: false,
            });
          }
        );
        // Rearrange the collections content
        collections.sort();
      }
    };

    // Theme support
    $scope.selectTheme = function (theme) {
      if (profile.get('uiTheme') !== theme) {
        profile.set('uiTheme', theme);
        alertify.warning(
          _tcStr('Icestudio needs to be restarted to switch the new UI Theme.'),
          15
        );
      }
    };
  });

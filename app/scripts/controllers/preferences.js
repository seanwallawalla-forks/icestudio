// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service.

/* eslint-disable camelcase */

angular
  .module('icestudio')
  .controller(
    'PrefCtrl',
    (
      $log,
      $scope,
      $uibModalInstance,
      alerts,
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
    ) => {
      'use strict';

      const _tcStr = (str, args) => {
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

      $scope.done = () => {
        $uibModalInstance.close();
      };

      //---

      var resultAlert = null;

      $scope.common = common;
      $scope.profile = profile;
      $scope.tools = tools;

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

      $scope.addColPath = () => {
        utils.renderForm(
          {
            icon: 'folder-open',
            title: _tcStr('Add group of collections'),
            fields: [
              {
                type: 'text',
                title: _tcStr('Name'),
              },
              {
                type: 'text',
                title: _tcStr('Path/location'),
              },
            ],
          },
          (evt, values) => {
            if (!evt.cancel) {
              const name = values[0];
              const gpath = values[1];
              if (common.collections[name] !== undefined) {
                alertify.error(
                  _tcStr(
                    "Collection group/path with name '{{path}}' exists already! Select a different name",
                    {path: name},
                    10
                  )
                );
                return;
              }
              if (!nodeFs.existsSync(gpath)) {
                alertify.error(
                  _tcStr('Path {{path}} does not exist', {path: gpath}, 5)
                );
                return;
              }
              common.collections[name] = {
                disabled: false,
                path: gpath,
                cols: collections.loadCollections(gpath),
              };
              collections.profileSet();
              alertify.success(_tcStr('Collection group/path added!'));
            }
          }
        );
      };

      $scope.addColFromRepo = (key) => {
        utils.renderForm(
          {
            icon: 'github',
            title: _tcStr('Add collection from GitHub repository'),
            fields: [
              {
                type: 'text',
                title: _tcStr('Organization/user name'),
              },
              {
                type: 'text',
                title: _tcStr('Repository name'),
              },
              {
                type: 'text',
                title: _tcStr('Local path/location (relative to the group)'),
              },
            ],
          },
          (evt, values) => {
            if (!evt.cancel) {
              collections.add(key, values[0], values[1], values[2]);
            }
          }
        );
      };

      $scope.reloadCollections = (key) => {
        collections.loadAllCollections(key);
      };

      $scope.removeColPath = (key) => {
        alerts.confirm({
          title: _tcStr(
            "Do you want to remove the collections path/group '{{name}}'?",
            {
              name: key,
            }
          ),
          body: _tcStr('Data will NOT be removed from disk.'),
          onok: () => {
            delete common.collections[key];
            collections.profileSet();
          },
        });
      };

      $scope.reloadCollection = (key, id) => {
        common.collections[key].cols[id] = collections.loadCollection(
          common.collections[key].cols[id].path
        );
      };

      $scope.removeCollection = (key, id) => {
        alerts.confirm({
          title: _tcStr("Do you want to remove the '{{name}}' collection?", {
            name: common.collections[key].cols[id].name,
          }),
          body: _tcStr(
            'All the (modified) projects in the collection will be deleted.'
          ),
          onok: () => {
            collections.removeCollection(key, id);
          },
        });
      };

      $scope.showCollectionData = (collection) => {
        const cname = collection.name;
        var readme = collection.readme;
        $log.debug('[menu.showCollectionData] collection:', collection);
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
            _tcStr(
              'README of collection &lt;{{collection}}&gt; does not exist',
              {
                collection: cname,
              }
            ),
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

      $scope.setExternalPlugins = () => {
        var externalPlugins = profile.get('externalPlugins');
        utils.renderForm(
          [
            {
              type: 'text',
              title: _tcStr('Enter the external plugins path'),
              value: externalPlugins || '',
            },
          ],
          (evt, values) => {
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

      $scope.setRemoteHostname = () => {
        var current = profile.get('remoteHostname');
        alertify.prompt(
          _tcStr('Enter the remote hostname user@host'),
          '',
          current ? current : '',
          (evt, remoteHostname) => {
            profile.set('remoteHostname', remoteHostname);
          },
          () => {}
        );
      };

      $(document).on('langChanged', (evt, lang) => {
        $scope.selectLanguage(lang);
      });

      $scope.selectLanguage = (language) => {
        if (profile.get('language') !== language) {
          profile.set('language', graph.selectLanguage(language));
          // Reload the project
          project.update(
            {
              deps: false,
            },
            () => {
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
      $scope.selectTheme = (theme) => {
        if (profile.get('uiTheme') !== theme) {
          profile.set('uiTheme', theme);
          alertify.warning(
            _tcStr(
              'Icestudio needs to be restarted to switch the new UI Theme.'
            ),
            15
          );
        }
      };
    }
  );

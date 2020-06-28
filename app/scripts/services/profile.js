angular
  .module('icestudio')
  .service('profile', function (
    $log,
    utils,
    common,
    gettextCatalog,
    _package,
    nodeFs
  ) {
    'use strict';

    this.load = _load;
    this.set = _set;
    this.get = _get;
    this.save = _save;
    this.setBoard = _setBoard;

    const _defData = {
      board: '',
      boardRules: true,
      collectionsPaths: '',
      externalPlugins: '',
      language: '',
      remoteHostname: '',
      uiTheme: 'dark',
    };

    this.data = _defData;

    if (common.DARWIN) {
      this.data['macosFTDIDrivers'] = false;
    }

    function _load(callback) {
      var self = this;
      utils
        .readFile(common.PROFILE_PATH)
        .then(function (data) {
          for (var i in data) {
            if (data[i]) {
              self.data[i] = data[i];
            }
          }
          //-- Custom Theme support
          if (self.data.uiTheme !== 'light') {
            let cssFile =
              '<link rel="stylesheet" href="resources/uiThemes/dark/dark.css">';
            let pHead = document.getElementsByTagName('head')[0];
            pHead.innerHTML = pHead.innerHTML + cssFile;
          }
          //-- End Custom Theme support
          if (common.DARWIN) {
            self.data['macosFTDIDrivers'] = data.macosFTDIDrivers || false;
          }
          if (callback) {
            callback();
          }
        })
        .catch(function (error) {
          $log.warn(error);
          if (callback) {
            callback();
          }
        });
    }

    function _set(key, value) {
      if (!_defData.hasOwnProperty(key)) {
        $log.error('[srv.profile.set] unknown key:', key, value);
        return;
      }
      this.data[key] = JSON.parse(JSON.stringify(value));
      this.save();
    }

    function _get(key) {
      return JSON.parse(JSON.stringify(this.data[key]));
    }

    function _save() {
      if (!nodeFs.existsSync(common.ICESTUDIO_DIR)) {
        nodeFs.mkdirSync(common.ICESTUDIO_DIR);
      }
      utils.saveFile(common.PROFILE_PATH, this.data).catch(function (error) {
        alertify.error(error, 30);
      });
    }

    function _setBoard(board) {
      this.set('board', board.name);
      alertify.success(
        gettextCatalog.getString('Board {{name}} selected', {
          name: utils.bold(board.info.label),
        })
      );
    }
  });

/* eslint-disable new-cap */

angular
  .module('icestudio')
  .service('common', function ($log, nodeFs, nodePath, nodeTmp) {
    'use strict';

    const self = this;

    // Project version
    this.VERSION = '1.2';

    // Project status
    this.topModule = true;
    this.hasChangesSinceBuild = false;

    // All project dependencies
    this.allDependencies = {};

    // Boards
    this.boards = [];
    this.devices = [];
    this.selectedProgrammer = null;
    this.selectedBoard = null;
    this.selectedDevice = null;
    this.pinoutInputHTML = '';
    this.pinoutOutputHTML = '';

    // Collections
    this.defaultCollection = null;
    this.internalCollections = [];
    this.externalCollections = [];

    // FPGA resources
    this.FPGAResources = {
      ffs: '-',
      luts: '-',
      pios: '-',
      plbs: '-',
      brams: '-',
    };

    // Debug mode (uncomment)
    // this.DEBUGMODE = 1;

    // Command output
    this.commandOutput = '';

    // Apio URL
    this.APIO_PIP_VCS =
      'git+https://github.com/FPGAwars/apio.git@%BRANCH%#egg=apio';

    // OS
    this.LINUX = Boolean(process.platform.indexOf('linux') > -1);
    this.WIN32 = Boolean(process.platform.indexOf('win32') > -1);
    this.DARWIN = Boolean(process.platform.indexOf('darwin') > -1);

    // Paths
    this.LOCALE_DIR = nodePath.join('resources', 'locale');
    this.SAMPLE_DIR = nodePath.join('resources', 'sample');
    this.DEFAULT_COLLECTION_DIR = nodePath.resolve(
      nodePath.join('resources', 'collection')
    );
    this.DEFAULT_PLUGIN_DIR = nodePath.resolve(
      nodePath.join('resources', 'plugins')
    );

    this.BASE_DIR = process.env.HOME || process.env.USERPROFILE;
    this.LOGFILE = nodePath.join(this.BASE_DIR, 'icestudio.log');
    this.ICESTUDIO_DIR = safeDir(
      nodePath.join(this.BASE_DIR, '.icestudio'),
      this
    );
    this.INTERNAL_COLLECTIONS_DIR = nodePath.join(
      this.ICESTUDIO_DIR,
      'collections'
    );
    this.APIO_HOME_DIR = nodePath.join(this.ICESTUDIO_DIR, 'apio');
    this.PROFILE_PATH = nodePath.join(this.ICESTUDIO_DIR, 'profile.json');
    this.CACHE_DIR = nodePath.join(this.ICESTUDIO_DIR, '.cache');
    this.OLD_BUILD_DIR = nodePath.join(this.ICESTUDIO_DIR, '.build');

    this.APP_DIR = nodePath.dirname(process.execPath);
    this.TOOLCHAIN_DIR = nodePath.join(this.APP_DIR, 'toolchain');

    this.DEFAULT_PYTHON_PACKAGES = 'default-python-packages';
    this.DEFAULT_PYTHON_PACKAGES_DIR = nodePath.join(
      this.CACHE_DIR,
      this.DEFAULT_PYTHON_PACKAGES
    );
    this.DEFAULT_PYTHON_PACKAGES_ZIP = nodePath.join(
      this.TOOLCHAIN_DIR,
      this.DEFAULT_PYTHON_PACKAGES + '.zip'
    );

    this.DEFAULT_APIO = 'default-apio';
    this.DEFAULT_APIO_DIR = nodePath.join(this.CACHE_DIR, this.DEFAULT_APIO);
    this.DEFAULT_APIO_ZIP = nodePath.join(
      this.TOOLCHAIN_DIR,
      this.DEFAULT_APIO + '.zip'
    );

    this.DEFAULT_APIO_PACKAGES = 'default-apio-packages';
    this.DEFAULT_APIO_PACKAGES_ZIP = nodePath.join(
      this.TOOLCHAIN_DIR,
      this.DEFAULT_APIO_PACKAGES + '.zip'
    );

    //-- Folder name for the virtual environment
    this.ENV_DIR = nodePath.join(this.ICESTUDIO_DIR, 'venv');
    this.ENV_BIN_DIR = nodePath.join(
      this.ENV_DIR,
      this.WIN32 ? 'Scripts' : 'bin'
    );
    this.ENV_PIP = nodePath.join(this.ENV_BIN_DIR, 'pip');
    this.ENV_APIO = nodePath.join(
      this.ENV_BIN_DIR,
      this.WIN32 ? 'apio.exe' : 'apio'
    );
    this.APIO_CMD =
      (this.WIN32 ? 'set' : 'export') +
      ' APIO_HOME_DIR=' +
      this.APIO_HOME_DIR +
      (this.WIN32 ? '& ' : '; ') +
      '"' +
      this.ENV_APIO +
      '"';

    this.BUILD_DIR_OBJ = new nodeTmp.dirSync({
      prefix: 'icestudio-',
      unsafeCleanup: true,
    });
    this.BUILD_DIR = this.BUILD_DIR_OBJ.name;
    this.BUILD_DIR_TMP = this.BUILD_DIR_OBJ.name;

    this.PATTERN_PORT_LABEL = /^([A-Za-z_][A-Za-z_$0-9]*)?(\[([0-9]+):([0-9]+)\])?$/;
    this.PATTERN_PARAM_LABEL = /^([A-Za-z_][A-Za-z_$0-9]*)?$/;

    this.PATTERN_GLOBAL_PORT_LABEL = /^([^\[\]]+)?(\[([0-9]+):([0-9]+)\])?$/;
    this.PATTERN_GLOBAL_PARAM_LABEL = /^([^\[\]]+)?$/;

    function safeDir(_dir, self) {
      if (self.WIN32) {
        // Put the env directory to the root of the current local disk when
        // default path contains non-ASCII characters. Virtualenv will fail to
        for (var i in _dir) {
          if (_dir[i].charCodeAt(0) > 127) {
            const _dirFormat = nodePath.parse(_dir);
            return nodePath.format({
              root: _dirFormat.root,
              dir: _dirFormat.root,
              base: '.icestudio',
              name: '.icestudio',
            });
          }
        }
      }
      return _dir;
    }

    this.setBuildDir = function (buildpath) {
      let fserror = false;
      if (!nodeFs.existsSync(buildpath)) {
        try {
          nodeFs.mkdirSync(buildpath, {recursive: true});
        } catch (e) {
          fserror = true;
        }
      }
      this.BUILD_DIR = fserror ? his.BUILD_DIR_TMP : buildpath;
    };

    this.showToolchain = function () {
      if (! this.selectedBoard) {
        return false;
      }
      return (this.selectedProgrammer !== 'GPIO');
    };

    this.showDrivers = function () {
      if (! this.selectedBoard) {
        return false;
      }
      return (this.selectedProgrammer === 'FTDI' || this.selectedProgrammer === 'Serial');
    };
    this.isEditingSubmodule = false;

    // Read list of subdirs of 'resources/boards' which do not start with '_';
    // for each, read 'info.json' and 'rules'.json'.
    // Generate list of boards and list of devices.
    try {
      var boards = [];
      var devices = [];
      var dpath = nodePath.join('resources', 'devices');
      nodeFs.readdirSync(dpath).forEach((ditem) => {
        const ddata = _readJSONFile(dpath, ditem);
        devices.push({
          'name': ditem.slice(0, -5),
          'resources': ddata
        });
      });
      var rpath = nodePath.join('resources', 'boards');
      nodeFs.readdirSync(rpath).forEach((bdir) => {
        if (bdir[0] !== '_' && !nodePath.extname(bdir)) {
          const bpath = nodePath.join(rpath, bdir);
          const idata = _readJSONFile(bpath, 'info.json');
          const mdata = (nodeFs.existsSync(nodePath.join(bpath, 'iomode.json'))) ?
          _readJSONFile(bpath, 'iomode.json') : {};
          var pinout = []
          for (const [key, value] of Object.entries(idata.pinout)) {
            const constraint = mdata[key];
            pinout.push({
              'name': key,
              'value': value,
              'type': ((constraint) ? constraint : 'inout')
            })
          }
          idata.pinout = pinout;
          boards.push({
            name: bdir,
            info: idata,
            rules: _readJSONFile(bpath, 'rules.json'),
          });
          if (devices.filter(obj => { return obj.name === idata.device }).length < 1) {
            console.log("Resource info of device", idata.device, "not available!");
            devices.push({'name': idata.device});
          };
        }
      });
      self.boards = boards;
      self.devices = devices;
    } catch (err) {
      console.error('[srv.boards.loadBoards]', err);
    }

    function _readJSONFile(filepath, filename) {
      try {
        return JSON.parse(
          nodeFs.readFileSync(nodePath.join(filepath, filename))
        );
      } catch (err) {
        $log.error('[srv.boards._readJSONFile]', err);
      }
      return {};
    }

    this.boardLabel = function (name) {
      const label = this.boards.find((board) => board.name === name).info.label;
      return label ? label : name;
    };
  });

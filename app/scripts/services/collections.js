/* eslint-disable camelcase */

angular
  .module('icestudio')
  .service('collections', function (
    $log,
    alerts,
    common,
    gettextCatalog,
    nodeAdmZip,
    nodeFs,
    nodePath,
    profile,
    utils
  ) {
    'use strict';

    const _tcStr = (str, args) => {
      return gettextCatalog.getString(str, args);
    };

    const MAX_LEVEL_SEARCH = 20;

    const _defColPaths = {
      Internal: {
        disabled: false,
        path: nodePath.resolve(nodePath.join('resources', 'collections')),
        cols: [],
      },
      Default: {
        disabled: false,
        path: nodePath.join(common.ICESTUDIO_DIR, 'collections'),
        cols: [],
      },
    };

    this.add = _addCollection;
    this.loadCollection = _loadCollection;
    this.loadCollections = _loadCollections;
    this.loadAllCollections = _loadAllCollections;
    this.profileGet = _profileGet;
    this.profileSet = _profileSet;
    this.removeCollection = _removeCollection;
    this.sort = _sort;

    function _loadAllCollections(key) {
      if (key) {
        var g = common.collections[key];
        g.cols = _loadCollections(g.path);
        return;
      }
      for (var key in common.collections) {
        var g = common.collections[key];
        g.cols = _loadCollections(g.path);
      }
    }

    function _loadCollection(path) {
      function _getFilesRecursive(folder, level) {
        var fileTree = [];
        var validator = /.*\.(ice|json|md)$/;
        try {
          var content = nodeFs.readdirSync(folder);
          level--;
          content.forEach(function (name) {
            var path = nodePath.join(folder, name);
            if (utils.isDirectory(path)) {
              fileTree.push({
                name: name,
                path: path,
                children: level >= 0 ? _getFilesRecursive(path, level) : [],
              });
            } else if (validator.test(name)) {
              fileTree.push({
                name: utils.basename(name),
                path: path,
              });
            }
          });
        } catch (e) {
          console.warn(e);
        }
        return fileTree;
      }

      var collection = {
        name: nodePath.basename(path),
        path: path,
        blocks: [],
        examples: [],
        readme: '',
      };
      for (var child of _getFilesRecursive(path, MAX_LEVEL_SEARCH)) {
        switch (child.name) {
          case 'README':
            collection.readme = child.path;
            break;
          case 'blocks':
            collection.blocks = child.children;
            break;
          case 'examples':
            collection.examples = child.children;
            break;
          case 'package':
            try {
              var pkg = _readJSONFile(child.path);
              if (pkg.repository) {
                if (pkg.repository.url) {
                  var url = pkg.repository.url;
                  pkg.repository = url.replace('https://github.com/', '');
                }
                // TODO check if '.git' exists.
              }
              collection.package = pkg;
            } catch (e) {
              $log.error('[collections.loadCollections] package error:', e);
            }
            break;
        }
      }
      return collection;
    }

    function _loadCollections(gpath) {
      function _findCollections(folder) {
        function _contains(array, item) {
          return array.indexOf(item) !== -1;
        }

        var collectionsPaths = [];
        try {
          if (folder) {
            collectionsPaths = nodeFs
              .readdirSync(folder)
              .map(function (name) {
                return nodePath.join(folder, name);
              })
              .filter(function (path) {
                if (
                  utils.isDirectory(path) ||
                  nodeFs.lstatSync(path).isSymbolicLink()
                ) {
                  try {
                    var content = nodeFs.readdirSync(path);
                    if (content) {
                      const cond = [
                        _contains(content, 'package.json') &&
                          nodeFs
                            .lstatSync(nodePath.join(path, 'package.json'))
                            .isFile(),
                        _contains(content, 'blocks') &&
                          utils.isDirectory(nodePath.join(path, 'blocks')),
                        _contains(content, 'examples') &&
                          utils.isDirectory(nodePath.join(path, 'examples')),
                      ];
                      return cond[0] && (cond[1] || cond[2]);
                    }
                  } catch (e) {
                    $log.error(e);
                  }
                }
                return false;
              });
          }
        } catch (e) {
          $log.warn(e);
        }
        return collectionsPaths;
      }

      var paths = _findCollections(gpath);
      if (!paths) {
        return [];
      }
      return paths.map((path) => {
        return _loadCollection(path);
      });
    }

    function _profileGet() {
      try {
        const gs = profile.get('collectionsPaths');
        $log.debug('[srv.collections.profileGet] profile', gs);
        common.collections = gs ? gs : _defColPaths;
      } catch (e) {
        $log.debug('[srv.collections.profileGet] error:', e);
      }
      $log.debug(
        '[srv.collections.profileGet] common.collections',
        common.collections
      );
    }

    function _profileSet() {
      var gs = {};
      for (var p in common.collections) {
        var g = common.collections[p];
        gs[p] = {
          disabled: g.disabled,
          path: g.path,
        };
      }
      profile.set('collectionsPaths', gs);
    }

    function _removeCollection(key, id) {
      const name = common.collections[key].cols[id].name;
      utils.deleteFolderRecursive(common.collections[key].cols[id].path);
      common.collections[key].cols.splice(id, 1);
      alertify.success(
        _tcStr("Collection '{{name}}' removed", {
          name: utils.bold(name),
        })
      );
    }

    function _sort() {
      function sortCollections(collections) {
        if (!collections) {
          return;
        } // FIXME: should no fail silently
        function sortContent(items) {
          if (!items) {
            return;
          } // FIXME: should no fail silently
          items.sort(function (a, b) {
            a = gettextCatalog.getString(a.name);
            b = gettextCatalog.getString(b.name);
            if (a > b) {
              return 1;
            }
            if (a < b) {
              return -1;
            }
            return 0;
          });
          for (var item of items) {
            sortContent(item.children);
          }
        }
        for (var collection of collections) {
          sortContent(collection.blocks);
          sortContent(collection.examples);
        }
      }
      sortCollections(common.externalCollection);
    }

    function _addCollection(key, org, repo, path) {
      function _do(msg) {
        _installCollection(key, org, repo, path, () => {
          _loadAllCollections(key);
          alertify.success(
            _tcStr("Collection '{{name}}'" + msg, {
              name: name,
            })
          );
        });
      }

      var destPath = nodePath.join(common.collections[key].path, path);
      if (!nodeFs.existsSync(destPath)) {
        _do('added');
        return;
      }
      // We need the currently open 'confirm' dialog to exit before opening a new one.
      setTimeout(() => {
        alerts.confirm({
          title: _tcStr('A collection exists already.'),
          body: _tcStr("Do you want to replace the content in '{{path}}'?", {
            path: destPath,
          }),
          onok: () => {
            utils.deleteFolderRecursive(destPath);
            _do('replaced');
          },
        });
      }, 0);
    }

    function _installCollection(key, org, repo, path, cb) {
      const {Octokit} = require('@octokit/rest');
      const octokit = new Octokit();
      octokit.repos
        .downloadArchive({
          owner: org,
          repo: repo,
          archive_format: 'zipball',
        })
        .then(({data}) => {
          try {
            const ipath = nodePath.join(common.ICESTUDIO_DIR, 'tmp');
            if (!nodeFs.existsSync(ipath)) {
              nodeFs.mkdirSync(ipath, {recursive: true});
            }
            const tname = nodePath.join(ipath, `${org}_${repo}.zip`);
            const tpath = nodePath.join(ipath, path);
            nodeFs.writeFileSync(tname, new Uint8Array(data));
            nodeAdmZip(tname).extractAllTo(tpath, true);
            nodeFs.unlinkSync(tname);
            const cpath = nodePath.join(common.collections[key].path, path);
            nodeFs.renameSync(
              nodePath.join(tpath, nodeFs.readdirSync(tpath)[0]),
              cpath
            );
            nodeFs.rmdirSync(tpath, {recursive: true});
            const ppath = nodePath.join(cpath, 'package.json');
            var pkg = _readJSONFile(ppath);
            pkg.repository = `${org}/${repo}`;
            nodeFs.writeFileSync(ppath, JSON.stringify(pkg, null, 2));
            if (cb) {
              cb();
            }
          } catch (e) {
            console.log(e);
          }
        })
        .catch((e) => {
          $log.error(e);
        });
    }

    function _readJSONFile(filepath) {
      try {
        return JSON.parse(nodeFs.readFileSync(filepath, 'utf8'));
      } catch (e) {
        $log.error('[srv.utils.readFile]', e);
        return;
      }
    }
  });

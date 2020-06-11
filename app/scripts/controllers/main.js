/* eslint-disable new-cap */

angular
  .module('icestudio')
  .controller('MainCtrl', function (gettextCatalog, common, tools, utils) {
    'use strict';

    alertify.defaults.movable = false;
    alertify.defaults.closable = false;
    alertify.defaults.transition = 'fade';
    alertify.defaults.notifier.delay = 3;

    setTimeout(function () {
      for (const item of ['alert', 'prompt', 'confirm']) {
        alertify.set(item, 'labels', {
          ok: gettextCatalog.getString('OK'),
          cancel: gettextCatalog.getString('Cancel'),
        });
      }
    }, 100);

    /* If in package.json appears development:{mode:true}*/
    /* activate development tools */
    tools.ifDevelopmentMode();

    $(document).delegate(
      '.action-open-url-external-browser',
      'click',
      function (e) {
        e.preventDefault();
        utils.openUrlExternalBrowser($(this).prop('href'));
        return false;
      }
    );

    /* Plugin menu*/
    if (ICEpm !== undefined) {
      ICEpm.setPluginDir(common.DEFAULT_PLUGIN_DIR, function () {});
    }

    console.log('ENV', common);
  });

"use strict";

var chokidar = require(`chokidar`);
var fs = require(`fs`);

var _require = require(`./create-file-node`),
    createId = _require.createId,
    createFileNode = _require.createFileNode;

exports.sourceNodes = function (_ref, pluginOptions) {
  var boundActionCreators = _ref.boundActionCreators,
      getNode = _ref.getNode,
      hasNodeChanged = _ref.hasNodeChanged,
      reporter = _ref.reporter;
  var createNode = boundActionCreators.createNode,
      deleteNode = boundActionCreators.deleteNode;


  var ready = false;

  // Validate that the path exists.
  if (!fs.existsSync(pluginOptions.path)) {
    console.log(`
The path passed to gatsby-source-filesystem does not exist on your file system:

${pluginOptions.path}

Please pick a path to an existing directory.
      `);
    process.exit(1);
  }

  var watcher = chokidar.watch(pluginOptions.path, {
    ignored: [`**/*.un~`, `**/.gitignore`, `**/.npmignore`, `**/.babelrc`, `**/yarn.lock`, `**/node_modules`, `../**/dist/**`]
  });

  var createAndProcessNode = function createAndProcessNode(path) {
    return createFileNode(path, pluginOptions).then(createNode);
  };

  // For every path that is reported before the 'ready' event, we throw them
  // into a queue and then flush the queue when 'ready' event arrives.
  // After 'ready', we handle the 'add' event without putting it into a queue.
  var pathQueue = [];
  var flushPathQueue = function flushPathQueue() {
    var queue = pathQueue.slice();
    pathQueue = [];
    return Promise.all(queue.map(createAndProcessNode));
  };

  watcher.on(`add`, function (path) {
    if (ready) {
      reporter.info(`added file at ${path}`);
      createAndProcessNode(path).catch(function (err) {
        return reporter.error(err);
      });
    } else {
      pathQueue.push(path);
    }
  });

  watcher.on(`change`, function (path) {
    reporter.info(`changed file at ${path}`);
    createAndProcessNode(path).catch(function (err) {
      return reporter.error(err);
    });
  });

  watcher.on(`unlink`, function (path) {
    reporter.info(`file deleted at ${path}`);
    var node = getNode(createId(path));
    deleteNode(node.id, node);

    // Also delete nodes for the file's transformed children nodes.
    node.children.forEach(function (childId) {
      return deleteNode(childId, getNode(childId));
    });
  });

  watcher.on(`addDir`, function (path) {
    if (ready) {
      reporter.info(`added directory at ${path}`);
      createAndProcessNode(path).catch(function (err) {
        return reporter.error(err);
      });
    } else {
      pathQueue.push(path);
    }
  });

  watcher.on(`unlinkDir`, function (path) {
    reporter.info(`directory deleted at ${path}`);
    var node = getNode(createId(path));
    deleteNode(node.id, node);
  });

  return new Promise(function (resolve, reject) {
    watcher.on(`ready`, function () {
      if (ready) return;

      ready = true;
      flushPathQueue().then(resolve, reject);
    });
  });
};
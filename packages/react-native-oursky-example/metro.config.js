// How does this work
//
// First we are using Yarn workspaces.
// Yarn workspaces has a feature called nohoist,
// which you may see people on the web use it to support monorepo in react native environment.
//
// The below config is my own experiment on how to support monorepo in react native environment.
//
// First, we must ensure no dependencies of react-native-oursky-example are hoisted.
// This is configured in <project_root>/package.json
//
// Second, we must ensure all dependencies of react-native-oursky are hoisted.
// So react-native-oursky/node_modules is empty. Being empty is important so
// that Metro does not detect duplicated modules.
//
// Metro only considers files in specified projectRoot and watchFolders exist.
// So we have to tell Metro to watch react-native-oursky
//
// Since Metro only look at projectRoot and watchFolders, we need to teach Metro
// how to resolve dependencies of react-native-oursky because its node_modules is empty.
// This is done by getNodeModulesForDirectory, which is copied from https://github.com/react-navigation/react-navigation/blob/v1.5.11/examples/NavigationPlayground/rn-cli.config.js#L20
// The idea is that the dependencies of react-native-oursky is from react-native-oursky-example/node_modules
//
// The last thing is actually what we want to do originally. We want
//
// import * as default "@oursky/react-native-oursky"
//
// to import from packages/react-native-oursky
//
// We achieve this by overriding extraNodeModules["@oursky/react-native-oursky"] and
// add packages/react-native-oursky to watchFolders so Metro knows where to find it.
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname);

function getNodeModulesForDirectory(rootPath) {
  const nodeModulePath = path.join(rootPath, "node_modules");
  const folders = fs.readdirSync(nodeModulePath);
  return folders.reduce((modules, folderName) => {
    const folderPath = path.join(nodeModulePath, folderName);
    if (folderName.startsWith("@")) {
      const scopedModuleFolders = fs.readdirSync(folderPath);
      const scopedModules = scopedModuleFolders.reduce(
        (scopedModules, scopedFolderName) => {
          scopedModules[
            `${folderName}/${scopedFolderName}`
          ] = maybeResolveSymlink(path.join(folderPath, scopedFolderName));
          return scopedModules;
        },
        {}
      );
      return Object.assign({}, modules, scopedModules);
    }
    modules[folderName] = maybeResolveSymlink(folderPath);
    return modules;
  }, {});
}

function maybeResolveSymlink(maybeSymlinkPath) {
  if (fs.lstatSync(maybeSymlinkPath).isSymbolicLink()) {
    const resolved = path.resolve(
      path.dirname(maybeSymlinkPath),
      fs.readlinkSync(maybeSymlinkPath)
    );
    return resolved;
  }
  return maybeSymlinkPath;
}

const thisNodeModules = getNodeModulesForDirectory(path.resolve(__dirname));

const extraNodeModules = {
  ...thisNodeModules,
};

extraNodeModules["@oursky/react-native-oursky"] = path.resolve(
  __dirname,
  "../react-native-oursky"
);

module.exports = {
  projectRoot,
  watchFolders: [path.resolve(__dirname, "../react-native-oursky")],
  resolver: {
    extraNodeModules,
  },
};

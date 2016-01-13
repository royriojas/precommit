[![NPM Version](http://img.shields.io/npm/v/precommit.svg?style=flat)](https://npmjs.org/package/precommit)
[![Build Status](http://img.shields.io/travis/royriojas/precommit.svg?style=flat)](https://travis-ci.org/royriojas/precommit)

# precommit
> Yet another precommit module that will run tasks defined in a config file or in a package.json file, stashing anything that is not supposed to be commited before run the scripts to avoid false positives when running validation like tasks.

## Motivation

All the other modules similar to this one were specifying the precommit tasks in
the `package.json` file. While this is ok I needed to have it defined in a separated
config file. Also I needed to have the option to interactively ask the user
to decide what to do in case a commit was attempted with a dirty state (*unstaged*/*untracked* files)

## Install

```bash
# install it as a dev-dependency.
npm i --save-dev precommit

# install the hook, passing the path to the config. If none is provided it will try to use the `package.json`
./node_modules/precommit/bin/cli.js install -c ./path/to/your/config
```

Using a custom precommit.json

```javascript
{
  "precommit" : [ "npm test" ]
}
```

or in your package.json file

```javascript
{
  "precommit" : [ "grunt precommit" ]
}
```

or as an object in a `custom.json` file or in `package.json` add the following section

```javascript
{
  "precommit" : {
    // the tasks to run
    "tasks" : [ "grunt precommit" ],
    // What to do in case of a dirty state
    // ask   => Show a prompt to the user to decide what to do, stash or fail.
    // fail  => Simply refuse to push something when you have uncommited/untracked files
    // stash => If there are uncommited/untracked files stash them, do the push and restore the stash
    //          This will also move untracked files into the stash
    "onDirtyState": "ask", // <== ask, fail or stash. Default to stash
    "coloredOutput" : true // <== true or false. If ommited it will try to use the env variable `__CLIX_COLORED_OUTPUT__` (from `clix` module)
  }
}
```

**Important**
Be aware that if you cancel the program using `CTRL+C` then the stash might not be restored.
So you will have to restore it manually. TODO: trap the `SIGINT` event and restore the
stash transparently for the user.

## cli usage

The following are the options available on the cli command that install/remove the hook. To pass options to the hook. Please use the `precommit` section on your config file or in the `package.json` file.

```
Yet another `precommit` module that will run tasks defined in a config file or in a package.json file, stashing anything that is not supposed to be pushed before run the scripts to avoid false positives!

========================================================
Usage: precommit -c [path/to/config/file] [install|remove]
========================================================

  -h, --help           Show this help
  -v, --version        Outputs the version number
  -q, --quiet          Show only the summary info - default: false
  --colored-output     Use colored output in logs
  -c, --config String  Path to your `precommit` config, if not provided will try to use the `package.json` file in your
                       current working directory, expecting an entry called `precommit`
```

**Note**: The `colored-output` in the cli is only for logs during installing/removing the hook.

If you want to enable the colored logs in the actual precommit hook, please include the option
`coloredOutput` in your `precommit` section. Like this:

```javascript
{
  "precommit": {
    // the tasks to run
    "tasks": [ "grunt precommit" ],
    "onDirtyState": "ask",
    "coloredOutput": true // or false
  }
}
```

The hook also honor the clix env variable to enable colored output `__CLIX_COLORED_OUTPUT__` so if you set this variable in your environment you don't need to configure it in the `precommit` section.

## Example

```bash
# install the hook and use the package.json precommit field
./node_modules/precommit/bin/cli.js install

# install the hook using a custom precommit.json file
./node_modules/precommit/bin/cli.js install -c ./path/to/precommit.json

# remove the hook
./node_modules/precommit/bin/cli.js remove
```

## Usage in npm scripts

```javascript
// in the scripts field
{
  "scripts": {
    "hook-install": "precommit install",
    "hook-remove": "precommit remove",
    "precommit" : "eslinter 'src/**/*.js'" // put here any script you want to run
  },
  "precommit" : {
    "tasks" : ["npm run precommit"]
  }
}
```

then in the command line you can do:

```bash
# install
npm run hook-install

# remove
npm run hook-remove
```

## License

[MIT](./LICENSE)

## Changelog
[Changelog](./changelog.md)

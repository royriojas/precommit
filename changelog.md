
# precommit - Changelog
## v1.2.2
- **Bug Fixes**
  - regression when upgrading read-file - [ba35402]( https://github.com/royriojas/precommit/commit/ba35402 ), [Roy Riojas](https://github.com/Roy Riojas), 31/07/2016 05:12:05

    
## v1.2.1
- **Build Scripts Changes**
  - update packages to prevent issues with deprecated packages - [cc0ff38]( https://github.com/royriojas/precommit/commit/cc0ff38 ), [Roy Riojas](https://github.com/Roy Riojas), 31/07/2016 04:28:48

    
## v1.2.0
- **undefined**
  - 'coloredOuput' => 'coloredOutput' - [6152649]( https://github.com/royriojas/precommit/commit/6152649 ), [Guido Kessels](https://github.com/Guido Kessels), 13/01/2016 10:42:02

    
## v1.1.9
- **Bug Fixes**
  - only change cwd to gitDirectory if a git command is executed - [6e7b64b]( https://github.com/royriojas/precommit/commit/6e7b64b ), [royriojas](https://github.com/royriojas), 16/12/2015 04:41:30

    
## v1.1.8
- **Bug Fixes**
  - properly detect the git directory to ensure the git commands will use the right git info - [f1a2fd8]( https://github.com/royriojas/precommit/commit/f1a2fd8 ), [royriojas](https://github.com/royriojas), 16/12/2015 04:20:02

    
## v1.1.7
- **Refactoring**
  - Add the option to apply the precommit only to given branches - [029fb23]( https://github.com/royriojas/precommit/commit/029fb23 ), [royriojas](https://github.com/royriojas), 17/10/2015 20:48:36

    
## v1.1.6
- **Bug Fixes**
  - Make it usable in case a GUI is used to control git - [2eddede]( https://github.com/royriojas/precommit/commit/2eddede ), [royriojas](https://github.com/royriojas), 17/10/2015 19:49:56

    
## v1.1.5
- **Build Scripts Changes**
  - update clix dep to get nicer log output - [469c0a8]( https://github.com/royriojas/precommit/commit/469c0a8 ), [royriojas](https://github.com/royriojas), 11/08/2015 19:43:54

    
## v1.1.4
- **Build Scripts Changes**
  - Update to latest clix - [ecec282]( https://github.com/royriojas/precommit/commit/ecec282 ), [royriojas](https://github.com/royriojas), 11/08/2015 16:29:52

    
## v1.1.3
- **Build Scripts Changes**
  - Move esbeautifier from dependencies to devDependencies - [de4faf7]( https://github.com/royriojas/precommit/commit/de4faf7 ), [royriojas](https://github.com/royriojas), 09/08/2015 20:20:31

    
## v1.1.2
- **Bug Fixes**
  - do not report renamed as dirty state - [941deb5]( https://github.com/royriojas/precommit/commit/941deb5 ), [royriojas](https://github.com/royriojas), 07/08/2015 16:26:41

    
## v1.1.1
- **Build Scripts Changes**
  - Update the beautifier to the latest version - [8d29c2a]( https://github.com/royriojas/precommit/commit/8d29c2a ), [royriojas](https://github.com/royriojas), 07/08/2015 12:54:46

    
- **Bug Fixes**
  - Do not consider deleted files to calculate the dirty state. Fixes [#2](https://github.com/royriojas/precommit/issues/2) - [fa45725]( https://github.com/royriojas/precommit/commit/fa45725 ), [royriojas](https://github.com/royriojas), 07/08/2015 12:54:27

    
## v1.1.0
- **Enhancements**
  - Make onDirtyState default to `stash` - [21a7766]( https://github.com/royriojas/precommit/commit/21a7766 ), [royriojas](https://github.com/royriojas), 30/07/2015 17:22:13

    **BREAKING CHANGE:**
    
    Well not really breaking, but this change the previous default value from `ask` to `stash` when the
    tree contains files that are modified but not staged or untracked
    
## v1.0.3
- **Enhancements**
  - Remove noisy outputs - [324c37e]( https://github.com/royriojas/precommit/commit/324c37e ), [royriojas](https://github.com/royriojas), 30/07/2015 04:41:43

    
## v1.0.2
- **Bug Fixes**
  - delete git env variables from process. Fixes [#1](https://github.com/royriojas/precommit/issues/1) - [7cc92c7]( https://github.com/royriojas/precommit/commit/7cc92c7 ), [royriojas](https://github.com/royriojas), 29/07/2015 20:18:40

    
## v1.0.1
- **Bug Fixes**
  - execute the precommit scripts when directory not dirty - [757a7a7]( https://github.com/royriojas/precommit/commit/757a7a7 ), [royriojas](https://github.com/royriojas), 29/07/2015 04:47:06

    
- **Build Scripts Changes**
  - include test as part of the pre-v scripts - [caaf6bf]( https://github.com/royriojas/precommit/commit/caaf6bf ), [royriojas](https://github.com/royriojas), 29/07/2015 04:45:01

    
## v1.0.0
- **Features**
  - First working version of precommit - [29943a6]( https://github.com/royriojas/precommit/commit/29943a6 ), [royriojas](https://github.com/royriojas), 29/07/2015 03:26:47

    

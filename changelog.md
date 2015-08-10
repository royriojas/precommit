
# precommit - Changelog
## v1.1.3
- **Build Scripts Changes**
  - Move esbeautifier from dependencies to devDependencies - [de4faf7]( https://github.com/royriojas/precommit/commit/de4faf7 ), [royriojas](https://github.com/royriojas), 09/08/2015 18:20:31

    
## v1.1.2
- **Bug Fixes**
  - do not report renamed as dirty state - [941deb5]( https://github.com/royriojas/precommit/commit/941deb5 ), [royriojas](https://github.com/royriojas), 07/08/2015 14:26:41

    
## v1.1.1
- **Build Scripts Changes**
  - Update the beautifier to the latest version - [8d29c2a]( https://github.com/royriojas/precommit/commit/8d29c2a ), [royriojas](https://github.com/royriojas), 07/08/2015 10:54:46

    
- **Bug Fixes**
  - Do not consider deleted files to calculate the dirty state. Fixes [#2](https://github.com/royriojas/precommit/issues/2) - [fa45725]( https://github.com/royriojas/precommit/commit/fa45725 ), [royriojas](https://github.com/royriojas), 07/08/2015 10:54:27

    
## v1.1.0
- **Enhancements**
  - Make onDirtyState default to `stash` - [21a7766]( https://github.com/royriojas/precommit/commit/21a7766 ), [royriojas](https://github.com/royriojas), 30/07/2015 15:22:13

    **BREAKING CHANGE:**
    
    Well not really breaking, but this change the previous default value from `ask` to `stash` when the
    tree contains files that are modified but not staged or untracked
    
## v1.0.3
- **Enhancements**
  - Remove noisy outputs - [324c37e]( https://github.com/royriojas/precommit/commit/324c37e ), [royriojas](https://github.com/royriojas), 30/07/2015 02:41:43

    
## v1.0.2
- **Bug Fixes**
  - delete git env variables from process. Fixes [#1](https://github.com/royriojas/precommit/issues/1) - [7cc92c7]( https://github.com/royriojas/precommit/commit/7cc92c7 ), [royriojas](https://github.com/royriojas), 29/07/2015 18:18:40

    
## v1.0.1
- **Bug Fixes**
  - execute the precommit scripts when directory not dirty - [757a7a7]( https://github.com/royriojas/precommit/commit/757a7a7 ), [royriojas](https://github.com/royriojas), 29/07/2015 02:47:06

    
- **Build Scripts Changes**
  - include test as part of the pre-v scripts - [caaf6bf]( https://github.com/royriojas/precommit/commit/caaf6bf ), [royriojas](https://github.com/royriojas), 29/07/2015 02:45:01

    
## v1.0.0
- **Features**
  - First working version of precommit - [29943a6]( https://github.com/royriojas/precommit/commit/29943a6 ), [royriojas](https://github.com/royriojas), 29/07/2015 01:26:47

    

#!/usr/bin/env node

var fs = require( 'fs' );
var nodeProcess = require( 'process' );
var nConsole = require( 'console' );
var opts = require( 'precommit-config' );
nodeProcess.chdir( opts.workingDirectory );
var path = require( 'path' );
var env = nodeProcess.env || { };

// getting rid of the environment variables that affect the way git status work
// when called from a directory different than the one where the precommit module is
// installed
var gitVars = [
  'GIT_PREFIX',
  'GIT_DIR',
  'GIT_AUTHOR_NAME',
  'GIT_AUTHOR_EMAIL',
  'GIT_AUTHOR_DATE',
  //'GIT_INDEX_FILE',
  'GIT_EDITOR'
];

gitVars.forEach( function ( key ) {
  delete nodeProcess.env[ key ]; //esfmt-ignore-line
} );

var readJSON = function ( filePath, options ) {
  return JSON.parse( String( fs.readFileSync( filePath, options ) ).replace( /^\ufeff/g, '' ) );
};

var config = readJSON( opts.configFile );
var precommitSection = config.precommit;
var configPrecommit = precommitSection || { };
var coloredOutput = configPrecommit.coloredOutput;

// if the coloredOutput was not specified
if ( typeof coloredOutput === 'undefined' ) {
  // try to use the value of the env variable
  coloredOutput = env.__CLIX_COLORED_OUTPUT__ === 'true';
}

var green = function () {
  var args = [ ].slice.call( arguments );
  if ( !coloredOutput ) {
    return args;
  }
  args.unshift( '\x1B[33m' );
  args.push( '\x1B[22m\x1B[39m' );
  return args;
};

var gray = function () {
  var args = [ ].slice.call( arguments );
  if ( !coloredOutput ) {
    return args;
  }
  args.unshift( '\x1B[90m' );
  args.push( '\x1B[22m\x1B[39m' );
  return args;
};

var red = function () {
  var args = [ ].slice.call( arguments );
  if ( !coloredOutput ) {
    return args;
  }
  args.unshift( '\x1B[31m' );
  args.push( '\x1B[22m\x1B[39m' );
  return args;
};

var white = function () {
  var args = [ ].slice.call( arguments );
  if ( !coloredOutput ) {
    return args;
  }
  args.unshift( '\x1B[37m' );
  args.push( '\x1B[22m\x1B[39m' );
  return args;
};

var yellow = function () {
  var args = [ ].slice.call( arguments );
  if ( !coloredOutput ) {
    return args;
  }
  args.unshift( '\x1B[33m' );
  args.push( '\x1B[22m\x1B[39m' );
  return args;
};

var yellowString = function () {
  return yellow.apply( null, arguments ).join( '' );
};

var grayString = function () {
  return gray.apply( null, arguments ).join( '' );
};

var redString = function () {
  return red.apply( null, arguments ).join( '' );
};

var whiteString = function () {
  return white.apply( null, arguments ).join( '' );
};

var Promise = ( function () {
  var _Promise = require( './Promise' );

  // if native promise found, just use it instead attempt to require the `es6-promise` module
  if ( _Promise ) {
    return _Promise;
  }

  try {
    _Promise = require( 'precommit/lib/promise' );
  } catch (ex) {
    try {
      _Promise = require( path.resolve( opts.workingDirectory, './node_modules/precommit/lib/promise' ) );
    } catch (_ex) {
      try {
        _Promise = require( 'es6-promise' ).Promise;
      } catch (err) {
        log.error( '>> could not execute the precommit script. Missing `Promise` module. try running `npm i -D es6-promise`' );
      }
    }
  }
  return _Promise;
}());


// taken from: https://github.com/noyobo/confirm-simple/blob/master/lib/index.js
//
var ttyConfirm = function ( question, callback ) {
  var domain = require( 'domain' );
  var d = domain.create();

  return new Promise( function ( resolve, reject ) {

    d.on( 'error', function ( err ) {
      if ( err.code === 'ENXIO' ) {
        // when using a graphical interface like github
        // there is no way we can create a tty stream
        // hence we assume that the user wanted to say yes
        // at least that will operate on the code
        console.error( 'could not open TTY... assuming the user wanted to say yes' );
        callback && callback( 'yes' );
        resolve();
      }
    } );

    d.run( function () {
      var readline = require( 'readline' );

      var tty = fs.createReadStream( '/dev/tty', 'utf8' );

      var r = readline.createInterface( {
        input: tty,
        output: nodeProcess.stdout,
        terminal: false
      } );

      r.question( question + '\n\n' +
          whiteString( '>> continue? ' ) +
          grayString( '(' ) +
          grayString( 'yes' ) +
          grayString( '|' ) +
          whiteString( 'NO' ) +
          grayString( ') : ' ), function ( answer ) {

          var yes = answer.trim() === 'yes';

          callback && callback( null, yes );

          if ( yes ) {
            resolve( answer );
          } else {
            reject();
          }
          tty.close();
        } );
    } );

  } );
};

var log = {
  ok: function () {
    var args = green.apply( null, arguments ).join( '' );
    nConsole.log.call( nConsole, args );
  },
  log: function () {
    var args = gray.apply( null, arguments ).join( '' );
    nConsole.log.call( nConsole, args );
  },
  error: function () {
    var args = red.apply( null, arguments ).join( '' );
    nConsole.error.call( nConsole, args );
  }
};

var spawnCmd = function ( cmd ) {
  var spawn = require( 'child_process' ).spawn;
  var args = cmd.split( ' ' );
  var command = args.shift();

  return new Promise( function ( resolve, reject ) {

    var cp = spawn( command, args, { stdio: 'inherit' } );

    cp.on( 'exit', function ( exitCode ) {
      if ( exitCode !== 0 ) {
        reject( exitCode );
      } else {
        resolve();
      }
    } );
  } );
};

var doExec = function ( cmd, cb ) {
  var _exec = require( 'child_process' ).exec;
  var _execOpts = { maxBuffer: Infinity };
  if ( cmd.match( /^git/ ) ) {
    _execOpts.cwd = opts.gitDirectory;
  }
  return new Promise( function ( resolve, reject ) {
    _exec( cmd, _execOpts, function ( err, stdout, stderr ) {
      if ( !err ) {
        resolve( stdout );
      } else {
        reject( { err: err, stderr: stderr } );
      }
      cb && cb( err, stdout, stderr );
    } );
  } );
};

var execSeq = function ( cmds ) {
  cmds = cmds || [ ];
  return cmds.reduce( function ( seq, current ) {
    return seq.then( function () {
      return doExec( current );
    } );
  }, Promise.resolve() );
};

var runTasks = function ( tasksToRun ) {
  return tasksToRun.reduce( function ( seq, current ) {
    return seq.then( function () {
      return spawnCmd( current );
    } );
  }, Promise.resolve() );
};

var trim = function trim( str ) {
  return ((str + '') || '');
};

var parsePorcelain = function ( str ) {
  var status = {
    files: []
  };

  var lines = trim( str ).split( '\n' );

  status.files = lines.reduce( function ( seq, _str ) {
    _str = trim( _str );
    if ( _str && _str.match( /\S/ ) ) {
      seq.push( _str );
      return seq;
    }
    return seq;
  }, [ ] ).filter( function ( entry ) {
    return !entry.match( /^[AMDR]\s/ );
  } );

  status.isDirty = status.files.length > 0;
  status.pureFiles = status.files.map( function ( entry ) {
    return entry.substr( 3 );
  } );
  return status;
};

var getDirtyState = function () {
  return doExec( 'git status --porcelain' ).then( function ( res ) {
    var status = parsePorcelain( res );
    return status;
  } ).catch( function ( err ) {
    console.error( 'precommit error: ', err );
  } );
};

var checkNoRebaseBranch = function () {
  var getBranch = doExec( 'git branch | grep \'*\' | sed \'s/* //\'' );

  return getBranch.then( function ( branch ) {
    return branch !== '(no branch)';
  } );
};

var confirmToProceed = function ( isDirty, onDirtyState, dirtyState ) {
  if ( isDirty && onDirtyState === 'ask' ) {
    return ttyConfirm(
      redString( '\n>> The index is not clean, the following files are not staged for commit or were modified after being staged:\n\n' ) +
        yellowString( '    - ' + dirtyState.join( '\n    - ' ) ) +
        whiteString( '\n\n>> A stash entry will be created and applied after running the tasks for precommit to avoid false positives on the `precommit` script' )
    );
  }
  return Promise.resolve();
};

var lastStashCMD = 'git rev-parse -q --verify refs/stash';
var resetHardQ = 'git reset --hard -q';

var getLastStash = function () {
  return new Promise( function ( resolve ) {
    doExec( lastStashCMD ).then( resolve, function () {
      // in case of no stash this command will exit with a code different than 0
      // We just want to make sure we can continue with the flow
      // since this failure case can be treated as just an empty response
      resolve( '' );
    } );
  } );
};

var stashChanges = function () {
  return execSeq( [ 'git stash save -q --keep-index' ] ).then( getLastStash ).catch( log.error );
};

var stashStaged = function () {
  return execSeq( [ 'git stash save -q' ] ).then( getLastStash );
};

var restoreStashedChanges = function () {
  log.log( 'restoring stashed changes' );
  return execSeq( [ resetHardQ, 'git stash pop --index -q' ] );
};

var stashUntracked = function () {
  return execSeq( [ 'git add .', 'git stash save -q' ] ).then( getLastStash );
};

var applyLastNStash = function ( n ) {
  if ( !n ) {
    n = '0';
  }
  return execSeq( [
    resetHardQ,
    'git stash apply --index -q stash@{' + n + '}'
  ] );
};

var restoreLastStash = function () {
  return execSeq( [ resetHardQ, 'git stash pop --index -q' ] );
};

var restoreUntracked = function () {
  return restoreLastStash().then( function () {
    return doExec( 'git reset HEAD -- . -q' );
  } );
};

var doWithStashIf = function ( condition ) {
  if ( condition ) {
    return new Promise( function ( resolve /*, reject */ ) {
      var p = getLastStash();

      p.then( function ( oldStashId ) {
        stashChanges().then( function ( stashChangesId ) {
          log.log( 'stash changes: ' + oldStashId );
          if ( oldStashId === stashChangesId ) {
            resolve( { success: false, msg: 'No changes to test' } );
          } else {
            stashStaged().then( function ( stashStagedId ) {
              if ( stashStagedId === stashChangesId ) {
                restoreStashedChanges().then( function () {
                  resolve( {
                    success: false, msg: 'No staged changes to test'
                  } );
                } );
              } else {
                log.log( 'stash staged: ' + stashStagedId );
                stashUntracked().then( function ( stashUntrackedId ) {
                  var sameStashAsStaged = stashUntrackedId === stashStagedId;
                  var n = sameStashAsStaged ? '0' : '1';

                  if ( !sameStashAsStaged ) {
                    log.log( 'stash untracked: ' + stashUntrackedId );
                  }

                  var restoreFn = function () {
                    log.log( 'restoring previous index state' );
                    var p1 = Promise.resolve();
                    if ( !sameStashAsStaged ) {
                      p1 = p1.then( restoreUntracked );
                    }

                    return p1.then( restoreLastStash )
                      .then( restoreLastStash );
                  };

                  applyLastNStash( n ).then( function () {
                    resolve( { success: true, restoreFn: restoreFn } );
                  } );
                } );
              }
            } );
          }
        } );
      } );
    } );
  }
  return Promise.resolve( {
    success: true,
    restoreFn: function () {
      return Promise.resolve();
    }
  } );
};

var main = function () {

  var tasks = [ ];
  var onDirtyState;

  if ( Array.isArray( precommitSection ) ) {
    tasks = precommitSection;
    onDirtyState = 'stash';
  } else {
    if ( precommitSection !== null && typeof precommitSection !== 'undefined' ) {
      tasks = precommitSection.tasks;
      onDirtyState = precommitSection.onDirtyState || 'stash';
    }
  }

  if ( tasks.length === 0 ) {
    log.ok( '>> Precommit check skipped. No tasks specified on file', opts.configFile );
    log.log( '\n>> add a section to your .json file like this one:\n------------------------------------\n{\n  "precommit": {\n    "tasks": [\n      "npm run prepush"\n    ],\n    "onDirtyState": "ask" // fail or stash\n  }\n}\n------------------------------------\n>> or this simplified one\n------------------------------------\n{\n  "precommit": ["npm run precommit" ]\n}\n------------------------------------\n* The precommit task should be provided by you. It can be any script\n\nCheck https://github.com/royriojas/precommit#install.' );
    return;
  }

  checkNoRebaseBranch().then( function ( noRebaseBranch ) {
    if ( noRebaseBranch ) {
      getDirtyState().then( function ( state ) {
        var dirtyState = state.pureFiles;
        var isDirty = state.isDirty;

        if ( isDirty ) {
          log.log( '>> files in dirty state \n    - ', dirtyState.join( '\n    - ' ) );
          if ( onDirtyState === 'fail' ) {
            log.error( '>> Precommit check failed. <<\n\n Refusing do the check on a dirty tree. There are changes that are not part of the commit.\n' );
            nodeProcess.exit( 1 );
          }
        }

        confirmToProceed( isDirty, onDirtyState, dirtyState ).then( function () {
          doWithStashIf( isDirty ).then( function ( res ) {
            if ( !res.success ) {
              log.ok( '>> ' + res.msg );
              nodeProcess.exit( 0 );
            } else {
              var p = runTasks( tasks );

              p.then( function () {
                res.restoreFn().then( function () {
                  log.ok( '>> Precommit check complete!' );
                } );
              } );

              p.catch( function ( exitCode ) {
                //restoreStash( isDirty, dirtyState ).then( function () {
                res.restoreFn().then( function () {
                  if ( exitCode ) {
                    log.error( '>> Precommit check failed. Stopping commit' );
                    nodeProcess.exit( exitCode );
                  }
                } );
              } );
            }
          } );
        } ).catch( function () {
          log.error( '>> Precommit check Canceled. Stopping commit' );
          nodeProcess.exit( 1 );
        } );
      } );
      return;
    }

    log.ok( '>> skip precommit when not in a branch' );
  } );
};

var applyToBranchFn = function ( branch ) {
  var applyToBranch = precommitSection.applyToBranch;
  if ( !applyToBranch ) {
    return true; // apply to all branches no distinction
  }
  if ( !Array.isArray( applyToBranch ) ) {
    applyToBranch = [ applyToBranch ];
  }
  return applyToBranch.filter( function ( branchName ) {
      branchName = (branchName || '').trim();
      return branchName === branch;
    } ).length > 0;
};

var ignoreBranchFn = function ( branch ) {
  var ignoreBranch = precommitSection.ignoreBranch;
  if ( !ignoreBranch ) {
    return false; // do not ignore the branch if no specified in the precommit section
  }

  if ( !Array.isArray( ignoreBranch ) ) {
    ignoreBranch = [ ignoreBranch ];
  }

  return ignoreBranch.filter( function ( branchName ) {
      branchName = (branchName || '').trim();
      return branchName === branch;
    } ).length > 0;
};

// check if can be applied to the given branch
doExec( 'git name-rev --name-only HEAD', function ( err, stdout /*, stderr*/ ) {
  if ( err ) {
    console.error( 'pre-commit error', err.message );
    nodeProcess.exit( 1 );
  }
  stdout = (stdout || '').trim();

  if ( !stdout ) {
    console.error( 'could not determine the name of the branch. Stopping' );
    nodeProcess.exit( 1 );
  }

  if ( ignoreBranchFn( stdout ) ) {
    console.log( 'ignore precommit on branch ', stdout );
    return;
  }

  if ( applyToBranchFn( stdout ) ) {
    console.log( 'applying precommit on branch ', stdout );
    main();
  }
} );

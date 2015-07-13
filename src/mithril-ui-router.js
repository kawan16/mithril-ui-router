
/* global m, mx */

var mx_factory = function( m ) {
    'use strict';

    var mx = {};

    /*
     * Validators for router function
     */
    var validators = {
        /**
         * Check whether the given parameter is a string
         * @param {String} string
         * @returns {String} value
         * @throws {TypeError} for non strings
         */
        string : function(string){
            if(typeof string !== 'string'){
                throw new TypeError('a string is expected, but ' + string + ' [' + (typeof string) + '] given');
            }
            return string;
        },

        /**
         * Check whether the given parameter is a plain object (array and functions aren't accepted)
         * @param {Object} object
         * @returns {Object} object
         * @throws {TypeError} for non object
         */
        plainObject : function(object){
            if(typeof object !== 'object' ){
                throw new TypeError('an object is expected, but ' + object + '  [' + (typeof object) + '] given');
            }
            return object;
        }
    };

    /*
     * Initial state of application
     */
    var defaultState;

    /**
     * Current state of application
     */
    var currentState;

    /**
     * Parameters of current state
     */
    var currentStateParams;

    /**
     * Current url
     */
    var currentUrl;

    /**
     * Application variable
     */
    var app;

    /**
     * Routes configuration object
     */
    var routes;

    /*
     * Define the application routes
     * @param {object} _app_             The global application variable
     * @param {string} _defaultState_    The initial state
     * @param {object} _routes_          The routes object
     */
    mx.route = function( _app_ , _defaultState_ , _routes_ ) {
        app             = validators.plainObject( _app_ );
        defaultState    = validators.string( _defaultState_ );
        routes          = validators.plainObject( _routes_ );
        $listen();
    };

    /**
     * Go to the specified state
     * @param {string} _state_   The target state
     * @param {object} _params_  The state parameters
     */
    mx.route.go = function( _state_ , _params_ ) {

        // Check parameters
        validators.string( _state_ );

        // Exit the current state
        if( currentState ) {
            var onExit = routes[ currentState ].onExit;
            if( onExit ) { onExit(); }
        }

        // Initial variables
        var splitState = _state_.split( '.' ),
            runningState = '',
            runningPlace = document,
            runningUrl = '',
            previousState = currentState;
        currentStateParams =  _params_;
        currentState = _state_;

        // Loop over composing partial states
        splitState.forEach( function( partialState ) {
            runningState = runningState ? runningState + '.' + partialState : partialState;
            var configuration = routes[ runningState ],
                module = $module(  configuration.module ),
                place = runningPlace.querySelector( configuration.place ),
                places = configuration.places,
                url = configuration.url,
                onEnter = configuration.onEnter;
            runningPlace = place || runningPlace;
            runningUrl = url? runningUrl + url : runningUrl;
            // Set up module(s)

            if( place ) {
                mx.route.$install( place , module );
                if( runningState !== _state_ ) {
                    m.redraw(true);
                }
            }
            else if( places ) {
                for( var key in places ) {
                    if ( places.hasOwnProperty( key ) ) {
                        module = $module( places[ key ] );
                        place = runningPlace.querySelector( key );
                        mx.route.$install( place , module );
                    }
                }
                if( runningState !== _state_ ) {
                    m.redraw(true);
                }
            }
            if( onEnter ) { onEnter(); }

        });

        // Update url
        for( var key in _params_ ) {
            if ( _params_.hasOwnProperty( key ) ) {
                runningUrl = runningUrl.replace( ":" + key , _params_[key] ) ;
            }
        }
        currentUrl = window.location[mx.route.mode] = runningUrl;

    };

    /**
     * @returns {String} the current state
     */
    mx.route.current = function() {
        return currentState;
    };

    /**
     * @param {string} _key_     The attribute key
     * @returns {string} the value of the specified parameter
     */
    mx.route.param = function( _key_ ) {
        validators.string( _key_ );
        currentStateParams = currentStateParams || {};
        return currentStateParams[ _key_ ];
    };

    /**
     * Default route mode
     * @type {string}
     */
    mx.route.mode = 'hash';

    /**
     * Equivalent to m.module ( used for tests only )
     * @param place The place
     * @param module The module to set up
     */
    mx.route.$install = function( place , module ) {
        var controller = module.controller ? new module.controller() : undefined;
        m.render( place , module.view( controller ) , true );
    };

    /**
     * Listen url change and go to the related state if needed
     */
    function $listen() {
        var listener = mx.route.mode === "hash" ? "onhashchange" : "onpopstate";
        window[listener] = function() {
            var url =   mx.route.mode === "hash" ?
                window.location[mx.route.mode].substr( 1 ):
                window.location[mx.route.mode];
            if( url !== currentUrl ) {
                var foundState = $findState( url );
                mx.route.go( foundState.state , foundState.parameters );
            }
        };
        window[listener]();
    }

    /**
     * Returns the state and state parameters for a given url ( otherwise returns the initial state )
     * @param url   the route url
     * @returns {string} the route state
     */
    function $findState( url ) {
        if( ! url ) {
            return {
                state: defaultState,
                parameters: {}
            };
        }
        for( var state in routes ) {
            if ( routes.hasOwnProperty( state ) ) {
                var splitState = state.split( '.' ),
                    runningState = '',
                    runningUrl = '';
                splitState.forEach( function( partialState ) {
                    runningState = runningState? runningState + '.' + partialState : partialState;
                    var configurationUrl = routes[ runningState].url;
                    runningUrl = configurationUrl ? runningUrl + configurationUrl : runningUrl;
                });
                var instanceParameters = $instantiateUrlWith( runningUrl , url );
                if( instanceParameters ) {
                    return {
                        state: runningState,
                        parameters: instanceParameters
                    };
                }
            }
        }
        return {
            state: defaultState,
            parameters: {}
        };
    }

    /**
     * Attempt to instantiate a state url ( with variables ) with the given url
     * and returns the key value state parameters that match.
     * @param fromUrla The state url
     * @param toUrl The concrete url
     */
    function $instantiateUrlWith( fromUrl , toUrl ) {
        var splitFromUrl = fromUrl.split('/'),
            splitToUrl = toUrl.split('/'),
            parameters = {};
        if( splitFromUrl.length === splitToUrl.length ) {
            // Match path variables to values
            for( var i = 0 ; i < splitFromUrl.length ; i++ ) {
                if( splitFromUrl[ i ] !== splitToUrl[ i ] ) {
                    if( splitFromUrl[ i ][ 0 ] === ':' ) {
                        parameters[ splitFromUrl[ i ].substr( 1 ) ] = splitToUrl[ i ];
                    }
                    else { return false; }
                }
            }
        }
        else { return false; }
        return parameters;
    }

    /**
     * Extract the module from the application variable extended with the given path
     * @param _path_    The application variable path
     * @returns {object}
     */
    var $module = function( _path_ ) {
        // Check parameters
        validators.string( _path_ );
        // Look for the module
        var result = app,
            splitPath = _path_.split( '.' );
        splitPath.forEach( function( pathPart ) {
            result = result[ pathPart ];
        });
        return result;
    };

    return mx;

};


if (typeof window !== "undefined" && m) window.mx = mx_factory(m);
if (typeof module !== "undefined" && module !== null && module.exports) {
    var m = require('mithril');
    module.exports = mx_factory(m);
}

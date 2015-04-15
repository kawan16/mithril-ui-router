
/* global m */

;( function( m ) {

    'use strict';

    window.mx = window.mx ||  {};

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
    var initialState;

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
     * @param {string} _initialState_    The initial state
     * @param {object} _routes_          The routes object
     */
    mx.route = function( _app_ , _initialState_ , _routes_ ) {
        app             = validators.plainObject( _app_ );
        initialState    = validators.string( _initialState_ );
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

        // Initial variables
        var splitState = _state_.split( '.' ),
            runningState = '',
            runningPlace = document,
            runningUrl = '';
        currentStateParams =  _params_;

        // Loop over composing partial states
        splitState.forEach( function( partialState ) {
            runningState = runningState ? runningState + '.' + partialState : partialState;
            var configuration = routes[ runningState ],
                module = $module(  configuration.module ),
                place = runningPlace.querySelector( '#' + configuration.place ),
                places = configuration.places,
                url = configuration.url,
                onEnter = configuration.onEnter;
            runningPlace = place || runningPlace;
            runningUrl = url? runningUrl + url : runningUrl;
            // Set up module(s)
            if( ! currentState || currentState.indexOf( runningState ) === -1 || runningState === _state_ ) {

                if( place ) {
                    mx.route.$install( place , module );
                    if( runningState !== _state_ ) {
                        m.redraw(true);
                    }
                }
                else if( places ) {
                    for( var key in places ) {
                        module = $module( places[ key ] );
                        place = runningPlace.querySelector( '#' + key );
                        mx.route.$install( place , module );
                    }
                    if( runningState !== _state_ ) {
                        m.redraw(true);
                    }
                }
                if( onEnter ) { onEnter(); }
            }
        });
        currentState = _state_;
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
        m.module( place , module );
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
                mx.route.go( $findState( url ) );
            }
        };
        window[listener]()
    }

    /**
     * Returns the state for a given url ( otherwise returns the initial state )
     * @param url   the route url
     * @returns {string} the route state
     */
    function $findState( url ) {
        for( var state in routes ) {
            var splitState = state.split( '.' ),
                runningState = '',
                runningUrl = '';
            splitState.forEach( function( partialState ) {
                runningState = runningState? runningState + '.' + partialState : partialState;
                var configurationUrl = routes[ runningState].url;
                runningUrl = configurationUrl ? runningUrl + configurationUrl : runningUrl;
            });
            if( runningUrl === url ) { return runningState; }
        }
        return initialState;
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

}) ( m );
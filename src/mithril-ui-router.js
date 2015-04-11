
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
            if(typeof object !== 'object' || object.constructor !== Object){
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
        mx.route.go( initialState );
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
            runningPlace = document;
        currentStateParams =  _params_;

        // Loop over composing partial states
        splitState.forEach( function( partialState ) {
            runningState = runningState ? runningState + '.' + partialState : partialState;
            var configuration = routes[ runningState ],
                module = $module(  configuration.module ),
                place = runningPlace.querySelector( '#' + configuration.place),
                places = configuration.places,
                onEnter = configuration.onEnter;
            runningPlace = place;

            // Set up module(s)
            if( ! currentState || currentState.indexOf( runningState ) === -1 ) {
                if( place ) { m.module( place , module ); }
                else if( places ) {
                    for( var key in places ) {
                        module = $module( places[ key ] );
                        place = runningPlace.querySelector( '#' + key );
                        m.module( place , module );
                    }
                }
                if( onEnter ) { onEnter(); }
            }
        });
        currentState = _state_;
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
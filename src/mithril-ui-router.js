
/* global m */

//namespace


;( function( m ) {
    'use strict';

    window.mx = window.mx ||  {};

    /* Private variables */
    var initialState ,
        currentState,
        currentStateParams,
        app,
        routes;

    /*
     * Define the application routes
     * @param _app_             The global application variable
     * @param _initialState_    The initial state
     * @param _routes_          The routes object
     */
    mx.route = function( _app_ , _initialState_ , _routes_ ) {
        initialState = _initialState_;
        app = _app_;
        routes = _routes_;
        mx.go( initialState );
    };

    /**
     * Go to the specified state
     * @param _state_   The target state
     * @param _params_  The state parameters
     */
    mx.go = function( _state_ , _params_ ) {
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
                places = configuration.places;
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
            }
        });
        currentState = _state_;
    };

    /**
     * Returns the value of the specified parameter
     * @param _key_     The attribute key
     * @returns {value}
     */
    mx.param = function( _key_ ) {
        currentStateParams = currentStateParams || {};
        return currentStateParams[ _key_ ];
    };

    var $module = function( _path_ ) {
        if( ! _path_ ) { return; }
        var result = app,
            splitPath = _path_.split( '.' );
        splitPath.forEach( function( pathPart ) {
            result = result[ pathPart ];
        });
        return result;
    };

}) ( m );
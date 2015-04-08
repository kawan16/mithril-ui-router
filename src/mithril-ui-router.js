
/* global m */
;( function( m ) {
    'use strict';

    //namespace
    var mx = mx ||  {};

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
        var normalizedState = $normalizeState( _state_ ),
            splitState = normalizedState.split( '.' ),
            runningState = '',
            runningPlace = document;
        currentStateParams =  _params_;
        splitState.forEach( function( partialState ) {
            runningState = runningState ? runningState + '.' + partialState : partialState;
            var configuration = routes[ runningState ],
                module = $module(  configuration.module ),
                place = runningPlace.querySelector( '#' + configuration.place );
            runningPlace = place;
            if( ! currentState || currentState.indexOf( runningState ) === -1 ) {
                m.module( place , module );
            }
        });
        currentState = normalizedState;
    };

    /**
     * Returns the value of the specified parameter
     * @param _key_     The attribute key
     * @returns {}
     */
    mx.param = function( _key_ ) {
        currentStateParams = currentStateParams || {};
        return currentStateParams[ _key_ ];
    };

    var $module = function( path ) {
        var result = app,
            splitPath = path.split( '.' );
        splitPath.forEach( function( pathPart ) {
            result = result[ pathPart ];
        });
        return result;
    };

    var $normalizeState = function( _state_ ) {
        var result = _state_;
        if( result.indexOf('*') === 0 ) {
            result = result.substring( 1 );
            result = currentState + result;
        }
        return result;
    };

}) ( m );
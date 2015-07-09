
/* global describe, it, expect */


/* Data sample */
var routeSample = {
    'A' : {
        url: '/',
        module: 'a',
        place: '#app'
    },
    'A.A1' : {
        module: 'a1',
        place: '#child'
    },
    'B' : {
        url: '/',
        module: 'b',
        place: '#app'
    }
};

var appSample = {
    a: {view: function( ) { return [ m( 'h1' , 'A') , m('#child') ]; } },
    b: { view: function( ) { return [ m( 'h1' , 'B') , m('#child') ]; } },
    a1: {view: function( ) { return [ m( 'h1' , 'A1') , m('#subchild') ]; } }
};

m.deps( mock.window );

/* Route method tests */
describe('mx.route()' , function() {

    it( 'should be a function' , function() {
        expect( typeof mx.route ).toBe( 'function' );
    });

    it( 'should accept an object as 1st parameter', function() {
        var call = function( _app_ ) { return function() { mx.route( _app_ , '' , {} ) } };
        expect( call( 'A string' ) ).toThrowError( TypeError );
        expect( call( 156 ) ).toThrowError( TypeError );
    });

    it( 'should accept an string as 2d parameter', function() {
        var call = function( _initialState_ ) { return function() { mx.route( {} , _initialState_ , {} ) } };
        expect( call( {} ) ).toThrowError( TypeError );
        expect( call( 156 ) ).toThrowError( TypeError );
    });

    it( 'should accept an object as 3d parameter', function() {
        var call = function( _routes_ ) { return function() { mx.route( {} , '' , _routes_ ) } };
        expect( call( 'A string' ) ).toThrowError( TypeError );
        expect( call( 156 ) ).toThrowError( TypeError );
    });

    it( 'should go to the given initial state' , function() {
        var initialState = "myInitialState";
        spyOn( mx.route , 'go' );
        mx.route( { no: 'matter' } , initialState , {} );
        expect( mx.route.go ).toHaveBeenCalledWith(  initialState , {} );
    });

});

/* Go method tests */
describe('mx.route.go()' , function() {


    it( 'should be a function' , function() {
        expect( typeof mx.route.go ).toBe( 'function' );
    });

    it( 'should have a string as 1st parameter' , function( ) {
        var call = function( _state_ ) { return function() { mx.route.go( _state_ ) } };
        expect( call( { a: 'object' } ) ).toThrowError( TypeError );
        expect( call( 156 ) ).toThrowError( TypeError );
    });

    it( 'should set up the state module in its related place' , function( ) {
        Document.prototype.querySelector = function( ) { return document.body };
        Element.prototype.querySelector = function( ) { return document.body };

        mx.route( appSample , 'A' , routeSample );
        spyOn(mx.route , '$install').and.callThrough();

        mx.route.go( 'B' );
        expect( mx.route.$install.calls.argsFor( 0 )[ 1 ] ).toEqual( appSample.b );
        mx.route.$install.calls.reset();

        mx.route.go( 'A.A1' );
        expect( mx.route.$install.calls.argsFor( 0 )[ 1 ] ).toEqual( appSample.a );
        expect( mx.route.$install.calls.argsFor( 1 )[ 1 ] ).toEqual( appSample.a1 );
    });

    it( 'should call the onEnter function when its state is active' , function( ) {
        routeSample['B'].onEnter = function() {};
        spyOn( routeSample['B'] , 'onEnter' ).and.callThrough();
        mx.route( appSample , 'A' , routeSample );
        mx.route.go( 'B' );
        expect( routeSample['B'].onEnter ).toHaveBeenCalled();
    });

    it( 'should call the onEnter function when its state is active' , function( ) {
        routeSample['B'].onExit = function() {};
        spyOn( routeSample['B'] , 'onExit' ).and.callThrough();
        mx.route( appSample , 'A' , routeSample );
        mx.route.go( 'B' );
        mx.route.go( 'A' );
        expect( routeSample['B'].onExit ).toHaveBeenCalled();
    });

});

/* Current method tests */
describe('mx.route.current()' , function() {

    it( 'should be a function' , function() {
        expect( typeof mx.route.current ).toBe( 'function' );
    });

    it( 'should return the current state string' , function() {
        var currentState = 'A';
        mx.route( appSample , currentState , routeSample );
        mx.route.go( currentState );
        expect( mx.route.current( ) ).toEqual( 'A' );

        currentState = 'A.A1';
        mx.route.go( currentState );
        expect( mx.route.current( )).toEqual( currentState );

        currentState = 'B';
        mx.route.go( currentState );
        expect( mx.route.current( )).toEqual( currentState );
    });

});

/* Param method tests */
describe('mx.route.param()' , function() {

    it( 'should be a function' , function() {
        expect( typeof mx.route.param ).toBe( 'function' );
    });

    it( 'should return the value of the given state parameter' , function() {
        var stateParameters = { some: 'state parameter' , and: 122 };
        mx.route( appSample , 'A' , routeSample );
        mx.route.go( 'B' , stateParameters );
        expect( mx.route.param( 'some') ).toEqual( 'state parameter' );
        expect( mx.route.param( 'and' ) ).toEqual( 122 );
    });

});
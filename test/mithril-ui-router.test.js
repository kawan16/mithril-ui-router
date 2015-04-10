
/* global describe, it, expect */

/* Route method */
describe('mx.route()' , function() {

    it( 'should be a function' , function() {
        expect( typeof mx.route ).toBe( 'function' );
    });

    it( 'should accept an object as 1st parameter', function() {
        var call = function( _app_ ) { return function() { mx.route( _app_ , '' , '') } };
        expect( call( 'A string' ) ).toThrowError( TypeError );
        expect( call( 156 ) ).toThrowError( TypeError );
    });

    it( 'should accept an string as 2d parameter', function() {
        var call = function( _initialState_ ) { return function() { mx.route( {} , _initialState_ , '' ) } };
        expect( call( {} ) ).toThrowError( TypeError );
        expect( call( 156 ) ).toThrowError( TypeError );
    });

    it( 'should accept an object as 3d parameter', function() {
        var call = function( _routes_ ) { return function() { mx.route( {} , '' , _routes_ ) } };
        expect( call( 'A string' ) ).toThrowError( TypeError );
        expect( call( 156 ) ).toThrowError( TypeError );
    });

    it( 'should go to the initial state' , function() {
        var initialState = "myInitialState";
        spyOn( mx.route , 'go' );
        mx.route( { no: 'matter' } , initialState , 'No matter' );
        expect( mx.route.go ).toHaveBeenCalledWith( initialState );
    });

});

/* Go method */
describe('mx.route.go()' , function() {

    it( 'should be a function' , function() {
        expect( typeof mx.route.go ).toBe( 'function' );
    });

    it( 'should have a string as 1st parameter' , function( ) {
        var call = function( _state_ ) { return function() { mx.route.go( _state_ ) } };
        expect( call( { a: 'object' } ) ).toThrowError( TypeError );
        expect( call( 156 ) ).toThrowError( TypeError );
    });

});

/* Current method */
describe('mx.route.current()' , function() {

    it( 'should be a function' , function() {
        expect( typeof mx.route.current ).toBe( 'function' );
    });

    it( 'should return the current state string' , function() {

    });

});

/* Param method */
describe('mx.route.param()' , function() {

    it( 'should be a function' , function() {
        expect( typeof mx.route.param ).toBe( 'function' );
    });


});

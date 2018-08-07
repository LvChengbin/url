import URL from '../src/url';
import URLSearchParams from '../src/url-search-params';

describe( 'URL', () => {

    // remove the native URL API for testing

    describe( 'href', () => {
        const base = 'http://192.168.0.1:3942/a/b/c/d?x=1&y=2#z';
        const host = location.protocol + '//' + location.host;
        const href = location.href;

        it( 'Invalid URL', () => {
            expect( () => { new URL( 'x' ) } ).toThrowError( TypeError );
            expect( () => { new URL( ':' ) } ).toThrowError( TypeError );
            expect( () => { new URL( ':x' ) } ).toThrowError( TypeError );
            expect( () => { new URL( '~~:x' ) } ).toThrowError( TypeError );
        } );

        it( 'Invalid base URL', () => {
            expect( () => { new URL( 'x', 'x' ) } ).toThrowError( TypeError );
            expect( () => { new URL( 'x', 'httpp://x' ) } ).toThrowError( TypeError );
            expect( () => { new URL( 'x', 'http://333.0.0.0' ) } ).toThrowError( TypeError );
        } );

        it( 'Create with URL instance', () => {
            const u = new URL( 'http://google.com' );
            const u2 = new URL( u );
            expect( u2.href ).toEqual( 'http://google.com/' );
            expect( u === u2 ).toBeFalsy();
            expect( new URL( '/abc', new URL( 'http://x.com' ) ).href ).toEqual( 'http://x.com/abc' );
        } );

        it( 'href', () => {
            expect( new URL( '/abc', href ).href ).toEqual( host + '/abc' );
            expect( new URL( 'abc', href ).href ).toEqual( host + '/abc' );
            expect( new URL( 'a/b/c', href ).href ).toEqual( host + '/a/b/c' );
            expect( new URL( 'a////b/c', href ).href ).toEqual( host + '/a////b/c' );
            expect( new URL( 'http://www.a.b.c.com' ).href ).toEqual( 'http://www.a.b.c.com/' );
            expect( new URL( './a', href ).href ).toEqual( host + '/a' );
            expect( new URL( '../../a', href ).href ).toEqual( host + '/a' );
            expect( new URL( '/abc', base ).href ).toEqual( 'http://192.168.0.1:3942/abc' );
            expect( new URL( '//abc', 'ftp://x' ).href ).toEqual( 'ftp://abc/' );
            expect( new URL( base ).href ).toEqual( base );
            expect( new URL( base, href ).href ).toEqual( new URL( base ).href );
            expect( new URL( 'x#33.33-22:', base ).href ).toEqual( 'http://192.168.0.1:3942/a/b/c/x#33.33-22:' );
            expect( new URL( 'x33.33-22:', base ).href ).toEqual( 'x33.33-22:' );
            expect( new URL( '../e', base ).href ).toEqual( 'http://192.168.0.1:3942/a/b/e' );
            expect( new URL( '../../e', base ).href ).toEqual( 'http://192.168.0.1:3942/a/e' );
            expect( new URL( './f', base ).href ).toEqual( 'http://192.168.0.1:3942/a/b/c/f' );
            expect( [ 'http://xn--6qq79v.xn--fiqs8s/', 'http://你好.中国/' ].indexOf( new URL( 'http://你好.中国' ).href ) > -1 ).toBeTruthy();
            expect( new URL( 'http://www.google.com', 'http://www.youtube.com' ).href ).toEqual( 'http://www.google.com/' );
            expect( new URL( 'index.js', 'http://localhost/packages/test' ).toString() ).toEqual( 'http://localhost/packages/index.js' );

            expect( new URL( 'index.js', 'http://localhost/packages/test/' ).toString() ).toEqual( 'http://localhost/packages/test/index.js' );
        } );

        it( 'protocol', () => {
            expect( new URL( base ).protocol ).toEqual( 'http:' );
        } );

        it( 'origin', () => {
            expect( new URL( base ).origin ).toEqual( 'http://192.168.0.1:3942' );
        } );

        it( 'host', () => {
            expect( new URL( base ).host ).toEqual( '192.168.0.1:3942' );
        } );

        it( 'hostname', () => {
            expect( new URL( base ).hostname ).toEqual( '192.168.0.1' );
        } );

        it( 'pathname', () => {
            expect( new URL( base ).pathname ).toEqual( '/a/b/c/d' );
        } );

        it( 'port', () => {
            expect( new URL( base ).port ).toEqual( '3942' );
        } );

        it( 'search', () => {
            expect( new URL( base ).search ).toEqual( '?x=1&y=2' );
        } );

        it( 'username', () => {
            expect( new URL( 'http://u:p@x.x:1000' ).username ).toEqual( 'u' );
        } );

        it( 'password', () => {
            expect( new URL( 'http://u:p@x.x:1000' ).password ).toEqual( 'p' );
        } );

        it( 'hash', () => {
            expect( new URL( base ).hash ).toEqual( '#z' );
        } );

        it( 'searchParams', () => {
            expect( new URL( base ).searchParams instanceof URLSearchParams ).toBeTruthy();
            expect( new URL( base ).searchParams.get( 'x' ) ).toEqual( '1' );
        } );
    } );

} );

describe( 'URLSearchParams', () => {

    it( 'toString', () => {
        expect( new URLSearchParams( { x : 1 } ).toString() ).toEqual( 'x=1' );
        expect( new URLSearchParams( { '&' : '=' } ).toString() ).toEqual( '%26=%3D' );
        expect( new URLSearchParams( { x : 1, y : 2 } ).toString() ).toEqual( 'x=1&y=2' );
        expect( new URLSearchParams( { x : 1, y : 2 } ).toString() ).toEqual( 'x=1&y=2' );
        expect( new URLSearchParams( 'x=1&y=2&x=2' ).toString() ).toEqual( 'x=1&y=2&x=2' );
    } );

    it( 'append', () => {
        const searchParams = new URLSearchParams();
        searchParams.append( 'x', 1 );
        expect( searchParams.toString() ).toEqual( 'x=1' );
        searchParams.append( 'y', 1 );
        expect( searchParams.toString() ).toEqual( 'x=1&y=1' );
        searchParams.append( 'x', 1 );
        expect( searchParams.toString() ).toEqual( 'x=1&y=1&x=1' );
        searchParams.append( 'x', 2 );
        expect( searchParams.toString() ).toEqual( 'x=1&y=1&x=1&x=2' );
    } );

    it( 'delete', () => {
        const searchParams = new URLSearchParams( { x : 1, y : 1, z : 2 } );
        searchParams.append( 'x', 2 );
        searchParams.delete( 'y' );
        expect( searchParams.toString() ).toEqual( 'x=1&z=2&x=2' );
        searchParams.delete( 'x' );
        expect( searchParams.toString() ).toEqual( 'z=2' );
    } );

    it( 'entries', () => {
        const searchParams = new URLSearchParams( {
            x : 1,
            y : 2,
            z : 3
        } );

        let i = 0;

        const steps = [ 
            [ 'x', '1' ],
            [ 'y', '2' ],
            [ 'z', '3' ]
        ];

        for( let param of searchParams.entries() ) {
            expect( param ).toEqual( steps[ i ] );
            i++;
        }

        expect( i ).toEqual( 3 );
    } );

    it( 'get', () => {
        const searchParams = new URLSearchParams( {
            x : 1,
            y : 2,
            z : 3
        } );

        expect( searchParams.get( 'x' ) ).toEqual( '1' );
        searchParams.append( 'x', 2 );
        expect( searchParams.get( 'x' ) ).toEqual( '1' );
        searchParams.append( 'n', 2 );
        expect( searchParams.get( 'n' ) ).toEqual( '2' );
        expect( searchParams.get( 'A' ) ).toEqual( null );
    } );

    it( 'getAll', () => {
        const searchParams = new URLSearchParams( {
            x : 1,
            y : 2,
            z : 3
        } );
        expect( searchParams.getAll( 'x' ) ).toEqual( [ '1' ] );
        searchParams.append( 'x', 2 );
        expect( searchParams.getAll( 'x' ) ).toEqual( [ '1', '2' ] );
        searchParams.delete( 'x' );
        expect( searchParams.getAll( 'x' ) ).toEqual( [] );
    } );

    it( 'has', () => {
        const searchParams = new URLSearchParams( {
            x : 1,
            y : 2,
            z : 3
        } );
        expect( searchParams.has( 'x' ) ).toEqual( true );
        expect( searchParams.has( 'n' ) ).toEqual( false );
    } );

    it( 'keys', () => {
        const searchParams = new URLSearchParams( {
            x : 1,
            y : 2,
            z : 3
        } );

        let i = 0;

        const list = [ 'x', 'y', 'z' ];
        
        for( let key of searchParams.keys() ) {
            expect( key ).toEqual( list[ i ] );
            i++;
        }
        
        expect( i ).toEqual( 3 );
    } );

    it( 'set', () => {
        const searchParams = new URLSearchParams( { x : 1 } );
        searchParams.set( 'x', 2 );
        expect( searchParams.get( 'x' ) ).toEqual( '2' );
        searchParams.append( 'x', 3 );
        searchParams.set( 'x', 4 );
        expect( searchParams.get( 'x' ) ).toEqual( '4' );
        expect( searchParams.getAll( 'x' ) ).toEqual( [ '4' ] );

        searchParams.set( 'y', 100 );
        expect( searchParams.get( 'y' ) ).toEqual( '100' );
        expect( searchParams.getAll( 'y' ) ).toEqual( [ '100' ] );
        expect( searchParams.toString( 'y' ) ).toEqual( 'x=4&y=100' );
    } );

    it( 'sort', () => {
        const searchParams = new URLSearchParams( {
            z : 1,
            y : 2,
            x : 3
        } );
        searchParams.sort();
        expect( searchParams.toString() ).toEqual( 'x=3&y=2&z=1' );
        searchParams.append( 'x', 0 );
        searchParams.sort();
        expect( searchParams.toString() ).toEqual( 'x=3&x=0&y=2&z=1' );
    } );

    it( 'values', () => {
        const searchParams = new URLSearchParams( {
            z : 1,
            y : 2,
            x : 3
        } );

        searchParams.append( 'z', 0 );

        let i = 0;

        const list = [ '1', '2', '3', '0' ];

        for( let value of searchParams.values() ) {
            expect( value ).toEqual( list[ i ] );
            i++;
        }
        expect( i ).toEqual( 4 );
    } );

    it( 'to create with another URLSearchParams instance', () => {
        const u = new URLSearchParams( { x : 1, y : 2 } );
        const u2 = new URLSearchParams( u );
        expect( u2.toString() ).toEqual( 'x=1&y=2' );
    } );
} );

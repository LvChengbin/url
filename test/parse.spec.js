import parse from '../src/parse';

describe( 'url/parse', () => {

    it( 'http', () => {
        expect( parse( 'http://a.b' ) ).toEqual( {
            href : 'http://a.b/',
            protocol : 'http:',
            origin : 'http://a.b',
            username : '',
            password : '',
            hostname : 'a.b',
            host : 'a.b',
            port : '',
            pathname : '/',
            search : '',
            hash : '',
            hier : '//a.b'
        } );
    } );

    it( 'https', () => {
        expect( parse( 'https://a.b' ) ).toEqual( {
            href : 'https://a.b/',
            protocol : 'https:',
            origin : 'https://a.b',
            username : '',
            password : '',
            hostname : 'a.b',
            host : 'a.b',
            port : '',
            pathname : '/',
            search : '',
            hash : '',
            hier : '//a.b'
        } );
    } );

    it( 'ftp', () => {
        expect( parse( 'ftp://a.b' ) ).toEqual( {
            href : 'ftp://a.b/',
            protocol : 'ftp:',
            origin : 'ftp://a.b',
            username : '',
            password : '',
            hostname : 'a.b',
            host : 'a.b',
            port : '',
            pathname : '/',
            search : '',
            hash : '',
            hier : '//a.b'
        } );
    } );

    it( 'username & password', () => {
        expect( parse( 'https://u:p@a.b:9000?x=1&y=2#xx' ) ).toEqual( {
            href : 'https://u:p@a.b:9000/?x=1&y=2#xx',
            protocol : 'https:',
            origin : 'https://a.b:9000',
            username : 'u',
            password : 'p',
            hostname : 'a.b',
            host : 'a.b:9000',
            port : '9000',
            pathname : '/',
            search : '?x=1&y=2',
            hash : '#xx',
            hier : '//u:p@a.b:9000'
        } );
    } );

    it( 'hash', () => {
        expect( parse( 'http://jnn.org#hash' ) ).toEqual( {
            href : 'http://jnn.org/#hash',
            protocol : 'http:',
            origin : 'http://jnn.org',
            username : '',
            password : '',
            hostname : 'jnn.org',
            host : 'jnn.org',
            port : '',
            pathname : '/',
            search : '',
            hash : '#hash',
            hier : '//jnn.org'
        } );
    } );

    it( 'localhost', () => {
        expect( parse( 'http://localhost' ) ).toEqual( {
            href : 'http://localhost/',
            protocol : 'http:',
            origin : 'http://localhost',
            username : '',
            password : '',
            hostname : 'localhost',
            host : 'localhost',
            port : '',
            pathname : '/',
            search : '',
            hash : '',
            hier : '//localhost'
        } );
    } );

    it( 'port', () => {
        expect( parse( 'ftp://u:p@x.x:1000' ) ).toEqual( {
            href : 'ftp://u:p@x.x:1000/',
            protocol : 'ftp:',
            origin : 'ftp://x.x:1000',
            username : 'u',
            password : 'p',
            hostname : 'x.x',
            host : 'x.x:1000',
            port : '1000',
            pathname : '/',
            search : '',
            hash : '',
            hier : '//u:p@x.x:1000'
        } );
    } );

    it( 'search & hash', () => {
        expect( parse( 'httpc://a.b/a/b/c?x=1&y=2#xx' ) ).toEqual( {
            href : 'httpc://a.b/a/b/c?x=1&y=2#xx',
            protocol : 'httpc:',
            origin : null,
            username : '',
            password : '',
            hostname : '',
            host : '',
            port : '',
            pathname : '//a.b/a/b/c',
            search : '?x=1&y=2',
            hash : '#xx',
            hier : ''
        } );
    } );

    it( 'IPv4', () => {
        expect( parse( 'http://1.1.1.1:9999' ) ).toEqual( {
            href : 'http://1.1.1.1:9999/',
            protocol : 'http:',
            origin : 'http://1.1.1.1:9999',
            username : '',
            password : '',
            hostname : '1.1.1.1',
            host : '1.1.1.1:9999',
            port : '9999',
            pathname : '/',
            search : '',
            hash : '',
            hier : '//1.1.1.1:9999'
        } );
    } );

    it( 'Incompleted IPv4', () => {
        expect( parse( 'http://1:9999' ) ).toEqual( {
            href : 'http://0.0.0.1:9999/',
            protocol : 'http:',
            origin : 'http://0.0.0.1:9999',
            username : '',
            password : '',
            hostname : '0.0.0.1',
            host : '0.0.0.1:9999',
            port : '9999',
            pathname : '/',
            search : '',
            hash : '',
            hier : '//0.0.0.1:9999'
        } );
    } );

    it( 'Integer IPv4', () => {
        expect( parse( 'http://300:9999' ) ).toEqual( {
            href : 'http://0.0.1.44:9999/',
            protocol : 'http:',
            origin : 'http://0.0.1.44:9999',
            username : '',
            password : '',
            hostname : '0.0.1.44',
            host : '0.0.1.44:9999',
            port : '9999',
            pathname : '/',
            search : '',
            hash : '',
            hier : '//0.0.1.44:9999'
        } );
    } );

    it( 'IPv6', () => {
        expect( parse( 'http://[::80]:9999' ) ).toEqual( {
            href : 'http://[::80]:9999/',
            protocol : 'http:',
            origin : 'http://[::80]:9999',
            username : '',
            password : '',
            hostname : '[::80]',
            host : '[::80]:9999',
            port : '9999',
            pathname : '/',
            search : '',
            hash : '',
            hier : '//[::80]:9999'
        } );
    } );

    it( 'pathname', () => {
        expect( parse( 'http://www.google.com/path/to/be/evil' ) ).toEqual( {
            href : 'http://www.google.com/path/to/be/evil',
            protocol : 'http:',
            origin : 'http://www.google.com',
            username : '',
            password : '',
            hostname : 'www.google.com',
            host : 'www.google.com',
            port : '',
            pathname : '/path/to/be/evil',
            search : '',
            hash : '',
            hier : '//www.google.com'
        } );
    } );
    
    it( 'parse false', () => {
        expect( parse( '://a.b?x=1&y=2#xx' ) ).toBeFalsy();
        expect( parse( 'www.xx.com' ) ).toBeFalsy();
        expect( parse( 'http://333.333.333.333' ) ).toBeFalsy();
        expect( parse( 'http://www.xx.com:23543535' ) ).toBeFalsy();
    } );
} );

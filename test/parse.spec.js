import parse from '../src/parse';

describe( 'url/parse', () => {

    it( 'http', () => {
        expect( parse( 'http://a.b' ) ).toEqual( {
            protocol : 'http:',
            origin : 'http://a.b',
            username : '',
            password : '',
            hostname : 'a.b',
            port : '',
            pathname : '/',
            search : '',
            hash : ''
        } );
    } );

    it( 'https', () => {
        expect( parse( 'https://a.b' ) ).toEqual( {
            protocol : 'https:',
            origin : 'https://a.b',
            username : '',
            password : '',
            hostname : 'a.b',
            port : '',
            pathname : '/',
            search : '',
            hash : ''
        } );
    } );

    it( 'ftp', () => {
        expect( parse( 'ftp://a.b' ) ).toEqual( {
            protocol : 'ftp:',
            origin : 'ftp://a.b',
            username : '',
            password : '',
            hostname : 'a.b',
            port : '',
            pathname : '/',
            search : '',
            hash : ''
        } );
    } );

    it( 'username & password', () => {
        expect( parse( 'https://u:p@a.b:9000?x=1&y=2#xx' ) ).toEqual( {
            protocol : 'https:',
            origin : 'https://a.b:9000',
            username : 'u',
            password : 'p',
            hostname : 'a.b',
            port : '9000',
            pathname : '/',
            search : '?x=1&y=2',
            hash : '#xx',
        } );
    } );

    it( 'hash', () => {
        expect( parse( 'http://jnn.org#hash' ) ).toEqual( {
            protocol : 'http:',
            origin : 'http://jnn.org',
            username : '',
            password : '',
            hostname : 'jnn.org',
            port : '',
            pathname : '/',
            search : '',
            hash : '#hash'
        } );
    } );

    it( 'localhost', () => {
        expect( parse( 'http://localhost' ) ).toEqual( {
            protocol : 'http:',
            origin : 'http://localhost',
            username : '',
            password : '',
            hostname : 'localhost',
            port : '',
            pathname : '/',
            search : '',
            hash : ''
        } );
    } );

    it( 'port', () => {
        expect( parse( 'ftp://u:p@x.x:1000' ) ).toEqual( {
            protocol : 'ftp:',
            origin : 'ftp://x.x:1000',
            username : 'u',
            password : 'p',
            hostname : 'x.x',
            port : '1000',
            pathname : '/',
            search : '',
            hash : ''
        } );
    } );

    it( 'search & hash', () => {
        expect( parse( 'httpc://a.b/a/b/c?x=1&y=2#xx' ) ).toEqual( {
            protocol : 'httpc:',
            origin : null,
            username : '',
            password : '',
            hostname : '',
            port : '',
            pathname : '//a.b/a/b/c',
            search : '?x=1&y=2',
            hash : '#xx'
        } );
    } );

    it( 'IPv4', () => {
        expect( parse( 'http://1.1.1.1:9999' ) ).toEqual( {
            protocol : 'http:',
            origin : 'http://1.1.1.1:9999',
            username : '',
            password : '',
            hostname : '1.1.1.1',
            port : '9999',
            pathname : '/',
            search : '',
            hash : ''
        } );
    } );

    it( 'Incompleted IPv4', () => {
        expect( parse( 'http://1:9999' ) ).toEqual( {
            protocol : 'http:',
            origin : 'http://0.0.0.1:9999',
            username : '',
            password : '',
            hostname : '0.0.0.1',
            port : '9999',
            pathname : '/',
            search : '',
            hash : ''
        } );
    } );

    it( 'Integer IPv4', () => {
        expect( parse( 'http://300:9999' ) ).toEqual( {
            protocol : 'http:',
            origin : 'http://0.0.1.44:9999',
            username : '',
            password : '',
            hostname : '0.0.1.44',
            port : '9999',
            pathname : '/',
            search : '',
            hash : ''
        } );
    } );

    it( 'IPv6', () => {
        expect( parse( 'http://[::80]:9999' ) ).toEqual( {
            protocol : 'http:',
            origin : 'http://[::80]:9999',
            username : '',
            password : '',
            hostname : '[::80]',
            port : '9999',
            pathname : '/',
            search : '',
            hash : ''
        } );
    } );

    it( 'pathname', () => {
        expect( parse( 'http://www.google.com/path/to/be/evil' ) ).toEqual( {
            protocol : 'http:',
            origin : 'http://www.google.com',
            username : '',
            password : '',
            hostname : 'www.google.com',
            port : '',
            pathname : '/path/to/be/evil',
            search : '',
            hash : ''
        } );
    } );
    
    it( 'parse false', () => {
        expect( parse( '://a.b?x=1&y=2#xx' ) ).toBeFalsy();
        expect( parse( 'www.xx.com' ) ).toBeFalsy();
        expect( parse( 'http://333.333.333.333' ) ).toBeFalsy();
        expect( parse( 'http://www.xx.com:23543535' ) ).toBeFalsy();
    } );
} );

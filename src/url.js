import parse from './parse';
import resolve from './resolve';
import URLSearchParams from './search-params';

const validBaseProtocols = {
    'http:' : true,
    'https:' : true,
    'file:' : true,
    'ftp:' : true,
    'gopher' : true
};

const attrs = [
    'href', 'origin',
    'host', 'hash', 'hostname',  'pathname', 'port', 'protocol', 'search',
    'username', 'password', 'searchParams'
];

export default class URL {
    constructor( url, base ) {
        if( URL.prototype.isPrototypeOf( url ) ) {
            return new URL( url.href );
        }

        if( URL.prototype.isPrototypeOf( base ) ) {
            return new URL( url, base.href );
        }

        url = String( url );

        if( base !== undefined ) {
            const parsed = parse( base );
            if( !parsed || !validBaseProtocols[ parsed.protocol ] ) {
                throw new TypeError( 'Failed to construct "URL": Invalid base URL' );
            }
            if( parse( url ) ) base = null;
        } else {
            if( !parse( url ) ) {
                throw new TypeError( 'Failed to construct "URL": Invalid URL' );
            }
        }

        if( base ) {
            url = resolve( base, url );
        }

        const parsed = parse( url );

        for( const item of attrs ) {
            this[ item ] = parsed[ item ];
        }

        this.searchParams = new URLSearchParams( this.search ); 
    }
    toString() {
        return this.href;
    }
    toJSON() {
        return this.href;
    }
}

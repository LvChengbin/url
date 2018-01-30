import isUrl from '@lvchengbin/is/src/url';
import URLSearchParams from './url-search-params';

const attrs = [
    'href', 'origin',
    'host', 'hash', 'hostname',  'pathname', 'port', 'protocol', 'search',
    'username', 'password', 'searchParams'
];

export default class URL {
    constructor( path, base ) {
        if( window.URL ) {
            let url;
            if( typeof base === 'undefined' ) {
                url = new window.URL( path );
            } else {
                url = new window.URL( path, base );
            }
            if( !( 'searchParams' in url ) ) {
                url.searchParams = new URLSearchParams( url.search ); 
            }
            return url;
        } else {

            if( URL.prototype.isPrototypeOf( path ) ) {
                return new URL( path.href );
            }

            if( URL.prototype.isPrototypeOf( base ) ) {
                return new URL( path, base.href );
            }

            path = String( path );

            if( base !== undefined ) {
                if( !isUrl( base ) ) {
                    throw new TypeError( 'Failed to construct "URL": Invalid base URL' );
                }
                if( /^[a-zA-Z][0-9a-zA-Z.-]*:/.test( path ) ) {
                    base = null;
                }
            } else {
                if( !/^[a-zA-Z][0-9a-zA-Z.-]*:/.test( path ) ) {
                    throw new TypeError( 'Failed to construct "URL": Invalid URL' );
                }
            }

            if( base ) {
                base = new URL( base );
                if( path.charAt( 0 ) === '/' && path.charAt( 1 ) === '/' ) {
                    path = base.protocol + path;
                } else if( path.charAt( 0 ) === '/' ) {
                    path = base.origin + path;
                } else {
                    path = base.origin + base.pathname.replace( /\/[^/]+\/?$/, '' ) + '/' + path;
                }
            }

            const dotdot = /([^/])\/[^/]+\/\.\.\//;
            const dot = /\/\.\//g;

            path = path.replace( dot, '/' );

            while( path.match( dotdot ) ) {
                path = path.replace( dotdot, '$1/' );
            }

            const node = document.createElement( 'a' );
            node.href = path;

            for( const attr of attrs ) {
                this[ attr ] = attr in node ? node[ attr ] : '';
            }
            this.searchParams = new URLSearchParams( this.search ); 
        }
    }
}

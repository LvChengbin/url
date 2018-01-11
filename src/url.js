import URLSearchParams from './url-search-params';

const attrs = [
    'href', 'origin',
    'host', 'hash', 'hostname',  'pathname', 'port', 'protocol', 'search',
    'username', 'password', 'searchParams'
];

// For validating URL with allowing the private and local networks.
function valid( url ) {
    if ( typeof url !== 'string' ) return false;
    if( !/^(https?|ftp):\/\//i.test( url ) ) return false;
    const a = document.createElement( 'a' );
    a.href = url;
    return /^(https?|ftp):/i.test( a.protocol );
}

/**
 * Most of browsers, we need to support, support URL API except IE 9~11.
 */

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

            path = String( path );

            if( base !== undefined ) {
                if( !valid( base ) ) {
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
            this.searchParams = new URLSearchParams( node.search ); 
        }
    }
}

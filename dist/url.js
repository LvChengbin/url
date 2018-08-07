(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.JURL = {})));
}(this, (function (exports) { 'use strict';

    var isString = str => typeof str === 'string' || str instanceof String;

    var isNumber = ( n, strict = false ) => {
        if( ({}).toString.call( n ).toLowerCase() === '[object number]' ) {
            return true;
        }
        if( strict ) return false;
        return !isNaN( parseFloat( n ) ) && isFinite( n )  && !/\.$/.test( n );
    };

    var isInteger = ( n, strict = false ) => {

        if( isNumber( n, true ) ) return n % 1 === 0;

        if( strict ) return false;

        if( isString( n ) ) {
            if( n === '-0' ) return true;
            return n.indexOf( '.' ) < 0 && String( parseInt( n ) ) === n;
        }

        return false;
    }

    var isIPv4 = ip => {
        if( !isString( ip ) ) return false;
        const pieces = ip.split( '.' );
        if( pieces.length !== 4 ) return false;

        for( const i of pieces ) {
            if( !isInteger( i ) ) return false;
            if( i < 0 || i > 255 ) return false;
        }
        return true;
    };

    /**
     * <user>:<password> can only be supported with FTP scheme on IE9/10/11
     */

    var isUrl = url => {
        if( !isString( url ) ) return false;

        if( !/^(https?|ftp):\/\//i.test( url ) ) return false;
        const a = document.createElement( 'a' );
        a.href = url;

        /**
         * In IE, sometimes a.protocol would be an unknown type
         * Getting a.protocol will throw Error: Invalid argument in IE
         */
        try {
            if( !isString( a.protocol ) ) return false;
        } catch( e ) {
            return false;
        }

        if( !/^(https?|ftp):/i.test( a.protocol ) ) return false;

        /**
         * In IE, invalid IP address could be a valid hostname
         */
        if( /^(\d+\.){3}\d+$/.test( a.hostname ) && !isIPv4( a.hostname ) ) return false;

        return true;
    };

    const decode = str => decodeURIComponent( String( str ).replace( /\+/g, ' ' ) );

    class URLSearchParams {
        constructor( init ) {
            this.dict = [];

            if( !init ) return;

            if( URLSearchParams.prototype.isPrototypeOf( init ) ) {
                return new URLSearchParams( init.toString() );
            }

            if( Array.isArray( init ) ) {
                throw new TypeError( 'Failed to construct "URLSearchParams": The provided value cannot be converted to a sequence.' );
            }

            if( typeof init === 'string' ) {
                if( init.charAt(0) === '?' ) {
                    init = init.slice( 1 );
                }
                const pairs = init.split( /&+/ );
                for( const item of pairs ) {
                    const index = item.indexOf( '=' );
                    this.append(
                        index > -1 ? item.slice( 0, index ) : item,
                        index > -1 ? item.slice( index + 1 ) : ''
                    );
                }
                return;
            }

            for( let attr in init ) {
                this.append( attr, init[ attr ] );
            }
        }
        append( name, value ) {
            this.dict.push( [ decode( name ), decode( value ) ] );
        }
        delete( name ) {
            const dict = this.dict;
            for( let i = 0, l = dict.length; i < l; i += 1 ) {
                if( dict[ i ][ 0 ] == name ) {
                    dict.splice( i, 1 );
                    i--; l--;
                }
            }
        }
        get( name ) {
            for( const item of this.dict ) {
                if( item[ 0 ] == name ) {
                    return item[ 1 ];
                }
            }
            return null;
        }
        getAll( name ) {
            const res = [];
            for( const item of this.dict ) {
                if( item[ 0 ] == name ) {
                    res.push( item[ 1 ] );
                }
            }
            return res;
        }
        has( name ) {
            for( const item of this.dict ) {
                if( item[ 0 ] == name ) {
                    return true;
                }
            }
            return false;
        }
        set( name, value ) {
            let set = false;
            for( let i = 0, l = this.dict.length; i < l; i += 1 ) {
                const item  = this.dict[ i ];
                if( item[ 0 ] == name ) {
                    if( set ) {
                        this.dict.splice( i, 1 );
                        i--; l--;
                    } else {
                        item[ 1 ] = String( value );
                        set = true;
                    }
                }
            }
            if( !set ) {
                this.dict.push( [ name, String( value ) ] );
            }
        }
        sort() {
            this.dict.sort( ( a, b ) => {
                const nameA = a[ 0 ].toLowerCase();
                const nameB = b[ 0 ].toLowerCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            } );
        }

        entries() {

            const dict = [];

            for( let item of this.dict ) {
                dict.push( [ item[ 0 ], item[ 1 ] ] );
            }
            
            return dict;
        }

        keys() {
            const keys = [];
            for( let item of this.dict ) {
               keys.push( item[ 0 ] );
            }

            return keys;
        }

        values() {
            const values = [];
            for( let item of this.dict ) {
               values.push( item[ 1 ] );
            }

            return values;
        }

        toString() {
            const pairs = [];
            for( const item of this.dict ) {
                pairs.push( encodeURIComponent( item[ 0 ] ) + '=' + encodeURIComponent( item[ 1 ] ) );
            }
            return pairs.join( '&' );
        }
    }

    const attrs = [
        'href', 'origin',
        'host', 'hash', 'hostname',  'pathname', 'port', 'protocol', 'search',
        'username', 'password', 'searchParams'
    ];

    class URL {
        constructor( path, base ) {
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
                    const pathname = base.pathname;
                    
                    if( pathname.charAt( pathname.length - 1 ) === '/' ) {
                        path = base.origin + pathname + path;
                    } else {
                        path = base.origin + pathname.replace( /\/[^/]+\/?$/, '' ) + '/' + path;
                    }
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

            /**
             * set origin for IE
             */
            if( !this.origin ) {
                this.origin = this.protocol + '//' + this.host;
            }

            /**
             * add a slash before the path for IE
             */
            if( this.pathname && this.pathname.charAt( 0 ) !== '/' ) {
                this.pathname = '/' + this.pathname;
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

    exports.URL = URL;
    exports.URLSearchParams = URLSearchParams;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

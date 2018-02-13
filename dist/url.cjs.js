'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var isString = str => typeof str === 'string' || str instanceof String;

var isUrl = url => {
    if( !isString( url ) ) return false;
    if( !/^(https?|ftp):\/\//i.test( url ) ) return false;
    const a = document.createElement( 'a' );
    a.href = url;
    return /^(https?|ftp):/i.test( a.protocol );
};

function supportIterator() {
    try {
        return !!Symbol.iterator;
    } catch( e ) {
        return false;
    }
}

const decode = str => decodeURIComponent( String( str ).replace( /\+/g, ' ' ) );

class URLSearchParams {
    constructor( init ) {
        if( window.URLSearchParams ) {
            return new window.URLSearchParams( init );
        } else {
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

        return !supportIterator() ? dict : ( {
            [Symbol.iterator]() {
                return {
                    next() {
                        const value = dict.shift();
                        return {
                            done : value === undefined,
                            value 
                        };
                    }
                };
            }
        } );
    }

    keys() {
        const keys = [];
        for( let item of this.dict ) {
           keys.push( item[ 0 ] );
        }

        return !supportIterator() ? keys : ( {
            [Symbol.iterator]() {
                return {
                    next() {
                        const value = keys.shift();
                        return {
                            done : value === undefined,
                            value
                        };
                    }
                };
            }
        } );
    }

    values() {
        const values = [];
        for( let item of this.dict ) {
           values.push( item[ 1 ] );
        }

        return !supportIterator() ? values : ( {
            [Symbol.iterator]() {
                return {
                    next() {
                        const value = values.shift();
                        return {
                            done : value === undefined,
                            value
                        };
                    }
                };
            }
        } );
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
        if( window.URL ) {
            const url = new window.URL( path, base );
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
            this.searchParams = new URLSearchParams( this.search ); 
        }
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

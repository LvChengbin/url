(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.JURL = {})));
}(this, (function (exports) { 'use strict';

    function isString (str) { return typeof str === 'string' || str instanceof String; }

    function isNumber ( n, strict ) {
        if ( strict === void 0 ) strict = false;

        if( ({}).toString.call( n ).toLowerCase() === '[object number]' ) {
            return true;
        }
        if( strict ) { return false; }
        return !isNaN( parseFloat( n ) ) && isFinite( n )  && !/\.$/.test( n );
    }

    function isInteger ( n, strict ) {
        if ( strict === void 0 ) strict = false;


        if( isNumber( n, true ) ) { return n % 1 === 0; }

        if( strict ) { return false; }

        if( isString( n ) ) {
            if( n === '-0' ) { return true; }
            return n.indexOf( '.' ) < 0 && String( parseInt( n ) ) === n;
        }

        return false;
    }

    function isIPv4 (ip) {
        if( !isString( ip ) ) { return false; }
        var pieces = ip.split( '.' );
        if( pieces.length !== 4 ) { return false; }

        for( var i$1 = 0, list = pieces; i$1 < list.length; i$1 += 1 ) {
            var i = list[i$1];

            if( !isInteger( i ) ) { return false; }
            if( i < 0 || i > 255 ) { return false; }
        }
        return true;
    }

    /**
     * <user>:<password> can only be supported with FTP scheme on IE9/10/11
     */

    function isUrl (url) {
        if( !isString( url ) ) { return false; }

        if( !/^(https?|ftp):\/\//i.test( url ) ) { return false; }
        var a = document.createElement( 'a' );
        a.href = url;

        /**
         * In IE, sometimes a.protocol would be an unknown type
         * Getting a.protocol will throw Error: Invalid argument in IE
         */
        try {
            if( !isString( a.protocol ) ) { return false; }
        } catch( e ) {
            return false;
        }

        if( !/^(https?|ftp):/i.test( a.protocol ) ) { return false; }

        /**
         * In IE, invalid IP address could be a valid hostname
         */
        if( /^(\d+\.){3}\d+$/.test( a.hostname ) && !isIPv4( a.hostname ) ) { return false; }

        return true;
    }

    var decode = function (str) { return decodeURIComponent( String( str ).replace( /\+/g, ' ' ) ); };

    var URLSearchParams = function URLSearchParams( init ) {
        var this$1 = this;

        this.dict = [];

        if( !init ) { return; }

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
            var pairs = init.split( /&+/ );
            for( var i = 0, list = pairs; i < list.length; i += 1 ) {
                var item = list[i];

                var index = item.indexOf( '=' );
                this$1.append(
                    index > -1 ? item.slice( 0, index ) : item,
                    index > -1 ? item.slice( index + 1 ) : ''
                );
            }
            return;
        }

        for( var attr in init ) {
            this$1.append( attr, init[ attr ] );
        }
    };
    URLSearchParams.prototype.append = function append ( name, value ) {
        this.dict.push( [ decode( name ), decode( value ) ] );
    };
    URLSearchParams.prototype.delete = function delete$1 ( name ) {
        var dict = this.dict;
        for( var i = 0, l = dict.length; i < l; i += 1 ) {
            if( dict[ i ][ 0 ] == name ) {
                dict.splice( i, 1 );
                i--; l--;
            }
        }
    };
    URLSearchParams.prototype.get = function get ( name ) {
            var this$1 = this;

        for( var i = 0, list = this$1.dict; i < list.length; i += 1 ) {
            var item = list[i];

                if( item[ 0 ] == name ) {
                return item[ 1 ];
            }
        }
        return null;
    };
    URLSearchParams.prototype.getAll = function getAll ( name ) {
            var this$1 = this;

        var res = [];
        for( var i = 0, list = this$1.dict; i < list.length; i += 1 ) {
            var item = list[i];

                if( item[ 0 ] == name ) {
                res.push( item[ 1 ] );
            }
        }
        return res;
    };
    URLSearchParams.prototype.has = function has ( name ) {
            var this$1 = this;

        for( var i = 0, list = this$1.dict; i < list.length; i += 1 ) {
            var item = list[i];

                if( item[ 0 ] == name ) {
                return true;
            }
        }
        return false;
    };
    URLSearchParams.prototype.set = function set ( name, value ) {
            var this$1 = this;

        var set = false;
        for( var i = 0, l = this.dict.length; i < l; i += 1 ) {
            var item  = this$1.dict[ i ];
            if( item[ 0 ] == name ) {
                if( set ) {
                    this$1.dict.splice( i, 1 );
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
    };
    URLSearchParams.prototype.sort = function sort () {
        this.dict.sort( function ( a, b ) {
            var nameA = a[ 0 ].toLowerCase();
            var nameB = b[ 0 ].toLowerCase();
            if (nameA < nameB) { return -1; }
            if (nameA > nameB) { return 1; }
            return 0;
        } );
    };

    URLSearchParams.prototype.entries = function entries () {
            var this$1 = this;


        var dict = [];

        for( var i = 0, list = this$1.dict; i < list.length; i += 1 ) {
            var item = list[i];

                dict.push( [ item[ 0 ], item[ 1 ] ] );
        }
            
        return dict;
    };

    URLSearchParams.prototype.keys = function keys () {
            var this$1 = this;

        var keys = [];
        for( var i = 0, list = this$1.dict; i < list.length; i += 1 ) {
           var item = list[i];

                keys.push( item[ 0 ] );
        }

        return keys;
    };

    URLSearchParams.prototype.values = function values () {
            var this$1 = this;

        var values = [];
        for( var i = 0, list = this$1.dict; i < list.length; i += 1 ) {
           var item = list[i];

                values.push( item[ 1 ] );
        }

        return values;
    };

    URLSearchParams.prototype.toString = function toString () {
            var this$1 = this;

        var pairs = [];
        for( var i = 0, list = this$1.dict; i < list.length; i += 1 ) {
            var item = list[i];

                pairs.push( encodeURIComponent( item[ 0 ] ) + '=' + encodeURIComponent( item[ 1 ] ) );
        }
        return pairs.join( '&' );
    };

    var attrs = [
        'href', 'origin',
        'host', 'hash', 'hostname',  'pathname', 'port', 'protocol', 'search',
        'username', 'password', 'searchParams'
    ];

    var URL = function URL( path, base ) {
        var this$1 = this;

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
                var pathname = base.pathname;
                    
                if( pathname.charAt( pathname.length - 1 ) === '/' ) {
                    path = base.origin + pathname + path;
                } else {
                    path = base.origin + pathname.replace( /\/[^/]+\/?$/, '' ) + '/' + path;
                }
            }
        }

        var dotdot = /([^/])\/[^/]+\/\.\.\//;
        var dot = /\/\.\//g;

        path = path.replace( dot, '/' );

        while( path.match( dotdot ) ) {
            path = path.replace( dotdot, '$1/' );
        }

        var node = document.createElement( 'a' );
        node.href = path;

        for( var i = 0, list = attrs; i < list.length; i += 1 ) {
            var attr = list[i];

            this$1[ attr ] = attr in node ? node[ attr ] : '';
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
    };
    URL.prototype.toString = function toString () {
        return this.href;
    };
    URL.prototype.toJSON = function toJSON () {
        return this.href;
    };

    exports.URL = URL;
    exports.URLSearchParams = URLSearchParams;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

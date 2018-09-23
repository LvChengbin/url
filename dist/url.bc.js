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

    /**
     * BNF of IPv4 address
     *
     * IPv4address = dec-octet "." dec-octet "." dec-octet "." dec-octet
     *
     * dec-octet = DIGIT                ; 0-9
     *           / %x31-39 DIGIT        ; 10-99
     *           / "1" 2DIGIT           ; 100-199
     *           / "2" 2DIGIT           ; 200-249
     *           / "25" %x30-35         ; 250-255
     */
    function ipv4 (ip) {
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
     * BNF of IPv6:
     *
     * IPv6address =                             6( h16 ":" ) ls32
     *              /                       "::" 5( h16 ":" ) ls32
     *              / [               h16 ] "::" 4( h16 ":" ) ls32
     *              / [ *1( h16 ":" ) h16 ] "::" 3( h16 ":" ) ls32
     *              / [ *2( h16 ":" ) h16 ] "::" 2( h16 ":" ) ls32
     *              / [ *3( h16 ":" ) h16 ] "::"    h16 ":"   ls32
     *              / [ *4( h16 ":" ) h16 ] "::"              ls32
     *              / [ *5( h16 ":" ) h16 ] "::"              h16
     *              / [ *6( h16 ":" ) h16 ] "::"
     *
     *  ls32 = ( h16 ":" h16 ) / IPv4address
     *       ; least-significant 32 bits of address
     *
     *  h16 = 1 * 4HEXDIG
     *      ; 16 bits of address represented in hexadcimal
     */

    function isIPv6 (ip) {
        /**
         * An IPv6 address should have at least one colon(:)
         */
        if( ip.indexOf( ':' ) < 0 ) { return false; }

        /**
         * An IPv6 address can start or end with '::', but cannot start or end with a single colon.
         */
        if( /(^:[^:])|([^:]:$)/.test( ip ) ) { return false; }

        /**
         * An IPv6 address should consist of colon(:), dot(.) and hexadecimel
         */
        if( !/^[0-9A-Fa-f:.]{2,}$/.test( ip ) ) { return false; }

        /**
         * An IPv6 address should not include any sequences bellow:
         * 1. a hexadecimal with length greater than 4
         * 2. three or more consecutive colons
         * 3. two or more consecutive dots
         */
        if( /[0-9A-Fa-f]{5,}|:{3,}|\.{2,}/.test( ip ) ) { return false; }

        /**
         * In an IPv6 address, the "::" can only appear once.
         */
        if( ip.split( '::' ).length > 2 ) { return false; }

        /**
         * if the IPv6 address is in mixed form.
         */
        if( ip.indexOf( '.' ) > -1 ) {
            var lastColon = ip.lastIndexOf( ':' );
            var hexadecimal = ip.substr( 0, lastColon );
            var decimal = ip.substr( lastColon + 1 );
            /**
             * the decimal part should be an valid IPv4 address.
             */
            if( !ipv4( decimal ) ) { return false; }

            /**
             * the length of the hexadecimal part should less than 6.
             */
            if( hexadecimal.split( ':' ).length > 6 ) { return false; }
        } else {
            /**
             * An IPv6 address that is not in mixed form can at most have 8 hexadecimal sequences.
             */
            if( ip.split( ':' ).length > 8 ) { return false; }
        }
        return true;
    }

    function encodePathname( pathname ) {
        if( !pathname ) { return pathname; }
        var splitted = pathname.split( '/' );
        var encoded = [];
        for( var i = 0, list = splitted; i < list.length; i += 1 ) {
            var item = list[i];

            encoded.push( encodeURIComponent( item ) );
        }
        return encoded.join( '/' );
    }

    function encodeSearch( search ) {
        if( !search ) { return search; }
        return '?' + search.substr( 1 ).replace( /[^&=]/g, function (m) { return encodeURIComponent( m ); } );
    }

    /**
     * <user>:<password> can only be supported with FTP scheme on IE9/10/11
     *
     * URI = scheme ":" hier-part [ "?" query ] [ "#" fragment ]
     * reserved = gen-delims / sub-delims
     * gen-delims = ":" / "/" / "?" / "#" / "[" / "]" / "@"
     * sub-delims = "!" / "$" / "&" / "'" / "(" / ")"
     *              / "*" / "+" / "," / ";" / "="
     *
     * pct-encoded = "%" HEXDIG HEXDIG
     */

    /**
     * protocols that always contain a // bit and must have non-empty path
     */
    var slashedProtocol = {
        'http:' : true,
        'https:' : true,
        'ftp:' : true,
        'gopher:' : true,
        'file:' : true
    };

    function parse (url) {
        var assign;

        if( !isString( url ) ) { return false; }
        /**
         * scheme = ALPHA * ( ALPHA / DIGIT / "+" / "-" / "." )
         */
        var splitted = url.match( /^([a-zA-Z][a-zA-Z0-9+-.]*:)([^?#]*)(\?[^#]*)?(#.*)?/ );
        if( !splitted ) { return false; }
        var scheme = splitted[1];
        var hier = splitted[2];
        var search = splitted[3]; if ( search === void 0 ) search = '';
        var hash = splitted[4]; if ( hash === void 0 ) hash = '';
        var protocol = scheme.toLowerCase();
        var username = '';
        var password = '';
        var href = protocol;
        var origin = protocol;
        var port = '';
        var pathname = '/';
        var hostname = '';

        if( slashedProtocol[ protocol ] ) {
            if( /^[:/?#[]@]*$/.test( hier ) ) { return false; }
            hier = '//' + hier.replace( /^\/+/, '' );
            href += '//';
            origin += '//';
        }

        /**
         * hier-part = "//" authority path-abempty
         *              / path-absolute
         *              / path-rootless
         *              / path-empty
         * authority = [ userinfo "@" ] host [ ":" port ]
         * userinfo = *( unreserved / pct-encoded /sub-delims / ":" )
         *
         * path = path-abempty      ; begins with "/" or is empty
         *      / path-absolute     ; begins with "/" but not "//"
         *      / path-noscheme     ; begins with a non-colon segment
         *      / path-rootless     ; begins with a segment
         *      / path-empty        ; zero characters
         *
         * path-abempty     = *( "/" segment )
         * path-absolute    = "/" [ segment-nz *( "/" segment ) ]
         * path-noscheme    = segment-nz-nc *( "/" segment )
         * path-rootless    = segment-nz *( "/" segment )
         * path-empty       = 0<pchar>
         * segment          = *pchar
         * segment-nz       = 1*pchar
         * setment-nz-nc    = 1*( unreserved / pct-encoded /sub-delims / "@" )
         *                  ; non-zero-length segment without any colon ":"
         *
         * pchar            = unreserved / pct-encoded /sub-delims / ":" / "@"
         *
         * host = IP-literal / IPv4address / reg-name
         * IP-leteral = "[" ( IPv6address / IpvFuture ) "]"
         * IPvFuture = "v" 1*HEXDIG "." 1*( unreserved / sub-delims / ":" )
         * reg-name = *( unreserved / pct-encoded / sub-delims )
         *
         * PORT = *DIGIT
         * A TCP header is limited to 16-bits for the source/destination port field.
         * @see http://www.faqs.org/rfcs/rfc793.html
         */

        /**
         * "//" authority path-abempty
         */
        if( slashedProtocol[ protocol ] ) {
            var matches = hier.substr( 2 ).match( /(?:(?:(?:([^:/?#[\]@]*):([^:/?#[\]@]*))?@)|^)([^:/?#[\]@]+|\[[^/?#[\]@]+\])(?::([0-9]+))?(\/.*|\/)?$/ );
            if( !matches ) { return false; }

            (assign = matches, username = assign[1], username = username === void 0 ? '' : username, password = assign[2], password = password === void 0 ? '' : password, hostname = assign[3], hostname = hostname === void 0 ? '' : hostname, port = assign[4], port = port === void 0 ? '' : port, pathname = assign[5], pathname = pathname === void 0 ? '/' : pathname);
            if( port && port > 65535 ) { return false; }

            if( username || password ) {
                if( username ) {
                    href += username;
                }

                if( password ) {
                    href += ':' + password;
                }
                href += '@';
            }

            /**
             * To check the format of IPv4
             * includes: 1.1.1.1, 1.1, 1.1.
             * excludes: .1.1, 1.1..
             */
            if( /^[\d.]+$/.test( hostname ) && hostname.charAt( 0 ) !== '.' && hostname.indexOf( '..' ) < 0 ) {
                var ip = hostname.replace( /\.+$/, '' );
                if( !ipv4( ip ) ) {
                    var pieces = ip.split( '.' );
                    if( pieces.length > 4 ) { return false; }
                    /**
                     * 300 => 0.0.1.44
                     * 2 => 0.0.0.2
                     */
                    if( pieces.length === 1 ) {
                        var n = pieces[ 0 ];
                        ip = [ ( n >> 24 ) & 0xff, ( n >> 16 ) & 0xff, ( n >> 8 ) & 0xff, n & 0xff ].join( '.' );
                    } else {
                        var l = pieces.length;
                        if( l < 4 ) {
                            pieces.splice.apply( pieces, [ l - 1, 0 ].concat( ( Array( 3 - l ).join( 0 ).split( '' ) ) ) );
                        }
                        ip = pieces.join( '.' );
                    }
                    if( !ipv4( ip ) ) { return false; }
                }
                hostname = ip;
            } else if( hostname.charAt( 0 ) === '[' ) {
                if( !isIPv6( hostname.substr( 1, hostname.length - 2 ) ) ) { return false; }
            }

            href += hostname;
            origin += hostname;
            if( port ) {
                href += ':' + port;
                origin += ':' + port;
            }
            href += pathname;
        } else {
            pathname = hier;
            href += hier;
            origin = null;
        }

        href += search + hash;

        var host = hostname + ( port ? ':' + port : '' );

        var hierPart = ( hier.substr( 0, 2 ) === '//' && host ) ? '//' : '';

        if( username || password ) {
            hierPart += (username||'') + ":" + (password||'') + "@";
        }

        hierPart += host;

        search = encodeSearch( search );

        if( pathname && pathname.charAt( 0 ) !== '/' ) {
            pathname = '/' + pathname;
        }

        return {
            href: href,
            protocol: protocol,
            origin: origin,
            username: username,
            password: password,
            hostname: hostname,
            host : hostname + ( port ? ':' + port : '' ),
            pathname : encodePathname( pathname ),
            search: search,
            hash: hash,
            port: port,
            hier : hierPart
        };
    }

    var resolvePath = function ( from, to ) {
        var dot = /\/\.\//g;
        var dotdot = /\/[^/]+\/\.\.|[^/]+\/\.\.\//;
        var path = from.replace( /[^/]+$/, '' ) + to.replace( /^\//, '' );

        path = path.replace( dot, '/' );
        while( path.match( dotdot ) ) {
            path = path.replace( dotdot, '' );
        }

        path = path.replace( /^[./]+/, '' );

        if( path.charAt( 0 ) === '/' ) { return path; }
        return '/' + path;
    };

    function resolve ( from, to ) {
        var original = from;
        /**
         * the "from" must be a valid full URL string.
         */
        from = parse( from );
        if( !from ) {
            throw new TypeError( 'The first paramter must be a valid URL string.' );
        }

        if( !to ) { return original; }

        /**
         * if "to" is a valid full URL string, return "to".
         */
        if( parse( to ) ) { return to; }

        if( to.substr( 0, 2 ) === '//' ) {
            return from.protocol + to;
        }

        // absolute path
        if( to.charAt( 0 ) === '/' ) {
            return from.protocol + from.hier + to;
        }

        if( /^\.+\//.test( to ) ) {
            return from.protocol + from.hier + resolvePath( from.pathname, to );
        }

        if( to.charAt( 0 ) === '#' ) {
            return from.href.replace( /#.*$/i, '' ) + to;
        }

        if( to.charAt( 0 ) === '?' ) {
            return from.protocol + from.hier + from.pathname + to;
        }

        return from.protocol + from.hier + resolvePath( from.pathname, '/' + to );
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

    var validBaseProtocols = {
        'http:' : true,
        'https:' : true,
        'file:' : true,
        'ftp:' : true,
        'gopher' : true
    };

    var attrs = [
        'href', 'origin',
        'host', 'hash', 'hostname',  'pathname', 'port', 'protocol', 'search',
        'username', 'password', 'searchParams'
    ];

    var URL = function URL( url, base ) {
        var this$1 = this;

        if( URL.prototype.isPrototypeOf( url ) ) {
            return new URL( url.href );
        }

        if( URL.prototype.isPrototypeOf( base ) ) {
            return new URL( url, base.href );
        }

        url = String( url );

        if( base !== undefined ) {
            var parsed$1 = parse( base );
            if( !parsed$1 || !validBaseProtocols[ parsed$1.protocol ] ) {
                throw new TypeError( 'Failed to construct "URL": Invalid base URL' );
            }
            if( parse( url ) ) { base = null; }
        } else {
            if( !parse( url ) ) {
                throw new TypeError( 'Failed to construct "URL": Invalid URL' );
            }
        }

        if( base ) {
            url = resolve( base, url );
        }

        var parsed = parse( url );

        for( var i = 0, list = attrs; i < list.length; i += 1 ) {
            var item = list[i];

            this$1[ item ] = parsed[ item ];
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
    exports.parse = parse;
    exports.resolve = resolve;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

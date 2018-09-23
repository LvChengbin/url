import isString from '@lvchengbin/is/src/string';
import isIPv4 from '@lvchengbin/is/src/ipv4';
import isIPv6 from '@lvchengbin/is/src/ipv6';

function encodePathname( pathname ) {
    if( !pathname ) return pathname;
    const splitted = pathname.split( '/' );
    const encoded = [];
    for( const item of splitted ) {
        encoded.push( encodeURIComponent( item ) );
    }
    return encoded.join( '/' );
}

function encodeSearch( search ) {
    if( !search ) return search;
    return '?' + search.substr( 1 ).replace( /[^&=]/g, m => encodeURIComponent( m ) );
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
const slashedProtocol = {
    'http:' : true,
    'https:' : true,
    'ftp:' : true,
    'gopher:' : true,
    'file:' : true
};

export default url => {
    if( !isString( url ) ) return false;
    /**
     * scheme = ALPHA * ( ALPHA / DIGIT / "+" / "-" / "." )
     */
    const splitted = url.match( /^([a-zA-Z][a-zA-Z0-9+-.]*:)([^?#]*)(\?[^#]*)?(#.*)?/ );
    if( !splitted ) return false;
    let [ , scheme, hier, search = '', hash = '' ] = splitted;
    const protocol = scheme.toLowerCase();
    let username = '';
    let password = '';
    let href = protocol;
    let origin = protocol;
    let port = '';
    let pathname = '/';
    let hostname = '';

    if( slashedProtocol[ protocol ] ) {
        if( /^[:/?#[]@]*$/.test( hier ) ) return false;
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
        const matches = hier.substr( 2 ).match( /(?:(?:(?:([^:/?#[\]@]*):([^:/?#[\]@]*))?@)|^)([^:/?#[\]@]+|\[[^/?#[\]@]+\])(?::([0-9]+))?(\/.*|\/)?$/ );
        if( !matches ) return false;

        [ , username = '', password = '', hostname = '', port = '', pathname = '/' ] = matches;
        if( port && port > 65535 ) return false;

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
            let ip = hostname.replace( /\.+$/, '' );
            if( !isIPv4( ip ) ) {
                const pieces = ip.split( '.' );
                if( pieces.length > 4 ) return false;
                /**
                 * 300 => 0.0.1.44
                 * 2 => 0.0.0.2
                 */
                if( pieces.length === 1 ) {
                    const n = pieces[ 0 ];
                    ip = [ ( n >> 24 ) & 0xff, ( n >> 16 ) & 0xff, ( n >> 8 ) & 0xff, n & 0xff ].join( '.' );
                } else {
                    const l = pieces.length;
                    if( l < 4 ) {
                        pieces.splice( l - 1, 0, ...( Array( 3 - l ).join( 0 ).split( '' ) ) );
                    }
                    ip = pieces.join( '.' );
                }
                if( !isIPv4( ip ) ) return false;
            }
            hostname = ip;
        } else if( hostname.charAt( 0 ) === '[' ) {
            if( !isIPv6( hostname.substr( 1, hostname.length - 2 ) ) ) return false;
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

    const host = hostname + ( port ? ':' + port : '' );

    let hierPart = ( hier.substr( 0, 2 ) === '//' && host ) ? '//' : '';

    if( username || password ) {
        hierPart += `${username||''}:${password||''}@`;
    }

    hierPart += host;

    search = encodeSearch( search );

    if( pathname && pathname.charAt( 0 ) !== '/' ) {
        pathname = '/' + pathname;
    }

    return {
        href,
        protocol,
        origin,
        username,
        password,
        hostname,
        host : hostname + ( port ? ':' + port : '' ),
        pathname : encodePathname( pathname ),
        search,
        hash,
        port,
        hier : hierPart
    };
};


import parse from './parse';

const resolvePath = ( from, to ) => {
    const dot = /\/\.\//g;
    const dotdot = /\/[^/]+\/\.\.|[^/]+\/\.\.\//;
    let path = from.replace( /[^/]+$/, '' ) + to.replace( /^\//, '' );

    path = path.replace( dot, '/' );
    while( path.match( dotdot ) ) {
        path = path.replace( dotdot, '' );
    }

    path = path.replace( /^[./]+/, '' );

    if( path.charAt( 0 ) === '/' ) return path;
    return '/' + path;
}

function hier( url ) {
    return parse.composite( {
        protocol : url.protocol,
        hostname : url.hostname,
        password : url.password,
        username : url.username,
        port : url.port
    } ) 
}

export default ( from, to ) => {
    const original = from;
    /**
     * the "from" must be a valid full URL string.
     */
    from = parse( from );
    if( !from ) {
        throw new TypeError( 'The first paramter must be a valid URL string.' );
    }

    if( !to ) return original;

    /**
     * if "to" is a valid full URL string, return "to".
     */
    if( parse( to ) ) return to;

    if( to.substr( 0, 2 ) === '//' ) {
        return from.protocol + to;
    }

    // absolute path
    if( to.charAt( 0 ) === '/' ) {
        return hier( from ) + to;
    }

    if( /^\.+\//.test( to ) ) {
        return hier( from ) + resolvePath( from.pathname, to );
    }

    if( to.charAt( 0 ) === '#' ) {
        return parse.composite( from ).replace( /#.*$/i, '' ) + to;
    }

    if( to.charAt( 0 ) === '?' ) {
        return hier( from ) + from.pathname + to;
    }

    return hier( from ) + resolvePath( from.pathname, '/' + to );
};

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
};

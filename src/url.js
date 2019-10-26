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
        if( base ) url = resolve( base, url );
        Object.assign( this, parse( url ) );
    }

    get href() {
        return parse.composite( {
            protocol : this.protocol,
            username : this.username,
            password : this.password,
            hostname : this.hostname,
            pathname : this.pathname,
            search : this.search,
            hash : this.hash,
            port : this.port
        } );
    }

    get host() {
        return this.port ? `${this.hostname}:${this.port}` : this.hostname;
    }

    set host( value ) {
        const [ hostname = '', port = '' ] = String( value ).split( ':' );
        this.hostname = hostname;
        this.port = port;
    }

    get search() {
        const search = this.searchParams.toString();
        return search ? `?${search}` : '';
    }

    set search( value ) {
        this.searchParams = new URLSearchParams( value.replace( /^[?&]+/, '' ) );
    }

    toString() {
        return this.href;
    }
    toJSON() {
        return this.href;
    }
}

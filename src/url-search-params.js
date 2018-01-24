function supportIterator() {
    try {
        return !!Symbol.iterator;
    } catch( e ) {
        return false;
    }
}

const decode = str => decodeURIComponent( String( str ).replace( /\+/g, ' ' ) );

export default class URLSearchParams {
    constructor( init ) {
        if( window.URLSearchParams ) {
            return new window.URLSearchParams( init );
        } else {
            this.dict = [];

            if( !init ) return;

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

const decode = str => decodeURIComponent( String( str ).replace( /\+/g, ' ' ) );

export default class URLSearchParams {
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

    /**
     * Array.prototype.sort is not stable.
     * http://ecma-international.org/ecma-262/6.0/#sec-array.prototype.sort
     *
     * the URLSearchParams.sort should be a stable sorting algorithm method.
     * 
     * To use inseration sort while the length of the array little than 100, otherwise, using the merge sort instead.
     * It was identified by nodejs and v8;
     * https://github.com/nodejs/node/blob/master/lib/internal/url.js
     * https://github.com/v8/v8/blob/master/src/js/array.js
     */
    sort() {
        const a = this.dict;
        const n = a.length;

        if( n < 2 ) { // eslint-disable-line 
        } else if( n < 100 ) {
            // insertion sort
            for( let i = 1; i < n; i += 1 ) {
                const item = a[ i ];
                let j = i - 1;
                while( j >= 0 && item[ 0 ] < a[ j ][ 0 ] ) {
                    a[ j + 1 ] = a[ j ];
                    j -= 1;
                }
                a[ j + 1 ] = item;
            }
        } else {
            /**
             * Bottom-up iterative merge sort
             */
            for( let c = 1; c <= n - 1; c = 2 * c ) {
                for( let l = 0; l < n - 1; l += 2 * c ) {
                    const m = l + c - 1;
                    const r = Math.min( l + 2 * c - 1, n - 1 );
                    if( m > r ) continue;
                    merge( a, l, m, r );
                }
            }
        }
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

// function for merge sort
function merge( a, l, m, r ) {
    const n1 = m - l + 1;
    const n2 = r - m;
    const L = a.slice( l, m + 1 );
    const R = a.slice( m + 1, 1 + r );

    let i = 0, j = 0, k = l;
    while( i < n1 && j < n2 ) {
        if( L[ i ][ 0 ] <= R[ j ][ 0 ] ) {
            a[ k ] = L[ i ];
            i++;
        } else {
            a[ k ] = R[ j ];
            j++;
        }
        k++;
    }

    while( i < n1 ) {
        a[ k ] = L[ i ];
        i++;
        k++;
    }

    while( j < n2 ) {
        a[ k ] = R[ j ];
        j++;
        k++;
    }
}

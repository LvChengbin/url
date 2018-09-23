import resolve from '../src/resolve';

describe( 'url.resolve', () => {
    describe( 'basic', () => {
        it( 'empty HREF URL being resolved', () => {
            expect( resolve( 'http://jnn.org' ) ).toEqual( 'http://jnn.org' ); 
        } );

        it( 'empty url', () => {
            expect( function() { resolve() } ).toThrow(); 
        } );

        it( 'invalid url', () => {
            expect( () => { resolve( 'jnn.org' ) } ).toThrow();
        } );
    } );

    describe( 'protocol', () => {
        it( 'merged protocol', () => {
            expect( resolve( 'http://jnn.org', '//jnn.com' ) ).toEqual( 'http://jnn.com' ); 
        } );
    } );

    describe( 'hash', () => {
        it( 'appended hash', () => {
            expect( resolve(
                'http://jnn.org',
                '#hash'
            ) ).toEqual( 'http://jnn.org/#hash' );
        } );

        it( 'replaced hash', () => {
            expect( resolve(
                'http://jnn.org#old',
                '#new'
            ) ).toEqual( 'http://jnn.org/#new' );
        } );
    } );

    describe( 'search string', () => {
        it( 'replaced search string', () => {
            expect( resolve(
                'http://jnn.org?x=1',
                '?x=1&y=2'
            ) ).toEqual( 'http://jnn.org/?x=1&y=2' );
        } );

        it( 'appended search string', () => {
            expect( resolve(
                'http://jnn.org',
                '?x=1&y=2'
            ) ).toEqual( 'http://jnn.org/?x=1&y=2' );
        } );
    } );

    describe( 'path', () => {
        it( 'appended path', () => {
            expect( resolve(
                'http://jnn.org?x=1',
                'x=1&y=2'
            ) ).toEqual( 'http://jnn.org/x=1&y=2' );
        } );

        it( 'absolute path', () => {
            expect( resolve(
                'http://jnn.org/old/path',
                '/new/path'
            ) ).toEqual( 'http://jnn.org/new/path' ); 
        } );

        it( 'merged path 1', () => {
            expect( resolve(
                'http://jnn.org/a/b/c',
                'd/e/f'
            ) ).toEqual( 'http://jnn.org/a/b/d/e/f' );
        } );

        it( 'merged path 2', () => {
            expect( resolve(
                'http://jnn.org/a/b/c',
                './d/e/f'
            ) ).toEqual( 'http://jnn.org/a/b/d/e/f' );
        } );

        it( 'merged path 3', () => {
            expect( resolve(
                'http://jnn.org/a/b/c',
                '../d/e/f'
            ) ).toEqual( 'http://jnn.org/a/d/e/f' );
        } );

        it( 'merged path 4', () => {
            expect( resolve(
                'http://jnn.org/a/b/c/',
                '../d/e/f'
            ) ).toEqual( 'http://jnn.org/a/b/d/e/f' );
        } );

        it( 'merged path 5', () => {
            expect( resolve(
                'http://jnn.org/a/b/c/',
                '../../d/e/f'
            ) ).toEqual( 'http://jnn.org/a/d/e/f' );
        } );

        it( 'merged path 6', () => {
            expect( resolve(
                'http://jnn.org/a/b/c/',
                '../../../../../d/e/f'
            ) ).toEqual( 'http://jnn.org/d/e/f' );
        } );
    } );
} );

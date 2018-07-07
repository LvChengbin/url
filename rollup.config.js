import resolve from 'rollup-plugin-node-resolve';
import buble from 'rollup-plugin-buble';

export default [ {
    input : 'src/index.js',
    plugins : [
        resolve( {
            module : true,
            jsnext : true
        } )
    ],
    output : [
        { file : 'dist/url.cjs.js', format : 'cjs' },
        { file : 'dist/url.js', format : 'umd', name : 'JURL' }
    ]
}, {
    input : 'src/index.js',
    plugins : [
        resolve( {
            module : true,
            jsnext : true
        } ),
        buble( {
            transforms : {
                arrow : true,
                dangerousForOf : true
            }
        } )
    ],
    output : [
        { file : 'dist/url.bc.js', format : 'umd', name : 'JURL' }
    ]
} ];

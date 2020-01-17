import vue from 'rollup-plugin-vue';
import buble from 'rollup-plugin-buble';
import rollupTypeScript from 'rollup-plugin-typescript';

export default {
  input: 'src/wrapper.js',
  output: {
    name: 'CCIPSessionTable',
    exports: 'named'
  },
  plugins: [
    vue({
      css: true,
      compileTemplate: true
    }),
    rollupTypeScript(),
    buble()
  ],
  external: ['vue-property-decorator', 'lodash']
};

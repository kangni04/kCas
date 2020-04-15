export default {
  entry: "lib/kCas.js",
  esm: {
    type: "rollup",
    minify: true
  },
  cjs: {
    type: "rollup",
    minify: true
  }
  // doc: {
  //     themeConfig: { mode: 'dark' },
  //     base: '/your-repo'
  // },
};

import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['src/index', 'src/cli'],
  clean: true,
  declaration: true,
  failOnWarn: false,
  rollup: {
    inlineDependencies: true,
    emitCJS: true,
    cjsBridge: true,
    esbuild: {
      minify: true,
    },
  },
});

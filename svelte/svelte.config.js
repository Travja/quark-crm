import staticAdapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: staticAdapter({
      // default options are shown
      pages: '../dist/www',
      assets: '../dist/www',
      fallback: 'index.html',
      precompress: false
    }),
    prerender: {
      enabled: false
    }
  }
};

export default config;

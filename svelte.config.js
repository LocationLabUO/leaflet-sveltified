import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter()
	},
	vitePlugin: {
		// Allows you to hold ctrl+shift and click on an item in the browser and it then
		// opens that components location in VSCode
		inspector: {
			holdMode: true
		}
	}
};

export default config;

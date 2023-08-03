import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
// 线上包
import vitePluginUniRouter from  `./uni-simple-router/compiler`

/**
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
    plugins: [
		vitePluginUniRouter({
			routesMain:'./router/routes.js',
			pluginPath:`./uni-simple-router`,
		}),
        uni()
	]
});

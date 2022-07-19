import path from "path";
import glob from "glob";
import svgrPlugin from "esbuild-plugin-svgr";
import esbuild from "esbuild";
import copyStaticFiles from "esbuild-copy-static-files";

// const path = require("path");
// const glob = require("glob");
// const svgrPlugin = require('esbuild-plugin-svgr');

// Resolve paths starting with / as relative to client/
const rootdirPlugin = function(rootdir) {
    return {
        name: "rootdir",
        setup(build) {
            build.onResolve({ filter: /^\// }, args => {
				const exact = glob.sync(path.join(path.resolve(rootdir), args.path));
				if (exact.length) {
					return { path: exact[0] };
            	} else {
					const match = glob.sync(path.join(path.resolve(rootdir), `${args.path}.*`));
					return { path: match[0] };
				}
            });
        },
    };
};

// https://github.com/evanw/esbuild/issues/438#issuecomment-705120203
const define = {};
for (const k in process.env) {
  define[`process.env.${k}`] = JSON.stringify(process.env[k]);
}

const buildOptions = {
	entryPoints: ["client/index.js"],
	// absWorkingDir: `${process.cwd()}/client`,
	bundle: true,
	outdir: "build/",
	sourcemap: true,
	// splitting: true,
	loader: {
		".js": "jsx",
		".woff2": "dataurl",
	},
	plugins: [ 
		rootdirPlugin("client/"),
		svgrPlugin({ ref: true }),
		copyStaticFiles({
			src: "client/static/",
			dest: "build/",
		}),
	],
	define,
};

if (process.argv[2] == "serve") {
	esbuild.serve({port: 3030, servedir: "build"}, buildOptions);
} else {
	esbuild.build(buildOptions);
}

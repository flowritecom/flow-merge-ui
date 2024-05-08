import esbuild from "esbuild"
import vuePlugin from "esbuild-plugin-vue3"
import chokidar from "chokidar"
import { env } from "@dotenv-run/core";

const watch = process.argv.includes("-w")
const serve = process.argv.includes("-s")

const { full } = env({
    prefix: "VUE_APP_",
    verbose: true,
    files: [".env"],
});

const buildConfig = {
    entryPoints: ["src/index.ts", "src/index.html"],
    bundle: true,
    outdir: "dist/",
    plugins: [vuePlugin(),],
    sourcemap: process.env.NODE_ENV === "development",
    minify: process.env.NODE_ENV !== "development",
    loader: {
        ".html": "copy",
        ".otf": "copy",
    },
    define: full,
    logLevel: "info",
}

if (serve) {
    const ctx = await esbuild.context(buildConfig)
    await ctx.serve({ servedir: 'dist' })
} else if (watch) {
    const ctx = await esbuild.context(buildConfig)
    chokidar.watch(["src/**/*"]).on("change", async () => {
        console.log('rebuilding...')
        const results = await ctx.rebuild()
        console.log(`done`)
        if (results.errors.length > 0) {
            console.error(results.errors)
        }
        if (results.warnings.length > 0) {
            console.warn(results.warnings)
        }
    })
} else {
    // Single build
    await esbuild.build(buildConfig)
    process.exit();
}

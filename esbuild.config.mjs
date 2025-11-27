import * as esbuild from "esbuild";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { sassPlugin } from "esbuild-sass-plugin";

const isServe = process.argv.includes("--serve");
const isWatch = process.argv.includes("--watch");
const isProd = !isServe && !isWatch;

const outdir = "dist";
const entryFile = "src/main.ts";

function packZip() {
  const zipScript = path.resolve(".acode/pack-zip.js");
  if (!fs.existsSync(zipScript)) {
    console.warn("⚠️ pack-zip.js não encontrado. Ignorando empacotamento.");
    return;
  }

  exec(`node ${zipScript}`, (err, stdout) => {
    if (err) {
      console.error("❌ Erro ao empacotar:", err);
    } else {
      console.log(`📦 ${stdout.trim()}`);
    }
  });
}

const zipPlugin = {
  name: "zip-plugin",
  setup(build) {
    build.onEnd((result) => {
      if (result.errors.length === 0) {
        console.log("✅ Build finalizado com sucesso.");
        packZip();
      } else {
        console.error("❌ Erros detectados no build, zip não gerado.");
      }
    });
  },
};

const buildConfig = {
  entryPoints: [entryFile],
  bundle: true,
  minify: !isServe,
  logLevel: "info",
  color: true,
  outdir: "dist",
  plugins: [zipPlugin, sassPlugin()],
  banner: {
    js: `/* 🧩 Acode Plugin Build - ${new Date().toISOString()} */`,
  },
  assetNames: 'assets/[name]-[hash]',
  define: {
    'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
    'global': 'globalThis'
  },
 
};

(async () => {
  try {
    if (isServe || isWatch) {
      console.log("🚧 Iniciando build em modo desenvolvimento...");
      const ctx = await esbuild.context(buildConfig);
      await ctx.watch();
      if (isServe) {
        console.log("🌐 Servidor local ativo em http://localhost:3000");
      }
    } else {
      console.log("🏗️ Build de produção em andamento...");
      await esbuild.build(buildConfig);
      console.log("🎯 Build concluído e empacotado com sucesso.");
    }
  } catch (error) {
    console.error("💥 Falha na execução do build:", error);
    process.exit(1);
  }
})();
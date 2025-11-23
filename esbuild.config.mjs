import * as esbuild from "esbuild";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { sassPlugin } from 'esbuild-sass-plugin';

const isServe = process.argv.includes("--serve");
const isWatch = process.argv.includes("--watch");
const isProd = !isServe && !isWatch;

const outdir = "dist";
const entryFile = "src/main.ts";
const distZip = "dist.zip";

// -------------------------------------------------
// 🧩 1. Empacotamento automático (gera dist.zip após cada build)
// -------------------------------------------------
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

// ---------------------------------------
// 🧱 2. Plugin personalizado do esbuild
// ---------------------------------------
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

// --------------------------------------------
// ⚙️ 3. Configuração base do esbuild
// --------------------------------------------
const buildConfig = {
  entryPoints: [entryFile],
  bundle: true,
  minify: isProd,
  platform: "browser",
  format: "esm",
  target: ["esnext"],
  sourcemap: !isProd,
  outdir,
  logLevel: "info",
  color: true,
  loader: {
    ".ts": "ts",
    ".js": "js",
    ".json": "json",
    ".png": "file",
    ".jpg": "file",
    ".jpeg": "file",
    ".gif": "file",
    ".svg": "file"
  },
  plugins: [
    zipPlugin,
    sassPlugin({
      // Configurações do SCSS
      loadPaths: ['src/styles', 'src'],
      sourceMap: !isProd,
      style: isProd ? 'compressed' : 'expanded',
      // Importante: garantir que o CSS seja injetado no bundle
      type: 'style',
      cssImports: true
    })
  ],
  banner: {
    js: `/* 🧩 Acode Plugin Build - ${new Date().toISOString()} */`,
  },
  // Adicionar esta configuração para garantir que arquivos estáticos sejam copiados
  assetNames: 'assets/[name]-[hash]'
};

// -------------------------------------------------------------
// 🚀 4. Execução do build e watch/serve modes
// -------------------------------------------------------------
(async () => {
  try {
    if (isServe || isWatch) {
      console.log("🚧 Iniciando build em modo desenvolvimento...");

      const ctx = await esbuild.context(buildConfig);
      await ctx.watch();

      if (isServe) {
        console.log("🌐 Servidor local ativo em http://localhost:3000");
        console.log("⚠️ Reload automático não disponível no Termux.");
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
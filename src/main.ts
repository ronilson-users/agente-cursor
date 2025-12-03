import plugin from '../plugin.json';

import { AcodePlugin } from './core/AcodePlugin';

if (window.acode) {
  const acodePlugin = new AcodePlugin();

  acode.setPluginInit(plugin.id, async (baseUrl: string, $page: any, { cacheFileUrl, cacheFile }: any) => {
    if (!baseUrl.endsWith('/')) baseUrl += '/';
    acodePlugin.baseUrl = baseUrl;
    await acodePlugin.init();
  });

  acode.setPluginUnmount(plugin.id, () => {
    acodePlugin.destroy();
  });
}
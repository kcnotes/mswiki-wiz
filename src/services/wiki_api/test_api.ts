import { fetch } from '@tauri-apps/plugin-http';

export const ping = async () => {
  const response = await fetch('https://maplestorywiki.net/api.php?action=query&meta=siteinfo&siprop=statistics&format=json', {
    method: 'GET',
  }).then(r => r.json());
  console.log(response);
};

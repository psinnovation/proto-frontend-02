import { CONFIG } from 'src/global-config';

import { ImportazioneView } from 'src/sections/import-ddt/view/importazione-view';



// ----------------------------------------------------------------------

const metadata = { title: `Import DDT | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <ImportazioneView />
    </>
  );
}

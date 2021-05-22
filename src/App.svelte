<script>
  import Router from 'svelte-spa-router';
  import { globalSettings } from './globalSettings.js';
  import { sync } from './sync-store.js';
  import Index from './pages/index.svelte';
  import Necromance from './pages/necromance.svelte';
  import NotFound from './pages/notfound.svelte';

  let loadAnalytics = location.pathname == '/' ? false : true;
  addEventListener('pictureGroup_load', e => setTimeout(() => loadAnalytics = e.detail == 'slideHero'));

  const routes = {
    '/': Index,
    '/necromance/': Necromance,
    '*': NotFound
  };

  $sync.standardWidth = null;
  const defautlStandardWidth = globalSettings.standardWidths[globalSettings.standardWidths.findIndex(v=> v.mediaQuery == 'default')].value;
  globalSettings.standardWidths.forEach((v, i, array) => {
    if(v.mediaQuery && v.mediaQuery != 'default') {
      let media = matchMedia(`(${v.mediaQuery})`);
      try {
        media.addEventListener('change', e => $sync.standardWidth = e.matches ? v.value : defautlStandardWidth);
      } catch (e1) {
        try {
          media.addEventListener(e => $sync.standardWidth = e.matches ? v.value : defautlStandardWidth);
        } catch (e2) {
          console.error(e2);
        }
      }
    }
    if(i == array.length - 1 && !$sync.standardWidth) $sync.standardWidth = defautlStandardWidth;
  });
</script>

<svelte:head>
  {#if loadAnalytics}
    <link rel="preconnect" href="https://www.google-analytics.com">
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-158103398-1"></script>
    <script async>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-158103398-1');
    </script>
  {/if}
</svelte:head>

<Router {routes} />
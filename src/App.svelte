<script>
  import Router from 'svelte-spa-router';
  import Index from './pages/index.svelte';
  import Necromance from './pages/necromance.svelte'
  import NotFound from './pages/notfound.svelte'

  let loadAnalytics = location.pathname == '/' ? false : true;
  addEventListener('pictureGroup_load', e => setTimeout(() => loadAnalytics = e.detail == 'slideHero'));

  const routes = {
    '/': Index,
    '/necromance/': Necromance,
    '*': NotFound
  };
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
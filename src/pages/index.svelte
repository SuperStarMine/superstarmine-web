<script>
  import Cframe from "../components/common-frame.svelte";
  import Nheader from "../components/nav-header.svelte";
  import Static from "../components/static-content.svelte";
  import Dlist from "../components/date-list.svelte";
  import HeroS from "../components/slide-hero-swiper.svelte";
  import Desc from "../components/slide-description.svelte";
  import Footer from "../components/footer.svelte";
  import Cards from "../components/cards.svelte";
  import { settings } from "../toppageSettings.js";
  import { globalSettings } from '../globalSettings.js';
  import { sync } from '../sync-store.js';
</script>


{#if settings.find(v => v.sectionType == 'navHeader')}
  <Nheader contents={settings.find(v => v.sectionType == 'navHeader').contents} {globalSettings}/>
{/if}
<main style="--transitionDuration: {globalSettings.transitionDuration}ms;--standardWidth: {$sync.standardWidth}vw">
  {#each settings as {title, subtitle, themeColor, sectionType, contents, id, pairId}}
    {#if sectionType == "slideHero"}
      <HeroS contents={contents || settings.find(v => v.pairId == pairId && v.isParent).contents} {globalSettings} {pairId} standardWidth={$sync.standardWidth}/>
    {:else if sectionType == "slideDesc"}
      <Desc {contents} {globalSettings} {pairId} standardWidth={$sync.standardWidth}/>
    {:else if sectionType == "footer"}
      <Footer {contents}/>
    {:else if sectionType != "navHeader"}
      <Cframe {id} {title} {subtitle} {themeColor}>
        {#if sectionType == "static"}
          <Static {contents} {globalSettings} standardWidth={$sync.standardWidth}/>
        {:else if sectionType == "dateList"}
          <Dlist {contents}/>
        {:else if sectionType == "cards"}
          <Cards {contents} {globalSettings} standardWidth={$sync.standardWidth}/>
        {/if}
      </Cframe>
    {/if}
  {/each}
</main>
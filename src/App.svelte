<script>
  import Cframe from "./common-frame.svelte";
  export let contents;
</script>

<style>
</style>

<main>
  {#each contents as {titleType, title, subtitle, themeColor}}
    {#if titleType=="static"}
      <Cframe {title} {subtitle} {themeColor}>
      </Cframe>
    {/if}
  {/each}
</main>
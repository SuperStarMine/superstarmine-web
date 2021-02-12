<script>
  import Cframe from "./common-frame.svelte";
  export let contents;
</script>

<style>
</style>

<main>
  {#each contents as {title, subtitle, themeColor}}
    <Cframe {title} {subtitle} {themeColor}>
    </Cframe>
  {/each}
</main>
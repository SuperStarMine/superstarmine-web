<script>
  import IntersectionObserver from "svelte-intersection-observer";
  /** 半角スペースで分割した文字列 */
  export let string = "";
  export let align = "";
  export let slideIn = "";
  export let className = "";
  let element;
  let intersecting;
</script>

<IntersectionObserver once {element} bind:intersecting>
  <div bind:this={element}>
    <p
      data-align={align}
      data-slidein={slideIn}
      class:animation={intersecting}
      class={className}
    >
      {#each string.split(" ") as chunk}
        <span>{chunk}</span>
      {/each}
    </p>
  </div>
</IntersectionObserver>

<style lang="stylus">
  span
    display: inline-block
</style>

<script>
  import Picture from "./picture.svelte";
  export let contents, globalSettings, id;
  let load = false
</script>

<div class="youtube-wrapper {load ? 'load' : ''}"  on:click={() => load = true}>
  <img class="play-icon" src="/img/youtube.svg" alt="YouTubeの再生ボタン">
  <Picture {contents} {globalSettings} imageId={id}/>
  {#if load}
    <iframe width="16" height="9" src="https://www.youtube-nocookie.com/embed/{id}" title="YouTube動画の埋め込み" frameborder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen="" loading="lazy">YouTube動画の埋め込み</iframe>
  {/if}
</div>

<style lang="stylus">
  .youtube-wrapper
    width 100%
    height calc(var(--standardWidth) / 16 * 9)
    position relative
    &.load
      height 0
      padding-top calc(var(--standardWidth) / 16 * 9)
  iframe, picture, img
    width 100%
    height 100%
    position absolute
    top 0
    left 0
  .play-icon
    width 15%
    position absolute
    top 0
    bottom 0
    right 0
    left 0
    margin auto
</style>
<script>
  import Picture from "./picture.svelte";
  export let contents, globalSettings, id;
  let load = false
</script>

<div class="youtube-wrapper {load ? 'load' : ''}"  on:click={() => load = true}>
  <Picture imgClass="youtube-thumbnail" {contents} {globalSettings} imageId={id}/>
  <img class="play-icon" src="/img/youtube.svg" alt="YouTubeの再生ボタン">
  {#if load}
    <iframe width="16" height="9" src="https://www.youtube-nocookie.com/embed/{id}?autoplay=1&playsinline=1" title="YouTube動画の埋め込み" frameborder="0" allow="fullscreen;accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen="true" loading="lazy">YouTube動画の埋め込み</iframe>
  {/if}
</div>

<style lang="stylus">
  .youtube-wrapper
    position relative
    width 100%
    &:before
      content ""
      display block
      padding-top calc(100% * 9 / 16)
  iframe, :global(.youtube-thumbnail)
    position absolute
    width 100%
    height 100%
    top 0
    left 0
    bottom 0
    right 0
  .play-icon
    width 15%
    position absolute
    top 0
    bottom 0
    right 0
    left 0
    margin auto
</style>
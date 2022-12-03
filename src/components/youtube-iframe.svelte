<script>
  import YouTube from 'svelte-youtube';
  import Picture from "./picture.svelte";
  export let contents, globalSettings, id, sizes;
  let load = false
</script>

<div class="youtube-wrapper {load ? 'load' : ''}"  on:click={() => load = true}>
  <img class="description-youtube-thumbnail" src="http://img.youtube.com/vi/{id}/maxresdefault.jpg" alt="動画のサムネイル" width='1280' height='720'>
  <img class="play-icon" src="/img/youtube.svg" alt="YouTubeの再生ボタン" width='44' height='31'>
  {#if load}
    <YouTube
      videoId={id}
      class='description-youtube-iframe'
      options={{
        width: '640',
        height: '360',
        playerVars: {
          autoplay: 1,
          playsinline: 1
        }
      }}
      on:ready={e => {
        window.addEventListener('slide', () => {e.detail.target.pauseVideo()})
      }}
    />
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
  :global(.description-youtube-thumbnail, .description-youtube-iframe, .description-youtube-iframe iframe)
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

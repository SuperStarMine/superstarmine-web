<script>
  import Button from "./button.svelte";
  import Picture from "./picture.svelte";
  export let contents, globalSettings, standardWidth;

  document.addEventListener('toggleExpand', () => alert('done!'));
</script>

{#each contents.articles as article}
  <article>
    <Picture pictureClass="il-picture" imgClass="il-img" sizes="@media screen and (orientation: portrait) {standardWidth}vw, {standardWidth * 0.3}vw" {contents} {globalSettings} imageId={article.imageId || contents.fallbackImageId} width={contents.aspectRatio.width} height={contents.aspectRatio.height}/>
    <a class="title-container" href={article.url}>
      {#if Array.isArray(article.title)}
        {#each article.title as title}
          <span class="title break-scope">{title}</span>
        {/each}
      {:else}
        <span class="title">{article.title}</span>
      {/if}
      <!-- svelte-ignore component-name-lowercase -->
      <time class="date" datetime="{(article.date.year ? ("0000"+article.date.year).slice(-4) : "") + (article.date.month ? "-" + ("00"+article.date.month).slice(-2) : "") + (article.date.day ? "-" + ("00"+article.date.day).slice(-2) : "")}">
        {(article.date.year ? ("0000"+article.date.year).slice(-4) : "") + (article.date.month ? "/" + ("00"+article.date.month).slice(-2) : "") + (article.date.day ? "/" + ("00"+article.date.day).slice(-2) : "")}
      </time>
    </a>
  </article>
{/each}
<!-- <Button target="toggleExpand" disabled="{true}" marginLeft="{'auto'}" marginRight="{'auto'}">もっと見る</Button> -->


<style lang="stylus">
  article
    display flex
    @media screen and (orientation: portrait)
      flex-direction column
      margin-bottom 1em
    @media screen and (orientation: landscape)
      height calc(var(--standardWidth) * 0.3 / 4 * 3)
    background-color white
    border-radius 2vw
    filter drop-shadow(2px 2px 3px #ccc)
    margin-bottom 2vw

  .title-container
    display flex
    align-items center
    height 100%
    flex-basis 100%
    padding 2em 2vw
    @media screen and (orientation: portrait)
      padding 0.5em 2vw 2em
    box-sizing border-box
    position relative
    text-decoration none
    color black
    @media (min-aspect-ratio: 16/9)
      font-size calc(2.5vw / 2.5 * 1.5)
    font-size calc(2.5vw / 2 * 1.5)
    @media (max-aspect-ratio: 1/1)
      font-size calc(2.5vw * 0.8 * 1.5)
    @media (max-aspect-ratio: 3/4)
      font-size: calc(2.5vw * 1.5)
    font-family vdl-v7marugothic, sans-serif
    font-style normal
    font-weight 700
    .date
      position absolute
      right 0
      bottom 0
      padding 0.5em 2vw 0.5em
      color white
      background-color #505050
      border-radius 2vw 0
      line-height 1em
  :global(.il-picture)
    height calc(var(--standardWidth) / 4 * 3)
    @media screen and (orientation: landscape)
      flex 0 0 30%
      height 100%

  :global(.il-img)
    width 100%
    height 100%
    object-fit contain
    border-bottom solid 1px #505050
    @media screen and (orientation: landscape)
      border solid 0px transparent
      border-right-color #505050
      border-right-width 1px
      border-radius 2vw
      box-sizing border-box
</style>
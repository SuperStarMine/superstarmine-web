<script>
  import Button from "./button.svelte";
  import Picture from "./picture.svelte";
  export let contents, globalSettings;
  const transitionDuration = globalSettings.transitionDuration,
        articles = contents.articles;
  let selectedArticleIndex = 0;
  let selectedArticleIndexLast;
  let articleElement;
  let articleHeight;
  let hiding = false;
  let articleSwitched = true;

  function setSelectedArticle(value) {
    selectedArticleIndexLast = selectedArticleIndex;
    if(isNaN(value)){
      var target = value.target.dataset.articleIndex;
    }else{
      var target = value;
    }
    if(target != selectedArticleIndexLast){
      hiding = true;
      articleSwitched = false;
      selectedArticleIndex = target;
      setTimeout(() => {
        articleSwitched = true;
      }, transitionDuration / 2);
      setTimeout(() => {
        articleHeight = articleElement.clientHeight;
        hiding = false;
      }, transitionDuration / 2);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    articleElement = document.querySelector('article');
    articleHeight = articleElement.clientHeight;
  });
  document.addEventListener('toggleExpand', () => alert('done!'));
</script>

<div class="container" style="--transitionDuration: {transitionDuration}ms">
  <div class="columns">
    <div class="img-wrapper">
      <Picture imgClass="el-img {hiding ? 'hidden' : 'shown'}" sizes="30vw" {contents} {globalSettings} imageId={articles[selectedArticleIndex].imageId}/>
    </div>
    <section class="right-column">
      <h3 class="{hiding ? 'hidden' : 'shown'}">
        {articles[hiding ? selectedArticleIndexLast : selectedArticleIndex].title}
      </h3>
      <div class="articleWrapper {hiding ? 'hidden' : 'shown'}" style="--height: {articleHeight}px">
        <article>
          {#each articles[articleSwitched ? selectedArticleIndex : selectedArticleIndexLast].article as article}
            <p>{article}</p>
          {/each}
        </article>
      </div>
      <ul style="height:{contents.listItemsCount}em">
      {#each articles.slice(0, contents.listItemsCount + 1) as article, i}
        <li data-article-index="{i}" on:click={setSelectedArticle} class="listed-title {selectedArticleIndex==i?'isSelected':''}">{article.title}</li>
      {/each}
      </ul>
    </section>
  </div>
  <Button target="toggleExpand" disabled="{true}" marginLeft="{false}" marginRight="{false}">もっと見る</Button>
</div>


<style lang="stylus">
  .container
    display: flex
    flex-direction: column
    align-items: center

  .columns
    width: 100%
    display: flex
    align-items: center
    justify-content: space-between
    &:not(:last-child)
      margin-bottom: 1em

  .img-wrapper
    background-color #fff
    box-shadow: 0 0 10px #ccc
    flex: 0 0 35%
    height: calc(var(--standardWidth) * 0.35 / 4 * 3)
    margin-right: 5%
    :global(.el-img)
      object-fit: contain
      width: 100%
      height: 100%
      transition: opacity calc(var(--transitionDuration) / 2) ease-in-out 0s
      &.hidden
        opacity: 0
      &.shown
        opacity: 1

  .right-column
    flex: 0 0 60%
    ul
      margin: .5em 1ch
      line-height: 100%
      list-style: none
      padding: 0
      li
        width: calc(var(--standardWidth) * 0.6 - 1ch)
        overflow: hidden
        white-space: nowrap
        text-overflow: ellipsis
        position: relative
        virtical-align: middle
        &.isSelected:before
          content: ''
          margin: 0 .5ch
          display: inline-block
          width: 1ch
          height: 1ch
          border-radius: 50%
          background-color: var(--themeColor)
          filter: blur(1px)
          opacity: 1
        &:not(.isSelected):before
          content: ''
          margin: 0 .5ch
          display: inline-block
          width: 1ch
          height: 1ch
          border-radius: 50%
          background-color: var(--themeColor)
          filter: blur(1px)
          opacity: 0
          transition: opacity calc(var(--transitionDuration) / 2) ease-in-out 0s
    h3
      margin: 0
      transition: clip-path calc(var(--transitionDuration) / 2) ease-in-out 0s
      &.shown
        clip-path: inset(0 0% 0 0)
      &.hidden
        clip-path: inset(0 100% 0 0)
    .articleWrapper
      height: var(--height)
      transition: height calc(var(--transitionDuration) / 2) cubic-bezier(0.87, 0, 0.13, 1) 0s
      overflow-y: hidden
      &.shown
        height: var(--height)
      &.hidden
        height: 0px
      p
        margin: 0
</style>
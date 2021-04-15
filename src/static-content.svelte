<script>
  import Button from "./button.svelte";
  import Picture from "./picture.svelte";
  export let
    contents,
    globalSettings,
    article = contents.article,
    buttonsLayout = contents.bottomButtonsLayout,
    buttons = contents.bottomButtons;
</script>

<div class="container">
  <Picture imgClass="static-img" sizes="30vw" {contents} {globalSettings} imageId={contents.imageId} width={contents.aspectRatio.width} height={contents.aspectRatio.height}/>
  <div class="spacer"></div>
  <section class="right-column">
    <section class="text">
      {#each article as article}
        <p>{article}</p>
      {/each}
    </section>
    <section class="buttons">
      {#each buttons as button}
        <Button target="{button.target}" marginLeft="{buttonsLayout=='right'}" marginRight="{buttonsLayout=='left'}">
          {#if Array.isArray(button.title)}
            {#each button.title as title}
              <span class="break-scope">{title}</span>
            {/each}
          {:else}
            {button.title}
          {/if}
        </Button>
      {/each}
    </section>
  </section>
</div>

<style lang="stylus">
.container
  display: flex
  align-items: center
  justify-content: space-between

:global(.static-img)
  background-color #fff
  box-shadow: 0 0 10px #ccc
  flex: 0 0 35%
  width: 100%
  height auto

.spacer
  flex 0 0 5%

.right-column
  flex: 0 0 60%

.text
  margin-bottom: 1em
  p
    margin: 0

.buttons
  display: flex
  width: 100%
</style>
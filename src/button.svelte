<script>
  export let target, marginLeft, marginRight;
  let isAnchor = RegExp("^https?:\/\/").test(target);
  let style = "";
  if(!isAnchor){
    let event = new CustomEvent(target);
    target = function(){
      document.dispatchEvent(event);
    }
  }
  if(!marginLeft && !marginRight) {
    style = "margin-left: 0;margin-right: 0"
  }else if(!marginRight) {
    style = "margin-right: 0"
  }else if(!marginLeft) {
    style = "margin-left: 0"
  }
</script>

<style lang="stylus">
a, button
  margin: 0 10% 0
  width: 45%
  box-sizing: border-box
  border: none
  border-radius: 0.5ch
  padding: 0.5ch
  font-size: 1em
  display flex
  justify-content center
  align-items center
  flex-wrap wrap
  color: #fff
  background-color: var(--themeColor)
</style>

{#if isAnchor}
  <a href="{target}" style="{style}"><slot></slot></a>
{:else}
  <button on:click={target} style="{style}"><slot></slot></button>
{/if}
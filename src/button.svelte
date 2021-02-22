<script>
  export let target, title, marginLeft, marginRight;
  let isAnchor = RegExp("^https?:\/\/").test(target);
  let style = "";
  if(!marginLeft && !marginRight) {
    style = "margin-left: 0;margin-right: 0"
  }
  if(!marginRight) {
    style = "margin-right: 0"
  }
  if(!marginLeft) {
    style = "margin-left: 0"
  }
</script>

<style>
a, button
  margin: 0 10% 0
  width: 45%
  box-sizing: border-box
  border: none
  border-radius: 0.5ch
  padding: 0.5ch
  font-size: 1em
  text-align: center
  color: #fff
  background-color: var(--themeColor)
</style>

{#if isAnchor}
  <a href="{target}" style="{style}">{title}</a>
{:else}
  <button onclick="{target}" style="{style}">{title}</button>
{/if}
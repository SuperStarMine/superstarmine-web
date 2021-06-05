<script>
  import { link } from 'svelte-spa-router';
  export let target, disabled = false, spaMode, marginLeft, marginRight, width = "45%", bg, style = "", Class;
  let isAnchor = RegExp("\/").test(target);
  if(!isAnchor){
    let event = new CustomEvent(target);
    target = function(){
      document.dispatchEvent(event);
    }
  }
  if(!marginLeft && !marginRight) {
    style = style + "margin-left: 0;margin-right: 0;"
  }else if(!marginRight) {
    style = style + "margin-right: 0;"
  }else if(!marginLeft) {
    style = style + "margin-left: 0;"
  }
  if(disabled){
    style = style + "--themeColor: #aaa;";
  }else if(bg){
    style = style + `--themeColor: ${bg};`;
  }
  style = style + `width:${width};`
</script>

<style lang="stylus">
a, button
  margin: 0 10% 0
  box-sizing: border-box
  border solid 1px var(--textColor)
  border-radius: 0.5ch
  padding: 0.5ch
  font-size: 1em
  display flex
  justify-content center
  align-items center
  flex-wrap wrap
  color: #fff
  background-color: var(--themeColor)
  position relative
  transition filter 200ms ease-out 0ms
  filter none
  &:hover
    filter brightness(0.8)
  &:disabled, &.disabled
    &:hover
      filter none
      cursor not-allowed
</style>

{#if isAnchor}
  {#if spaMode && !disabled}
    <a href="{!disabled ? target : 'javascript:void(0);'}" class="{Class} {disabled ? 'disabled' : ''}" style="{style}" {disabled} use:link><slot></slot></a>
  {:else}
    <a href="{!disabled ? target : 'javascript:void(0);'}" class="{Class} {disabled ? 'disabled' : ''}" style="{style}" {disabled}><slot></slot></a>
  {/if}
{:else}
  <button on:click={!disabled ? target : 'javascript:void(0);'} class="{disabled ? 'disabled' : ''} {Class}" style="{style}" {disabled}><slot></slot></button>
{/if}
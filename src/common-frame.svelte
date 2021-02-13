<script>
  import Color from 'color';
  export let title;
  export let subtitle;
  export let themeColor;
  let backgroundColor = Color(themeColor).lightness(96)
</script>

<style>
  section
    background-color: var(--backgroundColor)
    width: 100%
    margin: 0
    border-bottom: solid 1px white;
    h2, h3
      margin: 0
      margin-right: 1ch
      height: 100%
      line-height: 100%
      color: white
    div
      background: linear-gradient(var(--themeColor) 75%, var(--backgroundColor))
      display: flex
      align-items: center
      width: 100%
      height: 100%
      padding: 0 5vw 0
</style>

<section style="--themeColor: {themeColor}; --backgroundColor: {backgroundColor}">
  <div>
    {#if title}
      <h2>{title}</h2>
    {/if}
    {#if subtitle}
      <h3>{subtitle}</h3>
    {/if}
  </div>
  <slot></slot>
</section>
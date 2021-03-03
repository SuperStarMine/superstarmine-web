<script>
  import Color from 'color';
  export let title;
  export let subtitle;
  export let themeColor;
  $: backgroundColor = Color(themeColor).lightness(96);
  $: textColor = Color(themeColor).luminosity() > 0.7 ? '#000' : '#fff';
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
      color: var(--textColor)
    .title-bar
      background: linear-gradient(var(--themeColor) 75%, var(--backgroundColor))
      display: flex
      align-items: center
      width: 100%
      height: 100%
      box-sizing: border-box
      padding: 0 5vw 0
    .padding
      padding: 3vw calc((100vw - var(--standardWidth)) / 2)
</style>

<section style="--themeColor: {themeColor}; --backgroundColor: {backgroundColor}; --textColor: {textColor}">
  <div class="title-bar">
    {#if title}
      <h2>{title}</h2>
    {/if}
    {#if subtitle}
      <h3>{subtitle}</h3>
    {/if}
  </div>
  <div class="padding">
    <slot></slot>
  </div>
</section>
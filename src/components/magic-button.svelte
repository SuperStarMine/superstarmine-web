

<a href={$$props.href} class={$$props.class}>
  <div class="button">
    <svg class="shadow" width="258" height="52" viewBox="0 0 258 52" xmlns="http://www.w3.org/2000/svg">
      <use xlink:href="/img/magic-button.svg#shape" />
    </svg>
    <svg class="pink" width="258" height="52" viewBox="0 0 258 52" xmlns="http://www.w3.org/2000/svg">
      <use xlink:href="/img/magic-button.svg#shape" />
    </svg>
    <svg class="bg" width="262" height="56" viewBox="0 0 258 52" xmlns="http://www.w3.org/2000/svg">
      <use xlink:href="/img/magic-button.svg#shape" />
    </svg>
    <div class="content">
      <slot />
    </div>
  </div>
</a>

<style lang="stylus">
  a
    display: block;
  .button
    position: relative
    height 56px
    color: #fff
    font-family: m-plus-2p, sans-serif
    font-weight: 700
    text-shadow: none
    &:hover
      color: #282828
    *
      position: absolute;
      left: 0
      right: 0
      margin: 0 auto
      top: 0
      transition: all 0.1s ease-in-out


    &:hover
      .bg
        fill: #fff
      .pink
        rotate: -3deg
        translateY: 1px
      .content :global(svg)
        fill: #282828


    .bg
      fill: #282828
      stroke: #fff
      stroke-width: 2
  
    .pink
      fill: #FF00FF
    
    .shadow
      fill: #000
      translate: 5px 6px
  
    .content
      pointer-events:none
      display: flex;
      justify-content: center
      align-items: center
      height: 56px
      :global(svg)
        fill: #fff

</style>

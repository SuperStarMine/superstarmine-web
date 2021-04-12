<script>
  import Cframe from "./common-frame.svelte";
  import Button from "./button.svelte";
  import Yframe from "./youtube-iframe.svelte";
  import { Swiper, SwiperSlide } from 'swiper/svelte';
  import SwiperCore, { Controller, EffectFade } from 'swiper';
  import { sync } from './sync-store.js';
  import Color from 'color';
  export let pairId, isParent, globalSettings, contents;
  const transitionDuration = globalSettings.transitionDuration;
  $: backgroundColor = Color(contents.articles[realIndex].themeColor).lightness(95).desaturate(0.3);

  let realIndex = 0;
  addEventListener('slide', e => {realIndex = e.detail.realIndex});

  SwiperCore.use([Controller, EffectFade]);

  let controlledSwiper = null;
  const setControlledSwiper = e => {
      const [swiper] = e.detail;
      $sync.controlledSwiper = null
      // set Controller swiper instance
      setTimeout(() => {
        controlledSwiper = swiper;
        controlledSwiper.updateAutoHeight();
        $sync.controlledSwiper = controlledSwiper;
        dispatchEvent(new CustomEvent('controllee_load', {detail: pairId}))
      }, 100);
  }

  //Adobe font loading
  (function(d) {
    var config = {
      kitId: 'egn6fhp',
      scriptTimeout: 3000,
      async: true
    },
    h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
  })(document);
</script>

<svelte:head>
  <link rel="preload" href="/swiper-bundle.min.css" as="style">
  <link rel="stylesheet" type="text/css" href="/swiper-bundle.min.css">
</svelte:head>

<!-- <Cframe title={contents.articles[realIndex].title} subtitle={contents.articles[realIndex].subtitle} themeColor={contents.articles[realIndex].themeColor}> -->
<div class="wrapper" style="--backgroundColor: {backgroundColor};--themeColor: {contents.articles[realIndex].themeColor}">
  <Swiper
    allowSlideNext={false}
    allowSlidePrev={false}
    allowTouchMove={false}
    autoHeight={true}
    spaceBetween={0}
    slidesPerView={1}
    speed={transitionDuration}
    loop={true}
    loopAdditionalSlides={contents.articles.length - 1}
    effect='fade'
    fadeEffect={{crossFade: true}}
    on:swiper={setControlledSwiper}
    controller={{ control: controlledSwiper ? controlledSwiper : null }}
  >
    {#each contents.articles as article}
      <SwiperSlide>
        <div class="title-container">
          <div class="headline">
            <div class="subtitle">{contents.articles[realIndex].subtitle}</div>
            <div class="title">{contents.articles[realIndex].title}</div>
          </div>
          <div class="buttons">
            {#each article.buttons as button}
              {#if button.popup}
                <div class="popup">{button.popup}</div>
              {/if}
              <Button target={button.target} bg="#3183fd" width="auto">
                {#if Array.isArray(button.title)}
                  {#each button.title as title}
                    <span class="break-scope">{title}</span>
                  {/each}
                {:else}
                  {button.title}
                {/if}
              </Button>
            {/each}
          </div>
        </div>
        <div class="description-container">
          {#if article.slides}
            <div class="slide">
              <Swiper
                centeredSlides={true}
                autoHeight={true}
                spaceBetween={0}
                slidesPerView={1}
                speed={transitionDuration}
                updateOnImagesReady={true}
              >
                {#each article.slides as slide}
                  <SwiperSlide>
                    {#if slide.type == "youtube"}
                      <Yframe {contents} {globalSettings} id={slide.id} />
                    {/if}
                  </SwiperSlide>
                {/each}
              </Swiper>
            </div>
          {/if}
          <div class="description">
            <article>
              {#if Array.isArray(article.description)}
                {#each article.description as p, i}
                  <p class={i == 0 ? 'first-line' : ''}>{p}</p>
                {/each}
              {:else}
                {article.description}
              {/if}
            </article>
            {#if article.specs}
              <div class="specs">
                {#if article.specs.times}
                  <div class="times">
                    <span class="tag">制作時期</span>
                    {#each article.specs.times as time, i}
                      <!-- svelte-ignore component-name-lowercase -->
                      <time class="break-scope" datetime="{(time.year ? ("0000"+time.year).slice(-4) : "") + (time.month ? "-" + ("00"+time.month).slice(-2) : "") + (time.day ? "-" + ("00"+time.day).slice(-2) : "")}">
                        {#if time.year}
                          {time.year}年{!(time.month || time.day) ? time.annotation : ''}
                        {/if}
                        {#if time.month}
                          {time.month}月{!time.day ? time.annotation : ''}
                        {/if}
                        {#if time.day}
                          {time.day}日{time.annotation}
                        {/if}
                      </time>
                      {i+1 != article.specs.times.length ? ', ' : ''}
                    {/each}
                  </div>
                {/if}
                {#if article.specs.platforms}
                  <div class="platforms">
                    <span class="tag">対応プラットフォーム</span>
                    {#each article.specs.platforms as platform, i}
                      <span class="break-scope">
                        {platform.name} {platform.version || ""}{platform.orLater ? "以降" : ""}{i+1 != article.specs.platforms.length ? ',' : ''}
                      </span>
                    {/each}
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        </div>
      </SwiperSlide>
    {/each}
  </Swiper>
</div>

<style lang="stylus">
  .wrapper
    padding 0 0 5vw
    box-sizing: border-box
    background-color var(--backgroundColor)
    border-top solid .25em var(--themeColor)
  .title-container
    display flex
    justify-content space-between
    align-items center
    background-color white
    border-radius 2vw
    margin 5vw 5vw 0
    filter drop-shadow(2px 2px 3px #ccc)
    padding 2vw
    font-family vdl-v7marugothic, sans-serif
    font-style normal
    font-weight 700
    .headline
      .title, .subtitle
        display inline-block
    .title
      font-size 2em
      line-height 1em
    .subtitle
      font-size 1.5em
      line-height 1em
      position relative
      &:before
        content ''
        display block
        position absolute
        bottom 0
        left 0
        width 100%
        height calc(100% / 3)
        background-color var(--themeColor)
        opacity 0.5
        mix-blend-mode multiply
    .buttons
      display flex
      white-space nowrap
      flex-direction column
      justify-content center
      align-items center
      .popup
        font-size 0.75em
        font-weight 300
        white-space nowrap
        position relative
        color #3183fd
        &:before, &:after
          content ''
          display block
          width 1px
          height 50%
          position absolute
          top 0
          bottom 0
          margin auto
          background-color #3183fd
          border-radius 0.5px
        &:before
          left -1ch
          transform rotate(-30deg)
        &:after
          right -1ch
          transform rotate(30deg)
  .description-container
    display flex
    justify-content space-between
    align-items flex-start
    margin 2vw 7vw
    .slide
      box-sizing border-box
      flex 0 0 calc(50% - (2vw / 2))
      margin-right 2vw
    .specs
      font-family vdl-v7marugothic, sans-serif
      font-style normal
      font-size calc(1em * 14 / 16)
      font-weight 500
      &>*
        margin 0.75em 0
      .tag
        box-sizing border-box
        border solid 1px #d0d0d0
        border-radius .7vw
        padding .25em 1.5ch
        line-height 1em
        background-color white
        display inline-block
        font-weight 700
    .description
      flex-basis 100%
      p
        margin 0
        line-height 1.5em
        &.first-line
          line-height normal
          margin 0.8em 0
          font-size calc(1em * (18 / 14))
          font-family vdl-v7marugothic, sans-serif
          font-style normal
          font-weight 700
</style>
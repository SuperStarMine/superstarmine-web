<script>
  let last = performance.now();
  let eta = 5000;
  const cowntdown = (time) => {
    eta -= time - last;
    last = time;
    if(eta <= 500){
      location.replace(location.origin);
      return;
    }
    requestAnimationFrame(cowntdown);
  }
  requestAnimationFrame(cowntdown);
</script>

<h1>お探しのページは見つかりませんでした</h1>
<p>{Math.round(eta / 1000)}秒後にトップページに戻ります</p>
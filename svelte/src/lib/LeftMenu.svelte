<script>
  import { run } from 'svelte/legacy';

  import { onMount } from 'svelte';

  let theme = $state(true);
  let loaded = $state(false);

  onMount(() => {
    loaded = true;
    console.log('Theme is: ' + (theme ? 'dark' : 'light'));
  });

  run(() => {
    if (loaded) {
      if (theme) {
        document.documentElement.setAttribute('theme', 'dark');
      } else {
        document.documentElement.setAttribute('theme', 'light');
      }
    }
  });
</script>

<div id="left-menu">
  <div
    class="toggle"
    role="button"
    tabindex="0"
    onclick={() => (theme = !theme)}
    onkeypress={(e) => {
      if (e.key === 'Enter') theme = !theme;
    }}
  >
    Toggle
  </div>
</div>

<style>
  #left-menu {
    position: absolute;
    display: none;
  }

  .toggle {
    cursor: pointer;
  }
</style>

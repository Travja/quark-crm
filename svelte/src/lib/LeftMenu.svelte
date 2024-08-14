<script>
  import { onMount } from 'svelte';

  let theme = true;
  let loaded = false;

  onMount(() => {
    loaded = true;
    console.log('Theme is: ' + (theme ? 'dark' : 'light'));
  });

  $: if (loaded) {
    if (theme) {
      document.documentElement.setAttribute('theme', 'dark');
    } else {
      document.documentElement.setAttribute('theme', 'light');
    }
  }
</script>

<div id="left-menu">
  <div
    class="toggle"
    role="button"
    tabindex="0"
    on:click={() => (theme = !theme)}
    on:keypress={(e) => {
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

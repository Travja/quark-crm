<script lang="ts">
  import Color from 'color';
  import { onMount } from 'svelte';

  export let color = 'lime';

  let backgroundColor: string;
  let fontColor: string;
  let bodyColor: string;

  // Detect if the browser prefers dark mode
  let prefersDarkMode = false;
  onMount(
    () =>
      (prefersDarkMode = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches)
  );

  $: if (prefersDarkMode) {
    backgroundColor = Color(color).darken(0.4).rgb();
    fontColor = Color(color).lighten(0.8).rgb();
    bodyColor = Color(backgroundColor).isLight() ? 'black' : 'white';
  } else {
    backgroundColor = Color(color).lighten(0.4).rgb();
    fontColor = Color(color).darken(0.5).rgb();
    bodyColor = Color(backgroundColor).isLight() ? 'black' : 'white';
  }
</script>

<div
  class="card"
  style:background-color={backgroundColor}
  style:color={fontColor}
>
  <div class="header">
    <slot name="header" />
  </div>
  <div class="body" style:color={bodyColor}>
    <slot />
  </div>
</div>

<style>
  .card {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 16px;
  }

  .header {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
</style>

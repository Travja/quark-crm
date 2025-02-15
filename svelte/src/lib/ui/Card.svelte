<script lang="ts">
  import Color       from 'color';
  import { onMount } from 'svelte';

  interface Props {
    color?: string;
    header?: import('svelte').Snippet;
    children?: import('svelte').Snippet;
  }

  let { color = 'lime', header, children }: Props = $props();

  // Detect if the browser prefers dark mode
  let prefersDarkMode = $state(false);

  let backgroundColor: string = $derived(prefersDarkMode ? Color(color).darken(0.4).rgb() : Color(color).lighten(0.4).rgb());
  let fontColor: string       = $derived(prefersDarkMode ? Color(color).lighten(0.8).rgb() : Color(color).darken(0.5).rgb());
  let bodyColor: string       = $derived(Color(backgroundColor).isLight() ? 'black' : 'white');

  onMount(
    () =>
      (prefersDarkMode = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches)
  );
</script>

<div
        class="card"
        style:background-color={backgroundColor}
        style:color={fontColor}
>
  <div class="header">
    {@render header?.()}
  </div>
  <div class="body" style:color={bodyColor}>
    {@render children?.()}
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

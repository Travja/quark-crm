<script lang="ts">
  import '../app.css';
  import TitleBar from '$lib/TitleBar.svelte';
  import { onDestroy, onMount } from 'svelte';
  import type { ApiWindow } from '@types/global';
  import { get, writable } from 'svelte/store';

  let win: ApiWindow;
  let prev = { x: 50, y: 50 };
  let coords = writable({});
  // let coords = tweened(undefined, {
  //   duration: 200,
  //   easing: cubicInOut
  // });
  let mouseDown = false;
  let unsub;

  onMount(() => {
    win = window as unknown as ApiWindow;
    // coords.set({x: xx, y: yy})
    unsub = coords.subscribe(({ x, y }) => {
      if (mouseDown) {
        win.electron?.move(x, y);
      }
    });
  });

  onDestroy(() => {
    if (unsub) unsub();
  });

  const move = (event: MouseEvent) => {
    if (mouseDown) {
      const c = get(coords);
      coords.set({ x: event.x - prev.x, y: event.y - prev.y });
      prev = { x: event.x, y: event.y };
    }
  };

  const down = (event: MouseEvent) => {
    prev = { x: event.x, y: event.y };
    mouseDown = true;
  };
</script>

<svelte:window
  on:mousemove={move}
  on:mousedown={down}
  on:mouseup={() => (mouseDown = false)}
/>

<header>
  {#if window.electron}
    <TitleBar />
  {/if}
  <slot name="header" />
</header>
<main>
  <slot />
</main>

<style>
  header {
    background-color: var(--bg-color);
  }
</style>

<script lang='ts'>

  import type { ApiWindow } from '@types/global';
  import { onMount } from 'svelte';

  let win: ApiWindow;
  let focused = false;

  onMount(async () => {
    win = window as unknown as ApiWindow;
    win.electron.onFocus(() => focused = true);
    win.electron.onBlur(() => focused = false);

    focused = await win.electron.isFocused();
  });
</script>

<div id='title-bar' class:focused={focused}>
  <div class='nav-container'>
    <span
      class='ui-button material-icons'
      on:click={win.electron.showDevTools}>info</span>
    <span class='ui-button material-icons'
          on:click={win.electron.minimize}>minimize</span>
    <span class='ui-button material-icons'
          on:click={win.electron.maximize}>crop_square</span>
    <span class='ui-button close-button material-icons'
          on:click={win.electron.close}>close</span>
  </div>
</div>

<style>
  #title-bar {
    -webkit-app-region: drag;
    display: flex;
    justify-content: flex-end;
    background-color: var(--title-bg-color);
    overflow: hidden;
    transition: background-color 1s ease;
  }

  #title-bar.focused {
    background-color: var(--title-accent-color);
  }

  .nav-container {
    -webkit-app-region: no-drag;
    display: flex;
    position: relative;
    box-shadow: 0 0 0.5em #000;
  }

  span {
    margin: 0;
  }

  .close-button {
  }

  .close-button:hover {
    background-color: red;
  }

  .ui-button.material-icons {
    font-size: 1.3em;
  }
</style>

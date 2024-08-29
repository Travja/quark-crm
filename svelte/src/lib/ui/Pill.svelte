<script lang="ts">
  import Color from 'color';

  export let color: string = 'var(--ui-button-bg)';
  export let fg: string = 'auto';
  export let hover = false;
  export let wrap = false;
  let foregroundColor = 'var(--fg-color)';
  let hoverColor = 'var(--ui-button-hover)';

  const decideForeground = () => {
    if (color.startsWith('var') || fg !== 'auto') {
      if (fg === 'auto') {
        foregroundColor = 'var(--fg-color)';
      } else {
        foregroundColor = fg;
      }
      return;
    }

    // Extract the RGB values from the color string and convert them to HSL
    // then calculate a contrasting color for the text
    const isLight = Color(color).isLight();
    foregroundColor = isLight ? 'black' : 'white';
    hoverColor = Color(color).darken(0.15).hex();
  };

  $: if (color || fg) decideForeground();
</script>

<span
  on:click
  on:keypress
  class="pill"
  class:hover
  class:wrap
  style:--pill-bg-color={color}
  style:--pill-fg-color={foregroundColor}
  style:--hover-color={hover ? hoverColor : 'unset'}
  role="button"
  tabindex="0"
>
  <slot></slot>
</span>

<style>
  .pill {
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    padding: 0.25em 0.5em;
    margin: 0.25em;
    border-radius: 0.5em;
    background-color: var(--pill-bg-color);
    color: var(--pill-fg-color);

    font-size: 0.8rem;
  }

  .hover {
    cursor: pointer;
  }

  .hover:hover {
    background-color: var(--hover-color);
  }

  .wrap {
    white-space: unset;
  }
</style>

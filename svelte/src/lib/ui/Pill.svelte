<script lang="ts">
  import Color from 'color';

  export let color: string = 'var(--ui-button-bg)';
  let foregroundColor = 'var(--fg-color)';

  const decideForeground = () => {
    if (color === 'var(--ui-button-bg)') {
      return;
    }

    // Extract the RGB values from the color string and convert them to HSL
    // then calculate a contrasting color for the text
    const isLight = Color(color).isLight();
    foregroundColor = isLight ? 'black' : 'white';
  };

  $: if (color) decideForeground();
</script>

<span
  class="pill"
  style="--pill-bg-color: {color}; --pill-fg-color: {foregroundColor};"
>
  <slot></slot>
</span>

<style>
  .pill {
    white-space: nowrap;
    display: inline-block;
    padding: 0.25em 0.5em;
    margin: 0.25em;
    border-radius: 0.5em;
    background-color: var(--pill-bg-color);
    color: var(--pill-fg-color);

    font-size: 0.8rem;
  }
</style>

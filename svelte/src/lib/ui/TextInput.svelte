<script>
  export let value;
  export let margin = '0.5em';
  export let placeholder = '';
  export let type = 'text';
  export let underlineColor = 'var(--accent-color)';
  export let fontSize = '1.5em';

  let focused = false;
</script>

<div class="wrapper" style="margin: {margin}; --font-size: {fontSize}">
  {#if type == 'text'}
    <input
      type="text"
      {placeholder}
      bind:value
      on:focus={() => (focused = true)}
      on:blur={() => (focused = false)}
      on:keydown
      on:keypress
      on:keyup
    />
  {:else if type == 'password'}
    <input
      type="password"
      {placeholder}
      bind:value
      on:focus={() => (focused = true)}
      on:blur={() => (focused = false)}
      on:keydown
      on:keypress
      on:keyup
    />
  {:else}
    Unknown type
  {/if}
  <div
    class="border"
    class:shown={focused}
    style="background-color: {underlineColor}"
  />
</div>

<style>
  input {
    display: block;
    padding: 0.25em;
    font-size: var(--font-size);
    text-align: center;
    background-color: var(--ui-button-bg);
    color: var(--fg-color);
    border: none;
  }

  input:focus {
    outline: none;
  }

  .wrapper {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
  }

  .border {
    height: 2px;
    width: 0px;
    background-color: var(--accent-color);
    transition: width 0.5s ease;
  }

  .border.shown {
    height: 2px;
    width: 100%;
  }
</style>

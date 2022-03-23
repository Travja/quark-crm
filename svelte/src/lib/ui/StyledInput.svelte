<script>
  export let value;
  export let margin = '0.5em';
  export let placeholder = '';
  export let type = 'text';
  export let underlineColor = 'var(--accent-color)';
  export let fontSize = '1.5em';

  let focused = false;
</script>

<div class='wrapper' style='margin: {margin}; --font-size: {fontSize}'>
  {#if type == 'text'}
    <input
      type='text'
      {placeholder}
      bind:value
      on:focus={() => focused = true}
      on:blur={() => focused = false}
      on:keydown
      on:keypress
      on:keyup
    />
  {:else if type == 'date'}
    <input
      type='date'
      {placeholder}
      bind:value
      on:focus={() => focused = true}
      on:blur={() => focused = false}
      on:keydown
      on:keypress
      on:keyup
    />
  {:else if type == 'password'}
    <input
      type='password'
      {placeholder}
      bind:value
      on:focus={() => focused = true}
      on:blur={() => focused = false}
      on:keydown
      on:keypress
      on:keyup
    />
  {:else if type == 'select'}
    <select
      {placeholder}
      bind:value
      on:change
      on:focus={() => focused = true}
      on:blur={() => focused = false}
    >
      <slot />
    </select>
  {:else}
    Unknown type
  {/if}
  <div
    class='border'
    class:shown={focused}
    style='background-color: {underlineColor}'
  />
</div>

<style>
    input, select {
        display: block;
        padding: 0.25em;
        font-size: var(--font-size);
        background-color: var(--ui-button-bg);
        color: var(--fg-color);
        border: none;
        width: 100%;
    }

    input {
        text-align: center;
    }

    input:focus, select:focus {
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
        width: 100%;
    }

    @media (prefers-color-scheme: dark) {
        input[type="date"]::-webkit-calendar-picker-indicator {
            background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNSIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjZmZmZmZmIiBkPSJNMjAgM2gtMVYxaC0ydjJIN1YxSDV2Mkg0Yy0xLjEgMC0yIC45LTIgMnYxNmMwIDEuMS45IDIgMiAyaDE2YzEuMSAwIDItLjkgMi0yVjVjMC0xLjEtLjktMi0yLTJ6bTAgMThINFY4aDE2djEzeiIvPjxwYXRoIGZpbGw9Im5vbmUiIGQ9Ik0wIDBoMjR2MjRIMHoiLz48L3N2Zz4=');
        }
    }

</style>

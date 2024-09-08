<!--suppress CssUnresolvedCustomProperty -->
<script lang="ts">
  export let value: boolean;
  export let left = 'True';
  export let right = 'False';
  export let color = '#222';
  export let toggleColor = 'var(--accent-color)';
  export let inline = true;
</script>

<input type="checkbox" class="hidden" id="permission" bind:checked={value} />
<div
  class="toggle"
  class:selected={value}
  style:--color={color}
  style:--toggleColor={toggleColor}
  class:inline
>
  <div
    role="button"
    tabindex="0"
    class:active={value}
    on:click={() => (value = true)}
    on:keypress={(e) => {
      if (e.key === 'Enter') value = true;
    }}
  >
    {left}
  </div>
  <div
    role="button"
    tabindex="0"
    class:active={!value}
    on:click={() => (value = false)}
    on:keypress={(e) => {
      if (e.key === 'Enter') value = false;
    }}
  >
    {right}
  </div>
</div>

<style>
  .hidden {
    display: none;
  }

  .toggle {
    overflow: hidden;
    position: relative;
    display: flex;
    text-align: center;
    background-color: var(--color);
    border: 1px solid var(--fg-color);
    border-radius: 0.4rem;
    user-select: none;
    -webkit-user-select: none;

    align-self: var(--align-self, auto);
  }

  .inline {
    display: inline-flex;
  }

  .toggle:before {
    content: '';
    height: 100%;
    width: 50%;
    border-radius: 0.4rem;
    background-color: var(--toggleColor);
    position: absolute;
    left: 0;
    transition: left 350ms ease-in-out;
  }

  .toggle:not(.selected):before {
    left: 50%;
  }

  .toggle > div {
    position: relative;
    flex: 1;
    width: 5%;
    padding: 0.2rem;
    padding-inline: 1.5rem;

    display: flex;
    justify-content: center;

    color: var(--fg-color);
    transition: color 350ms ease-in-out;
  }

  .toggle > div:hover {
    cursor: pointer;
  }

  .toggle > .active {
    color: black;
  }
</style>

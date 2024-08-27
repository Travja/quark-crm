<script lang="ts">
  export let value: any;
  export let id: string;
  export let type: 'number' = 'number';
</script>

<div class="sp-in">
  {#if type === 'number'}
    <input
      class="sp-input"
      name="test"
      placeholder=" "
      bind:value
      type="number"
      {id}
    />
  {:else}
    <input
      class="sp-input"
      name="test"
      placeholder=" "
      bind:value
      {id}
    />
  {/if}
  <label for="test"><slot /></label>
</div>

<style>
  .sp-in {
    position: relative;
    margin: 0.5rem 0;
  }

  .sp-in label {
    position: absolute;
    top: 0.5rem;
    left: 0;
    color: var(--fg-color-light);
    padding-inline: 0.5rem;
    pointer-events: none;
    transition: all 0.2s ease;
    /*background-color: red;*/
    /*height: 5px;*/

    transform-origin: left center;

    display: flex;
    align-items: center;
  }

  .sp-in:has(input:not(:placeholder-shown)) label,
  .sp-in:has(input:focus) label {
    color: var(--fg-color);
    background-color: var(--bg-color);
    height: 5px;
    transform: translate(0.4rem, -0.7rem) scale(0.8);
  }

  .sp-input {
    border: 1px solid var(--fg-color-light);
    border-radius: 0.3rem;
    background-color: var(--bg-color);
    color: var(--fg-color);
    width: 100%;
    box-sizing: border-box;
    font-size: 1rem;
    padding: 0.5rem;
    margin-bottom: 1px;
  }

  .sp-input:focus {
    outline: none;
    margin-bottom: 0;
    border-bottom: 2px solid var(--title-accent-color);
  }
</style>

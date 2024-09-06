<script lang="ts">
  import type { AdditionalPrint } from '@types/global';
  import Pill from '$lib/ui/Pill.svelte';
  import { createEventDispatcher } from 'svelte';
  import { formatCurrency } from '$lib/api/util';

  export let print: AdditionalPrint;

  const dispatch = createEventDispatcher();
</script>

<Pill color="#5276ff" wrap>
  <div class="container">
    <span class="bold">{print.quantity}x</span>
    <span>{print.printType}</span>
    {#if print.printSize}
      <span>- {print.printSize}</span>
    {/if}
    {#if print.frame}
      <div class="frame">{print.frame}</div>
    {/if}

    <span> - {formatCurrency(print.cost + print.frameCost)}</span>
    <span
      role="button"
      tabindex="0"
      class="delete material-symbols-outlined"
      on:click={() => dispatch('delete', this)}
      on:keypress={(e) => {
        if (e.key === 'Enter') dispatch('delete', this);
      }}>delete</span
    >
  </div>
</Pill>

<style>
  .container {
    position: relative;
  }

  .bold {
    font-size: 1.1em;
  }

  .frame {
    margin-left: 0.75em;
  }

  .delete {
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);

    font-size: 1.5em;
    background-color: rgba(255, 0, 0, 0.6);
    color: white;
    padding: 0.25em;
    border-radius: 1rem;
    aspect-ratio: 1;

    opacity: 0;
    transition: opacity 0.5s ease;
  }

  .container:hover .delete {
    opacity: 1;
  }
</style>

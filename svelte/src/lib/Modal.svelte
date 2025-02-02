<!--suppress CssUnresolvedCustomProperty -->
<script lang="ts">
  import { preventDefault, stopPropagation, stopImmediatePropagation } from 'svelte/legacy';

  import { fade, fly } from 'svelte/transition';
  import { clickOutside } from './api/clickoutside';
  import { createEventDispatcher } from 'svelte';

  interface Props {
    width?: string;
    open?: boolean;
    children?: import('svelte').Snippet;
  }

  let { width = 'auto', open = $bindable(false), children }: Props = $props();

  const dispatch = createEventDispatcher();

  const closeModal = (e?: CustomEvent) => {
    open = false;
    dispatch('close');
    e?.detail?.stopPropagation();
  };

  const checkClose = (e: KeyboardEvent) => {
    if (e.key == 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    }
  };
</script>

<svelte:window onkeyup={checkClose} />
{#if open}
  <div
    role="navigation"
    class="backdrop"
    transition:fade
    draggable="true"
    ondragstart={stopImmediatePropagation(stopPropagation(preventDefault(() =>
      true)))}
    ontouchstart={stopPropagation(() => true)}
  >
    <div
      role="dialog"
      class="modal-content"
      use:clickOutside
      onoutclick={closeModal}
      transition:fly={{ y: -200 }}
      style:--width={width}
    >
      <div class="wrapper">
        {@render children?.()}
      </div>
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 100;

    display: flex;
    justify-content: center;
    align-items: center;

    background: rgba(0, 0, 0, 0.6);
  }

  .modal-content {
    display: flex;
    justify-content: center;
    background-color: var(--bg-color);
    padding: 1rem;
    border: 2px solid #444;
    border-radius: 0 1.5rem 0 1.5rem;
    box-shadow: 0 0 1rem #222;
    width: var(--width);
    min-height: 15rem;
    max-height: 85vh;
    max-width: 90%;
    margin: 2rem;
    box-sizing: border-box;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    flex: 1;
  }

  @media screen and (min-width: 500px) {
    .modal-content {
      min-width: var(--width);
    }
  }
</style>

<script lang="ts">
  import { run, createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();

  interface Props {
    id?: string;
    checked?: boolean;
    indeterminate?: boolean;
  }

  let { id = '', checked = $bindable(false), indeterminate = false }: Props = $props();

  let box: HTMLInputElement = $state();

  run(() => {
    if (box) box.indeterminate = indeterminate;
  });
</script>

<input type="checkbox" bind:this={box} bind:checked {id} onchange={bubble('change')}/>

<style>
</style>

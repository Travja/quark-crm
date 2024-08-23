<script lang="ts">
  export let id = '';

  export let checked = false;
  export let indeterminate = false;

  let box: HTMLInputElement;

  $: if (box) box.indeterminate = indeterminate;
</script>

<input type="checkbox" bind:this={box} bind:checked {id} on:change/>

<style>
</style>

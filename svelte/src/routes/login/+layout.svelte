<script lang="ts">
  import ReusableLayout from '$lib/ReusableLayout.svelte';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<ReusableLayout>
  <div id="main">
    {@render children?.()}
  </div>
</ReusableLayout>

<style>
  #main {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

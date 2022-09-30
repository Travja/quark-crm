<script lang='ts'>
  import ReusableLayout from '$lib/ReusableLayout.svelte';
</script>

<ReusableLayout>
  <div id='main'>
    <slot />
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

<script lang="ts">
  import { page } from '$app/stores';
</script>

{#if $page.status == 404}
  <div id="main">
    <div id="emoji">😨</div>
    <h1>Page not found!</h1>
  </div>
{/if}

<style>
  #emoji {
    font-size: 3rem;
  }

  #main {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    font-weight: bold;
    align-items: center;
    justify-content: center;
  }
</style>

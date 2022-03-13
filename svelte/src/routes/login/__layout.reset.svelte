<script>
  import '../../app.css';
  import TitleBar from '$lib/TitleBar.svelte';
</script>

<header>
  <TitleBar />
</header>
<main>
  <slot />
</main>

<style>
    header {
        background-color: var(--bg-color);
    }

    main {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
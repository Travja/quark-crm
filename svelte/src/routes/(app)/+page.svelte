<script>
  import DataContainer from '$lib/DataContainer.svelte';
</script>

<container class='center'>
  <h1>At a Glance</h1>
  <div class='actions-container'>
    <div>Quick Actions</div>
    <div class='card' on:click={() => console.log('test')}>Test</div>
  </div>
  <DataContainer />
</container>

<style>

    container {
        height: 100%;
        width: 100%;
    }

    h1 {
        margin-top: 0;
    }

    .card {
        position: relative;
        padding: 2em;
        margin: 0.5em;
        font-size: 1em;
        background-color: var(--ui-button-bg);
        box-shadow: -4px 4px 3px rgba(0, 0, 0, 0.4);

        transition: font-size 0.5s ease,
        padding 0.5s ease;
    }

    .card:hover {
        font-size: 1.2em;
    }

    .card::after {
        content: ' ';
        position: absolute;
        top: 0;
        right: 0;
        height: 0;
        width: 0;
        border-left: 1.3em solid var(--bg-secondary);
        border-top: 1.3em solid var(--bg-color);
        box-shadow: -1px 1px 1px rgba(0, 0, 0, 0.6);
    }

    .actions-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

</style>

<script>
</script>

<div id='title-bar'>
  <div class='nav-container'>
    <span class='ui-button material-icons' on:click={window.electron.showDevTools}>info</span>
    <span class='ui-button material-icons' on:click={window.electron.minimize}>minimize</span>
    <span class='ui-button material-icons' on:click={window.electron.maximize}>crop_square</span>
    <span class='ui-button close-button material-icons' on:click={window.electron.close}>close</span>
  </div>
</div>

<style>
    #title-bar {
        -webkit-app-region: drag;
        display: flex;
        justify-content: flex-end;
        background-color: var(--title-bg-color);
        overflow: hidden;
    }

    .nav-container {
        -webkit-app-region: no-drag;
        display: flex;
        position: relative;
        box-shadow: 0 0 0.5em #000;
    }

    span {
        margin: 0;
    }

    .close-button {
    }

    .close-button:hover {
        background-color: red;
    }
</style>
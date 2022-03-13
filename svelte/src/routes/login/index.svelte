<script lang='ts'>
  let username: string,
    password: string;
</script>

<section>
  <h1>Login</h1>
  <input type='text' placeholder='Username' bind:value={username} />
  <input type='password' placeholder='Password' bind:value={password} />
  <div class='button'>Submit</div>
</section>

<style>

    h1 {
        margin: 0;
    }

    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    input {
        margin: 0.5em;
        font-size: 1.5em;
        width: 80%;
        text-align: center;
        background-color: var(--ui-button-bg);
        color: var(--fg-color);
    }

</style>

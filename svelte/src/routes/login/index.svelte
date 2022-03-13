<script lang='ts'>
  import TextInput from '$lib/ui/TextInput.svelte';

  let username: string, password: string;

  const login = async () => {
    window.electron.login().then((res) => console.log(res));
  };
</script>

<section>
  <h1>Login</h1>
  <TextInput bind:value={username} placeholder='Username' />
  <TextInput bind:value={password} type='password' placeholder='Password' />
  <div class='button' on:click={login}>Submit</div>
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
</style>

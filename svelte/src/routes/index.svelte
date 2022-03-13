<script>
  import LoginForm from '../lib/LoginForm.svelte';
</script>

<container>
  Welcome to Quark CRM
  <LoginForm />
  <div on:click={() => console.log("test")}>Test</div>
</container>

<style>

</style>
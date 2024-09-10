<script lang="ts">
  import { afetch, apiUrl } from '$lib/http.js';
  import type { Artist, User } from 'global.js';
  import LabeledInput from '$lib/ui/LabeledInput.svelte';
  import { artists, refreshArtists } from '$lib/data';

  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const phoneRegex = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;

  let user: User = {
    id: '',
    username: '',
    email: ''
  };

  let success = '';
  let error = '';

  async function handleSubmit() {
    error = '';
    success = '';

    // Validate that first + last name are filled in, then use regex to validate email and phone
    if (!user.username) {
      error = 'Username is required';
      return;
    }

    if (!emailRegex.test(user.email)) {
      error = 'Invalid email';
      return;
    }

    afetch(`${apiUrl}/api/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
      .then((res) => {
        if (res.ok) {
          console.log('User created');
          success = `User ${user.username} created`;
          user = {
            id: '',
            username: '',
            email: ''
          };

          refreshArtists();
        } else {
          res.text().then((text) => {
            console.error('Failed to create user', text);
            error = text;
          });
        }
      })
      .catch((err) => {
        console.error('Failed to create user', err);
        error = 'Failed to create user';
      });
  }
</script>

<slot />
<form class="form" on:submit|preventDefault={handleSubmit}>
  <div class="flex">
    <LabeledInput bind:value={user.username}>Username</LabeledInput>

    <LabeledInput bind:value={user.email} type="email">Email</LabeledInput>
  </div>

  {#if success}
    <div class="success">
      {success}
    </div>
  {/if}

  {#if error}
    <div class="error">
      {error}
    </div>
  {/if}

  <div
    class="button"
    role="button"
    tabindex="0"
    on:click={handleSubmit}
    on:keypress={(e) => {
      if (e.key === 'Enter') handleSubmit();
    }}
  >
    Create
  </div>
</form>

<style>
  .flex {
    width: 100%;
    display: flex;
    gap: 1rem;
    align-content: stretch;
  }

  .success {
    color: green;
    margin-top: 1rem;
  }

  .error {
    color: red;
    margin-top: 1rem;
  }

  .button {
    margin: 1rem 0;
  }
</style>

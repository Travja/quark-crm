<!--suppress XmlInvalidId -->
<script lang='ts'>
  import StyledInput from '$lib/ui/StyledInput.svelte';
  import { slide } from 'svelte/transition';
  import { onMount } from 'svelte';

  export let id: string = undefined;
  export let value: any = undefined;
  export let type = 'text';
  export let placeholder = '';
  export let group: any = undefined;
  export let options: any[] = undefined;
  export let disabled = false;
  export let fillSpace = false;
  export let noTransition = false;
  export let backgroundColor = undefined;
  export let color = undefined;

  onMount(() => {
    if (options) type = 'select';
  });
</script>

<div in:slide|local={{duration: noTransition ? 0 : 500}} out:slide class:fill={fillSpace}>
  <label for={id} class:centered={type == 'checkbox'}>
    <slot />
  </label>
  <StyledInput {id}
               name={id}
               {type}
               {placeholder}
               bind:value={value}
               bind:group={group}
               {disabled}
               {backgroundColor}
               {color}
  >
    {#if options}
      {#each options as option}
        <option value='{option}'>{option}</option>
      {/each}
    {:else}
      <slot name='value' />
    {/if}
  </StyledInput>
</div>

<style>
    div {
        display: flex;
        flex-direction: column;
    }

    label:empty {
        display: none;
    }

    label:not(:empty) {
        font-size: 0.9rem;
        margin: 0.5rem 0 0.25rem;
    }

    .centered {
        text-align: center;
    }

    .fill {
        flex: 1;
        width: 100%;
    }
</style>
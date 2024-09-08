<script lang="ts">
  import StyledInput from '$lib/ui/StyledInput.svelte';
  import { slide } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { deepEqual } from '$lib/api/util';

  export let id: string = undefined;
  export let value: any = undefined;
  export let type:
    | 'text'
    | 'number'
    | 'date'
    | 'datetime'
    | 'password'
    | 'select'
    | 'textarea'
    | 'checkbox'
    | 'radio' = 'text';
  export let placeholder = '';
  export let group: any = undefined;
  export let options: any[] = undefined;
  export let disabled = false;
  export let readonly = false;
  export let fillSpace = false;
  export let noTransition = false;
  export let backgroundColor = undefined;
  export let color = undefined;

  export let canCopy = false;

  /**
   * Function to render the value of the input (specifically for select)
   * @param value The value to render
   */
  export let render: (value: any) => string = (value) => value;

  onMount(() => {
    if (options) type = 'select';
  });
</script>

<div
  class:textarea={type === 'textarea'}
  in:slide|local={{ duration: noTransition ? 0 : 500 }}
  out:slide
  class:fill={fillSpace}
>
  <label for={id} class:centered={type === 'checkbox'}>
    <slot />
  </label>
  <StyledInput
    {id}
    name={id}
    {type}
    {placeholder}
    bind:value
    bind:group
    {disabled}
    {readonly}
    {backgroundColor}
    {color}
    {canCopy}
  >
    {#if options}
      {#each options as option}
        <option value={option} selected={deepEqual(value, option)}>
          {render && option ? render(option) : option || ''}
        </option>
      {/each}
    {:else}
      <slot name="value" />
    {/if}
  </StyledInput>
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
  }

  .textarea {
    height: 100%;
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

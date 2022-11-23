<!--suppress XmlDuplicatedId, XmlInvalidId -->
<script lang='ts'>
  import * as moment from 'moment';

  export let id: string = undefined;
  export let name: string = undefined;
  export let value: any = undefined;
  export let margin = '0';
  export let placeholder = '';
  export let type = 'text';
  export let underlineColor = 'var(--accent-color)';
  export let fontSize = '1rem';
  export let disabled = false;
  export let group: any = undefined;

  export let min: number = undefined;
  export let max: number = undefined;
  export let step: number = undefined;

  let focused = false;
  let offset = 0;
  let element: HTMLInputElement;
  let internalDate: string;

  const processVal = (val): void => {
    if (!val || (type != 'date' && type != 'datetime')) return;
    if (typeof (val) == 'string') {
      if (type == 'date') {
        console.log("Yay")
        let mom = moment(val, moment.HTML5_FMT.DATETIME_LOCAL).startOf('day');
        value = mom.toISOString().split('Z')[0];//.replace(/\.0{3}/, '');
        internalDate = value.split('T')[0];
      }
      return;
    }

    let mom = moment(val, moment.HTML5_FMT.DATETIME_LOCAL).startOf('minute');
    if (offset == 0) {
      offset = mom.utcOffset() / 60;
    }

    let convert;
    if (type == 'date') {
      convert = mom.toISOString().split('T')[0];
      internalDate = convert;
    }
    mom = mom.add({ hour: offset });
    convert = mom.toISOString().split('Z')[0];

    value = convert;
  };

  $: processVal(internalDate ? internalDate : value);
  $: if (type == 'checkbox' && typeof value == 'boolean') {
    focused = value;
  }

  const stepUp = () => {
    if (disabled) return;
    element.stepUp();
    element.focus();
  };

  const stepDown = () => {
    if (disabled) return;
    element.stepDown();
    element.focus();
  };
</script>

<div class='styled-input wrapper'
     class:check={type=='checkbox'}
     style='margin: {margin}; --font-size: {fontSize}; --background-color: {underlineColor}'>
  {#if type == 'text'}
    <input
      {disabled}
      {id}
      {name}
      type='text'
      {placeholder}
      bind:value
      bind:this={element}
      on:focus={() => focused = true}
      on:blur={() => focused = false}
      on:keydown
      on:keypress
      on:keyup
    />
  {:else if type == 'number'}
    <div class='input-wrap'>
      <div class='buttons hidden' class:disabled={disabled} on:click={() => element.focus()}>
        <span class='material-icons'>keyboard_arrow_up</span>
      </div>
      <input
        {disabled}
        {id}
        {name}
        type='number'
        {placeholder}
        {min}
        {max}
        {step}
        bind:value
        bind:this={element}
        on:focus={() => focused = true}
        on:blur={() => focused = false}
        on:keydown
        on:keypress
        on:keyup
      />
      <div class='buttons' class:disabled={disabled}>
        <span class='material-icons' on:click={stepUp}>keyboard_arrow_up</span>
        <span class='material-icons' on:click={stepDown}>keyboard_arrow_down</span>
      </div>
    </div>
  {:else if type == 'date'}
    <input
      {disabled}
      {id}
      {name}
      type='date'
      {placeholder}
      bind:value={internalDate}
      bind:this={element}
      on:focus={() => focused = true}
      on:blur={() => focused = false}
      on:keydown
      on:keypress
      on:keyup
    />
  {:else if type == 'datetime'}
    <input
      {disabled}
      {id}
      {name}
      type='datetime-local'
      {placeholder}
      bind:value={value}
      bind:this={element}
      on:focus={() => focused = true}
      on:blur={() => focused = false}
      on:keydown
      on:keypress
      on:keyup
    />
  {:else if type == 'password'}
    <input
      {disabled}
      {id}
      {name}
      type='password'
      {placeholder}
      bind:value
      bind:this={element}
      on:focus={() => focused = true}
      on:blur={() => focused = false}
      on:keydown
      on:keypress
      on:keyup
    />
  {:else if type == 'select'}
    <select
      {disabled}
      {id}
      {name}
      {placeholder}
      bind:value
      bind:this={element}
      on:change
      on:focus={() => focused = true}
      on:blur={() => focused = false}
    >
      <slot />
    </select>
  {:else if type == 'textarea'}
    <textarea
      {disabled}
      {id}
      {name}
      {placeholder}
      bind:value
      bind:this={element}
      on:change
      on:focus={() => focused = true}
      on:blur={() => focused = false}
    />
  {:else if type == 'checkbox'}
    <input type='checkbox'
           {disabled}
           {id}
           {name}
           bind:checked={value}
           bind:this={element}
           on:change
    />
    <label tabindex='0'
           for='{id}'
           class='checkbox material-icons'
           class:checked={value}>check</label>
  {:else if type == 'radio'}
    <label for='{id}' class='radio-wrap' class:checked={group == value}>
      <slot />
      <input type='radio'
             {disabled}
             {id}
             {name}
             value='{value}'
             bind:group='{group}'
             bind:this={element}
             on:change
      />
    </label>
  {:else}
    Unknown type
  {/if}

  {#if type != 'checkbox' && type != 'radio'}
    <label
      for='{id}'
      class='border'
      class:shown={focused}
      class:check={type=='checkbox'}
    />
  {/if}
</div>

<style>
  input:not([type='checkbox']), select, textarea {
    display: block;
    flex: 1;
    padding: 0.5rem 0.5rem calc(0.5rem - 2px);
    font-size: var(--font-size);
    background-color: var(--ui-button-bg);
    color: var(--fg-color);
    border: none;
    width: 100%;
    box-sizing: border-box;
    font-family: Arial, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;
  }

  input:not([type='checkbox']):not([type='number']), select, textarea {
    min-width: 150px;
  }

  input {
    text-align: center;
  }

  input[type='checkbox'], input[type='radio'] {
    position: absolute;
    display: none;
  }

  .checkbox {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ui-button-bg);
    background-color: var(--ui-button-bg);
    border: 2px solid var(--ui-button-bg);
    border-radius: 0.5rem;
    box-sizing: border-box;
    transition: border-color 0.5s ease, color 0.5s ease;
    user-select: none;
  }

  .checkbox.checked {
    color: var(--fg-color);
    border-color: var(--background-color);
  }

  input:focus, select:focus {
    outline: none;
  }

  .wrapper {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }

  .wrapper:not(.check) {
    background-color: var(--ui-button-bg);
  }

  /*:not(.check)*/

  .border {
    height: 2px;
    width: 0px;
    background-color: var(--background-color);
    transition: width 0.5s ease;
  }

  label.border.check {
    background-color: red;
  }

  .border.shown:not(.check) {
    width: 100%;
    background-color: var(--accent-color);
  }

  @media (prefers-color-scheme: light) {
    input[type="date"]::-webkit-calendar-picker-indicator,
    input[type="datetime-local"]::-webkit-calendar-picker-indicator {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNSIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjZmZmZmZmIiBkPSJNMjAgM2gtMVYxaC0ydjJIN1YxSDV2Mkg0Yy0xLjEgMC0yIC45LTIgMnYxNmMwIDEuMS45IDIgMiAyaDE2YzEuMSAwIDItLjkgMi0yVjVjMC0xLjEtLjktMi0yLTJ6bTAgMThINFY4aDE2djEzeiIvPjxwYXRoIGZpbGw9Im5vbmUiIGQ9Ik0wIDBoMjR2MjRIMHoiLz48L3N2Zz4=');
    }
  }

  textarea {
    resize: none;
  }

  textarea:focus {
    outline: none;
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    display: none;
  }

  .input-wrap {
    display: flex;
    width: 100%;
    min-width: 150px;
  }

  .buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--ui-button-bg);
    color: var(--ui-button-bg);
    transition: color 0.5s ease;
  }

  .buttons .material-icons {
    text-align: center;
    font-size: 1rem;
    padding: 0 0.5rem;
  }

  .input-wrap:hover .buttons .material-icons {
    color: var(--fg-color);
  }

  .buttons:hover {
    cursor: pointer;
  }

  .buttons .material-icons:hover {
    background-color: var(--ui-button-hover);
  }

  .buttons.hidden .material-icons {
    opacity: 0;
  }

  input[disabled] {
    color: rgba(125, 125, 125, 0.5);
    background-color: rgba(0, 0, 0, 0.5);
  }

  .buttons.disabled {
    background-color: rgba(0, 0, 0, 0.5);
  }

  .radio-wrap {
    display: flex;
    width: 100%;
    border: 2px solid var(--ui-button-bg);
    background-color: var(--ui-button-bg);
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    transition: border 0.5s ease;
    padding: 0.5rem;
  }

  .radio-wrap.checked {
    border: 2px solid var(--accent-color);
  }
</style>

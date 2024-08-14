<script>
  import { OrderStatus, TreeStatus } from '$lib/models/order';
  import LabeledInput from '$lib/ui/LabeledInput.svelte';

  let activeOnly = true;
</script>

<div class="filter-wrapper">
  <LabeledInput type="checkbox" bind:value={activeOnly}>
    Only Active Orders
  </LabeledInput>

  <br />
  <h3>Order Statuses</h3>
  <label class="select-all"><input type="checkbox" />Select All</label>
  <label><input type="checkbox" />{OrderStatus.ORDER_PLACED}</label>
  <label><input type="checkbox" />{OrderStatus.PAID}</label>
  <label><input type="checkbox" />{OrderStatus.INVOICED}</label>
  <label><input type="checkbox" />{OrderStatus.ON_HOLD}</label>

  <br />
  <h3>Tree Statuses</h3>
  <label class="select-all"><input type="checkbox" />Select All</label>
  <label><input type="checkbox" />{TreeStatus.CREATING}</label>
  <label><input type="checkbox" />{TreeStatus.ASSIGNED}</label>
  <label><input type="checkbox" />{TreeStatus.APPROVED}</label>
  <label><input type="checkbox" />{TreeStatus.ADJUSTING}</label>
  <label><input type="checkbox" />{TreeStatus.RESUBMITTED}</label>
</div>

<style>
  h3 {
    text-decoration: underline;
    margin: 0 0 0 0.5rem;
  }

  label {
    margin-left: 1rem;
  }

  .filter-wrapper {
    display: flex;
    flex-direction: column;
    border: 2px solid black;
  }

  .select-all {
    font-style: italic;
  }
</style>

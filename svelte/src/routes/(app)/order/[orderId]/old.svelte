<!--suppress XmlInvalidId -->
<script lang='ts'>
  import { onMount } from 'svelte';
  import type { Order } from '$lib/models/order';
  import StyledInput from '$lib/ui/StyledInput.svelte';
  import { BranchStyle, TextLocation } from '$lib/models/order.js';

  export let data: Order;

  onMount(() => {
    // Do something
    console.log(data);
  });
</script>

<container>
  <div class='column'>
    <label for='order-status'>Order Status</label>
    <StyledInput id='order-status'
                 name='order-status'
                 bind:value={data.status} />

    <label for='order-date'>Order Date</label>
    <StyledInput id='order-date' name='order-date'
                 type='date'
                 bind:value={data.created} />

    <label for='request-date'>Due Date</label>
    <StyledInput id='request-date' name='request-date'
                 type='date'
                 bind:value={data.requestDate} />

    <label for='artist'>Artist</label>
    <StyledInput id='artist' name='artist'
                 bind:value={data.artist} />

    <label for='history'>History</label>
    <StyledInput id='history' name='history'
                 type='textarea'
                 placeholder='No history 😨'
                 value='' />
  </div>

  <div class='column'>
    <label for='tree-type'>Tree Type</label>
    <StyledInput id='tree-type' name='tree-type'
                 bind:value={data.type} />

    <label for='generations'>Generations</label>
    <StyledInput id='generations' name='generations'
                 bind:value={data.generations} />
    <div>
      <div class='section'>
        <div class='head'>Style</div>
        <StyledInput type='radio' id='style-1' name='style-1' bind:group={data.branchStyle}
                     value='{BranchStyle.STYLE_1}'>
          1
        </StyledInput>

        <StyledInput type='radio' id='style-2' name='style-2' bind:group={data.branchStyle}
                     value='{BranchStyle.STYLE_2}'>
          2
        </StyledInput>
      </div>
    </div>
    <div class='section'>
      <label for='background'>Background</label><br />
      <StyledInput id='background' name='background'
                   bind:value={data.background} />
    </div>

    <label for='fontColor'>Font Color</label>
    <StyledInput id='fontColor' name='fontColor'
                 bind:value={data.fontColor} />

    <label for='familyName'>Family Name</label>
    <StyledInput id='familyName' name='familyName'
                 bind:value={data.familyName} />

    <label for='established'>Established</label>
    <StyledInput id='established' name='established'
                 bind:value={data.established} />

    <label for='familyFont'>Font</label>
    <StyledInput id='familyFont' name='familyFont'
                 bind:value={data.familyFont} />
  </div>

  <div class='column-vertical'>
    <label for='notes'>Order Notes</label>
    <StyledInput type='textarea' id='notes'
                 name='notes'
                 placeholder='Notes...'
                 bind:value={data.notes} />

    <!-- TODO Figure out ground font-->
    <label for='groundText'>Ground</label>
    <StyledInput type='textarea' id='groundText'
                 name='groundText'
                 placeholder='Ground Text'
                 bind:value={data.groundText} />

    <div class='section'>
      <div class='vertical'>
        <!-- TODO Figure this out. Is this name location? Where does quote go? -->
        <StyledInput type='radio' id='left' name='left' bind:group={data.nameLocation} value='{TextLocation.LEFT}'>
          Left
        </StyledInput>
      </div>
      <div class='vertical'>
        <StyledInput type='radio' id='right' name='right' bind:group={data.nameLocation} value='{TextLocation.RIGHT}'>
          Right
        </StyledInput>
      </div>
    </div>
  </div>

  <div class='column triple-column'>
    <label for='vendor'>Vendor</label>
    <StyledInput id='vendor'
                 name='vendor'
                 placeholder='Pick a vendor'
                 bind:value={data.vendor} />
    <div></div>

    <label for='printType'>Print Type</label>
    <StyledInput id='printType'
                 name='printType'
                 bind:value={data.printType} />
    <label class='center-text'><strong>$ In</strong></label>
    <label for='printSize'>Print Size</label>
    <StyledInput id='printSize'
                 name='printSize'
                 bind:value={data.printSize} />
    <StyledInput id='printSizeValue'
                 name='printSizeValue'
                 type='number'
                 min='0'
                 bind:value={data.printCost} />

    <label for='hasDateBranches'>Date Branches</label>
    <StyledInput type='checkbox'
                 id='hasDateBranches'
                 name='hasDateBranches'
                 bind:value={data.hasDateBranches} />
    <StyledInput id='dateBranchValue'
                 name='dateBranchValue'
                 type='number'
                 min='0'
                 bind:value={data.dateBranchCost} />

    <label for='hasLeaves'>Leaves</label>
    <StyledInput type='checkbox'
                 id='hasLeaves'
                 name='hasLeaves'
                 bind:value={data.hasLeaves} />
    <StyledInput id='leavesValue'
                 name='leavesValue'
                 type='number'
                 min='0'
                 bind:value={data.leafCost} />

    <label for='roots'>Roots</label>
    <StyledInput id='roots'
                 name='roots'
                 bind:value={data.roots} />
    <StyledInput id='rootsValue'
                 name='rootsValue'
                 type='number'
                 min='0'
                 bind:value={data.rootCost} />

    <label for='updates'>Updates</label>
    <StyledInput id='updates'
                 name='updates'
                 type='number'
                 bind:value={data.updates} />
    <StyledInput id='updatesCharge'
                 name='updatesCharge'
                 type='number'
                 bind:value={data.updateCost}
    />

    <label for='coupon'>Discount</label>
    {#if data.coupon}
      <StyledInput id='coupon'
                   name='coupon'
                   placeholder='Coupon Code'
                   bind:value={data.coupon.code} />
      <StyledInput id='couponValue'
                   name='couponValue'
                   type='number'
                   bind:value={data.coupon.value} />
    {:else}
      <StyledInput id='coupon'
                   name='coupon'
                   placeholder='Coupon Code'
                   disabled
                   value='No Coupon' />
      <StyledInput id='couponValue'
                   name='couponValue'
                   type='number'
                   disabled
                   value='0' />
    {/if}

    <label for='customDescription'>Custom</label>
    <StyledInput id='customDescription'
                 name='customDescription'
                 bind:value={data.customDescription} />
    <StyledInput id='customCharge'
                 name='customCharge'
                 type='number'
                 min='0'
                 placeholder='Custom Charge'
                 bind:value={data.customCharge} />
    <label>Shipping</label>
    <StyledInput id='shippingType'
                 name='shippingType'
                 bind:value={data.shippingType} />
    <StyledInput id='shipping'
                 name='shipping'
                 type='number'
                 min='0'
                 bind:value={data.shippingCost} />
  </div>

  <div class='column'>
    <div id='profit'>
      <h3 class='center-text'>Profit</h3>
      <div class='center-text'>${(data.profit || 0).toFixed(2)}</div>
    </div>
    <div></div>

    <label class='center-text'><strong>$ Out</strong></label>

    <label>Print</label>
    <StyledInput id='printValue'
                 name='printValue'
                 type='number'
                 min='0'
                 bind:value={data.printExpense} />

    <label>Shipping</label>
    <StyledInput id='shippingExpense'
                 name='shippingExpense'
                 type='number'
                 min='0'
                 bind:value={data.shippingExpense} />

    <label>Tax</label>
    <StyledInput id='tax'
                 name='tax'
                 type='number'
                 min='0'
                 bind:value={data.tax} />

    <label>Fees</label>
    <StyledInput id='fees'
                 name='fees'
                 type='number'
                 min='0'
                 bind:value={data.fees} />

    <!--    bind:value={data.updates?.charge}  TODO Put this back-->
    <label for='custom'>Artist</label>
    <StyledInput id='customExpenseDescription'
                 name='customExpenseDescription'
                 bind:value={data.customExpenseDescription} />

    <label for='custom'>Other</label>
    <StyledInput id='customExpenseDescription'
                 name='customExpenseDescription'
                 bind:value={data.customExpenseDescription} />

    <div></div>
    <StyledInput id='customExpense'
                 name='customExpense'
                 type='number'
                 min='0'
                 bind:value={data.customExpense} />
  </div>
</container>

<style>
  container {
    display: flex;
    padding: 1rem;
    margin-bottom: 0.5rem;
    background-color: rgba(125, 125, 125, 0.5);
    border-radius: 0.5rem;
    border: 2px solid rgba(200, 200, 200, 0.5);
    overflow: auto;
  }

  .column {
    display: grid;
    grid-template-columns: max-content auto;
    grid-auto-rows: min-content;
    align-items: center;
    flex: 1;
  }

  .column:first-child {
    grid-template-rows: min-content
    min-content
    min-content
    min-content
    1fr;
  }

  .column:last-child {
    flex: 0.5;
  }

  :global(.column:first-child > label:last-of-type) {
    margin-top: 1rem;
    height: 100%;
  }

  :global(.column:first-child > .styled-input.wrapper:last-of-type) {
    height: 100%;
  }

  .column.triple-column {
    grid-template-columns: max-content 1fr 1fr;
    grid-column-gap: 0.15rem;
  }

  .column-vertical {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .column:not(:first-child), .column-vertical {
    margin-left: 0.5rem;
  }

  .column > label {
    flex: 1;
    text-align: right;
    box-sizing: border-box;
    padding: 0 0.5rem;
  }

  .column-vertical > label {
    margin: 0.5rem 0;
  }

  .vertical {
    display: inline-flex;
    flex-direction: column;
    flex: 1;
  }

  .section {
    text-align: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .section > label, .section .head {
    display: inline-block;
    margin: 0.5rem 0.25rem;
  }

  .section .head {
    display: block;
    text-align: center;
    flex-basis: 100%;
  }

  h3 {
    margin: 0 0 0.4rem;
  }

  #profit {
    grid-row: 1 / span 2;
    grid-column: 1;
    border: 1px solid rgba(200, 200, 200, 0.5);
    border-radius: 0.5rem;
    padding: 0.25rem;
  }

  .center-text {
    align-self: end;
  }
</style>
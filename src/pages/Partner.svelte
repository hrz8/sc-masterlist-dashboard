<script lang="ts">
  import dayjs from 'dayjs';
  import type { RestAPI } from "src/services/rest/service";
  import type Partner from "src/types/domains/Partner";

  import { getContext, onMount } from "svelte";

  import Select from "svelte-select";
import active from 'svelte-spa-router/active';

  const masterlistService = getContext("masterlistService") as RestAPI;

  let activeList = [] as Partner[]
  let activeDetail = null as Partner

  let items = [
    { value: "chocolate", label: "Chocolate" },
    { value: "pizza", label: "Pizza" },
    { value: "cake", label: "Cake" },
    { value: "chips", label: "Chips" },
    { value: "ice-cream", label: "Ice Cream" },
  ];

  let value = { value: "cake", label: "Cake" };

  function handleSelect(event: any) {
    console.log("selected item", event.detail);
    // .. do something here
  }

  function handleFormSubmit() {
    console.log("uy")
  }

  async function handleSelectRow(id: string) {
    const { data } = await masterlistService.call<Partner>("partner.detail", { params: { id } });
    activeDetail = data
  }

  function handleCancelUpdate(): void {
    activeDetail = null as Partner
  }

  onMount(async () => {
    // fetch item list
    const { data } = await masterlistService.call<Partner[]>("partner.list");
    activeList = data
  });
</script>

<h1>Partner</h1>
<div class="card mb-3">
  <div class="card-header">
    {#if activeDetail}
      <span class="badge bg-warning">Update</span>
    {:else}
      <span class="badge bg-success">New</span>
    {/if}
    Partner
  </div>
  <div class="card-body">
    <form on:submit|preventDefault={handleFormSubmit} class="row g-3">
      <div class="col-md-4">
        <label for="validationName" class="form-label">Name</label>
        <input type="text" class="form-control" id="validationName" value={activeDetail?.name || ""} required>
        <div class="valid-feedback">Nice!</div>
      </div>
      <div class="col-md-4">
        <label for="validationAddress" class="form-label">Address</label>
        <input type="text" class="form-control" id="validationAddress" value={activeDetail?.address || ""}>
        <div class="valid-feedback">Nice!</div>
      </div>
      <div class="col-md-4">
        <label for="validationContact" class="form-label">Contact</label>
        <input type="text" class="form-control" id="validationContact" value={activeDetail?.contact || ""} required>
        <div class="valid-feedback">Nice!</div>
      </div>
      <div class="col-12">
        <button class="btn btn-primary" type="submit">{activeDetail ? 'Update' : 'Add'}</button>
        {#if activeDetail}
          <button on:click={handleCancelUpdate} class="btn btn-outline-danger" type="button">Cancel</button>
        {/if}
      </div>
    </form>
  </div>
</div>

<div class="card mb-3">
  <div class="card-header">
    <span class="badge bg-primary">List</span> Partner
  </div>
  <div class="class-body p-3">
    <div class="table-responsive">
      <table class="table table-hover">
        <caption>List of partners</caption>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Address</th>
            <th scope="col">Contact</th>
            <th scope="col">Description</th>
            <th scope="col">Created</th>
            <th scope="col">Last Modified</th>
          </tr>
        </thead>
        <tbody>
          {#each activeList as item, i }
            <tr on:click={async () => {await handleSelectRow(item.id)}} style="cursor: pointer;">
              <th scope="row">{ i + 1 }</th>
              <td class="text-nowrap">{ item.name }</td>
              <td class="text-nowrap">{ item.address }</td>
              <td class="text-nowrap">{ item.contact }</td>
              <td class="text-nowrap">{ item.description }</td>
              <td class="text-nowrap">{ dayjs(item.createdAt).format('DD/MM/YYYY HH:mm:ss') }</td>
              <td class="text-nowrap">{ dayjs(item.updatedAt).format('DD/MM/YYYY HH:mm:ss') }</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>


<!-- <Select {items} {value} on:select={handleSelect} isClearable={false}></Select> -->

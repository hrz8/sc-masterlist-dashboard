<script lang="ts">
  import dayjs from 'dayjs';
  import type { RestAPI } from "src/services/rest/service";
  import type Partner from "src/types/domains/Partner";

  import { getContext, onMount } from "svelte";

  import Select from "svelte-select";

  const masterlistService = getContext("masterlistService") as RestAPI;

  let activeList = [] as Partner[]
  let activeDetail = {} as Partner

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

  onMount(async () => {
    // fetch item list
    const { data } = await masterlistService.call<Partner[]>("partner.list");
    activeList = data
  });
</script>

<h1>Partner</h1>
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
        <tr>
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

<!-- <Select {items} {value} on:select={handleSelect} isClearable={false}></Select> -->

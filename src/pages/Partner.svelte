<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { push } from 'svelte-spa-router'
  import Select from "svelte-select";
  import dayjs from 'dayjs';
  import type { RestAPI } from "src/services/rest/service";
  import type Partner from "src/types/domains/Partner";
  import type PartnerType from 'src/types/domains/PartnerType';

  export let params = {} as  { id: string };

  const masterlistService = getContext('masterlistService') as RestAPI;

  const activeRoute = 'partner-list';

  // app props
  let loadingList = true;
  let loadingDetail= false;

  // domain props
  let activeList = [] as Partner[];
  let activeDetail = null as Partner;

  // external domain props
  let partnerTypes = [] as PartnerType[];

  function handleSelect(event: any) {
    console.log("selected item", event.detail);
  }

  function handleFormSubmit() {
    console.log("uy");
  }

  async function openDetail(id: string) {
    loadingDetail = true;
    try {
      const { data } = await masterlistService
        .call<Partner>('partner.detail', {
          params: { id }
        });
      activeDetail = data;
    } catch (error) {
      activeDetail = null;
    } finally {
      loadingDetail = false;
    }
  }

  async function fetchList() {
    try {
      const { data } = await masterlistService
        .call<Partner[]>('partner.list');
      activeList = data;
    } catch (error) {
      activeList = [];
    } finally {
      loadingList = false;
    }
  }

  function handleCancelUpdate(): void {
    activeDetail = null as Partner;
  }

  onMount(async () => {
    if (params.id) {
      await openDetail(params.id);
    }
    await fetchList();

    // fetch other items from relationship
    try {
      ({ data: partnerTypes } = await masterlistService
        .call<Partner[]>('partnerType.list'));
    } catch (error) {
      partnerTypes = [];
    }

  });
</script>

<h1>Partner</h1>

<!-- FORM -->
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
    {#if loadingDetail}
      <div
        class="text-center"
        style="height: 385px; display: grid; place-items: center;">
        <div
          class="spinner-border"
          role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    {:else}
    <form
      on:submit|preventDefault={handleFormSubmit}
      class="row g-3"
      style="height: 400px; overflow-y: auto;"
    >
      <div class="col-md-4">
        <label
          for="inputName"
          class="form-label"
        >Name</label>
        <input
          id="inputName"
          type="text"
          class="form-control"
          value={activeDetail?.name || ""}
          required>
      </div>
      <div class="col-md-4">
        <label
          for="inputAddress"
          class="form-label"
        >Address/Country</label>
        <input
          id="inputAddress"
          type="text"
          class="form-control"
          value={activeDetail?.address || ""}>
      </div>
      <div class="col-md-4">
        <label
          for="inputContact"
          class="form-label"
        >Contact</label>
        <input
          id="inputContact"
          type="text"
          class="form-control"
          value={activeDetail?.contact || ""}
          required>
      </div>
      <div class="col-md-12">
        <label
          for="selectType"
          class="form-label"
        >Type</label>
        <Select
          items={
            partnerTypes
              .map((o) => ({ value: o.id, label: o.name }))
          }
          value={
            !activeDetail
              ? []
              : activeDetail
                  .partnerTypes
                  .map((o) => ({ value: o.id, label: o.name }))
          }
          on:select={handleSelect}
          isMulti={true}
          isClearable={false}
        ></Select>
      </div>
      <div class="col-md-12">
        <label
          for="inputDescription"
          class="form-label"
        >Description</label>
        <textarea
          class="form-control"
          id="inputDescription"
          rows="3"
          value={activeDetail?.description || ""}></textarea>
      </div>
      <div class="col-12">
        <button
          class="btn btn-primary"
          type="submit"
        >{activeDetail ? 'Update' : 'Add'}</button>
        {#if activeDetail}
          <button
            on:click={handleCancelUpdate}
            class="btn btn-outline-danger"
            type="button"
          >Cancel</button>
        {/if}
      </div>
    </form>
    {/if}
  </div>
</div>

<!-- TABLE -->
<div class="card mb-3">
  <div class="card-header">
    <span class="badge bg-primary">List</span> Partner
  </div>
  <div class="class-body p-3">
    <div class="table-responsive">
      {#if loadingList}
        <div class="text-center">
          <div
            class="spinner-border"
            role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      {:else}
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
            <tr
              on:click={async () => {
                push(`/${activeRoute}/${item.id}`);
                await openDetail(item.id)
              }}
              style="cursor: pointer;"
            >
              <th scope="row">{ i + 1 }</th>
              <td class="text-nowrap">{ item.name }</td>
              <td class="text-nowrap">{ item.address }</td>
              <td class="text-nowrap">{ item.contact }</td>
              <td class="text-nowrap">{ item.description }</td>
              <td class="text-nowrap text-muted">
                { dayjs(item.createdAt).format('DD/MM/YYYY HH:mm:ss') }
              </td>
              <td class="text-nowrap text-muted">
                { dayjs(item.updatedAt).format('DD/MM/YYYY HH:mm:ss') }
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
      {/if}
    </div>
  </div>
</div>



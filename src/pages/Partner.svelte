<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import { Icon, Popover } from 'sveltestrap';
  import { push } from 'svelte-spa-router';
  import Select from 'svelte-select';
  import dayjs from 'dayjs';
  import Loading from '../components/shared/Loading.svelte';
  import PartnerTypeCrud from '../components/crud-table/PartnerType.svelte';
  import type { EndpointPayload, RestAPI } from 'src/services/rest/service';
  import type Partner from 'src/types/domains/Partner';
  import type PartnerType from 'src/types/domains/PartnerType';

  export let params = {} as  { id: string };

  const masterlistService = getContext('masterlistService') as RestAPI;
  const toastSuccess = getContext('toastSuccess') as (message: string) => void;
  const toastError = getContext('toastError') as (message: string) => void;

  const activeRoute = 'partner-list';

  // app props
  let loadingActiveList = true;
  let loadingActiveDetail = false;

  // domain props
  let activeList = [] as Partner[];
  let activeDetail = null as Partner;
  let payloadList = {} as EndpointPayload;
  let searchFormValue = "";
  let searchBy = "";
  let searchPartnerTypes = [] as string[];

  // external domain props
  let partnerTypes = [] as PartnerType[];

  // events
  function handleSelect(event: any) {
    console.log("selected item", event.detail);
  }

  function handleFormSubmit() {
    console.log("uy");
  }

  function handleSearchPartnerTypeSelect(e: any) {
    searchPartnerTypes = e.detail.map((v) => v.value);
  }

  async function handleSearchClick() {
    payloadList = {}
    if (searchBy !== "" && searchFormValue !== "") {
      payloadList = {
        query: {
          [searchBy]: {
            like: searchFormValue,
          }
        }
      }
    };
    if (searchPartnerTypes.length) {
      payloadList.query['partnerTypes'] = { in: searchPartnerTypes };
    }
    await fetchList(payloadList);
  }

  // method -> services related
  async function openDetail(id: string) {
    loadingActiveDetail = true;
    try {
      const { data } = await masterlistService
        .call<Partner>('partner.detail', {
          params: { id }
        });
      activeDetail = data;
      toastSuccess('successfully fetch partner detail!');
    } catch (error) {
      activeDetail = null;
      toastError(`
        error while fetch partner detail!<br>
        reason: ${error.message}${
          error.errorCode
          ? `<br>code: [${error.errorCode}]` 
          : ''
        }
      `);
    } finally {
      loadingActiveDetail = false;
    }
  }

  async function fetchList(payload: EndpointPayload = null) {
    try {
      const { data } = await masterlistService
        .call<Partner[]>('partner.list', payload);
      activeList = data;
      toastSuccess('successfully fetch partner list!');
    } catch (error) {
      activeList = [];
      toastError(`
        error while fetch partner list!<br>
        reason: ${error.message}${
          error.errorCode
          ? `<br>code: [${error.errorCode}]` 
          : ''
        }
      `);
    } finally {
      loadingActiveList = false;
    }
  }

  async function fetchPartnerTypes() {
    try {
      const { data }= await masterlistService
        .call<PartnerType[]>('partnerType.list', );
      partnerTypes = data;
      toastSuccess('successfully fetch partner type list!');
    } catch (error) {
      partnerTypes = [];
      toastError(`
        error while fetch partner type list!<br>
        reason: ${error.message}${
          error.errorCode
          ? `<br>code: [${error.errorCode}]` 
          : ''
        }
      `);
    }
  }

  onMount(async () => {
    if (params.id) {
      await openDetail(params.id);
    }
    await fetchList();
    // fetch other items from relationship
    await fetchPartnerTypes();

    // event registeration
    const partnerTypeModal = document.querySelector('#partnerTypeModal');
    partnerTypeModal.addEventListener('hidden.bs.modal', async function() {
      await fetchPartnerTypes();
    });
  });
</script>

<div id="toast" aria-live="polite" aria-atomic="true" class="position-relative"></div>

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
    {#if loadingActiveDetail}
      <div
        class="text-center"
        style="height: 385px; display: grid; place-items: center;"
      ><Loading />
      </div>
    {:else}
    <form
      on:submit|preventDefault={handleFormSubmit}
      class="row g-3"
      style="height: 400px; overflow-y: auto;">
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
      <div class="col-md-11">
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
      <div
        class="col-md-1"
        style="align-self: end; padding-bottom: 16px;">
        <button
          type="button"
          class="btn btn-sm btn-outline-primary"
          data-bs-toggle="modal" data-bs-target="#partnerTypeModal"
        ><Icon name="box-arrow-up-left" /></button>
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
        {#if activeDetail}
          <div class="col-md-12">
            <div class="d-grid gap-2 col-6 mx-auto">
              <button
                id="partnerMaterial"
                class="btn btn-outline-success"
                type="button"
              >Material List of { activeDetail.name }</button>
              <Popover
                target="partnerMaterial"
                trigger="focus"
                placement="top"
                title={`Material List of ${activeDetail.name}`}
              >
                <div class="table-responsive">
                    <table class="table table-hover">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">TSM</th>
                          <th scope="col">Material Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {#each activeDetail.materials || [] as material, i}
                          <tr style="cursor: pointer;">
                            <th scope="row">{ i + 1 }</th>
                            <td class="text-nowrap">{ material.tsm }</td>
                            <td class="text-nowrap">{ material.materialGrade.code }</td>
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                </div>
              </Popover>
            </div>
          </div>
        {/if}
        <div class="col-12">
        <button
          class="btn btn-primary"
          type="submit"
        >{activeDetail ? 'Update' : 'Add'}</button>
        {#if activeDetail}
          <button
            on:click={() => {activeDetail = null}}
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
  <div class="card-body p-3">
    <div class="row">
      <div class="col-md-3">
        <input
          type="text"
          class="form-control"
          bind:value={searchFormValue}
          placeholder="Search">
      </div>
      <div class="col-md-9">
        <input
          type="radio"
          class="btn-check"
          name="options-outlined"
          id="searchByName"
          autocomplete="off"
          checked={searchBy==='name'}
          on:change={(e) => {
            searchBy = e.currentTarget.value;
          }}
          on:click={(e) => {
            if (searchBy === e.currentTarget.value) {
              searchBy = "";
            }
          }}
          value="name">
        <label
          class="btn btn-outline-success"
          for="searchByName"
        >Name</label>
        <input
          type="radio"
          class="btn-check"
          name="options-outlined"
          id="searchByAddress"
          autocomplete="off"
          checked={searchBy==='address'}
          on:change={(e) => {
            searchBy = e.currentTarget.value;
          }}
          on:click={(e) => {
            if (searchBy === e.currentTarget.value) {
              searchBy = "";
            }
          }}
          value="address">
        <label
          class="btn btn-outline-success"
          for="searchByAddress"
        >Address/Country</label>
        <input
          type="radio"
          class="btn-check"
          name="options-outlined"
          id="searchByContact"
          autocomplete="off"
          checked={searchBy==='contact'}
          on:change={(e) => {
            searchBy = e.currentTarget.value;
          }}
          on:click={(e) => {
            if (searchBy === e.currentTarget.value) {
              searchBy = "";
            }
          }}
          value="contact">
        <label
          class="btn btn-outline-success"
          for="searchByContact"
        >Contact</label>
      </div>
      <div class="col-md-6 mt-3">
        <label
          for="selectSearchType"
          class="form-label"
        >Type</label>
        <Select
          items={
            partnerTypes
              .map((o) => ({ value: o.id, label: o.name }))
          }
          value={[]}
          on:select={handleSearchPartnerTypeSelect}
          isMulti={true}
          isClearable={false}
        ></Select>
      </div>
      <div class="col-md-12 mt-2 mb-5">
        <button
          on:click={async () => await handleSearchClick()}
          class="btn btn-primary"
          type="button"
        >Search</button>
      </div>
    </div>
    <div class="table-responsive">
      {#if loadingActiveList}
        <div class="text-center">
          <Loading />
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
              style="cursor: pointer;">
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

<!-- PARTNER TYPE MODAL -->
<div
  id="partnerTypeModal" 
  class="modal fade"
  tabindex="-1"
  aria-labelledby="partnerTypeModalLabel"
  aria-hidden="true"
  data-bs-backdrop="static"
  data-bs-keyboard="false">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="partnerTypeModalLabel">Part Type List</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <PartnerTypeCrud />
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

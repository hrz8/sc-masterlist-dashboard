<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import { Icon } from 'sveltestrap';
  import Loading from '../components/shared/Loading.svelte';
  import type { RestAPI } from 'src/services/rest/service';
  import type PartnerType from 'src/types/domains/PartnerType';

  export let params = {} as  { id: string };

  const masterlistService = getContext('masterlistService') as RestAPI;
  const toastSuccess = getContext('toastSuccess') as (message: string) => void;
  const toastError = getContext('toastError') as (message: string) => void;

  // app props
  let loadingActiveList = true;
  let loadingActiveDetail = false;

  // domain props
  let activeList = [] as PartnerType[];
  let activeDetail = null as PartnerType;

  function handleFormSubmit() {
    console.log("SUBMIT PARTNERTYPE");
  }

  async function openDetail(id: string) {
    loadingActiveDetail = true;
    try {
      const { data } = await masterlistService
        .call<PartnerType>('partnerType.detail', {
          params: { id }
        });
      activeDetail = data;
      toastSuccess('successfully fetch partner type detail!');
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

  // method -> services related
  async function fetchList() {
    try {
      loadingActiveList = true;
      const { data }= await masterlistService
        .call<PartnerType[]>('partnerType.list');
      activeList = data;
      toastSuccess('successfully fetch partner type list!');
    } catch (error) {
      activeList = [];
      toastError(`
        error while fetch partner type list!<br>
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

  onMount(async () => {
    if (params.id) {
      await openDetail(params.id);
    }
    await fetchList();
});
</script>

<!-- FORM -->
<div class="card mb-3">
  <div class="card-header">
    {#if activeDetail}
      <span class="badge bg-warning">Update</span>
    {:else}
      <span class="badge bg-success">New</span>
    {/if}
    Partner Type
  </div>
  <div class="card-body">
    {#if loadingActiveDetail}
      <div
        class="text-center"
        style="height: 300px; display: grid; place-items: center;"
      ><Loading />
      </div>
    {:else}
      <form
        on:submit|preventDefault={handleFormSubmit}
        class="row g-3"
        style="height: 315px; overflow-y: auto;">
        <div class="col-md-12">
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
    <span class="badge bg-primary">List</span> Partner Type
  </div>
  <div class="card-body p-3">
    <div class="table-responsive">
      {#if loadingActiveList}
        <div class="text-center">
          <Loading />
        </div>
      {:else}
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">#</th>
            </tr>
          </thead>
          <tbody>
            {#each activeList as type, i}
            <tr
              on:click={async () => await openDetail(type.id)}
              style="cursor: pointer;">
              <td>{ type.name }</td>
              <td>{ type.description }</td>
              <td>
                <button type="button" class="btn btn-danger btn-sm">
                  <Icon name="trash-fill" />
                </button>
              </td>
            </tr>
            {/each}
          </tbody>
        </table>
      {/if}
    </div>
  </div>
</div>

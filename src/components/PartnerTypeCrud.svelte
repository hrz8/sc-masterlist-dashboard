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
  enum SUBMIT_TYPE {
    CREATE = "Create",
    UPDATE = "Update"
  }

  // app props
  let loadingActiveList = true;
  let loadingActiveDetail = false;

  // domain props
  let activeList = [] as PartnerType[];
  let activeDetailFetched = false;
  let activeDetailDefault: PartnerType = {
    id: "",
    name: "",
    description: ""
  };
  let activeDetail: PartnerType = activeDetailDefault;

  async function handleFormSubmit(type: SUBMIT_TYPE) {
    if (type === SUBMIT_TYPE.CREATE) {
      await createNewRow();
    } else if (type === SUBMIT_TYPE.UPDATE) {
      await updateRow();
    }
    await fetchList();
  }

  // method -> services related
  async function openDetail(id: string) {
    loadingActiveDetail = true;
    try {
      const { data } = await masterlistService
        .call<PartnerType>('partnerType.detail', {
          params: { id }
        });
      activeDetail = data;
      activeDetailFetched = true;
      toastSuccess('successfully fetch partner type detail!');
    } catch (error) {
      toastError(`
        error while fetch partner detail!<br>
        reason: ${error.message}${
          error.errorCode
          ? `<br>code: [${error.errorCode}]` 
          : ''
        }
      `);
      activeDetailFetched = false;
    } finally {
      loadingActiveDetail = false;
    }
  }

  async function fetchList() {
    try {
      loadingActiveList = true;
      const { data } = await masterlistService
        .call<PartnerType[]>('partnerType.list', {
          query: {
            sort: {
              by: "upddatedAt"
            }
          }
        });
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

  async function createNewRow() {
    try {
      loadingActiveDetail = true;
      const { data } = await masterlistService
        .call<PartnerType>('partnerType.create', {
          data: activeDetail
        });
      activeDetail = data;
      toastSuccess('successfully create partner type!');
    } catch (error) {
      toastError(`
        error while creating partner type!<br>
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

  async function updateRow() {
    try {
      loadingActiveDetail = true;
      await masterlistService
        .call<PartnerType>('partnerType.update', {
          params: { id: activeDetail.id },
          data: activeDetail
        });
      toastSuccess('successfully update partner type!');
    } catch (error) {
      toastError(`
        error while updating partner type!<br>
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

  async function deleteRow(id: string) {
    const confirmation = confirm('Are you sure want to delete this row?');
    if (confirmation) {
      try {
        loadingActiveList = true;
        await masterlistService
          .call('partnerType.delete', {
            params: { id }
          });
        activeDetailFetched = false;
        activeDetail = activeDetailDefault;
        toastSuccess('successfully delete partner type!');
      } catch (error) {
        toastError(`
          error while deleting partner type!<br>
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
    {#if activeDetailFetched}
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
        on:submit|preventDefault={async () => {
          await handleFormSubmit(activeDetailFetched ? SUBMIT_TYPE.UPDATE : SUBMIT_TYPE.CREATE)
        }}
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
            bind:value={activeDetail.name}
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
            bind:value={activeDetail.description}></textarea>
        </div>
        <div class="col-12">
          <button
            class="btn btn-primary"
            type="submit"
          >{activeDetailFetched ? SUBMIT_TYPE.UPDATE : SUBMIT_TYPE.CREATE }</button>
          {#if activeDetailFetched}
            <button
              on:click={() => {
                activeDetail = activeDetailDefault;
                activeDetailFetched = false;
              }}
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
    <div class="float-end">
      <button
        type="button"
        class="btn btn-success btn-sm"
        on:click={async () => await fetchList()}
      ><Icon name="arrow-clockwise" />
      </button>
    </div>
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
              <th scope="col">Created</th>
              <th scope="col">Last Modified</th>
              <th scope="col">#</th>
            </tr>
          </thead>
          <tbody>
            {#each activeList as type}
            <tr
              on:click={async () => await openDetail(type.id)}
              style={`
                cursor: pointer;
                ${activeDetail.id === type.id && 'background-color: #00000013'}
              `}>
              <td class="text-nowrap">{ type.name }</td>
              <td class="text-nowrap">{ type.description }</td>
              <td class="text-nowrap text-muted">{ type.createdAt }</td>
              <td class="text-nowrap text-muted">{ type.updatedAt }</td>
              <td class="text-nowrap">
                <button
                  type="button"
                  class="btn btn-danger btn-sm"
                  on:click={async () => {
                    await deleteRow(type.id);
                    await fetchList();
                  }}
                ><Icon name="trash-fill" />
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

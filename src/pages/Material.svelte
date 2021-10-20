<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import { Icon, Tooltip } from 'sveltestrap';
  import { push } from 'svelte-spa-router';
  import Select from 'svelte-select';
  import dayjs from 'dayjs';
  import Loading from '../components/shared/Loading.svelte';
  import type { EndpointPayload, RestAPI } from 'src/services/rest/service';
  import type Material from 'src/types/domains/Material';
  import type MaterialGrade from 'src/types/domains/MaterialGrade';
  import type Partner from 'src/types/domains/Partner';

  export let params = {} as  { id: string };

  const masterlistService = getContext('masterlistService') as RestAPI;
  const toastSuccess = getContext('toastSuccess') as (message: string) => void;
  const toastErrorWrapper = getContext('toastErrorWrapper') as (error, message: string) => void;
  enum SUBMIT_TYPE {
    CREATE = "Create",
    UPDATE = "Update"
  }

  const activeRoute = 'material-list';

  // constant default props
  const activeDetailDefault = (): Material => ({
    id: "",
    tsm: "",
    description: "",
    maker: {} as Partner,
    materialGrade: {} as MaterialGrade
  });
  const payloadListDefault = (): EndpointPayload => ({
    query: {
      sort: {
        by: "updatedAt",
        mode: "desc"
      },
      pagination: {
        page: 1,
        limit: 10
      }
    }
  });

  // app props
  let loadingActiveList = true;
  let loadingActiveDetail = false;
  let totalPage = 0;

  // domain props
  let activeList = [] as Material[];
  let activeDetailFetched = false;
  let activeDetail: Material = activeDetailDefault();
  let payloadList: EndpointPayload = payloadListDefault();

  // active relation props
  let activeDropdownMakerValueToSend = null;
  let activeDropdownMakerObj = null as {
    label: string,
    value: string
  };
  let activeDropdownMaterialGradeValueToSend = null;
  let activeDropdownMaterialGradeObj = null as {
    label: string,
    value: string
  };

  // search form
  let searchBy = "";
  let searchFormValue = "";

  // external domain props
  let makers = [] as Partner[];
  let materialGrades = [] as MaterialGrade[];

  $: {
    // detail handler
    if (activeDetailFetched) {
      activeDropdownMakerObj = {
        value: activeDetail?.maker?.id,
        label: activeDetail?.maker?.name
      }
      activeDropdownMaterialGradeObj = {
        value: activeDetail?.materialGrade?.id,
        label: activeDetail?.materialGrade?.code
      }
    }

    // payload handler
    payloadList = payloadListDefault();
    if (searchBy !== "" && searchFormValue !== "") {
      payloadList.query[searchBy] = {
        like: searchFormValue
      };
    }
  }

  // #region component event handlers
  function handleActiveDropdownMakerSelect(
    event: {
      detail: {
        label: string,
        value: string
      }
    }
  ) {
    activeDropdownMakerValueToSend = event.detail.value;
    activeDropdownMakerObj = event.detail;
  }

  function handleActiveDropdownMaterialGradeSelect(
    event: {
      detail: {
        label: string,
        value: string
      }
    }
  ) {
    activeDropdownMaterialGradeValueToSend = event.detail.value;
    activeDropdownMaterialGradeObj = event.detail;
  }

  async function handleFormSubmit(type: SUBMIT_TYPE) {
    if (type === SUBMIT_TYPE.CREATE) {
      await createNewRow();
    } else if (type === SUBMIT_TYPE.UPDATE) {
      await updateRow();
    }
    await fetchList();
  }
  // #endregion

  // #region method -> services related
  async function openDetail(id: string) {
    loadingActiveDetail = true;
    try {
      const { data } = await masterlistService
        .call<Material>('material.detail', {
          params: { id }
        });
      activeDetail = data;
      activeDetailFetched = true;
      toastSuccess('successfully fetch material detail!');
    } catch (error) {
      activeDetailFetched = false;
      toastErrorWrapper(
        error,
        'error while fetch material detail!'
      );
    } finally {
      loadingActiveDetail = false;
    }
  }

  async function fetchList() {
    try {
      loadingActiveList = true;
      const { data, meta } = await masterlistService
        .call<Material[]>('material.list', payloadList);
      activeList = data;
      totalPage = Math.ceil(meta.total/payloadList.query.pagination.limit);
      toastSuccess('successfully fetch material list!');
    } catch (error) {
      activeList = [];
      toastErrorWrapper(
        error,
        'error while fetch material list!'
      );
    } finally {
      loadingActiveList = false;
    }
  }

  async function createNewRow() {
    try {
      loadingActiveDetail = true;
      await masterlistService
        .call<Material>('material.create', {
          data: {
            ...activeDetail,
            maker: activeDropdownMakerValueToSend,
            materialGrade: activeDropdownMaterialGradeValueToSend
          }
        });
      activeDetail = activeDetailDefault();
      activeDropdownMakerValueToSend = null;
      activeDropdownMaterialGradeValueToSend = null;
      toastSuccess('successfully create material!');
    } catch (error) {
      toastErrorWrapper(
        error,
        'error while creating material type!'
      );
    } finally {
      loadingActiveDetail = false;
    }
  }

  async function updateRow() {
    try {
      loadingActiveDetail = true;
      await masterlistService
        .call<Material>('material.update', {
          params: { id: activeDetail.id },
          data: {
            ...activeDetail,
            maker: activeDropdownMakerValueToSend,
            materialGrade: activeDropdownMaterialGradeValueToSend
          }
        });
      toastSuccess('successfully update partner type!');
    } catch (error) {
      toastErrorWrapper(
        error,
        'error while updating partner type!'
      );
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
          .call('material.delete', {
            params: { id }
          });
        activeDetailFetched = false;
        activeDetail = activeDetailDefault();
        toastSuccess('successfully delete partner type!');
      } catch (error) {
        toastErrorWrapper(
          error,
          'error while deleting partner type!'
        );
      } finally {
        loadingActiveList = false;
      }
    }
  }

  async function fetchMakers() {
    try {
      const { data }= await masterlistService
        .call<Partner[]>('partner.list');
      makers = data;
      toastSuccess('successfully fetch maker list!');
    } catch (error) {
      makers = [];
      toastErrorWrapper(
        error,
        'error while fetch partner list!'
      );
    }
  }

  async function fetchMaterialGrades() {
    try {
      const { data }= await masterlistService
        .call<MaterialGrade[]>('materialGrade.list', );
      materialGrades = data;
      toastSuccess('successfully fetch material grade list!');
    } catch (error) {
      materialGrades = [];
      toastErrorWrapper(
        error,
        'error while fetch material grade list!'
      );
    }
  }
  // #endregion

  // #region svelte events
  onMount(async () => {
    if (params.id) {
      await openDetail(params.id);
    }
    await fetchList();

    // fetch other items from relationship
    await fetchMakers();
    await fetchMaterialGrades();
  });
  // #endregion
</script>

<!-- HEADING -->
<div id="toast" aria-live="polite" aria-atomic="true" class="position-relative"></div>
<h1>Material</h1>

<!-- FORM -->
<div class="card mb-3">
  <div class="card-header">
    {#if activeDetailFetched}
      <span class="badge bg-warning">Update</span>
    {:else}
      <span class="badge bg-success">New</span>
    {/if}
    Material
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
          >TSM</label>
          <input
            id="inputName"
            type="text"
            class="form-control"
            bind:value={activeDetail.tsm}
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
        <div class="col-md-12">
          <label
            for="selectType"
            class="form-label"
          >Maker</label>
          <Select
            items={
              makers
                .map((o) => ({ value: o.id, label: o.name }))
            }
            value={activeDropdownMakerObj}
            on:select={handleActiveDropdownMakerSelect}
          ></Select>
        </div>
        <div class="col-md-11">
          <label
            for="selectType"
            class="form-label"
          >Material Grade</label>
          <Select
            items={
              materialGrades
                .map((o) => ({ value: o.id, label: o.code }))
            }
            value={activeDropdownMaterialGradeObj}
            on:select={handleActiveDropdownMaterialGradeSelect}
          ></Select>
        </div>
        <div class="col-12">
          <button
            class="btn btn-primary"
            type="submit"
          >{activeDetailFetched ? SUBMIT_TYPE.UPDATE : SUBMIT_TYPE.CREATE }</button>
          {#if activeDetailFetched}
            <button
              on:click={() => {
                activeDetail = activeDetailDefault();
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
        id="refresh-partnerType"
        type="button"
        class="btn btn-success btn-sm"
        on:click={async () => await fetchList()}
      ><Icon name="arrow-clockwise" />
      </button>
      <Tooltip
        target="refresh-partnerType"
        placement="left"
      >Refresh the list</Tooltip>
    </div>
  </div>
  <div
    class="card-body p-3"
    style="height: 400px; overflow-y: auto;">
    <div class="row">
      <!-- search form -->
      <div class="col-md-3">
        <input
          type="text"
          class="form-control"
          bind:value={searchFormValue}
          placeholder="Search">
      </div>
      <!-- search selectors -->
      <div class="col-md-6">
        <input
          type="radio"
          class="btn-check"
          name="options-outlined"
          id="searchByPartnerTypeName"
          autocomplete="off"
          checked={searchBy==='name'}
          on:change={(e) => searchBy = e.currentTarget.value }
          on:click={(e) => {
            if (searchBy === e.currentTarget.value) {
              searchBy = "";
            }
          }}
          value="name">
        <label
          class="btn btn-outline-success"
          for="searchByPartnerTypeName"
        >Name</label>
        <input
          type="radio"
          class="btn-check"
          name="options-outlined"
          id="searchByPartnerTypeDescription"
          autocomplete="off"
          checked={searchBy==='description'}
          on:change={(e) => searchBy = e.currentTarget.value }
          on:click={(e) => {
            if (searchBy === e.currentTarget.value) {
              searchBy = "";
            }
          }}
          value="description">
        <label
          class="btn btn-outline-success"
          for="searchByPartnerTypeDescription"
        >Description</label>
      </div>
      <!-- maximum rows -->
      <div class="col-md-3">
        <div class="row">
          <label
            for="#selectMaxRows"
            class="col-lg-4 col-form-label">Shows</label>
          <div class="col-lg-8">
            <select
              id="selectMaxRows"
              class="form-select"
              aria-label="select max rows showing"
              bind:value={payloadList.query.pagination.limit}
              on:change={async () => await fetchList()}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>
      <div class="col-md-12 mt-2 mb-5">
        <button
          on:click={async () => await fetchList()}
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
          <thead>
            <tr>
              <th scope="col">TSM</th>
              <th scope="col">Description</th>
              <th scope="col">Created</th>
              <th scope="col">Last Modified</th>
              <th scope="col">#</th>
            </tr>
          </thead>
          <tbody>
            {#each activeList as item}
            <tr
              on:click={async () => {
                push(`/${activeRoute}/${item.id}`);
                await openDetail(item.id)}
              }
              style={`
                cursor: pointer;
                ${activeDetail.id === item.id && 'background-color: #00000013'}
              `}>
              <td class="text-nowrap">{ item.tsm }</td>
              <td class="text-nowrap">{ item.description }</td>
              <td class="text-nowrap text-muted">
                { dayjs(item.createdAt).format('DD/MM/YYYY HH:mm:ss') }
              </td>
              <td class="text-nowrap text-muted">
                { dayjs(item.createdAt).format('DD/MM/YYYY HH:mm:ss') }
              </td>
              <td class="text-nowrap">
                <button
                  type="button"
                  class="btn btn-danger btn-sm"
                  on:click={async () => {
                    await deleteRow(item.id);
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

<!-- PAGINATION -->
<div class="float-end">
  <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item {payloadList.query.pagination.page === 1 ? 'disabled' : ''}">
        <button
          class="page-link"
          aria-label="Previous"
          on:click={async () => {
            payloadList.query.pagination.page--;
            await fetchList();
          }}
        >
          <span aria-hidden="true">&laquo;</span>
        </button>
      </li>
      {#each Array(totalPage) as _, i }
        <li
          class="page-item {payloadList.query.pagination.page === i + 1 ? 'active' : ''}">
          <button
            class="page-link"
            on:click={async () => {
              if (payloadList.query.pagination.page !== i + 1) {
                payloadList.query.pagination.page = i + 1;
                await fetchList();
              }
            }}
          >{i + 1}</button>
        </li>
      {/each}
      <li
        class="page-item {payloadList.query.pagination.page === totalPage ? 'disabled' : ''}">
        <button
          class="page-link"
          aria-label="Next"
          on:click={async () => {
            payloadList.query.pagination.page++;
            await fetchList();
          }}
        >
          <span aria-hidden="true">&raquo;</span>
        </button>
      </li>
    </ul>
  </nav>
</div>

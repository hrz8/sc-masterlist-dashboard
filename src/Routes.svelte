
<script lang="ts">
  import Router from 'svelte-spa-router'

  // pages
  import Home from './pages/Home.svelte'
  import Partlist from './pages/Partlist.svelte'
  import PartnerList from './pages/Partner.svelte'
  import MaterialList from './pages/Material.svelte'
  import Page404 from './pages/404.svelte'

  const routes = {
    '/': Home,
    '/part-list': Partlist,
    '/partner-list/:id?': PartnerList,
    '/material-list': MaterialList,
    '/material-list/:id?': MaterialList,
    '/*': Page404
  }
</script>

<div class="m-3 container-fluid" style="min-width: 80%;">
  <Router {routes} />
</div>

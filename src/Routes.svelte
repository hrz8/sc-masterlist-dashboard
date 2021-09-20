
<script lang="ts">
  import Router from 'svelte-spa-router'

  // pages
  import Home from './pages/Home.svelte'
  import Partlist from './pages/Partlist.svelte'
  import PartnerList from './pages/Partner.svelte'
  import Page404 from './pages/404.svelte'

  const routes = {
    '/': Home,
    '/part-list': Partlist,
    '/partner-list': PartnerList,
    '/*': Page404
  }
</script>

<div class="mx-3 container-fluid">
  <Router {routes} />
</div>

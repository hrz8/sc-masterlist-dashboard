<script lang="ts">
  import { Icon, Tooltip } from 'sveltestrap';
  import { link } from 'svelte-spa-router';
  import active from 'svelte-spa-router/active';
</script>

<div
  id="sidebar-wrapper"
  class="d-flex flex-column flex-shrink-0"
>
  <a
    use:link
    href="/"
    class="bg-dark bg-gradient text-light text-center p-3 link-dark text-decoration-none">
    <Icon class="h3" name="house-door" />
  </a>
  <ul
    class="nav nav-pills nav-flush flex-column mb-auto text-center"
  >
    <li>
      <a
        id="sidebar-dashboard"
        use:link
        use:active={{path: '/', className: 'active'}}
        href="/"
        class="nav-link py-3 border-bottom">
        <Icon class="h4" name="speedometer2" />
      </a>
      <Tooltip target="sidebar-dashboard" placement="right">Dashboard</Tooltip>
    </li>
    <li>
      <a
        id="sidebar-partlist"
        use:link
        use:active={{path: '/part-list*', className: 'active'}}
        href="/part-list"
        class="nav-link py-3 border-bottom">
        <Icon class="h4" name="bounding-box" />
      </a>
      <Tooltip target="sidebar-partlist" placement="right">Part List</Tooltip>
    </li>
    <li>
      <a
        id="sidebar-partner-list"
        use:link
        use:active={{path: '/partner-list/*', className: 'active'}}
        href="/partner-list/"  class="nav-link py-3 border-bottom">
        <Icon class="h4" name="people" />
      </a>
      <Tooltip target="sidebar-partner-list" placement="right">Partner List</Tooltip>
    </li>
    <li>
      <a
        id="sidebar-material-list"
        use:link
        use:active={{path: '/material-list/*', className: 'active'}}
        href="/material-list"  class="nav-link py-3 border-bottom">
        <Icon class="h4" name="gear-wide-connected" />
      </a>
      <Tooltip target="sidebar-material-list" placement="right">Material List</Tooltip>
    </li>
  </ul>
  <div class="dropdown border-top" style="position: unset;">
    <a
      id="sidebar-dropdown-account"
      on:click="{(e) => e.preventDefault()}"
      href="/"
      class="d-flex align-items-center justify-content-center p-3 link-dark text-decoration-none dropdown-toggle" 
      data-bs-toggle="dropdown"
      aria-expanded="false">
      <i class="h4 bi-person-circle"></i>
    </a>
    <ul
      class="dropdown-menu text-small shadow"
      aria-labelledby="sidebar-dropdown-account"
    >
      <li>
        <h6 class="dropdown-header">Account</h6>
      </li>
      <li>
        <a use:link class="dropdown-item" href="/account/account">
          <i class="h4 bi-person-badge"></i> Profile
        </a>
      </li>
      <li>
        <a use:link class="dropdown-item" href="/account/settings">
          <i class="h4 bi-gear"></i> Settings
        </a>
      </li>
      <li><hr class="dropdown-divider"></li>
      <li>
        <a use:link class="dropdown-item" href="/account/logout">
          <i class="h4 bi-box-arrow-right"></i> Sign Out
        </a>
      </li>
    </ul>
  </div>
</div>

<style>
#sidebar-wrapper {
  height: 100vh;
  overflow-y: auto;
  box-shadow: 0 0.125em 0.5em rgb(0 0 0 / 15%);
}
.nav-flush .nav-link {
  border-radius: 0;
}
</style>

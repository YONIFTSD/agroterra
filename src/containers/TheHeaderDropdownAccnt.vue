<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink>
        <div class="c-avatar">
          <img src="@/assets/icons/avatar.png" class="c-avatar-img " />
          
        </div>
      </CHeaderNavLink>
      
    </template>
    <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>Cuenta</strong>
    </CDropdownHeader>

    <CDropdownItem @click="ViewProfile">
      <CIcon name="cil-user" /> Perfil
    </CDropdownItem>

    <CDropdownItem @click="Logout">
      <CIcon name="cil-lock-locked" /> Salir
    </CDropdownItem>
  </CDropdown>

  
</template>

<script>
const Swal = require("sweetalert2");
export default {
  name: 'TheHeaderDropdownAccnt',
  data () {
    return { 
      itemsCount: 42
    }
  },
  methods: {
    Logout,
    ViewProfile,
  }
}

function Logout() {
  Swal.fire({
      icon: "success",
      title: "Se ha cerrado la session",
      showConfirmButton: false,
      timer: 1500,
    });
  window.localStorage.clear()
  this.$router.push({ name: "Login"})

  setTimeout(window.location.reload(), 2000);
}
function ViewProfile() {
  this.$router.push({ name: "UserProfile"})
}
</script>

<style scoped>
  .c-icon {
    margin-right: 0.3rem;
  }
</style>
<template>
  <CHeader fixed with-subheader primary>
    <CToggler
      in-header
      class="ml-3 d-lg-none"
      @click="$store.commit('toggleSidebarMobile')"
    />
    <CToggler
      in-header
      class="ml-3 d-md-down-none"
      @click="$store.commit('toggleSidebarDesktop')"
    />
    <CHeaderBrand class="mx-auto d-lg-none" to="/">
    <div class="w-100">
 <!-- <img src="@/assets/icons/logo-sm.png" class="img-fluid p-1" alt=""> -->
      <b-badge variant="success">{{name_establishment}}</b-badge>
    </div>
     
    </CHeaderBrand>
    <CHeaderNav class="d-md-down-none mr-auto">

        <b-badge variant="info">{{name_bussines}}</b-badge>

    </CHeaderNav>
    <CHeaderNav class="d-md-down-none mr-1">
    <b-badge variant="success">{{name_establishment}}</b-badge>
    </CHeaderNav>
    <CHeaderNav class="mr-4">
      <TheHeaderDropdownAccnt/>
    </CHeaderNav>

  </CHeader>
</template>

<script>
import TheHeaderDropdownAccnt from './TheHeaderDropdownAccnt'
const je = require("json-encrypt");
const axios = require("axios").default;
import { mapState,mapActions } from "vuex";
export default {
  name: 'TheHeader',
  components: {
    TheHeaderDropdownAccnt
  },
  data() {
    return {
      name_establishment: "",
      name_bussines:""
    };
  },
  methods: {
    ViewEstablishment,
    ViewBussiness,
  },
  mounted() {
    this.ViewEstablishment();
    this.ViewBussiness();

  },
  computed: {
    ...mapState(["url_base"]),
    user: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user;
    },
    token: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.api_token;
    },
    id_establishment: function () {
      let establishment = window.localStorage.getItem("id_establishment");
      establishment = JSON.parse(je.decrypt(establishment));
      return establishment;
    }
  },
}
function ViewEstablishment() {

  let me = this;
  let url = this.url_base + "view-establishment/"+this.id_establishment;

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token,},
  })
  .then(function (response) {
    if (response.data.status == 200) {
      me.name_establishment = response.data.result.name;
    }
  })

}

function ViewBussiness() {
  let me = this;
  let url = this.url_base + "get-business";

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token,},
  })
  .then(function (response) {
    if (response.data.status == 200) {
      me.name_bussines = response.data.result.name+" - "+response.data.result.document_number;
    }
  })
}

</script>
<style>

</style>
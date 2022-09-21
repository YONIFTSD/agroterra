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
        <b-badge class="ml-2" variant="info">{{name_establishment}}</b-badge>
        <b-badge v-if="expiration" class="ml-2" variant="danger">{{service_expiration}} </b-badge>
    </CHeaderNav>
    <CHeaderNav class="d-md-down-none mr-1">
      <b-badge variant="success">{{user.user}}</b-badge>
    </CHeaderNav>
    <CHeaderNav class="d-md-down-none mx-2" v-if="not_read > 0">
      <CDropdown inNav class="c-header-nav-items" placement="bottom-end" add-menu-classes="pt-0" >
        <template #toggler>
        <CHeaderNavLink>
          <div class="c-avatar">
            <img src="@/assets/icons/email.png" class="img-float" /> <b-badge variant="info">{{not_read}}</b-badge>
          </div>
        </CHeaderNavLink>
      </template>
      <div class="dropdown-menu dropdown-menu-end dropdown-menu-lg pt-0 show"
        style="position: absolute; inset: 0px 0px auto auto; margin: 0px; min-width: 400px;" data-popper-placement="bottom-end">
        <div class="dropdown-header bg-light dark:bg-white dark:bg-opacity-10"><strong>Tienes {{not_read}} mensajes sin leer</strong></div>
        <a class="dropdown-item" href="#">
            <div class="w-100 row" v-for="(item, it) in messages" :key="it">
              <div class="col-md-12">
                <small class="text-medium-emphasis float-left">{{item.from}}</small>
                <small class="text-medium-emphasis float-right">{{item.created_at}}</small>
              </div>
              <div class="col-md-12">
                <div class="text-truncate font-weight-bold">
                   {{item.subject}}
                </div>
                <div class="small text-medium-emphasis text-truncate">
                  {{item.message}}
                </div>
              </div>
            </div>
       
      
        </a>
      </div>

  
  
    </CDropdown>

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
      name_bussines:"",
      expiration: false,
      service_expiration: '',
      messages:[],
      not_read:0,
    };
  },
  methods: {
    ViewEstablishment,
    ViewBussiness,
    ServiceExpiration,
    ListMessages,
  },
  mounted() {
    this.ViewEstablishment();
    this.ViewBussiness();
    this.ServiceExpiration();
    this.ListMessages();

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
      window.localStorage.removeItem('business');
      let business = {
        type_print : response.data.result.type_print,
      }
      business = je.encrypt(JSON.stringify(business));
      window.localStorage.setItem( "business",business );
    }
  })

}

function ListMessages() {

let me = this;
let url = this.url_base + "message/list";

axios({
  method: "GET",
  url: url,
  headers: { token: this.token },
})
.then(function (response) {
  if (response.data.status == 200) {
    me.messages = response.data.messages;
    me.not_read = parseFloat(response.data.not_read);
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

      window.localStorage.removeItem('type_business');
      let type_business = {
        type_business : response.data.result.type_business,
      }
      type_business = je.encrypt(JSON.stringify(type_business));
      window.localStorage.setItem( "type_business",type_business );
 
      
    }
  })
}

function ServiceExpiration() {
  let me = this;
  let url = this.url_base + "service-expiration";

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token,},
  })
  .then(function (response) {
    if (response.data.status == 200) {

      me.expiration = response.data.result.expiration;    
      me.service_expiration = response.data.result.service_expiration;
 
      
    }
  })
}


</script>
<style>

</style>
<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Guia de Remisión - Listar</strong>
          </CCardHeader>
          <CCardBody>
            <b-row>

                <b-col sm="12" md="6">
           
              </b-col>

                <b-col sm="12" md="2">
                  <b-form-group label="Desde :">
                    <b-form-input @change="ListReferralGuide" class="text-center" :max="to" type="date"  ref="to" v-model="from"></b-form-input>
                    <small v-if="errors.from" class="form-text text-danger" >Selccione una fecha</small>
                  </b-form-group>
                </b-col>

                <b-col sm="12" md="2">
                  <b-form-group label="Hasta :">
                    <b-form-input @change="ListReferralGuide" class="text-center" :min="from" type="date"  ref="from" v-model="to"></b-form-input>
                    <small v-if="errors.to" class="form-text text-danger" >Selccione una fecha</small>
                  </b-form-group>
                </b-col>
                
                <b-col sm="6" md="2">
                  <b-form-group label=".">
                    <b-input-group>
                    <b-form-input v-model="search" class="form-control"></b-form-input>
                    <b-input-group-append>
                      <b-button variant="primary" @click="ListReferralGuide"><b-icon icon="search"></b-icon></b-button>
                    </b-input-group-append>
                  </b-input-group>
                  </b-form-group>
                </b-col>
          
            </b-row>

            <div class="table-responsive mt-3 height-table">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th width="5%" class="text-center">#</th>
                    <th width="10%" class="text-center">Fecha</th>
                    <th width="10%" class="text-center">Comprobante</th>
                    <th width="55%" class="text-center">Proveedor</th>
                    <th width="10%" class="text-center">Estado</th>
                    <th width="10%" class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="item.id_input">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-center"> {{ item.broadcast_date }}</td>
                    <td class="text-center"> {{ CodeInvoice(item.type_invoice)+ ' '+item.serie+'-'+item.number }}</td>
                    <td class="text-left"> {{ item.name+" - "+item.document_number }}</td>
                    <td class="text-center">
                        <b-badge v-if="item.state == 1" variant="warning">Pendiente</b-badge>
                        <b-badge v-if="item.state == 2" variant="success">Girado</b-badge>
                        <b-badge v-if="item.state == 3" variant="primary">Emitido</b-badge>
                        <b-badge v-if="item.state == 4" variant="success">Aceptado</b-badge>
                        <b-badge v-if="item.state == 5" variant="danger">Rechazado</b-badge>
                        <b-badge v-if="item.state == 0" variant="danger">Anulado</b-badge>
                    </td>
                    <td class="text-center">
                      <b-dropdown bloque size="sm" text="Acciones" right>

                        <b-dropdown-item v-if="Permission('ReferralGuideEdit')" @click="CompleteReferralGuide(item.id_referral_guide)">Completar</b-dropdown-item>
                        <b-dropdown-item v-if="Permission('ReferralGuideView')"  @click="ViewReferralGuide(item.id_referral_guide)">Ver</b-dropdown-item>
                        <b-dropdown-item v-if="item.state != 1" @click="PDFReferralGuide(item.id_referral_guide)">PDF</b-dropdown-item>
                        <b-dropdown-item v-if="item.state == 3 || item.state == 5 ||item.state == 6" @click="SendXML(item.id_referral_guide)">Enviar XML</b-dropdown-item>
                        <!-- <b-dropdown-item v-if="Permission('ReferralGuideDelete') && item.state != 1" @click="ConfirmDeleteReferralGuide(item.id_referral_guide)">Eliminar</b-dropdown-item> -->
                      </b-dropdown>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <b-row class="mt-4">
              <b-col md="8">
                <b-pagination v-model="currentPage" v-on:input="ListReferralGuide" :total-rows="rows" :per-page="perPage" align="center"></b-pagination>
              </b-col>
              <b-col md="4 text-center">
                <p>Pagina Actual: {{ currentPage }}</p>
              </b-col>
            </b-row>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import vSelect from "vue-select";
import 'vue-select/dist/vue-select.css';
import "vue-select/src/scss/vue-select.scss";

const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState } from "vuex";

import CodeToName from "@/assets/js/CodeToName";
var moment = require("moment");

export default {
  name: "RquirementList",
  components:{
      vSelect,
  },
  data() {
    return {
      module: 'ReferralGuide',
      perPage: 15,
      currentPage: 1,
      rows: 0,
      data_table: [],

      to:moment(new Date()).local().format("YYYY-MM-DD"),
      from:moment().subtract(30, 'days').local().format("YYYY-MM-DD"),
      search: "",
      providers: [],
      provider:null,
      errors:{
        to:false,
        from:false,
      }
    };
  },
  mounted() {
    this.ListReferralGuide();
  },
  methods: {
    ListReferralGuide,
    CompleteReferralGuide,
    EditReferralGuide,
    ViewReferralGuide,
    ConfirmDeleteReferralGuide,
    DeleteReferralGuide,
    Permission,
    PDFReferralGuide,
    CodeInvoice,
    SearchProvider,
    SendXML,
  },

  computed: {
    ...mapState(["url_base"]),
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
};

function SearchProvider(search, loading) {
  
    let me = this;
    let url = this.url_base + "search-providers/" + search;
    if (search !== "") {
      loading(true);
      axios({
        method: "GET",
        url: url,
      }).then(function (response) {
            me.providers = response.data.result;
            loading(false);
      })
    }
    
}

// crear xml
function SendXML(id_referral_guide) {
  this.isLoading = true;
  let me = this;
  let url = this.url_base + "referral-guide/send-xml/" + id_referral_guide;
  axios({
    method: "get",
    url: url,
    headers: { token: this.token, module: this.module,role: 1 },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        for (var i = 0; i < me.data_table.length; i++) {
          if (me.data_table[i].id_referral_guide == id_referral_guide) {
            me.data_table[i].state = response.data.result.state;
            break;
          }
        }
        if (response.data.result.state == 4) {
          Swal.fire({ icon: 'success', text: 'El comprobante, ha sido aceptado', timer: 3000,})
        }else if(response.data.result.state == 5){
          Swal.fire({ icon: 'error', text: response.data.result.sunat_message, timer: 3000,})
        }
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
      me.isLoading = false;
    })
}


function CodeInvoice(code) {
  return CodeToName.CodeInvoice(code);
}

function PDFReferralGuide(id_referral_guide) {
  open(this.url_base + 'referral-guide-pdf/'+id_referral_guide,'_blank');
}
//listar usuario
function ListReferralGuide() {

    let id_provider = this.provider == null ? 'all' : this.provider.id;
  this.errors.from = false;
  this.errors.to = false;

  if (this.from.length == 0) {this.errors.from = true; return false;}
  if (this.to.length == 0) {this.errors.to = true; return false;}
  let search = this.search == "" ? "all" : this.search;

  let me = this;
  let url = this.url_base + "referral-guide/list/"+id_provider+"/" + this.from + "/" + this.to + "/" + this.id_establishment + "/" + search + "?page=" + this.currentPage;

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module,role: 1,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.rows = response.data.result.total;
        me.data_table = response.data.result.data;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}


function CompleteReferralGuide(id_referral_guide) {
  this.$router.push({
    name: "ReferralGuideComplete",
    params: { id_referral_guide: je.encrypt(id_referral_guide) },
  });
}

// Editar usuario
function EditReferralGuide(id_referral_guide) {
  this.$router.push({
    name: "ReferralGuideEdit",
    params: { id_referral_guide: je.encrypt(id_referral_guide) },
  });
}

// Ver Usuario
function ViewReferralGuide(id_referral_guide) {
  this.$router.push({
    name: "ReferralGuideView",
    params: { id_referral_guide: je.encrypt(id_referral_guide) },
  });
}

// Confirmar eliminar
function ConfirmDeleteReferralGuide(id_referral_guide) {
  Swal.fire({
    title: "Esta seguro de eliminar el requerimiento?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.DeleteReferralGuide(id_referral_guide);
    }
  });
}

// eliminar usuario
function DeleteReferralGuide(id_referral_guide) {
  let me = this;
  let url = this.url_base + "requirement/delete/" + id_referral_guide;
  axios({
    method: "delete",
    url: url,
    headers: {token: this.token, module: this.module, role: 4,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        //eliminado del objeto
        for (var i = 0; i < me.data_table.length; i++) {
          if (me.data_table[i].id_referral_guide == id_referral_guide) {
            me.data_table.splice(i, 1);
            break;
          }
        }
        Swal.fire({ icon: 'success', text: 'Se ha eliminado el requerimiento', timer: 2000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 2000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error',text: 'A ocurrido un error',timer: 2000,})
    });
}

// permisos
function Permission(module_permission) {
  let user_permissions = window.localStorage.getItem("user_permissions");
  user_permissions = JSON.parse(JSON.parse(je.decrypt(user_permissions)));
  if (user_permissions.indexOf(module_permission) > -1) {
    return true;
  } else {
    return false;
  }
}
</script>

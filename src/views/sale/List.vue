<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Venta - Listar</strong>
          </CCardHeader>
          <CCardBody>

              <b-row>
                <b-col sm="12" md="5">
                  <b-form-group>
                    <label>Client: </label>
                    <v-select @input="ListSales" placeholder="Todos" class="w-100" :filterable="false" label="full_name" v-model="client" @search="SearchClients" :options="clients"></v-select>
                  </b-form-group>
                </b-col>

                <b-col sm="12" md="2">
                  <b-form-group label="Desde :">
                    <b-form-input @change="ListSales" class="text-center" :max="to" type="date"  ref="to" v-model="from"></b-form-input>
                    <small v-if="errors.from" class="form-text text-danger" >Selccione una fecha</small>
                  </b-form-group>
                </b-col>

                <b-col sm="12" md="2">
                  <b-form-group label="Hasta :">
                    <b-form-input @change="ListSales" class="text-center" :min="from" type="date"  ref="from" v-model="to"></b-form-input>
                    <small v-if="errors.to" class="form-text text-danger" >Selccione una fecha</small>
                  </b-form-group>
                </b-col>
                
                <b-col sm="6" md="2">
                  <b-form-group label=".">
                    <b-input-group>
                    <b-form-input v-model="search" class="form-control"></b-form-input>
                    <b-input-group-append>
                      <b-button variant="primary" @click="ListSales"><b-icon icon="search"></b-icon></b-button>
                    </b-input-group-append>
                  </b-input-group>
                  </b-form-group>
                </b-col>

                <b-col sm="6" md="1">
                  <b-form-group label=".">
                    <b-link  v-if="Permission('SaleAdd')" class="btn form-control btn-primary"  :to="{ path: '/venta/nuevo' }" append ><i class="fas fa-file"></i></b-link>
                  </b-form-group>
                </b-col>
          
            </b-row>



            <div class="table-responsive mt-3 height-table-sale">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th width="3%" class="text-center">#</th>
                    <th width="10%" class="text-center">Fecha</th>
                    <th width="13%" class="text-center">Comprobante</th>
                    <th width="49%" class="text-center">Cliente</th>
                    <th width="8%" class="text-center">Total</th>
                    <th width="10%" class="text-center">Estado</th>
                    <th width="10%" class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="it">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-center"> {{ item.broadcast_date }}</td>
                    <td class="text-center"> {{ CodeInvoice(item.type_invoice)+ ' '+item.serie+'-'+item.number }}</td>
                    <td class="text-left"> {{ item.client_name + ' - '+item.client_document_number }}</td>
                    <td class="text-right"> {{ item.total }} </td>
                    <td class="text-center">
                          <b-badge v-if="item.state == 0" variant="danger">XML</b-badge>
                          <b-badge v-if="item.state == 1" variant="warning">Girado</b-badge>
                          <b-badge v-if="item.state == 2" variant="success">Canjeado</b-badge>
                          <b-badge v-if="item.state == 3" variant="info">Emitido</b-badge>
                          <b-badge v-if="item.state == 4" variant="success">Aceptado</b-badge>
                          <b-badge v-if="item.state == 5" variant="danger">Rechazado</b-badge>
                          <b-badge v-if="item.state == 6" variant="danger">Anulado</b-badge>
                    </td>
                    <td class="text-center">
                      <b-dropdown bloque size="sm" text="Acciones" right>
                        <b-dropdown-item v-if="item.state == 3 || item.state == 5" @click="SendXML(item.id_sale)">Enviar XML</b-dropdown-item>
                        <b-dropdown-item v-if="Permission('SaleEdit')  && (item.state == 1 || item.state == 3)" @click="EditSale(item.id_sale)">Editar</b-dropdown-item>
                        <b-dropdown-item v-if="Permission('SaleView')"  @click="ViewSale(item.id_sale)">Ver</b-dropdown-item>
                        <b-dropdown-item v-if="item.state == 1 || item.state == 3"  @click="ViewReferralGuide(item.id_sale)">Generar G.R.</b-dropdown-item>
                        <b-dropdown-item v-if="Permission('SaleDelete') && (item.state == 1 || item.state == 3)" @click="ConfirmDeleteSale(item.id_sale)">Eliminar</b-dropdown-item>
                      </b-dropdown>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <b-row class="mt-4">
              <b-col md="8">
                <b-pagination v-model="currentPage" v-on:input="ListSales" :total-rows="rows" :per-page="perPage" align="center"></b-pagination>
              </b-col>
              <b-col md="4 text-center">
                <p>Pagina Actual: {{ currentPage }}</p>
              </b-col>
            </b-row>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <LoadingComponent :is-visible="isLoading"/>
    <ModalReferralGuide />
  </div>
</template>
<style>
.height-table-sale{
  min-height: 220px !important;
}
</style>
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
import EventBus from "@/assets/js/EventBus";
import LoadingComponent from './../pages/Loading'
import ModalReferralGuide from './components/ModalReferralGuide'

export default {
  name: "UsuarioList",
  components:{
    vSelect,
    LoadingComponent,
    ModalReferralGuide,
  },
  data() {
    return {
      isLoading:false,
      module: 'Sale',
      role:1,
      perPage: 15,
      currentPage: 1,
      rows: 0,
      data_table: [],

      id_client:0,
      to:moment(new Date()).local().format("YYYY-MM-DD"),
      from:moment().subtract(1, 'days').local().format("YYYY-MM-DD"),
      search: "",
      clients: [],
      client:null,
      errors:{
        to:false,
        from:false,
      }
    };
  },
  mounted() {
    this.ListSales();
  },
  methods: {
    ListSales,
    EditSale,
    ViewSale,
    ConfirmDeleteSale,
    DeleteSale,
    Permission,
    CodeInvoice,
    SearchClients,

    ViewReferralGuide,
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
      let id_establishment = window.localStorage.getItem("id_establishment");
      id_establishment = JSON.parse(je.decrypt(id_establishment));
      return id_establishment;
    },
  },
};

function SearchClients(search, loading) {
  
   let me = this;
    let url = this.url_base + "search-clients/" + search;
    if (search !== "") {
      loading(true);
      axios({
        method: "GET",
        url: url,
      }).then(function (response) {
            me.clients = response.data;
            loading(false);
      })
    }
}

function CodeInvoice(code) {
  return CodeToName.CodeInvoice(code);
}
//listar usuario
function ListSales() {
  this.errors.from = false;
  this.errors.to = false;

  let id_client = this.client == null ? 0 : this.client.id;
  if (this.from.length == 0) {this.errors.from = true; return false;}
  if (this.to.length == 0) {this.errors.to = true; return false;}
  let search = this.search == "" ? "all" : this.search;

  let me = this;
  let url = this.url_base + "sale/list/" + id_client + "/" + this.from + "/" + this.to + "/" + this.id_establishment + "/" + search + "?page=" + this.currentPage;


  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: 1,},
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

// Editar usuario
function EditSale(id_sale) {
  this.$router.push({
    name: "SaleEdit",
    params: { id_sale: je.encrypt(id_sale) },
  });
}

// Ver Usuario
function ViewSale(id_sale) {
  this.$router.push({
    name: "SaleView",
    params: { id_sale: je.encrypt(id_sale) },
  });
}

function ViewReferralGuide(id_sale) {
  EventBus.$emit('ModalReferralGuideShow',id_sale);
}

function SendXML(id_sale) {
  this.isLoading = true;
  let me = this;
  let url = this.url_base + "sale/send-xml/" + id_sale;
  axios({
    method: "get",
    url: url,
    headers: { token: this.token, module: this.module,role: 1 },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        for (var i = 0; i < me.data_table.length; i++) {
          if (me.data_table[i].id_sale == id_sale) {
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



// Confirmar eliminar
function ConfirmDeleteSale(id_sale) {
  Swal.fire({
    title: "Esta seguro de eliminar el registro?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.DeleteSale(id_sale);
    }
  });
}

// eliminar usuario
function DeleteSale(id_sale) {
  let me = this;
  let url = this.url_base + "sale/delete/" + id_sale;
  axios({
    method: "delete",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: 4,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        //eliminado del objeto
        for (var i = 0; i < me.data_table.length; i++) {
          if (me.data_table[i].id_sale == id_sale) {
            me.data_table.splice(i, 1);
            break;
          }
        }
        Swal.fire("Eliminado!", "El registro ha sido eliminado", "success");
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
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

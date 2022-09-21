<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Cotización - Listar</strong>
          </CCardHeader>
          <CCardBody>

              <b-row>
                <b-col sm="12" md="5">
                  <b-form-group>
                    <label>Client: </label>
                    <v-select @input="ListQuotation" placeholder="Todos" class="w-100" :filterable="false" label="full_name" v-model="client" @search="SearchClients" :options="clients"></v-select>
                  </b-form-group>
                </b-col>

                <b-col sm="12" md="2">
                  <b-form-group label="Desde :">
                    <b-form-input @change="ListQuotation" class="text-center" :max="to" type="date"  ref="to" v-model="from"></b-form-input>
                    <small v-if="errors.from" class="form-text text-danger" >Selccione una fecha</small>
                  </b-form-group>
                </b-col>

                <b-col sm="12" md="2">
                  <b-form-group label="Hasta :">
                    <b-form-input @change="ListQuotation" class="text-center" :min="from" type="date"  ref="from" v-model="to"></b-form-input>
                    <small v-if="errors.to" class="form-text text-danger" >Selccione una fecha</small>
                  </b-form-group>
                </b-col>
                
                <b-col sm="6" md="2">
                  <b-form-group label=".">
                    <b-input-group>
                    <b-form-input v-model="search" class="form-control"></b-form-input>
                    <b-input-group-append>
                      <b-button variant="primary" @click="ListQuotation"><b-icon icon="search"></b-icon></b-button>
                    </b-input-group-append>
                  </b-input-group>
                  </b-form-group>
                </b-col>

                <b-col sm="6" md="1">
                  <b-form-group label=".">
                    <b-link  v-if="Permission('QuotationAdd')" class="btn form-control btn-primary"  :to="{ path: '/cotizacion/nuevo' }" append ><i class="fas fa-file"></i></b-link>
                  </b-form-group>
                </b-col>
          
            </b-row>



            <div class="table-responsive mt-3 height-table-sale">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th width="3%" class="text-center">#</th>
                    <th width="12%" class="text-center">Fecha</th>
                    <th width="13%" class="text-center">Comprobante</th>
                    <th width="37%" class="text-center">Cliente</th>
                    <th width="6%" class="text-center">Moneda</th>
                    <th width="6%" class="text-center">Total</th>
                    <th width="10%" class="text-center">Usuario</th>
                    <th width="7%" class="text-center">Estado</th>
                    <th width="10%" class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="it">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-center"> {{ item.broadcast_date }} {{ item.broadcast_time }}</td>
                    <td class="text-center"> {{ CodeInvoice(item.type_invoice)+ ' '+item.serie+'-'+item.number }}</td>
                    <td class="text-left"> {{ item.client_name + ' - '+item.client_document_number }}</td>
                    <td class="text-center"> {{ item.coin }} </td>
                    <td class="text-right"> {{ item.total }} </td>
                    <td class="text-left"> {{ item.user }} </td>
                    <td class="text-center">
                        <b-badge v-if="item.state == 1" variant="warning">Girado</b-badge>
                        <b-badge v-if="item.state == 2" variant="success">Canjeado</b-badge>
                    </td>
                    <td class="text-center">
                      <b-dropdown bloque size="sm" text="Acciones" right>
                        <b-dropdown-item v-if="Permission('QuotationEdit')  && item.state == 1" @click="EditQuotation(item.id_quotation)">Editar</b-dropdown-item>
                        <b-dropdown-item v-if="Permission('QuotationView')"  @click="ViewQuotation(item.id_quotation)">Ver</b-dropdown-item>
                        <b-dropdown-item v-if="Permission('QuotationDelete') && item.state == 1" @click="ConfirmDeleteSale(item.id_quotation)">Eliminar</b-dropdown-item>
                        <b-dropdown-item v-if="item.state == 1"  @click="TradeSale(item.id_quotation)">Canjear Cotización</b-dropdown-item>
                        <b-dropdown-item  @click="ModalEmail(item.id_quotation)">Enviar por Email</b-dropdown-item>
                      </b-dropdown>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <b-row class="mt-4">
              <b-col md="8">
                <b-pagination v-model="currentPage" v-on:input="ListQuotation" :total-rows="rows" :per-page="perPage" align="center"></b-pagination>
              </b-col>
              <b-col md="4 text-center">
                <p>Pagina Actual: {{ currentPage }}</p>
              </b-col>
            </b-row>



            <b-modal size="md" hide-footer v-model="modal_email" title="ENVIO DE EMAIL">
              <b-form>
                <b-col md="12">
                  <b-form-group label="Enviar por correo electrónico">
                    <b-input-group>
                    <b-form-input type="email" v-model="quotation.email" class="form-control"></b-form-input>
                    <b-input-group-append>
                      <b-button @click="SendEmail" variant="primary"><i class="far fa-paper-plane"></i></b-button>
                    </b-input-group-append>
                  </b-input-group>
                  </b-form-group>
                </b-col>
              </b-form>
            </b-modal>

          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <LoadingComponent :is-visible="isLoading"/>
  </div>
</template>
<style>
.height-table-sale{
  min-height: 260px !important;
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


export default {
  name: "UsuarioList",
  components:{
    vSelect,
    LoadingComponent,
  },
  data() {
    return {
      isLoading:false,
      module: 'Quotation',
      role:1,
      perPage: 30,
      currentPage: 1,
      rows: 0,
      data_table: [],
      modal_email :false,

      id_client:0,
      to:moment(new Date()).local().format("YYYY-MM-DD"),
      from:moment().subtract(1, 'days').local().format("YYYY-MM-DD"),
      search: "",
      clients: [],
      client:null,
      errors:{
        to:false,
        from:false,
      },
      quotation:{
        id_quotation:'',
        email:'',
      },
      sale_low: {
        id_quotation_low : '',
        id_quotation : '',
        id_user : '',
        code : '',
        serie : '',
        sequence : '',
        reference_date : '',
        low_date : '',
        reason : '',
        sunat_message : '',
        observation:'',
        state:1,
      },
      errors_low:{
          reason:false,
      },
    };
  },
  mounted() {
    this.ListQuotation();
  },
  methods: {
    ListQuotation,
    EditQuotation,
    ViewQuotation,
    ConfirmDeleteSale,
    DeleteSale,
    Permission,
    CodeInvoice,
    SearchClients,
    ModalEmail,
    SendEmail,
    TradeSale,
    
  },

  computed: {
    ...mapState(["url_base"]),
    token: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.api_token;
    },
    user: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user;
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
function ListQuotation() {
  this.errors.from = false;
  this.errors.to = false;

  let id_client = this.client == null ? 0 : this.client.id;
  if (this.from.length == 0) {this.errors.from = true; return false;}
  if (this.to.length == 0) {this.errors.to = true; return false;}
  let search = this.search == "" ? "all" : this.search;

  let me = this;
  let url = this.url_base + "quotations/list/" + id_client + "/" + this.from + "/" + this.to + "/" + this.id_establishment + "/" + search + "?page=" + this.currentPage;


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
function EditQuotation(id_quotation) {
  this.$router.push({
    name: "QuotationEdit",
    params: { id_quotation: je.encrypt(id_quotation) },
  });
}


function TradeSale(id_quotation) {
  this.$router.push({
    name: "SaleTrade",
    params: { id_quotation: je.encrypt(id_quotation) },
  });
}
// Ver Usuario
function ViewQuotation(id_quotation) {
  this.$router.push({
    name: "QuotationView",
    params: { id_quotation: je.encrypt(id_quotation) },
  });
}

function ModalEmail(id_quotation) {
  
  let me = this;
  let url = me.url_base + "quotations/view/"+id_quotation;
  axios({
    method: "GET",
    url: url,
    headers: {"Content-Type": "application/json", token: me.token, module: me.module,role: 1 },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.modal_email = true;
        me.quotation.id_quotation = response.data.result.quotation.id_quotation;
        me.quotation.email = response.data.result.quotation.email;
      } else {
        this.modal_email = false;
        me.quotation.id_quotation = '';
        me.quotation.email = '';
      }
    })
}

function SendEmail() {
  if (this.quotation.id_quotation.length == 0) {
    return false;
  }
  if (this.quotation.email.length == 0) {
    return false;
  }

  this.isLoading = true;
  let me = this;
  let url = this.url_base + "quotations/send-email";
  let data = {
    id_quotation:this.quotation.id_quotation,
    email:this.quotation.email,
  }
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: { token: this.token, module: this.module,role: 1 },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        Swal.fire({ icon: 'success', text: response.data.message, timer: 3000,})
        me.quotation.id_quotation = '';
        me.quotation.email = '';
        me.modal_email = false;
      } else {
        Swal.fire({ icon: 'error', text: response.data.message, timer: 3000,})
        me.quotation.id_quotation = '';
        me.quotation.email = '';
        me.modal_email = false;
      }
      me.isLoading = false;
    })
}



// Confirmar eliminar
function ConfirmDeleteSale(id_quotation) {
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
      this.DeleteSale(id_quotation);
    }
  });
}

// eliminar usuario
function DeleteSale(id_quotation) {
  let me = this;
  let url = this.url_base + "quotations/delete/" + id_quotation;
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
          if (me.data_table[i].id_quotation == id_quotation) {
            me.data_table.splice(i, 1);
            break;
          }
        }
        Swal.fire("Eliminado!", "La cotización ha sido eliminado", "success");
      } else {
        Swal.fire({ icon: 'error', text: response.data.message, timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}


function showModalSaleLow(index) {

  if (this.data_table[index].type_invoice == '01' ||this.data_table[index].type_invoice == '03' ||this.data_table[index].type_invoice == '07' ||this.data_table[index].type_invoice == '08' ) {
    if (this.data_table[index].state == 3) {
      Swal.fire({ icon: 'error', text: 'Para dar de baja un comprobante, se requiere que el comprobante este aceptado', timer: 3000,})  
      return false;
    }
    
  }
  this.$refs['modal-sale-low'].show();
  this.sale_low.id_quotation = this.data_table[index].id_quotation;
  this.sale_low.index =  index;
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

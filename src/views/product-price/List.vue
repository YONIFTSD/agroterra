<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Productos - Lista de Precios</strong>
          </CCardHeader>
          <CCardBody>
            <b-row>
              <b-col sm="12" md="6"></b-col>
              <b-col sm="12" md="1">
                  <b-button type="button" title="Exportar Excel" @click="ExportExcel" class="form-control" variant="success"><i class="fas fa-file-excel"></i></b-button>
              </b-col>
              <b-col sm="12" md="1">
                  <b-button type="button" title="Exportar Excel General" @click="ExportExcelGeneral" class="form-control" variant="primary"><i class="fas fa-file-excel"></i></b-button>
              </b-col>
              <b-col sm="6" md="2">
                <b-input-group>
                  <b-form-input type="number" step="any" v-model="exchange_rate" class="form-control text-center"></b-form-input>
                  <b-input-group-append>
                    <b-button variant="primary" @click="ConfirmDeterminatePriceGlobal"><i class="fas fa-sync-alt"></i></b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-col>
              <b-col sm="6" md="2">
                <b-input-group>
                  <b-form-input  v-model="search" class="form-control"></b-form-input>
                  <b-input-group-append>
                    <b-button variant="primary" @click="ListProduct"><b-icon icon="search"></b-icon></b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-col>
            </b-row>

            <div class="table-responsive mt-3">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th rowspan="2" width="5%" class="text-center">#</th>
                    <th rowspan="2" width="6%" class="text-center">Código</th>
                    <th rowspan="2" width="40%" class="text-center">Nombre</th>
                    <th rowspan="2" width="15%" class="text-center">Marca</th>
                    <th colspan="3" width="27%" class="text-center">Precios</th>
                    <th rowspan="2" width="8%" class="text-center">Acciones</th>
                  </tr>
                  <tr>
                    <th class="text-center">Costo Real</th>
                    <th class="text-center">Precio Minimo</th>
                    <th class="text-center">Precio Venta</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="item.id_product">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-center"> {{ item.code }}</td>
                    <td class="text-left"> {{ item.name + " - "+item.presentation }}</td>
                    <td class="text-left"> {{ item.brand_name }}</td>
                    <td class="text-right"> {{ item.real_cost }}</td>
                    <td class="text-right"> {{ item.minimal_price }}</td>
                    <td class="text-right"> {{ item.sale_price }}</td>
                    <td class="text-center">
                      <b-button type="button" @click="modalProductPriceShow(item.id_product)" variant="info" ><i class="fas fa-eye"></i></b-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <b-row class="mt-4">
              <b-col md="8">
                <b-pagination
                  v-model="currentPage"
                  v-on:input="ListProduct"
                  :total-rows="rows"
                  :per-page="perPage"
                  align="center"
                ></b-pagination>
              </b-col>
              <b-col md="4 text-center">
                <p>Pagina Actual: {{ currentPage }}</p>
              </b-col>
            </b-row>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <ModalProductPrice/>
     <LoadingComponent :is-visible="isLoading"/>
  </div>
</template>

<script>
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState } from "vuex";
import EventBus from "@/assets/js/EventBus";

import ModalProductPrice from './components/ModalProductPrice'
import LoadingComponent from './../pages/Loading'

export default {
  name: "UsuarioList",
  components:{
    ModalProductPrice,
    LoadingComponent,
  },
  data() {
    return {
  
      module:'ProductPrice',
      perPage: 15,
      currentPage: 1,
      rows: 0,
      search: "",
      data_table: [],

      exchange_rate:'',
      isLoading:false,
    };
  },
  mounted() {
    EventBus.$on('ListPriceProduct', () => {7
      this.ListProduct();
    });
    this.GetExchangeRate();
    this.ListProduct();
  },
  methods: {
    ListProduct,
    ListPriceByProduct,
    modalProductPriceShow,

    GetExchangeRate,
    ConfirmDeterminatePriceGlobal,
    DeterminatePriceGlobal,
    Permission,
    ExportExcel,
    ExportExcelGeneral,
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

//listar usuario
function ListProduct() {
  let search = this.search == "" ? "all" : this.search;
  let me = this;
  let url = this.url_base + "product/list-determine-price/" + search +"/"+ this.id_establishment + "?page=" + this.currentPage;

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token,module: this.module, role: 1,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.rows = response.data.result.paginate.total;
        me.data_table = response.data.result.result;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      console.log(error);
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function ListPriceByProduct(id_product) {
  let me = this;
  let url = this.url_base + "product/list-prices/" + id_product + this.id_establishment;

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

function modalProductPriceShow(id_product) {
    EventBus.$emit('ModalProductPriceShow',id_product);
}

function ExportExcel() {  
  let url = this.url_base + "excel-products-price/"+this.id_establishment;
  window.open(url,'_blank');
}


function ExportExcelGeneral() {  
  let url = this.url_base + "excel-products-price-general";
  window.open(url,'_blank');
}


function GetExchangeRate() {
  let me = this;
  let url = this.url_base + "get-business";

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token,module: this.module, role: 1,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.exchange_rate = response.data.result.exchange_rate;
      } 
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function ConfirmDeterminatePriceGlobal() {

  if (this.exchange_rate.length == 0) {
    return false;
  }

  let me = this;
  Swal.fire({
    title: 'Esta seguro de actualizar el tipo de cambio de manera general a todos los productos?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      me.DeterminatePriceGlobal(me);
    }
  })

}

function DeterminatePriceGlobal(me) {
  me.isLoading = true;
  let url = me.url_base + "product/determine-price-global";
  let data = {
    id_establishment : me.id_establishment,
    exchange_rate : me.exchange_rate,
  };
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: { token: me.token, module: me.module, role: 1,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.ListProduct();
      } 
      me.isLoading = false;
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      me.isLoading = false;
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

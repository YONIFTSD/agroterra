<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Kardex de Existencias Valorado</strong>
          </CCardHeader>
          <CCardBody>
            <b-row>

                <b-col md="2">
                  <b-form-group label="Establecimiento :">
                    <b-form-select disabled v-model="id_establishment" :options="establishments"></b-form-select>
                    <small v-if="errors.id_establishment" class="form-text text-danger" >Selccione un establecimiento</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Almacen :">
                    <b-form-select v-model="id_warehouse" :options="warehouses"></b-form-select>
                    <small v-if="errors.id_warehouse" class="form-text text-danger" >Seleccione un almacen</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Comprobante de Pago ? :">
                    <b-form-select v-model="voucher_of_payment" :options="vouchers_of_payment"></b-form-select>
                    <small v-if="errors.voucher_of_payment" class="form-text text-danger" >Selccione un opción</small>
                  </b-form-group>
                </b-col>


                <b-col md="2">
                  <b-form-group label="Hasta ? :">
                    <b-form-input type="date" v-model="to"></b-form-input>
                    <small v-if="errors.to" class="form-text text-danger" >Selccione un fecha</small>
                  </b-form-group>
                </b-col>


                <b-col md="3">
                  <b-form-group label=".">
                    <b-input-group>
                    <b-form-input v-model="search" class="form-control"></b-form-input>
                    <b-input-group-append>
                      <b-button variant="primary" @click="ListStockExistence"><b-icon icon="search"></b-icon></b-button>
                    </b-input-group-append>
                  </b-input-group>
                  </b-form-group>
                </b-col>

                <b-col md="1">
                  <b-form-group label=".">
                    <b-button @click="ExportExcel" title="Exportar a Excel" type="button" variant="success" class="form-control"><i class="fas fa-file-excel"></i></b-button>
                  </b-form-group>
                </b-col>

            </b-row>

            <div class="table-responsive mt-3">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th rowspan="2" width="5%" class="text-center">#</th>
                    <th rowspan="2" width="10%" class="text-center">Codigo</th>
                    <th rowspan="2" width="40%" class="text-center">Nombre</th>
                    <th rowspan="2" width="10%" class="text-center">Categoria</th>
                    <th colspan="3" width="15%" class="text-center">Fisico</th>
                    <th colspan="3" width="20%" class="text-center">Valorado</th>
                  </tr>
                  <tr>
                    <th class="text-center">Entradas</th>
                    <th class="text-center">Salidas</th>
                    <th class="text-center">Saldo</th>
                    <th class="text-center">Entradas</th>
                    <th class="text-center">Salidas</th>
                    <th class="text-center">Saldo</th>
                    
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="it">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-center"> {{ item.code }}</td>
                    <td class="text-left"> {{ item.name}}</td>
                    <td class="text-left"> {{ item.category_name }}</td>
                    <td class="text-center"> {{ item.input_physical }}</td>
                    <td class="text-center"> {{ item.output_physical }}</td>
                    <td class="text-center"> {{ item.balance_physical }}</td>

                    <td class="text-right"> {{ item.input_valued }}</td>
                    <td class="text-right"> {{ item.output_valued }}</td>
                    <td class="text-right"> {{ item.balance_valued }}</td>
                   
                  </tr>
                </tbody>
              </table>
            </div>
            <b-row class="mt-4">
              <b-col md="8">
                <b-pagination v-model="currentPage" v-on:input="ListStockExistence" :total-rows="rows" :per-page="perPage" align="center"></b-pagination>
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
  </div>
</template>

<script>

const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState } from "vuex";

import CodeToName from "@/assets/js/CodeToName";
var moment = require("moment");
import LoadingComponent from './../pages/Loading'
export default {
  name: "RquirementList",
  components:{
    LoadingComponent,
  },
  data() {
    return {
      isLoading: false,
      module: 'KardexExistence',
      perPage: 15,
      currentPage: 1,
      rows: 0,
      data_table: [],
      establishments:[],
      warehouses:[],
      id_warehouse:'',
      voucher_of_payment:'all',
      to:moment(new Date()).local().format("YYYY-MM-DD"),
      search: "",

      vouchers_of_payment:[
        {value: 'all', text: '-- Todos --'},
        {value: 1, text: 'SI'},
        {value: 0, text: 'NO'},
      ],

      errors:{
        id_warehouse:false,
        to:false,
        from:false,
      }
    };
  },
  mounted() {
    this.ListEstablishment();
    this.ListWarehouse();
  },
  methods: {
    ListEstablishment,
    ListWarehouse,
    ListStockExistence,
    ExportExcel,
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
function ListEstablishment() {

  let me = this;
  let url = this.url_base + "active-establishments";
  axios({
    method: "GET",
    url: url,
    headers: { token: me.token, module: me.module, role: me.role,},
  })
    .then(function (response) {
      me.establishments = [{value:'',text:'Seleccione un establecimiento'}];
      if (response.data.status == 200) {
        for (let index = 0; index < response.data.result.length; index++) {
          const element = response.data.result[index];
          me.establishments.push({value: element.id_establishment, text: element.name});
        }
      } else {
        Swal.fire({ icon: 'error', text: 'A Ocurrido un error', timer: 2000,})
      }
    })
}

function ListWarehouse() {

  let me = this;
  me.warehouses = [{value:'',text:'Seleccione un almacen'}];
  if (me.id_establishment.length == 0) {
    me.id_warehouse = '';
    return false;
  }
  let url = this.url_base + "active-warehouses/"+me.id_establishment;
  axios({
    method: "GET",
    url: url,
    headers: { token: me.token,module: me.module, role: me.role,},
  })
    .then(function (response) {
      
      if (response.data.status == 200) {
        for (let index = 0; index < response.data.result.length; index++) {
          const element = response.data.result[index];
          me.warehouses.push({value: element.id_warehouse, text: element.name});
        }
      } else {
        Swal.fire({ icon: 'error', text: 'A Ocurrido un error', timer: 2000,})
      }
    })
}

function ListStockExistence() {
  this.errors.id_warehouse = false;
  this.errors.to = false;
  if (this.id_warehouse.length == 0) {
    this.errors.id_warehouse = true;
    Swal.fire({ icon: 'warning', text: 'Complete los cambos obligatorios', timer: 3000,})
    return false;
  }

  if (this.to.length == 0) {
    this.errors.to = true;
    Swal.fire({ icon: 'warning', text: 'Complete los cambos obligatorios', timer: 3000,})
    return false;
  }

  this.isLoading = true;
  let search = this.search == "" ? "all" : this.search;
  let me = this;
  let url = this.url_base + "kardex/existence/"+this.id_warehouse +"/"+ this.voucher_of_payment+"/"+ this.to +"/"+ search + "?page=" + this.currentPage;

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module,role: 1,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.rows = response.data.result.table.total;
        me.data_table = response.data.result.products;
        me.isLoading = false;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
        me.isLoading = false;
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      me.isLoading = false;
    });
}

function ExportExcel() {

  this.errors.id_warehouse = false;
  this.errors.to = false;
  if (this.id_warehouse.length == 0) {
    this.errors.id_warehouse = true;
    Swal.fire({ icon: 'warning', text: 'Complete los cambos obligatorios', timer: 3000,})
    return false;
  }

  if (this.to.length == 0) {
    this.errors.to = true;
    Swal.fire({ icon: 'warning', text: 'Complete los cambos obligatorios', timer: 3000,})
    return false;
  }

  let search = this.search == "" ? "all" : this.search;
  let me = this;
  let url = this.url_base + "excel-kardex-existence/"+this.id_warehouse +"/"+ this.voucher_of_payment+"/"+ this.to +"/"+ search;

  window.open(url,'_blank');
}

</script>

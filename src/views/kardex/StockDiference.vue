<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Diferencia de Stock</strong>
          </CCardHeader>
          <CCardBody>
            <b-row>
                <b-col md="3">
                </b-col>

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

                <b-col md="1">
                  <b-form-group label=".">
                    <b-button @click="ListStockDiference" title="Buscar" type="button" variant="primary" class="form-control"><i class="fas fa-search"></i></b-button>
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
                    <th width="5%" class="text-center">#</th>
                    <th width="10%" class="text-center">Codigo</th>
                    <th width="35%" class="text-center">Nombre</th>
                    <th width="10%" class="text-center">Categoria</th>
                    <th width="10%" class="text-center">Stock Kardex</th>
                    <th width="10%" class="text-center">Stock</th>
                    <th width="10%" class="text-center">Diferencia</th>
                    <th width="5%" class="text-center"></th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="it">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-center"> {{ item.code }}</td>
                    <td class="text-left"> {{ item.name}}</td>
                    <td class="text-left"> {{ item.category_name }}</td>
                    <td class="text-center"> {{ item.balance }}</td>
                    <td class="text-center"> {{ item.stock }}</td>
                    <td class="text-center"> {{ item.diference }}</td>
                    <td class="text-center">
                      <b-button type="button" @click="RefreshStock(item.id_product)" title="Actualizar" variant="primary"><i class="fas fa-sync-alt"></i></b-button>
                    </td>
                   
                  </tr>
                </tbody>
              </table>
            </div>
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
      module: 'StockDiference',
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
    ListStockDiference,
    RefreshStock,
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

function RefreshStock(id_product) {
  this.isLoading = true;
  let me = this;
  let url = this.url_base + "kardex/stock-diference-update";
  let data = {
    id_product:id_product,
    id_warehouse:this.id_warehouse,
  }
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: { token: this.token, module: this.module,role: 1,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        const index = me.data_table.map(item => item.id_product).indexOf(response.data.result.id_product);
        me.data_table[index].stock = response.data.result.quantity;
        me.data_table.splice(index, 1);
        Swal.fire({ icon: 'success', text: 'Se ha modificado el stock', timer: 3000,})
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

function ListStockDiference() {
  this.errors.id_warehouse = false;
  this.errors.to = false;
  if (this.id_warehouse.length == 0) {
    this.errors.id_warehouse = true;
    Swal.fire({ icon: 'warning', text: 'Complete los cambos obligatorios', timer: 3000,})
    return false;
  }


  this.isLoading = true;
  let me = this;
  let url = this.url_base + "kardex/stock-diference/"+this.id_warehouse + "?page=" + this.currentPage;

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module,role: 1,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.data_table = response.data.result;
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

  let me = this;
  let url = this.url_base + "excel-kardex-stock-diference/"+this.id_warehouse;

  window.open(url,'_blank');
}

</script>

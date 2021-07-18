<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Kardex - Fisico</strong>
          </CCardHeader>
          <CCardBody>
        
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>

                <b-col md="3">
                  <b-form-group label="Establecimiento :">
                    <b-form-select disabled @change="ListWarehouse" v-model="kardex.id_establishment" :options="establishments"></b-form-select>
                    <small v-if="errors.id_establishment" class="form-text text-danger" >Selccione un establecimiento</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Almacen :">
                    <b-form-select v-model="kardex.id_warehouse" :options="warehouses"></b-form-select>
                    <small v-if="errors.id_warehouse" class="form-text text-danger" >Selccione un almacen</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Comprobante de Pago ? :">
                    <b-form-select v-model="kardex.voucher_of_payment" :options="voucher_of_payment"></b-form-select>
                    <small v-if="errors.voucher_of_payment" class="form-text text-danger" >Selccione un opción</small>
                  </b-form-group>
                </b-col>


                <b-col md="3">
                  <b-form-group label="Hasta ? :">
                    <b-form-input type="date" v-model="kardex.to"></b-form-input>
                    <small v-if="errors.to" class="form-text text-danger" >Selccione un fecha</small>
                  </b-form-group>
                </b-col>

                <b-col md="6">
                  <b-form-group label="Producto :">
                    <v-select placeholder="Seleccione un producto" class="w-100" :filterable="false" label="name" v-model="product" @search="SearchProduct" :options="products"></v-select>
                    <small v-if="errors.id_product" class="form-text text-danger" >Selccione un producto</small>
                  </b-form-group>
                </b-col>
                

                <b-col md="2">
                  <b-form-group label=".">
                    <b-button type="submit" class="form-control" variant="primary">BUSCAR</b-button>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label=".">
                    <b-button type="button" title="Exportar Excel" @click="ExportExcel" class="form-control" variant="success"><i class="fas fa-file-excel"></i> EXCEL</b-button>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label=".">
                    <b-button type="button" title="Exportar Excel" @click="ExportExcelGeneral" class="form-control" variant="success"><i class="fas fa-file-excel"></i> EXCEL GENERAL</b-button>
                  </b-form-group>
                </b-col>

           

              </b-row>
            </b-form>

            
            <div class="table-responsive mt-3">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th class="text-center" colspan="4">Documento de traslado, comprobante de pago, documento interno o similir</th>
                    <th class="text-center" rowspan="2">Tipo Operación</th>
                    <th class="text-center">Entrada</th>
                    <th class="text-center">Salida</th>
                    <th class="text-center">S. Final.</th>
              
                  </tr>
                  <tr>
                    <th class="text-center">Fecha</th>
                    <th class="text-center">Tipo</th>
                    <th class="text-center">Serie</th>
                    <th class="text-center">Numero</th>
                    <th class="text-center">Cant.</th>
                    <th class="text-center">Cant.</th>
                    <th class="text-center">Cant.</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in kardex_psysical" :key="it">
                  <tr>
                    <td class="text-center">{{ item.broadcast_date }}</td>
                    <td class="text-center">{{ CodeInvoice(item.type_invoice) }}</td>
                    <td class="text-center">{{ item.serie }}</td>
                    <td class="text-center">{{ item.number }}</td>
                    <td class="text-center">{{ NameOperationType(item.type_operation) }}</td>
                    <td class="text-right">{{ item.input }}</td>
                    <td class="text-right">{{ item.output }}</td>
                    <td class="text-right">{{ item.balance }}</td>
                    
                                

                  </tr>
                </tbody>
              </table>
            </div>



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
var moment = require("moment");
import CodeToName from "@/assets/js/CodeToName";

export default {
  name: "SalidaList",
  components:{
      vSelect,
  },
  data() {
    return {
      module: 'KardexPsysical',
      role:1,
      kardex_psysical: [],
   


      establishments:[{value:'',text:'Seleccione un establecimiento'}],
      warehouses:[{value:'',text:'Seleccione un almacen'}],
      voucher_of_payment:[
        {value: '', text: '-- Todos --'},
        {value: 1, text: 'SI'},
        {value: 0, text: 'NO'},
      ],
      products:[],
      product: null,

      kardex:{
        id_establishment: '',
        id_warehouse: '',
        voucher_of_payment: '',
        to:  moment(new Date()).local().format("YYYY-MM-DD"),
        id_product: '',
      },
      errors:{
        id_establishment:false,
        id_warehouse:false,
        voucher_of_payment:false,
        to:false,
        id_product:false,
      }
    };
  },
  mounted() {
    this.ListEstablishment();
  },
  methods: {
    SearchProduct,
    ListEstablishment,
    ListWarehouse,
    Validate,
    SearchKardexMovement,
    CodeInvoice,
    NameOperationType,
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

function ExportExcel() {
  this.errors.id_establishment = this.kardex.id_establishment.length == 0 ? true : false;
  this.errors.id_warehouse = this.kardex.id_warehouse.length == 0 ? true : false;
  this.errors.to = this.kardex.to.length == 0 ? true : false;
  this.errors.id_product = this.product == null ? true : false;

  if (this.errors.id_establishment == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_warehouse == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.to == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_product == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
 
  let voucher_of_payment = this.kardex.voucher_of_payment.length == 0 ? 'all':this.kardex.voucher_of_payment;
  let me = this;
  let url = this.url_base + "excel-kardex-psysical/"+this.kardex.id_warehouse +"/"+ voucher_of_payment+"/"+ this.kardex.to +"/"+ this.product.id;

  window.open(url,'_blank');
}
function ExportExcelGeneral() {
  this.errors.id_establishment = this.kardex.id_establishment.length == 0 ? true : false;
  this.errors.id_warehouse = this.kardex.id_warehouse.length == 0 ? true : false;
  this.errors.to = this.kardex.to.length == 0 ? true : false;

  if (this.errors.id_establishment == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_warehouse == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.to == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
 
  let voucher_of_payment = this.kardex.voucher_of_payment.length == 0 ? 'all':this.kardex.voucher_of_payment;
  let me = this;
  let url = this.url_base + "excel-kardex-psysical-general/"+this.kardex.id_warehouse +"/"+ voucher_of_payment+"/"+ this.kardex.to;

  window.open(url,'_blank');
}

function SearchProduct(search, loading) {
  
    let me = this;
    let url = this.url_base + "search-products-select/" + search;
    if (search !== "") {
      loading(true);
      axios({
        method: "GET",
        url: url,
      }).then(function (response) {
            me.products = response.data.result;
            loading(false);
      })
    }
    
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
        me.kardex.id_establishment = me.id_establishment;
        me.ListWarehouse();
      } else {
        Swal.fire({ icon: 'error', text: 'A Ocurrido un error', timer: 2000,})
      }
    })
}



function ListWarehouse() {

  let me = this;
  me.warehouses = [{value:'',text:'Seleccione un almacen'}];
  if (me.kardex.id_establishment.length == 0) {
    me.kardex.id_warehouse = '';
    return false;
  }
  let url = this.url_base + "active-warehouses/"+me.kardex.id_establishment;
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



function Validate() {
  
  this.errors.id_establishment = this.kardex.id_establishment.length == 0 ? true : false;
  this.errors.id_warehouse = this.kardex.id_warehouse.length == 0 ? true : false;
  this.errors.to = this.kardex.to.length == 0 ? true : false;
  this.errors.id_product = this.product == null ? true : false;


  if (this.errors.id_establishment == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_warehouse == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.to == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_product == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
 

  let me = this;

  
  SearchKardexMovement(me);
  
}

function SearchKardexMovement(_this) {
 let me = _this;
 let url = me.url_base + "kardex/physical";
 me.kardex.id_product = me.product.id;
 let data = me.kardex;
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      token: me.token,
      module: me.module,
      role: me.role,
    },
  })
  .then(function (response) {
    if (response.data.status == 200) {
      me.kardex_psysical = response.data.result;
    } 
  })
}

function CodeInvoice(code) {
  return CodeToName.CodeInvoice(code);
}

function NameOperationType(code) {
  return CodeToName.NameOperationType(code);
}






</script>

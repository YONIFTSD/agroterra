<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Control Stock - Editar</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" autocomplete="off" @submit.prevent="Validate">
              <b-row>


               <b-col md="3">
                  <b-form-group label="Numero :">
                    <b-form-input class="text-center" readonly type="text" ref="number"  v-model="control_stock.number"></b-form-input>
                    <small v-if="errors.number" class="form-text text-danger">Ingrese un numero de 8 digitos</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Fecha:">
                    <b-form-input disabled class="text-center" type="date" ref="broadcast_date" v-model="control_stock.broadcast_date"></b-form-input>
                    <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>

                 <b-col md="3">
                  <b-form-group label="Almacen :">
                    <b-form-select disabled v-model="control_stock.id_warehouse" :options="warehouses"></b-form-select>
                    <small  v-if="errors.id_warehouse"  class="form-text text-danger">Seleccione un almacen</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="." >
                      <b-button class="form-control" @click="RefreshStock" variant="primary" type="button">Recalcular Stock</b-button>
                  </b-form-group>
                </b-col>



               <b-col md="10">
                  <b-form-group label="Observación:">
                    <b-form-input rows="1"  v-model="control_stock.observation" max-rows="2"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Estado:">
                    <b-form-select v-model="control_stock.state" :options="state"></b-form-select>
                  </b-form-group>
                </b-col>


                <b-col md="12">
                  <b-row>
                      <b-col md="2">
                        <b-form-group label="">
                          <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"></b-form-select>
                        </b-form-group>
                      </b-col>
                      <b-col md="2">
                      </b-col>
                       <b-col md="3">
                          <b-form-group>
                            <b-form-input type="text" ref="barcode" placeholder="Ingrese el codigo de barras"  v-model="barcode" @keyup="GetProductByBarcodeAdd"></b-form-input>
                          </b-form-group>
                        </b-col>
                      <b-col md="3">
                        <b-form-group label="" >
                          <b-input-group>
                            <b-form-input id="filter-input" v-model="filter" type="search" placeholder="Buscar un producto"></b-form-input>
                            <b-input-group-append>
                              <b-button variant="primary" :disabled="!filter" @click="filter = ''">Limpiar</b-button>
                            </b-input-group-append>
                          </b-input-group>
                        </b-form-group>
                      </b-col>
                      <b-col md="2">
                        <b-form-group label="" >
                            <b-button class="form-control" @click="ModalProductShow" variant="primary" type="button">Productos</b-button>
                        </b-form-group>
                      </b-col>
                      
                    </b-row>

                    <!-- Main table element -->
                    <b-table :items="control_stock_detail" :fields="fields" :current-page="currentPage" :per-page="perPage"  :filter="filter" responsive="sm" :filter-included-fields="filterOn" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"  :sort-direction="sortDirection"  stacked="md" show-empty  small @filtered="onFiltered">

                      <template  #cell(code)="row">
                        <span>{{ row.item.code }}</span>
                      </template>
                      <template #cell(name)="row">
                        <span class="text-left">{{ row.item.name }}</span>
                      </template>
                      <template #cell(unit_measure)="row">
                        <span class="text-left">{{ NameUnitMeasure(row.item.unit_measure) }}</span>
                      </template>
                      <template #cell(stock)="row">
                        <span class="text-left">{{ row.item.stock }}</span>
                      </template>
                      <template #cell(quantity)="row">
                        <b-input class="text-right" type="number" step="any" @change="UpdateQuantity(row.item.index)" v-model="row.item.quantity"></b-input>
                      </template>
                      <template #cell(balance)="row">
                        <span :class="'pr-2'">{{ row.item.balance }}</span>
                      </template>

                      <template #row-details="row">
                        <b-card>
                          <ul>
                            <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
                          </ul>
                        </b-card>
                      </template>
                    </b-table>

                    <b-row>
                      <b-col md="12" class="mt-3 text-center">
                        <small  v-if="errors.control_stock_detail"  class="form-text text-danger">Ingrese los productos</small>
                      </b-col>
                      <b-col md="12" class="mt-3">
                        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="fill" size="sm" class="my-0"></b-pagination>
                      </b-col>

                      
                    </b-row>
                </b-col>

  
                <!-- Detalle venta -->

                <b-col md="12" class="mt-3"></b-col>

       
         

                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-button  type="submit" class="form-control text-white" variant="primary" ><i class="fas fa-save"></i> Guardar (F4)</b-button>
                </b-col>
              </b-row>
            </b-form>



            <b-col md="12">
              <br>
              <br>
            </b-col>


          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <LoadingComponent :is-visible="isLoading"/>
    <ModalProducts />
  </div>
</template>

<style>
tr .th-code {
  width: 7% !important;
}
tr .th-name {
  width: 52% !important;
}
tr .th-um {
  width: 13% !important;
}
tr .th-input {
  width: 10% !important;
}
tr .th-total-price {
  width: 8% !important;
}
</style>
<script>
import vSelect from "vue-select";
import 'vue-select/dist/vue-select.css';
import "vue-select/src/scss/vue-select.scss";

const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
var moment = require("moment");
import EventBus from '@/assets/js/EventBus';
import converter from "@/assets/js/NumberToLetters";
import { mapState,mapActions } from "vuex";
import LoadingComponent from './../pages/Loading'
import ModalProducts from './components/ModalProduct'
import CodeToName from "@/assets/js/CodeToName";
export default {
  name: "UsuarioAdd",
  props: ["id_control_stock"],
  components:{
      LoadingComponent,
      ModalProducts,
  },
  data() {
    return {
      isLoading:false,
      module: 'ControlStock',
      role: 2,
      control_stock: {
        id_control_stock: "",
        id_user: "",
        id_establishment: "",
        id_warehouse: "",
        id_correlative: "",
        number: "",
        broadcast_date: moment(new Date()).local().format("YYYY-MM-DD"),
        observation: "",
        state: '1',
      },
      control_stock_detail : [],
      series: null,
      warehouses: [],
      type_invoice:[
        {value: "NE", text : "Nota de Entrada"},
      ],
      state:[
        {value:0, text:'Anulado'},
        {value:1, text:'Pendiente'},
        {value:2, text:'Finalizado'},
      ],
      //errors
      errors: {
        type_invoice: false,
        serie: false,
        number: false,
        control_stock_detail: false,
        total: false,
      },
      validate: false,
      barcode:'',
      // detail 
      fields: [
        { key: 'code', label: 'Código', sortable: true, class: 'text-center th-code', sortDirection: 'desc' },
        { key: 'name', label: 'Nombre', sortable: true, class: 'text-left th-name' },
        { key: 'unit_measure', label: 'U. M.', sortable: true, class: 'text-left th-um' },
        { key: 'Stock', label: 'Stock', sortable: true, class: 'text-center th-stock' },
        { key: 'quantity', label: 'Cantidad', sortable: true, class: 'text-center th-input' },
        { key: 'balance', label: 'Diferencia', sortable: true, class: 'text-right th-total-price'},
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 50,
      pageOptions: [50,100, 200, 500, { value: 100, text: "1000" }],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      infoModal: {
          id: 'info-modal',
          title: '',
          content: ''
        }
      // end detail 
    };
  },
  mounted() {
    EventBus.$on('ControlStockAddProduct', (data) => {
      this.AddQuantity(data.id_product,data.quantity);
    });
    this.isLoading = true;
    this.totalRows = this.control_stock_detail.length
    this.ListWarehouses();
    this.ViewControlStock();
    
  },
  methods: {
    UpdateQuantity(index){
      this.control_stock_detail[index].quantity = this.control_stock_detail[index].quantity.length == 0 ? 0 :parseFloat(this.control_stock_detail[index].quantity);
      this.control_stock_detail[index].balance = parseFloat(this.control_stock_detail[index].quantity) - parseFloat(this.control_stock_detail[index].stock);

      this.control_stock_detail[index].quantity = parseFloat(this.control_stock_detail[index].quantity).toFixed(2);
      this.control_stock_detail[index].balance = parseFloat(this.control_stock_detail[index].balance).toFixed(2);
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    ModalProductShow,
    ViewControlStock,
    ListWarehouses,
    RefreshStock,
    EditControlStock,
    Validate,
    AddQuantity,
    GetProductByBarcodeAdd,
    NameUnitMeasure,

  },

  computed: {
    sortOptions() {
        return this.fields
          .filter(f => f.sortable)
          .map(f => {
            return { text: f.label, value: f.key }
          })
    },
    
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
      let establishment = window.localStorage.getItem("id_establishment");
      establishment = JSON.parse(je.decrypt(establishment));
      return establishment;
    }
  },
};

function NameUnitMeasure(code) {
  return CodeToName.NameUnitMeasure(code);
}


function GetProductByBarcodeAdd() {
  if (this.barcode.length == 0) {
    return false;
  }
  let me  = this;
  let url = this.url_base + "get-product-by-barcode/"+this.barcode;
  this.barcode = '';
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role:this.role, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        let data = {
          id_product: response.data.result.id_product,
          quantity: 1,
        }
        EventBus.$emit('ControlStockAddProduct',data);
        me.barcode = '';
        const barcode = me.$refs.barcode;
        barcode.focus();
        me.$notify({ group: 'alert', title: 'Sistema', text:'Se ha agregado el stock del producto', type: 'success'});
      }
    })
}

function ListWarehouses() {
  let me = this;
  let url = this.url_base + "active-warehouses/"+this.id_establishment;

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token,},
  })
    .then(function (response) {
      me.warehouses = [{value:'',text:'-- Seleccione un almacen --'}];
      if (response.data.status == 200) {
        let data = response.data.result;
        for (let index = 0; index < data.length; index++) {
          me.warehouses.push( { value : data[index].id_warehouse , text: data[index].name } );
        }
      }
    })
}

function AddQuantity(id_product,quantity) {
  for (let index = 0; index < this.control_stock_detail.length; index++) {
    const element = this.control_stock_detail[index];
    if (element.id_product == id_product) {
      element.quantity = parseFloat(element.quantity) + parseFloat(quantity);
      element.balance = parseFloat(element.quantity) - parseFloat(element.stock);

      element.quantity = parseFloat(element.quantity).toFixed(2);
      element.balance = parseFloat(element.balance).toFixed(2);
      break;
    }
  }
}

function ViewControlStock() {
  let id_control_stock = je.decrypt(this.id_control_stock);
  let me = this;
  let url = this.url_base + "control-stock/view/"+id_control_stock;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: this.role,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
       
        me.control_stock.id_control_stock = response.data.result.control_stock.id_control_stock;
        me.control_stock.id_user = response.data.result.control_stock.id_user;
        me.control_stock.id_establishment = response.data.result.control_stock.id_establishment;
        me.control_stock.id_warehouse = response.data.result.control_stock.id_warehouse;
        me.control_stock.type_operation = response.data.result.control_stock.type_operation;
        me.control_stock.type_invoice = response.data.result.control_stock.type_invoice;
        me.control_stock.id_serie = response.data.result.control_stock.id_serie;
        me.control_stock.serie = response.data.result.control_stock.serie;
        me.control_stock.number = response.data.result.control_stock.number;
        me.control_stock.broadcast_date = response.data.result.control_stock.broadcast_date;
        me.control_stock.observation = response.data.result.control_stock.observation;
        me.control_stock.state = response.data.result.control_stock.state;

        me.totalRows = response.data.result.control_stock_detail.length;
        me.control_stock_detail = response.data.result.control_stock_detail;

        me.isLoading = false;

      } 
      me.isLoading = false;
    })
}

function ModalProductShow() {
  EventBus.$emit('ModalProductsShow',this.role);
}


function RefreshStock() {
  let me = this;
  me.isLoading = true;
  let url = me.url_base + "control-stock/refresh-stock";
  let data = {
    id_warehouse : this.control_stock.id_warehouse,
    control_stock_detail : this.control_stock_detail,
  }
  axios({
    method: "PUT",
    url: url,
    data: data,
    headers: {"Content-Type": "application/json", token: me.token, module: me.module, role: me.role,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.totalRows = response.data.result.length;
        me.control_stock_detail = response.data.result;
        me.isLoading = false;
      } else {
        me.isLoading = false;
      }
    })
    .catch((error) => {
      me.isLoading = false;
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      
    });
}

function EditControlStock(_this) {
  
  let me = _this;
  me.isLoading = true;
  let url = me.url_base + "control-stock/edit";
  me.control_stock.control_stock_detail = me.control_stock_detail;
  let data = me.control_stock;
  axios({
    method: "PUT",
    url: url,
    data: data,
    headers: {"Content-Type": "application/json", token: me.token, module: me.module, role: me.role,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        Swal.fire({ icon: 'success', text: 'Se ha modificado correctamente el control de stock', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
      me.isLoading = false;
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function Validate() {

  this.errors.id_warehouse = this.control_stock.id_warehouse == 0 ? true : false;
  this.errors.number = this.control_stock.number == 0 ? true : false;
  this.errors.broadcast_date = this.control_stock.broadcast_date == 0 ? true : false;
  this.errors.control_stock_detail = this.control_stock_detail.length == 0 ? true : false;
  
  if (this.errors.id_warehouse == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.number == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.control_stock_detail == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

  let me = this;

  Swal.fire({
    title: 'Esta seguro de modificar el control de Stock ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      EditControlStock(me);
    }
  })



}



</script>

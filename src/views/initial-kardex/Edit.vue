<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Kardex Inicial - Editar</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>


               <b-col md="3">
                  <b-form-group label="Tipo de Comprobante :">
                    <b-form-select disabled v-model="initial_kardex.type_invoice" :options="type_invoice"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Serie :">
                    <b-form-input class="text-center" disabled type="text" ref="serie"  v-model="initial_kardex.serie"></b-form-input>
                    <small v-if="errors.serie"  class="form-text text-danger" >Seleccione una serie</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Numero :">
                    <b-form-input class="text-center" disabled type="text" ref="number"  v-model="initial_kardex.number"></b-form-input>
                    <small v-if="errors.number" class="form-text text-danger">Ingrese un numero de 8 digitos</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Fecha Emision:">
                    <b-form-input class="text-center" disabled type="date" ref="broadcast_date" v-model="initial_kardex.broadcast_date"></b-form-input>
                    <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>


                 <b-col md="3">
                  <b-form-group label="Almacen :">
                    <b-form-select disabled v-model="initial_kardex.id_warehouse" :options="warehouses"></b-form-select>
                    <small  v-if="errors.id_warehouse"  class="form-text text-danger">Seleccione un almacen</small>
                  </b-form-group>
                </b-col>


                <b-col md="9">
                  <b-form-group label="Observación:">
                    <b-form-input rows="1"  v-model="initial_kardex.observation" max-rows="2"></b-form-input>
                  </b-form-group>
                </b-col>

                 

                <b-col md="12">
                  <b-row>
                      <b-col md="1">
                        <b-form-group label="Registros">
                          <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"></b-form-select>
                        </b-form-group>
                      </b-col>
                      <b-col md="8">
                      </b-col>
                      <b-col md="3">
                        <b-form-group label="Buscar" >
                          <b-input-group>
                            <b-form-input id="filter-input" v-model="filter" type="search" placeholder="Buscar un producto"></b-form-input>
                            <b-input-group-append>
                              <b-button variant="primary" :disabled="!filter" @click="filter = ''">Limpiar</b-button>
                            </b-input-group-append>
                          </b-input-group>
                        </b-form-group>
                      </b-col>
                    </b-row>

                    <!-- Main table element -->
                    <b-table :items="initial_kardex_detail" :fields="fields" :current-page="currentPage" :per-page="perPage"  :filter="filter" responsive="sm" :filter-included-fields="filterOn" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"  :sort-direction="sortDirection"  stacked="md" show-empty  small @filtered="onFiltered">

                      <template  #cell(code)="row">
                        <span>{{ row.item.code }}</span>
                      </template>
                      <template #cell(name)="row">
                        <span class="text-left">{{ row.item.name }}</span>
                      </template>
                      <template #cell(quantity)="row">
                        <span class="pr-2">{{ row.item.quantity }}</span>
                      </template>
                      <template #cell(unit_price)="row">
                        <span class="pr-2">{{ row.item.unit_price }}</span>
                      </template>
                      <template #cell(total_price)="row">
                        <span class="pr-2">{{ row.item.total_price }}</span>
                      </template>
                      <template #cell(actions)="row">
                        <b-button size="sm" @click="info(row.item, row.index, $event.target)" variant="primary" class="mr-1">
                          <i class="fas fa-pen-square"></i>
                        </b-button>
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
                        <small  v-if="errors.initial_kardex_detail"  class="form-text text-danger">Ingrese los productos</small>
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
                  <b-button  type="submit" class="form-control text-white" variant="primary" >GUARDAR</b-button>
                </b-col>
              </b-row>
            </b-form>



            <b-col md="12">
              <br>
              <br>
            </b-col>

          <b-modal :id="infoModal.id" :title="infoModal.title" hide-footer @hide="resetInfoModal">
            <b-row>
              <b-col md="4">
                 <b-form-group label="Cantidad :">
                    <b-form-input class="text-center" @change="UpdatePrices()" type="number" v-model="infoModal.content.quantity"></b-form-input>
                  </b-form-group>
              </b-col>
              <b-col md="4">
                 <b-form-group label="P. Unitario :">
                    <b-form-input class="text-right" @change="UpdatePrices()" type="number" step="any" v-model="infoModal.content.unit_price"></b-form-input>
                  </b-form-group>
              </b-col>
              <b-col md="4">
                 <b-form-group label="P. Total :">
                    <b-form-input class="text-right" disabled @change="UpdatePrices()" type="number" step="any" v-model="infoModal.content.total_price"></b-form-input>
                  </b-form-group>
              </b-col>

      
              <b-col md="4"></b-col>
              <b-col md="4">
                 <b-form-group class="mt-3" >
                    <b-button variant="primary" block @click="EditKardexInitialDetail">Actualizar</b-button>
                  </b-form-group>
              </b-col>
            </b-row>

          </b-modal>

          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <LoadingComponent :is-visible="isLoading"/>
  </div>
</template>

<style>
tr .th-code {
  width: 7% !important;
}
tr .th-name {
  width: 65% !important;
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
export default {
  name: "UsuarioAdd",
  props: ["id_initial_kardex"],
  components:{
      LoadingComponent,
  },
  data() {
    return {
      isLoading:false,
      module: 'InitialKardex',
      role: 2,
      initial_kardex: {
        id_initial_kardex: "",
        id_user: "",
        id_establishment: "",
        id_warehouse: "",
        type_operation: 16,
        type_invoice: "NE",
        id_serie: "",
        serie: "",
        number: "",
        broadcast_date: moment(new Date()).local().format("YYYY-MM-DD"),
        observation: "",
        state: '1',
      },
      initial_kardex_detail : [],
      series: null,
      warehouses: [],
      type_invoice:[
        {value: "NE", text : "Nota de Entrada"},
      ],
      //errors
      errors: {
        type_invoice: false,
        serie: false,
        number: false,
        initial_kardex_detail: false,
        total: false,
      },
      validate: false,
     
      // detail 
      fields: [
        { key: 'code', label: 'Código', sortable: true, class: 'text-center th-code', sortDirection: 'desc' },
        { key: 'name', label: 'Nombre', sortable: true, class: 'text-left th-name' },
        { key: 'quantity', label: 'Cantidad', sortable: true, class: 'text-center th-input' },
        { key: 'unit_price', label: 'P. Unit', sortable: true, class: 'text-center th-input' },
        { key: 'total_price', label: 'P. Total', sortable: true, class: 'text-right th-total-price'},
        { key: 'actions', label: 'Acc.', sortable: true, class: 'text-center'},
        
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
    this.isLoading = true;
    this.totalRows = this.initial_kardex_detail.length
    this.ListWarehouses();
    this.ViewInitialKardex();
  },
  methods: {
    info(item, index, button) {
        this.infoModal.title = item.name
        this.infoModal.content = {
          id_initial_kardex_detail : item.id_initial_kardex_detail,
          id_product : item.id_product,
          code : item.code,
          index : item.index,
          name : item.name,
          quantity : item.quantity,
          unit_price : item.unit_price,
          total_price : item.total_price,
        }
        this.$root.$emit('bv::show::modal', this.infoModal.id, button)
      },
      resetInfoModal() {
        this.infoModal.title = ''
        this.infoModal.content = ''
      },
      UpdatePrices(){
        this.infoModal.content.quantity = parseFloat(this.infoModal.content.quantity);
        this.infoModal.content.unit_price = parseFloat(this.infoModal.content.unit_price);
        this.infoModal.content.total_price = this.infoModal.content.quantity * this.infoModal.content.unit_price;
        this.infoModal.content.unit_price = this.infoModal.content.unit_price.toFixed(2);
        this.infoModal.content.total_price = this.infoModal.content.total_price.toFixed(2);
      },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },


    ViewInitialKardex,
    ListWarehouses,
    EditKardexInitialDetail,
    EditKardexInitial,
    Validate,



    ...mapActions('InitialKardex',['mLoadAddInitialKardexDetail','mLoadResetInitialKardexDetail']),
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


function ViewInitialKardex() {
  let id_initial_kardex = je.decrypt(this.id_initial_kardex);
  let me = this;
  let url = this.url_base + "initial-kardex/view/"+id_initial_kardex;

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: this.role,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
       
        me.initial_kardex.id_initial_kardex = response.data.result.initial_kardex.id_initial_kardex;
        me.initial_kardex.id_user = response.data.result.initial_kardex.id_user;
        me.initial_kardex.id_establishment = response.data.result.initial_kardex.id_establishment;
        me.initial_kardex.id_warehouse = response.data.result.initial_kardex.id_warehouse;
        me.initial_kardex.type_operation = response.data.result.initial_kardex.type_operation;
        me.initial_kardex.type_invoice = response.data.result.initial_kardex.type_invoice;
        me.initial_kardex.id_serie = response.data.result.initial_kardex.id_serie;
        me.initial_kardex.serie = response.data.result.initial_kardex.serie;
        me.initial_kardex.number = response.data.result.initial_kardex.number;
        me.initial_kardex.broadcast_date = response.data.result.initial_kardex.broadcast_date;
        me.initial_kardex.observation = response.data.result.initial_kardex.observation;
        me.initial_kardex.state = response.data.result.initial_kardex.state;

        me.totalRows = response.data.result.initial_kardex_detail.length;
        me.initial_kardex_detail = response.data.result.initial_kardex_detail;

        me.isLoading = false;

      } 
    })
}

function EditKardexInitialDetail() {
  let me = this;
  me.isLoading = true;
  let url = me.url_base + "initial-kardex/edit-detail";
  let data = me.infoModal.content;
  console.log(data);
  axios({
    method: "PUT",
    url: url,
    data: data,
    headers: {"Content-Type": "application/json", token: me.token, module: me.module, role: me.role,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.initial_kardex_detail[me.infoModal.content.index].quantity = response.data.result.quantity;
        me.initial_kardex_detail[me.infoModal.content.index].unit_price = response.data.result.unit_price;
        me.initial_kardex_detail[me.infoModal.content.index].total_price = response.data.result.total_price;
        Swal.fire({ icon: 'success', text: 'Se ha modificado correctamente el detalle de kardex inicial', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
      me.isLoading = false;
    })
    .catch((error) => {
      me.isLoading = false;
      console.log(error);
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      
    });
}

function EditKardexInitial(_this) {
  
  let me = _this;
  me.isLoading = true;
  let url = me.url_base + "initial-kardex/edit";
  let data = me.initial_kardex;
  axios({
    method: "PUT",
    url: url,
    data: data,
    headers: {"Content-Type": "application/json", token: me.token, module: me.module, role: me.role,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        
        Swal.fire({ icon: 'success', text: 'Se ha modificado correctamente el kardex inicial', timer: 3000,})
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
  
  this.errors.type_invoice = this.initial_kardex.type_invoice == 0 ? true : false;
  this.errors.id_serie = this.initial_kardex.id_serie == 0 ? true : false;
  this.errors.broadcast_date = this.initial_kardex.broadcast_date == 0 ? true : false;
  this.errors.initial_kardex_detail = this.initial_kardex_detail.length == 0 ? true : false;
  
  if (this.errors.type_invoice == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_serie == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.initial_kardex_detail == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

  let me = this;

  Swal.fire({
    title: 'Esta seguro de modificar el kardex inicial?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      EditKardexInitial(me);
    }
  })



}



</script>

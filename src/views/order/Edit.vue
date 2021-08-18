<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Pedidos - Editar</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>
       
              <b-col md="2">
                  <b-form-group label="N° Pedido :">
                    <b-form-input disabled type="text"  v-model="order.number_of_order"></b-form-input>
                  </b-form-group>
              </b-col>

              <b-col md="2">
                  <b-form-group label="Comprobante :">
                    <b-form-select disabled v-model="order.type_invoice" :options="type_invoice"></b-form-select>
                  </b-form-group>
              </b-col>

              <b-col md="2">
                  <b-form-group label="Medio de Pago :">
                    <b-form-select disabled v-model="order.payment_method" :options="payment_method"></b-form-select>
                  </b-form-group>
              </b-col>

              <b-col md="2">
                  <b-form-group label="Referencia de Pago :">
                    <b-form-input disabled type="text"  :value="order.c_charge_id"></b-form-input>
                  </b-form-group>
              </b-col>

              <b-col md="2">
                  <b-form-group label="Fecha del Pedido :">
                    <b-form-input class="text-center" disabled type="text"  :value="order.date"></b-form-input>
                  </b-form-group>
              </b-col>

              <b-col md="2">
                  <b-form-group label="Estado :">
                    <b-form-select disabled v-model="order.state" :options="states"></b-form-select>
                  </b-form-group>
              </b-col>


              <b-col md="6">
                  <b-form-group label="Cliente :">
                    <b-form-input disabled type="text"  :value="order.client_name+' - '+ order.client_document_number"></b-form-input>
                  </b-form-group>
              </b-col>

              <b-col md="4">
                  <b-form-group label="Email :">
                    <b-form-input disabled type="text"  :value="order.client_email"></b-form-input>
                  </b-form-group>
              </b-col>

              <b-col md="2">
                  <b-form-group label="Teléfono :">
                    <b-form-input disabled type="text"  :value="order.client_phone"></b-form-input>
                  </b-form-group>
              </b-col>


          

              <b-col md="2">
                  <b-form-group label="Metodo de Envío :">
                    <b-form-select disabled v-model="order.shipping_method" :options="shipping_method"></b-form-select>
                  </b-form-group>
              </b-col>

              <b-col md="6" v-if="order.shipping_method == 1">
                  <b-form-group label="Dirección :">
                    <b-form-input disabled type="text"  :value="order.client_address"></b-form-input>
                  </b-form-group>
              </b-col>

              <b-col md="4" v-if="order.shipping_method == 1">
                  <b-form-group label="Referencia :">
                    <b-form-input disabled type="text"  :value="order.description"></b-form-input>
                  </b-form-group>
              </b-col>


              <b-col md="6" v-if="order.shipping_method == 2">
                  <b-form-group label="Dirección :">
                    <b-form-input v-if="order.pickup_store == '01'" disabled type="text"  value="Aeropuerto Carlos Ciriani Tienda 6 - 7, Tacna - Perú"></b-form-input>
                    <b-form-input v-if="order.pickup_store == '02'" disabled type="text"  value="Av. San Martín 631 - 637, Tacna - Perú"></b-form-input>
                  </b-form-group>
              </b-col>

              <b-col md="4" v-if="order.shipping_method == 2">
                  <b-form-group label="Referencia :">
                    <b-form-input disabled type="text"  :value="order.description"></b-form-input>
                  </b-form-group>
              </b-col>

          

              
                <div class="col-md-12">
                  <div class="table-responsive mt-3">
                    <table  class="table  table-bordered table-hover table-lg mt-lg mb-0">
                      <thead class="">
                        <tr>
                          <th width="5%" class="text-center">#</th>
                          <th width="8%" class="text-center">Codigo</th>
                          <th width="45%" class="text-center">Nombre</th>
                          <th width="5%" class="text-center">UM</th>
                          <th width="10%" class="text-center">Cantidad</th>
                          <th width="10%" class="text-center">P. Unit</th>
                          <th width="8%" class="text-center">P. Total</th>
                        </tr>
                      </thead>
                      <tbody v-for="(item, it) in order_detail" :key="item.id_product">
                        <tr>
                            <td class="align-middle text-center">{{ it + 1 }}</td>
                            <td class="align-middle text-left">{{ item.code }}</td>
                            <td class="align-middle text-left">{{ item.name }}</td>
                            <td class="align-middle text-center">{{ item.unit_measure }}</td>
                            <td class="align-middle text-center">{{ item.quantity }}</td>
                            <td class="align-middle text-center">{{ item.unit_price }}</td>
                            <td class="align-middle text-center">{{ item.total_price }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <b-col md="12" class="mt-3"></b-col>
                <b-col md="8"></b-col>

                <b-col md="4">
                  <b-form-group  label-cols-lg="8" label="Subtotal:" label-align="right" >
                    <b-form-input readonly class="text-right" v-model="order.subtotal"></b-form-input>
                  </b-form-group>

                  <b-form-group    label-cols-lg="8" label="Delivery:"  label-align="right">
                    <b-form-input readonly class="text-right" v-model="order.delivery_cost"></b-form-input>
                  </b-form-group>

                  <b-form-group   label-cols-lg="8" label="Total:" label-align="right">
                    <b-form-input readonly class="text-right" v-model="order.total"></b-form-input>
                    <small  v-if="errors.total"  class="form-text text-danger">Ingrese un monto</small>
                  </b-form-group>

                </b-col>

                <b-col md="3"></b-col>
                <b-col md="3">
                  <b-button  type="button" class="form-control" @click="Cancel" variant="danger">ANULAR PEDIDO</b-button>
                </b-col>
                <b-col md="3">
                  <b-button  type="button" class="form-control" @click="Accept" variant="info">PROCESAR PEDIDO</b-button>
                </b-col>
              </b-row>
            </b-form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Modal Products -->
    <ModalProducts />
    <!-- Modal Products -->

    <!-- Modal Clients -->
    <ModalClients />
    <!-- Modal Clients -->

    
  </div>
</template>

<style>

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


// components
import ModalClients from './../components/ModalClient'
import ModalProducts from './components/ModalProduct'
import SaleDetail from './components/SaleDetail'

export default {
  name: "UsuarioAdd",
  props: ["id_order"],
  components:{
      vSelect,  
      ModalProducts,
      SaleDetail,
      ModalClients,
  },
  data() {
    return {
      module: 'Sale',
      role: 2,
      order: {
        id_order: 0,
        id_client: 0,
        number_of_order: "",
        description: "",
        subtotal: 0,
        discount: 0,
        igv: 0,
        total: 0,
        type_invoice: "",
        state: 1,
        shipping_method: "",
        pickup_store: "",
        payment_state: "",
        c_charge_id: "",
        c_commission: "",
        c_igv: "",
        c_amount_to_deposit: "",
        created_at: "",
      },
      order_detail:[],
      type_invoice:[
        {value: "01", text : "Factura"},
        {value: "03", text : "Boleta de Venta"},
        {value: "NV", text : "Nota de Venta"},
      ],
      payment_method:[
        {value: "01", text : "Culqi"},
        {value: "02", text : "Contra Entrega"},
        {value: "03", text : "Yape"},
      ],
      states:[
        {value: "0", text : "Anulado"},
        {value: "1", text : "Pendientes"},
        {value: "2", text : "En Proceso"},
        {value: "3", text : "Finalizado"},
      ],
      shipping_method:[
        {value:"1", text: 'Entrega a Domicilio'},
        {value:"2", text: 'Recogo a Tienda'},
      ],

  
      //errors
      errors: {
        id_serie: false,
        id_client: false,
        way_to_pay: false,
        sale_detail: false,
        total: false,
      },
      validate: false,
    };
  },
  mounted() {
    this.ViewOrder();
  },
  methods: {
    
    modalProducts,
    modalClients,

    ViewOrder,
    Cancel,
    Accept,

    EditOrder,
    Validate,

    ...mapActions('Sale',['mLoadResetSaleDetail','mLoadAddSaleDetail']),
  },

  computed: {
    ...mapState('Sale',['sale_detail','total_sale']),
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
function Validate() {
  
}

function modalProducts() {
  EventBus.$emit('ModalProductsShow',this.role);
}

function modalClients() {
  EventBus.$emit('ModalClientsShow');
}

function ViewOrder() {
  let id_order = je.decrypt(this.id_order);
  let me = this;
  let url = me.url_base + "order/view/"+id_order;
  axios({
    method: "GET",
    url: url,
    headers: {"Content-Type": "application/json", token: me.token, module: me.module,role: me.role, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
      
        me.order.id_order = response.data.result.order.id_order,
        me.order.id_client = response.data.result.order.id_client,
        me.order.client_name = response.data.result.order.client_name,
        me.order.client_document_number = response.data.result.order.client_document_number,
        me.order.client_email = response.data.result.order.client_email,
        me.order.client_phone = response.data.result.order.client_phone,
        me.order.client_address = response.data.result.order.client_address,
        me.order.client_phone = response.data.result.order.client_phone,
        me.order.number_of_order = response.data.result.order.number_of_order;
        me.order.date = response.data.result.order.date;
        me.order.description = response.data.result.order.description;
        me.order.subtotal = response.data.result.order.subtotal;
        me.order.discount = response.data.result.order.discount;
        me.order.delivery_cost = response.data.result.order.delivery_cost;
        me.order.total = response.data.result.order.total;
        me.order.type_invoice = response.data.result.order.type_invoice;
        me.order.state = response.data.result.order.state;
        me.order.shipping_method = response.data.result.order.shipping_method;
        me.order.pickup_store = response.data.result.order.pickup_store;
        me.order.payment_state = response.data.result.order.payment_state;
        me.order.c_charge_id = response.data.result.order.c_charge_id;
        me.order.c_commission = response.data.result.order.c_commission;
        me.order.c_igv = response.data.result.order.c_igv;
        me.order.c_amount_to_deposit = response.data.result.order.c_amount_to_deposit;
        me.order.created_at = response.data.result.order.created_at;
        me.order.updated_at = response.data.result.order.updated_at;
        me.order.payment_method = "01";
        me.order_detail = response.data.result.order_detail;
  
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
   
}


function EditOrder(_this,state) {
  
  let me = _this;
  let url = me.url_base + "order/edit";
  me.order.state = state;
  let data = me.order;
  axios({
    method: "PUT",
    url: url,
    data: data,
    headers: { "Content-Type": "application/json", token: me.token, module: me.module, role: me.role,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        Swal.fire({ icon: 'success', text: 'Se ha modificado correctamente el pedido', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text:  response.data.response, timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function Cancel() {
  
  let me = this;
  Swal.fire({
    title: 'Esta seguro de cancelar el pedido?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      EditOrder(me,0);
    }
  })
}

function Accept() {
  
  let me = this;
  Swal.fire({
    title: 'Esta seguro de aceptar el pedido?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      EditOrder(me,2);
    }
  })
}



</script>

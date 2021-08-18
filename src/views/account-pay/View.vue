<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Cuentas por Pagar - Ver</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form">
              <b-row>

                <b-col md="6">
                  <b-form-group>
                    <label>Proveedor: </label>
                    <b-form-input type="text" :value="account_pay.provider" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Comprobante :">
                    <b-form-select v-model="account_pay.type_invoice" :options="type_invoice" disabled></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Serie :">
                    <b-form-input type="text" ref="serie" v-model="account_pay.serie" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Numero :">
                    <b-form-input class="text-right" type="text" ref="number" v-model="account_pay.number" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Fecha Emision:">
                    <b-form-input type="date" ref="broadcast_date" v-model="account_pay.broadcast_date" disabled></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Fecha Vencimiento:">
                    <b-form-input type="date" ref="expiration_date" v-model="account_pay.expiration_date" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Moneda:">
                    <b-form-select ref="coin" v-model="account_pay.coin" :options="coins" disabled></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Total:">
                    <b-form-input type="number" class="text-right" step="any" v-model="account_pay.total" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Total Pagado:">
                    <b-form-input type="number" class="text-right" step="any" v-model="account_pay.fee" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="deuda:">
                    <b-form-input type="number" class="text-right" step="any" v-model="account_pay.balance" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="5"></b-col>
                <b-col md="2">
                  <b-link class="btn btn-primary form-control" :to="{ path: '/cuentas-por-pagar/listar' }" append >REGRESAR</b-link>
                </b-col>
              </b-row>
            </b-form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState } from "vuex";
import LoadingComponent from './../pages/Loading'

export default {
  name: "CategoriaView",
  components:{
    LoadingComponent,
  },
  props: ["id_account_pay"],
  data() {
    return {
      isLoading: false,
      module: 'AccountReceivable',
      role: 5,
      account_pay: {
          id_account_pay:'',
          id_sale:'',
          id_client:'',
          id_establishment:'',
          id_user:'',
          type_invoice:'',
          serie:'',
          number:'',
          coin:'',
          broadcast_date:'',
          expiration_date:'',
          reason:'',
          total:'',
          fee:'',
          balance:'',
          state:1,
      },
    
      type_invoice:[
        {value: "01", text : "Factura"},
        {value: "03", text : "Boleta de Venta"},
        {value: "04", text : "Liquidación de compra"},
        {value: "07", text : "Nota de crédito"},
        {value: "08", text : "Nota de débito"},
        {value: "09", text : "Guía de remisión - Remitente"},
        {value: "12", text : "Ticket o cinta emitido por máquina registradora"},
        {value: "22", text : "Comprobante por Operaciones No Habituales"},
        {value: "31", text : "Guía de Remisión - Transportista"},
        {value: "50", text : "Declaración Única de Aduanas - Importación definitiva"},
        {value: "52", text : "Despacho Simplificado - Importación Simplificada"},
        {value: "91", text : "Comprobante de No Domiciliado"},
        {value: "NE", text : "Nota de Entrada"},
        {value: "00", text : "Otros"},
      ],
      providers: [],
      provider:null,

      coins:[
        {value: "PEN", text : "Soles"},
        {value: "USD", text : "Dolares"},
      ],
    };
  },
  mounted() {
    this.ViewAccountPay();
  },
  methods: {
    ViewAccountPay,

  },

  computed: {
    ...mapState(["url_base"]),
    token: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.api_token;
    },
  },
};


//ver usuario
function ViewAccountPay() {
  let id_account_pay = je.decrypt(this.id_account_pay);
  let me = this;
  me.isLoading = true;
  let url = this.url_base + "account-pay/view/" + id_account_pay;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token,  module: this.module, role: this.role, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
          me.account_pay.id_account_pay = response.data.result.id_account_pay;
          me.account_pay.module = response.data.result.module;
          me.account_pay.id_module = response.data.result.id_module;
          me.account_pay.id_client = response.data.result.id_client;
          me.account_pay.provider = response.data.result.name+' - '+response.data.result.document_number;
          me.account_pay.id_establishment = response.data.result.id_establishment;
          me.account_pay.id_user = response.data.result.id_user;
          me.account_pay.type_invoice = response.data.result.type_invoice;
          me.account_pay.serie = response.data.result.serie;
          me.account_pay.number = response.data.result.number;
          me.account_pay.coin = response.data.result.coin;
          me.account_pay.broadcast_date = response.data.result.broadcast_date;
          me.account_pay.expiration_date = response.data.result.expiration_date;
          me.account_pay.reason = response.data.result.reason;
          me.account_pay.total = response.data.result.total;
          me.account_pay.fee = response.data.result.fee;
          me.account_pay.balance = response.data.result.balance;
          me.account_pay.state = response.data.result.state;
      } else {
        Swal.fire("Sistema", "A Ocurrido un error", "error");
      }
      me.isLoading = false;
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      me.isLoading = false;
    });
}

</script>

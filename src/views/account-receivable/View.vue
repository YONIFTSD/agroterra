<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Cuentas por Cobrar - Ver</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form">
              <b-row>

                <b-col md="6">
                  <b-form-group>
                    <label>Cliente: </label>
                    <b-form-input type="text" :value="account_receivable.client" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Tipo de Comprobante :">
                    <b-form-select v-model="account_receivable.type_invoice" :options="type_invoice" disabled></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Serie :">
                    <b-form-input type="text" ref="serie" v-model="account_receivable.serie" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Numero :">
                    <b-form-input class="text-right" type="text" ref="number" v-model="account_receivable.number" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Fecha Emision:">
                    <b-form-input type="date" ref="broadcast_date" v-model="account_receivable.broadcast_date" disabled></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Fecha Vencimiento:">
                    <b-form-input type="date" ref="expiration_date" v-model="account_receivable.expiration_date" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Moneda:">
                    <b-form-select ref="coin" v-model="account_receivable.coin" :options="coins" disabled></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Total:">
                    <b-form-input type="number" class="text-right" step="any" v-model="account_receivable.total" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Total Pagado:">
                    <b-form-input type="number" class="text-right" step="any" v-model="account_receivable.total" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="deuda:">
                    <b-form-input type="number" class="text-right" step="any" v-model="account_receivable.balance" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="5"></b-col>
                <b-col md="2">
                  <b-link class="btn form-control btn-primary" :to="{ path: '/cuentas-por-cobrar/listar' }" append >REGRESAR</b-link>
                </b-col>
              </b-row>
            </b-form>
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
import LoadingComponent from './../pages/Loading'
export default {
  name: "CategoriaView",
  props: ["id_account_receivable"],
  components:{
      LoadingComponent,
  },
  data() {
    return {
      isLoading: false,
      module: 'AccountReceivable',
      role: 5,
      account_receivable: {
          id_account_receivable:'',
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
    this.ViewAccountReceivable();
  },
  methods: {
    ViewAccountReceivable,

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
function ViewAccountReceivable() {
  let id_account_receivable = je.decrypt(this.id_account_receivable);
  let me = this;
  me.isLoading = true;
  let url = this.url_base + "account-receivable/view/" + id_account_receivable;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token,  module: this.module, role: this.role, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
          me.account_receivable.id_account_receivable = response.data.result.id_account_receivable;
          me.account_receivable.id_sale = response.data.result.id_sale;
          me.account_receivable.id_client = response.data.result.id_client;
          me.account_receivable.client = response.data.result.name+' - '+response.data.result.document_number;
          me.account_receivable.id_establishment = response.data.result.id_establishment;
          me.account_receivable.id_user = response.data.result.id_user;
          me.account_receivable.type_invoice = response.data.result.type_invoice;
          me.account_receivable.serie = response.data.result.serie;
          me.account_receivable.number = response.data.result.number;
          me.account_receivable.coin = response.data.result.coin;
          me.account_receivable.broadcast_date = response.data.result.broadcast_date;
          me.account_receivable.expiration_date = response.data.result.expiration_date;
          me.account_receivable.reason = response.data.result.reason;
          me.account_receivable.total = response.data.result.total;
          me.account_receivable.fee = response.data.result.fee;
          me.account_receivable.balance = response.data.result.balance;
          me.account_receivable.state = response.data.result.state;
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

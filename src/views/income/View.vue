<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Ingresos - Ver</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" autocomplete="off">
              <b-row>

                <b-col md="6">
                  <b-form-group>
                    <label>Proveedor: </label>
                    <b-form-input type="text" :value="income.name + ' - ' + income.document_number" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Comprobante :">
                    <b-form-select v-model="income.voucher_type" :options="invoices_type" disabled></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Serie :">
                    <b-form-input type="text" ref="serie"  v-model="income.serie" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Numero :">
                    <b-form-input class="text-right" type="text" ref="number" v-model="income.number" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Fecha de pago:">
                    <b-form-input type="date" ref="broadcast_date" v-model="income.broadcast_date" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Fecha Emisión:">
                    <b-form-input type="date" ref="date" v-model="income.date" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Moneda:">
                    <b-form-select ref="coin" v-model="income.coin" :options="coins" disabled></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="4">
                  <b-form-group label="Observación:">
                    <b-form-input type="text" v-model="income.observation" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Importe:">
                    <b-form-input type="number" class="text-right" step="any" v-model="income.total" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="5"></b-col>
                <b-col md="2">
                  <b-link class="btn form-control btn-primary" :to="{ path: '/ingresos/listar' }" append >REGRESAR</b-link>
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
  props: ["id_income"],
  components:{
    LoadingComponent,
  },
  data() {
    return {
      isLoading: false,
      module: 'Income',
      role: 5,
      income: {
          id_income:'',
          id_user:'',
          id_provider:'',
          voucher_type:'',
          serie:'',
          number:'',
          broadcast_date:'',
          date:'',
          coin:'¿',
          observation:'',
          total:(0).toFixed(2),
          state:1,
      },

      providers: [],
      provider:null,

      invoices_type:[
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
        {value: "RH", text : "Recibo por Honorarios"},
        {value: "00", text : "Otros"},
      ],

      coins:[
        {value: "PEN", text : "Soles"},
        {value: "USD", text : "Dolares"},
        {value: "CLP", text : "Pesos Chilenos"},
      ],
    };
  },
  mounted() {
    this.ViewIncome();
  },
  methods: {
    ViewIncome,

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
function ViewIncome() {
  let id_income = je.decrypt(this.id_income);
  let me = this;
  let url = this.url_base + "income/view/" + id_income;
  me.isLoading = true;
  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: this.role,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.income.id_income = response.data.result.id_income;
        me.income.id_provider = response.data.result.id_provider;
        me.income.voucher_type = response.data.result.voucher_type;
        me.income.serie = response.data.result.serie;
        me.income.number = response.data.result.number;
        me.income.broadcast_date = response.data.result.broadcast_date;
        me.income.date = response.data.result.date;
        me.income.coin = response.data.result.coin;
        me.income.total = response.data.result.total;
        me.income.observation = response.data.result.observation;
        me.income.state = response.data.result.state;
        me.income.name = response.data.result.name;
        me.income.document_number = response.data.result.document_number;
        me.income.email = response.data.result.email;
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

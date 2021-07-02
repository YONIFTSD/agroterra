<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Egresos - Ver</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form">
              <b-row>

                <b-col md="6">
                  <b-form-group>
                    <label>Proveedor: </label>
                    <b-form-input type="text" :value="expense.name + ' - ' + expense.document_number" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Tipo de Comprobante :">
                    <b-form-select v-model="expense.voucher_type" :options="invoices_type" disabled></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Serie :">
                    <b-form-input type="text" ref="serie" v-model="expense.serie" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Numero :">
                    <b-form-input class="text-right" type="text" ref="number" v-model="expense.number" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Fecha Emision:">
                    <b-form-input type="date" ref="broadcast_date" v-model="expense.broadcast_date" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Moneda:">
                    <b-form-select ref="coin" v-model="expense.coin" :options="coins" disabled></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="5">
                  <b-form-group label="Observación:">
                    <b-form-input type="text" v-model="expense.observation" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Importe:">
                    <b-form-input type="number" class="text-right" step="any" v-model="expense.total" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-link class="btn form-control btn-primary" :to="{ path: '/egresos/listar' }" append >REGRESAR</b-link>
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

export default {
  name: "CategoriaView",
  props: ["id_expense"],
  data() {
    return {
      module: 'Expense',
      role: 5,
      expense: {
          id_expense:'',
          id_user:'',
          id_provider:'',
          voucher_type:'',
          serie:'',
          number:'',
          broadcast_date:'',
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
    this.ViewExpense();
  },
  methods: {
    ViewExpense,

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
function ViewExpense() {
  let id_expense = je.decrypt(this.id_expense);
  let me = this;
  let url = this.url_base + "expense/view/" + id_expense;

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
        me.expense.id_expense = response.data.result.id_expense;
        me.expense.id_provider = response.data.result.id_provider;
        me.expense.voucher_type = response.data.result.voucher_type;
        me.expense.serie = response.data.result.serie;
        me.expense.number = response.data.result.number;
        me.expense.broadcast_date = response.data.result.broadcast_date;
        me.expense.coin = response.data.result.coin;
        me.expense.total = response.data.result.total;
        me.expense.observation = response.data.result.observation;
        me.expense.state = response.data.result.state;
        me.expense.name = response.data.result.name;
        me.expense.document_number = response.data.result.document_number;
        me.expense.email = response.data.result.email;
      } else {
        Swal.fire("Sistema", "A Ocurrido un error", "error");
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

</script>

<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Comprobantes - Listar</strong>
          </CCardHeader>
          <CCardBody>
            <b-row>
              <b-col md="8"></b-col>
              <b-col md="2">
                <!-- <b-link
                  v-if="Permission('ShoppingAdd')"
                  variant="info"
                  class="btn form-control btn-primary"
                  :to="{ path: '/compra/nuevo' }"
                  append
                  >NUEVO</b-link
                > -->
              </b-col>
              <b-col md="2">
                <b-input-group>
                  <b-form-input
                    v-model="search"
                    class="form-control"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button variant="info" @click="ListPayment">
                      <b-icon icon="search"></b-icon
                    ></b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-col>
            </b-row>

            <div class="table-responsive mt-3">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th width="3%" class="text-center">#</th>
                    <th width="10%" class="text-center">Fecha</th>
                    <th width="13%" class="text-center">Comprobante</th>
                    <th width="49%" class="text-center">Cliente</th>
                    <th width="8%" class="text-center">Total</th>
                    <th width="10%" class="text-center">Estado</th>
                    <th width="10%" class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="item.id_payment">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-center"> {{ item.broadcast_date }}</td>
                    <td class="text-center"> {{ CodeInvoice(item.voucher_type)+ ' '+item.serie+'-'+item.number }}</td>
                    <td class="text-left"> {{ item.name + ' - '+item.document_number }}</td>
                    <td class="text-right"> {{ item.total }} </td>
                    <td class="text-center">
                          <b-badge v-if="item.state == 0" variant="danger">XML</b-badge>
                          <b-badge v-if="item.state == 1" variant="success">Girado</b-badge>
                          <b-badge v-if="item.state == 2" variant="info">Emitido</b-badge>
                          <b-badge v-if="item.state == 3" variant="success">Aceptado</b-badge>
                          <b-badge v-if="item.state == 4" variant="danger">Rechazado</b-badge>
                          <b-badge v-if="item.state == 5" variant="warning">Anulado</b-badge>
                    </td>
                    <td class="text-center">
                      <b-dropdown bloque size="sm" text="Acciones" right>
                        <b-dropdown-item
                          v-if="Permission('PaymentEdit') && (item.state == 0 || item.state == 1 || item.state == 2)"
                          @click="EditPayment(item.id_payment)"
                          >Editar</b-dropdown-item
                        >
                        <b-dropdown-item
                          v-if="Permission('PaymentView')"
                          @click="ViewPayment(item.id_payment)"
                          >Ver</b-dropdown-item
                        >
                        <b-dropdown-item
                          v-if="Permission('PaymentDelete') && (item.state == 0 || item.state == 1 || item.state == 2)"
                          @click="ConfirmDeletePayment(item.id_payment)"
                          >Eliminar</b-dropdown-item
                        >
                        <b-dropdown-item
                          v-if="Permission('PaymentEdit') && (item.state == 2 || item.state == 4)"
                          @click="SendXML(item.id_payment)"
                          >Enviar a Sunat</b-dropdown-item
                        >
                      </b-dropdown>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <b-row class="mt-4">
              <b-col md="8">
                <b-pagination
                  v-model="currentPage"
                  v-on:input="ListPayment"
                  :total-rows="rows"
                  :per-page="perPage"
                  align="center"
                ></b-pagination>
              </b-col>
              <b-col md="4 text-center">
                <p>Pagina Actual: {{ currentPage }}</p>
              </b-col>
            </b-row>
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

import CodeToName from "@/assets/js/CodeToName";

export default {
  name: "PaymentList",
  data() {
    return {
      module: 'Payment',
      perPage: 15,
      currentPage: 1,
      rows: 0,
      search: "",
      data_table: [],
    };
  },
  mounted() {
    this.ListPayment();
  },
  methods: {
    ListPayment,
    EditPayment,
    ViewPayment,
    ConfirmDeletePayment,
    DeletePayment,
    Permission,

    SendXML,

    State,
    CodeInvoice,
    Substr,
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

function CodeInvoice(code) {
  return CodeToName.CodeInvoice(code);
}
function Substr(name,limit) {
  if (name.length > limit ) {
    return name.substr(0,limit)+'...';
  }else{
    return name;
  }
}

function State(state) {
  let data = '';
  switch (state) {
    case 0: data = '<b-badge variant="danger">XML</b-badge>'; break;
    case 1: data = '<b-badge variant="success">Girado</b-badge>'; break;
    case 2: data = '<b-badge variant="info">Primary</b-badge>'; break;
    case 3: data = '<b-badge variant="success">Aceptado</b-badge>'; break;
    case 4: data = '<b-badge variant="danger">Rechazado</b-badge>'; break;
    case 5: data = '<b-badge variant="warning">Anulado</b-badge>'; break;
  
    default:
      break;
  }

  return data;

}


//listar usuario
function ListPayment() {


  let search = this.search == "" ? "all" : this.search;
  let me = this;
  let url =
    this.url_base + "payment/list/"+ search + "?page=" + this.currentPage;

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: 1,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.rows = response.data.result.total;
        me.data_table = response.data.result.data;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}


function SendXML(id_payment) {


  let me = this;
  let url = this.url_base + "payment/send-xml/"+ id_payment;

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: 3,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
          if (response.data.result.state == 3) {
                for (var i = 0; i < me.data_table.length; i++) {
                  if (me.data_table[i].id_payment == id_payment) {
                      me.data_table[i].state = 3;
                      break;
                    }
                }
                Swal.fire({ icon: 'success', text: 'El comprobante electronico a sido aceptado correctamente', timer: 2000,})
          }
          if (response.data.result.state == 4) {
                for (var i = 0; i < me.data_table.length; i++) {
                  if (me.data_table[i].id_payment == id_payment) {
                      me.data_table[i].state = 4;
                      break;
                    }
                }
                Swal.fire({ icon: 'error', text: 'El comprobante electronico fue rechazado', timer: 2000,})
          }

      } else {

          for (var i = 0; i < me.data_table.length; i++) {
            if (me.data_table[i].id_payment == id_payment) {
              me.data_table[i].state = 6;
              break;
            }
          }

          Swal.fire({ icon: 'error', text: 'A ocurido un error', timer: 2000,})
    
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });

}

// Editar usuario
function EditPayment(id_payment) {
  this.$router.push({
    name: "PaymentEdit",
    params: { id_payment: je.encrypt(id_payment) },
  });
}

// Ver Usuario
function ViewPayment(id_payment) {
  this.$router.push({
    name: "PaymentView",
    params: { id_payment: je.encrypt(id_payment) },
  });
}

// Confirmar eliminar
function ConfirmDeletePayment(id_payment) {
  Swal.fire({
    title: "Esta seguro de eliminar el registro?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.DeletePayment(id_payment);
    }
  });
}

// eliminar usuario
function DeletePayment(id_payment) {
  let me = this;
  let url = this.url_base + "payment/delete/" + id_payment;
  axios({
    method: "delete",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: 4,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        //eliminado del objeto
        for (var i = 0; i < me.data_table.length; i++) {

          if (me.data_table[i].id_payment == id_payment) {
            me.data_table.splice(i, 1);
            break;
          }
        }
        Swal.fire({ icon: 'success', text: 'Se ha eliminado el registro', timer: 2000, })
      }else{

        Swal.fire({
          icon: 'error',
          text: 'No se puede eliminar el pago',
          timer: 2000,
        })

      }
    })
    .catch((error) => {
      Swal.fire({
          icon: 'error',
          text: 'A ocurrido un error',
          timer: 2000,
        })
    });
}

// permisos
function Permission(module_permission) {
  let user_permissions = window.localStorage.getItem("user_permissions");
  user_permissions = JSON.parse(JSON.parse(je.decrypt(user_permissions)));
  if (user_permissions.indexOf(module_permission) > -1) {
    return true;
  } else {
    return false;
  }
}
</script>

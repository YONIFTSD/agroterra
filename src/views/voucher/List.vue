<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Comprobantes - Listar</strong>
          </CCardHeader>
          <CCardBody>
            <b-row>
              <b-col sm="12" md="8"></b-col>
              <b-col sm="6" md="2">
                <b-link
                  v-if="Permission('VoucherAdd')"
                  variant="info"
                  class="btn form-control btn-primary"
                  :to="{ path: '/comprobante/nuevo' }"
                  append
                  >NUEVO</b-link
                >
              </b-col>
              <b-col sm="6" md="2">
                <b-input-group>
                  <b-form-input
                    v-model="search"
                    class="form-control"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button variant="info" @click="ListVoucher">
                      <b-icon icon="search"></b-icon
                    ></b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-col>
            </b-row>

            <div class="table-responsive mt-3 height-table">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th  class="text-center">#</th>
                    <th  class="text-center">Código</th>
                    <th  class="text-center">Nombre</th>
                    <th  class="text-center">Estado</th>
                    <th  class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="item.id_voucher">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-left"> {{ item.code }}</td>
                    <td class="text-left"> {{ item.name }}</td>
                    <td class="text-center">
                      {{ item.state == 1 ? "Activo" : "Inactivo" }}
                    </td> 
                    <td class="text-center">
                      <b-dropdown bloque size="sm" text="Acciones" right>
                        <b-dropdown-item v-if="Permission('VoucherEdit')"  @click="EditVoucher(item.id_voucher)" >Editar</b-dropdown-item>
                        <b-dropdown-item v-if="Permission('VoucherView')"  @click="ViewVoucher(item.id_voucher)">Ver</b-dropdown-item >
                        <b-dropdown-item v-if="Permission('VoucherList')"  @click="ShowModalSerie(item.id_voucher)" >Series</b-dropdown-item >
                        <b-dropdown-item v-if="Permission('VoucherDelete')"  @click="ConfirmDeleteVoucher(item.id_voucher)">Eliminar</b-dropdown-item>
                
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
                  v-on:input="ListVoucher"
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

    <ModalSerie ref="Serie"/>
  </div>
</template>
<style>
div.modal-backdrop {
    opacity: .5;
}
</style>
<script>
import ModalSerie from './serie/Serie'
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState } from "vuex";
import EventBus from "@/assets/js/EventBus";
export default {
  name: "EstablishmentList",
  components:{
    ModalSerie
  },
  data() {
    return {
      module: 'Voucher',
      perPage: 15,
      currentPage: 1,
      rows: 0,
      search: "",
      data_table: [],
      id_establishment_children: null,
      
    };
  },
  mounted() {
    this.ListVoucher();
  },
  methods: {
    ListVoucher,
    EditVoucher,
    ViewVoucher,
    ConfirmDeleteVoucher,
    DeleteVoucher,
    Permission,

    ShowModalSerie,
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

//listar usuario
function ListVoucher() {
  let search = this.search == "" ? "all" : this.search;
  let me = this;
  let url =
    this.url_base + "voucher/list/" + search + "?page=" + this.currentPage;

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

// Editar usuario
function EditVoucher(id_voucher) {
  this.$router.push({
    name: "VoucherEdit",
    params: { id_voucher: je.encrypt(id_voucher) },
  });
}

// Ver Usuario
function ViewVoucher(id_voucher) {
  this.$router.push({
    name: "VoucherView",
    params: { id_voucher: je.encrypt(id_voucher) },
  });
}

// Confirmar eliminar
function ConfirmDeleteVoucher(id_voucher) {
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
      this.DeleteVoucher(id_voucher);
    }
  });
}

// eliminar usuario
function DeleteVoucher(id_voucher) {
  let me = this;
  let url = this.url_base + "voucher/delete/" + id_voucher;
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
          if (me.data_table[i].id_voucher == id_voucher) {
            me.data_table.splice(i, 1);
            break;
          }
        }
        Swal.fire("Eliminado!", "El registro ha sido eliminado", "success");
      } else {
        Swal.fire(
          "A Ocurrido un error",
          "El registro no ha sido eliminado",
          "error"
        );
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
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



function ShowModalSerie(id_voucher) {
  EventBus.$emit('ModalSerieShow',id_voucher);
}
</script>

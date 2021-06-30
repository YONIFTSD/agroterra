<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Mantenimiento - Listar</strong>
          </CCardHeader>
          <CCardBody>
            <b-row>
              <b-col sm="12" md="8"></b-col>
              <b-col sm="6" md="2">
                <b-link
                  v-if="Permission('MaintenanceAdd')"
                  class="btn form-control btn-primary"
                  :to="{ path: '/mantenimiento/nuevo' }"
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
                    <b-button variant="primary" @click="ListMaintenance">
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
                    <th width="5%" class="text-center">#</th>
                    <th width="10%" class="text-center">Habitación</th>
                    <th width="23%" class="text-center">Fecha Inicio</th>
                    <th width="23%" class="text-center">Fecha Final</th>
                    <th width="25%" class="text-center">Usuario</th>
                    <th width="10%" class="text-center">Estado</th>
                    <th width="10%" class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="it">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-left"> {{ item.room_number  }}</td>
                    <td class="text-center"> {{ item.start_date }}</td>
                    <td class="text-center"> {{ item.state == 2 ? item.end_date:'' }}</td>
                    <td class="text-left"> {{ item.email  }}</td>
                    <td class="text-center">
                      {{ item.state == 1 ? "Pendiente" : "" }}
                      {{ item.state == 2 ? "Finalizado" : "" }}
                      {{ item.state == 0 ? "Anulado" : "" }}
                    </td>
                    <td class="text-center">
                      <b-dropdown bloque size="sm" text="Acciones" right>
                        <b-dropdown-item
                          v-if="Permission('MaintenanceEdit') && item.state == 1"
                          @click="EditMaintenance(item.id_maintenance)"
                          >Editar</b-dropdown-item
                        >
                        <b-dropdown-item
                          v-if="Permission('MaintenanceView')"
                          @click="ViewMaintenance(item.id_maintenance)"
                          >Ver</b-dropdown-item
                        >
                        <b-dropdown-item
                          v-if="Permission('MaintenanceDelete')"
                          @click="ConfirmDeleteMaintenance(item.id_maintenance)"
                          >Eliminar</b-dropdown-item
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
                  v-on:input="ListMaintenance"
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

export default {
  name: "MantenianceList",
  data() {
    return {
      module:'Maintenance',
      perPage: 15,
      currentPage: 1,
      rows: 0,
      search: "",
      data_table: [],
    };
  },
  mounted() {
    this.ListMaintenance();
  },
  methods: {
    ListMaintenance,
    EditMaintenance,
    ViewMaintenance,
    ConfirmDeleteMaintenance,
    DeleteMaintenance,
    Permission,
  },

  computed: {
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
  },
};

//listar usuario
function ListMaintenance() {
  let search = this.search == "" ? "all" : this.search;
  let me = this;
  let url =
    this.url_base + "maintenance/list/"+this.user.id_user+"/" + search + "?page=" + this.currentPage;

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
function EditMaintenance(id_maintenance) {
  this.$router.push({
    name: "MaintenanceEdit",
    params: { id_maintenance: je.encrypt(id_maintenance) },
  });
}

// Ver Usuario
function ViewMaintenance(id_maintenance) {
  this.$router.push({
    name: "MaintenanceView",
    params: { id_maintenance: je.encrypt(id_maintenance) },
  });
}

// Confirmar eliminar
function ConfirmDeleteMaintenance(id_maintenance) {
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
      this.DeleteMaintenance(id_maintenance);
    }
  });
}

// eliminar usuario
function DeleteMaintenance(id_maintenance) {
  let me = this;
  let url = this.url_base + "maintenance/delete/" + id_maintenance;
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
          if (me.data_table[i].id_maintenance == id_maintenance) {
            me.data_table.splice(i, 1);
            break;
          }
        }
        Swal.fire("Sistema", "El registro ha sido eliminado", "success");
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
</script>

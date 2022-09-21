<template>
  <div>
    <b-modal size="lg" hide-footer v-model="modalCars" class="w-100" title="Vehiculos">
      <b-form id="Form" autocomplete="off" @submit.prevent="Validate">
        <b-row>
          <b-col md="3">
            <b-form-group label="Marca">
              <b-form-input v-model="car.brand"></b-form-input>
              <small v-if="errors.brand"  class="form-text text-danger" >Ingrese una marca</small>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Placa">
              <b-form-input v-model="car.plate"></b-form-input>
              <small v-if="errors.plate"  class="form-text text-danger" >Ingrese una placa</small>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Placa Sec.">
              <b-form-input v-model="car.plate_secondary"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Nro Constancia">
              <b-form-input v-model="car.record_number"></b-form-input>
              <small v-if="errors.record_number"  class="form-text text-danger" >Ingrese un nro de constancia</small>
            </b-form-group>
          </b-col>
        
          <b-col md="11">
            <b-form-group label="Observación">
              <b-form-input v-model="car.observation"></b-form-input>
            </b-form-group>
          </b-col>

          <b-col md="1">
            <b-form-group label=".">
                <b-button class="form-control" v-if="car.id_car.length == 0" type="submit" variant="primary" title="Guardar"><i class="fas fa-save"></i></b-button>
                <b-button class="form-control" v-if="car.id_car.length != 0" type="submit" variant="info" title="Modificar"><i class="fas fa-edit"></i></b-button>
              </b-form-group>
          </b-col>
        </b-row>
      </b-form>
      <b-row>
        <b-col md="8">
        </b-col>
         <b-col md="4">
          <b-form-group label=".">
            <b-input-group>
              <b-form-input v-model="search" class="form-control"></b-form-input>
              <b-input-group-append>
                <b-button variant="primary" @click="ListCars"><b-icon icon="search"></b-icon></b-button>
              </b-input-group-append>
          </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="12">
          <div class="table-responsive mt-3 height-table">
            <table class="table table-hover table-bordered">
              <thead>
                <tr>
                  <th width="5%"  class="text-center align-middle">#</th>
                  <th width="20%"  class="text-center align-middle">Marca</th>
                  <th width="20%"  class="text-center align-middle">Placa</th>
                  <th width="20%"  class="text-center align-middle">Placa Secundaria</th>
                  <th width="20%"  class="text-center align-middle">Nro Constancia</th>
                  <th width="10%"  class="text-center align-middle">Acciones</th>
                </tr>
              </thead>
              <tbody v-for="(item, it) in data_table" :key="it">
                <tr>
                  <td class="text-center">{{ it + 1 }}</td>
                  <td class="text-left">{{ item.brand }}</td>
                  <td class="text-left">{{ item.plate }}</td>
                  <td class="text-left">{{ item.plate_secondary }}</td>
                  <td class="text-left">{{ item.record_number }}</td>
                  <td class="text-center">
                      <b-dropdown bloque size="sm" text="Acciones" right>
                        <b-dropdown-item @click="ViewCar(item.id_car)">Editar</b-dropdown-item>
                        <b-dropdown-item @click="ConfirmDeleteCar(item.id_car)">Eliminar</b-dropdown-item>
                      </b-dropdown>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-col>
      </b-row>
      <b-row class="mt-4">
          <b-col md="8">
            <b-pagination v-model="currentPage" v-on:input="ListCars" :total-rows="rows" :per-page="perPage" align="center"></b-pagination>
          </b-col>
          <b-col md="4 text-center">
            <p>Pagina Actual: {{ currentPage }}</p>
          </b-col>
        </b-row>
    </b-modal>
  </div>
</template>
<style>



</style>
<script>
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState,mapActions } from "vuex";
import EventBus from "@/assets/js/EventBus";



export default {
  name: "ModalsProduct",
  data() {
    return {
        modalCars:false,
        module:'ReferralGuide',
        role:0,
        car:{
          id_car:'',
          brand:'',
          plate:'',
          plate_secondary:'',
          record_number:'',
          observation:'',
          state:'1',
        },
        errors:{
          brand:false,
          plate:false,
          record_number:false,
        },



        search:'',
        perPage: 15,
        currentPage: 1,
        rows: 0,
        data_table: [],


        products: [],
        establishment:{},
        id_establishment:'',
        warehouses:[]
    };
  },
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalCarsShow', (role) => {
      this.modalCars = true;
      this.role = role;
      this.ListCars(this);
    });
    
  },
  methods: {
      ListCars,
      Validate,
      AddCar,
      EditCar,
      ViewCar,
      ConfirmDeleteCar,
      DeleteCar,
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

function ListCars(me) {

  let search = me.search == "" ? "all" : me.search;
  let url = me.url_base + "car/list/" + search + "?page=" + me.currentPage;

  axios({
    method: "GET",
    url: url,
    headers: { token: me.token, module: me.module, role: me.role,},
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

function ViewCar(id_car) {
  
  let me = this;
  let url = this.url_base + "car/view/"+id_car;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: this.role,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.car.id_car = response.data.result.id_car;
        me.car.brand = response.data.result.brand;
        me.car.plate = response.data.result.plate;
        me.car.plate_secondary = response.data.result.plate_secondary;
        me.car.record_number = response.data.result.record_number;
        me.car.observation = response.data.result.observation;
        me.car.state = response.data.result.state;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire("422", "A Ocurrido un error" + error, "error");
    });
}

function Validate() {
  this.errors.brand = this.car.brand.length == 0 ? true : false;
  this.errors.plate = this.car.plate.length == 0 ? true : false;
  // this.errors.record_number = this.car.record_number.length == 0 ? true : false;

  if (this.errors.brand == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.plate == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  // if (this.errors.record_number == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

  let me = this;
  if (this.car.id_car.length == 0) {
    Swal.fire({
      title: 'Esta seguro de registrar el vehiculo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Estoy de Acuerdo!'
    }).then((result) => {
      if (result.isConfirmed) {
        me.AddCar(me);
      }
    })
  }else{
    Swal.fire({
      title: 'Esta seguro de modificar el vehiculo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Estoy de Acuerdo!'
    }).then((result) => {
      if (result.isConfirmed) {
        me.EditCar(me);
      }
    })
  }
 
}

function AddCar(me) {

  let url = me.url_base + "car/add";
  let data = me.car;
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: {"Content-Type": "application/json", token: me.token, module: me.module, role: me.role,},
  })
    .then(function (response) {
      if (response.data.status == 201) {
        me.car.brand = "",
        me.car.plate = "";
        me.car.plate_secondary = "";
        me.car.record_number = "";
        me.car.observation = "";
        me.car.state = 1;
        me.ListCars(me);
        EventBus.$emit('RefreshListCars');
        Swal.fire({ icon: 'success', text: 'Se ha registrado el vehiculo', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function EditCar(me) {

  let url = me.url_base + "car/edit";
  let data = me.car;
  axios({
    method: "PUT",
    url: url,
    data: data,
    headers: {"Content-Type": "application/json", token: me.token, module: me.module, role: me.role,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.car.id_car = "",
        me.car.brand = "",
        me.car.plate = "";
        me.car.plate_secondary = "";
        me.car.record_number = "";
        me.car.observation = "";
        me.car.state = 1;
        me.ListCars(me);
        EventBus.$emit('RefreshListCars');
        Swal.fire({ icon: 'success', text: 'Se ha modificado el vehiculo', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}


function ConfirmDeleteCar(id_car) {
  Swal.fire({
    title: "Esta seguro de eliminar el vehiculo?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.DeleteCar(id_car);
    }
  });
}

// eliminar usuario
function DeleteCar(id_car) {
  let me = this;
  let url = this.url_base + "car/delete/" + id_car;
  axios({
    method: "delete",
    url: url,
    headers: {token: me.token, module: me.module, role: me.role,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        for (var i = 0; i < me.data_table.length; i++) {
          if (me.data_table[i].id_car == id_car) {
            me.data_table.splice(i, 1);
            break;
          }
        }
        EventBus.$emit('RefreshListCars');
        Swal.fire({ icon: 'success', text: 'Se ha eliminado el vehiculo', timer: 2000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 2000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error',text: 'A ocurrido un error',timer: 2000,})
    });
}


</script>

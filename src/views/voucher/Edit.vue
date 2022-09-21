<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Comprobante - Editar</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" autocomplete="off" @submit.prevent="EditVoucher">
              <b-row>
                
       
                <b-col md="3">
                  <b-form-group label="Código:">
                    <b-form-input
                      type="text"
                      ref="code"
                      v-model="voucher.code"
                    ></b-form-input>
                    <small v-if="errors.code" class="form-text text-danger"
                      >Ingrese un código</small
                    >
                  </b-form-group>
                </b-col>
           
                <b-col md="6">
                  <b-form-group label="Nombre:">
                    <b-form-input
                      type="text"
                      ref="name"
                      v-model="voucher.name"
                      placeholder="Ingrese su nombre"
                    ></b-form-input>
                    <small v-if="errors.name" class="form-text text-danger">Ingrese un nombre</small>
                  </b-form-group>
                </b-col>
         


                <b-col md="3">
                  <b-form-group label="Estado :">
                    <select
                      ref="state"
                      v-model="voucher.state"
                      class="form-control">
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
                    </select>
                  </b-form-group>
                </b-col>
         


                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-button
                    type="submit"
                    class="form-control bg-primary text-white"
                    variant="primary"
                    >GUARDAR</b-button
                  >
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
  name: "VoucherEdit",
  props: ["id_voucher"],
  data() {
    return {
      module:'Voucher',
      voucher: {
        id_voucher: "",
        code: "",
        name: "",
        state: 1,
      },

      ubigens: [],
      //errors
      errors: {
        code: false,
        name: false,
      },
      validate: false,
    };
  },
  mounted() {
    this.ViewVoucher();
  },
  methods: {
    ViewVoucher,
    EditVoucher,
    Validate,
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
function ViewVoucher() {
  let id_voucher = je.decrypt(this.id_voucher);
  let me = this;
  let url = this.url_base + "voucher/view/" + id_voucher;

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
        me.voucher.id_voucher = response.data.result.id_voucher;
        me.voucher.name = response.data.result.name;
        me.voucher.code = response.data.result.code;
        me.voucher.state = response.data.result.state;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

//editar usuario
function EditVoucher() {
  // validacion de campos obligatorios
  this.Validate();
  if (this.validate) {
    return false;
  }

  let me = this;
  let url = this.url_base + "voucher/edit";
  let data = {
    id_voucher: this.voucher.id_voucher,
    code: this.voucher.code,
    name: this.voucher.name,
    state: this.voucher.state,
  };

  axios({
    method: "PUT",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      token: this.token,
      module: this.module,
      role: 3,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        Swal.fire("Comprobante", "Se ha modificado el comprobante", "success");
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

//validacion de formulario
function Validate() {
  this.errors.code = this.voucher.code.length == 0 ? true : false;
  this.errors.name = this.voucher.name.length == 0 ? true : false;

  
  this.validate = this.errors.code == true ? true : false;
  this.validate = this.errors.name == true ? true : false;


}
</script>

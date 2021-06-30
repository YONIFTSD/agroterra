<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Comprobante - Ver</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form">
              <b-row>
               
                <b-col md="3">
                  <b-form-group label="Código:">
                    <b-form-input
                    disabled
                      type="text"
                      ref="code"
                      v-model="voucher.code"
                    ></b-form-input>
                   
                  </b-form-group>
                </b-col>
      
                <b-col md="6">
                  <b-form-group label="Nombre:">
                    <b-form-input
                    disabled
                      type="text"
                      ref="name"
                      v-model="voucher.name"
                      placeholder="Ingrese su nombre"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
         
                <b-col md="3">
                  <b-form-group label="Estado :">
                    <select
                    disabled
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
                  <b-link
                    class="btn form-control btn-primary"
                    :to="{ path: '/comprobante/listar' }"
                    append
                    >REGRESAR</b-link
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
  name: "ComprobanteView",
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

    };
  },
  mounted() {
    this.ViewVoucher();
  },
  methods: {
    ViewVoucher,

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

</script>

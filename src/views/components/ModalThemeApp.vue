<template>
  <div>
    <b-modal size="md" class="modal-size" hide-footer v-model="modal_theme" title="TEMA DEL SISTEMA">
      <b-row>
        <b-col md="12">
          <b-form id="Form" @submit.prevent="Validate">
              <b-row>

                <b-col md="12">
                  <b-form-group label="Encabezado :">
                    <b-form-input type="color" v-model="business.bg_header"></b-form-input>
                  </b-form-group>
                  <small v-if="errors.bg_header"  class="form-text text-danger" >Seleccione un color</small>
                </b-col>

                <b-col md="12">
                  <b-form-group label="Menu :">
                    <b-form-input type="color" v-model="business.bg_sidebar"></b-form-input>
                  </b-form-group>
                  <small v-if="errors.bg_sidebar"  class="form-text text-danger" >Seleccione un color</small>
                </b-col>

                <b-col md="12">
                  <b-form-group label="Menu Fondo :">
                    <b-form-input type="color" v-model="business.bg_sidebar_nav_dropdown_items"></b-form-input>
                  </b-form-group>
                  <small v-if="errors.bg_sidebar_nav_dropdown_items"  class="form-text text-danger" >Seleccione un color</small>
                </b-col>

                 <b-col md="12">
                  <b-form-group label="Menu Seleccionado :">
                    <b-form-input type="color" v-model="business.bg_sidebar_nav_dropdown_toggle"></b-form-input>
                  </b-form-group>
                  <small v-if="errors.bg_sidebar_nav_dropdown_toggle"  class="form-text text-danger" >Seleccione un color</small>
                </b-col>

      
                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-button   type="submit"  class="form-control " variant="primary" >GUARDAR</b-button >
                </b-col>
              </b-row>
            </b-form>
        </b-col>
  
      </b-row>
    </b-modal>
  </div>
</template>

<style>


</style>

<script>

import vSelect from "vue-select";
import 'vue-select/dist/vue-select.css';
import "vue-select/src/scss/vue-select.scss";

const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState } from "vuex";
import EventBus from "@/assets/js/EventBus";
import converter from "@/assets/js/NumberToLetters";
import ApiQuery from "@/assets/js/APIQuery";
export default {
  name: "ModalClient",
  components:{
    vSelect,
  },
  data() {
    return {
      module: "Business",
      role: 3,
      modal_theme : false,
      business: {
        id_company : '',
        bg_header : '',
        bg_sidebar : '',
        bg_sidebar_nav_dropdown_toggle : '',
        bg_sidebar_nav_dropdown_items : '',
      },
      errors: {
        document_number: false,
        name: false,
        tradename: false,
      },
      validate: false,
    };
  },

  mounted () {
    EventBus.$on('ModalThemeAppShow', () => {
      this.modal_theme = true;
      this.ViewBusiness();
    });
    
  },
  methods: {
    Validate,
    EditBusiness,
    ViewBusiness,
  },
  computed: {
    ...mapState(["url_base"]),
    token: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.api_token;
    }
  },
};

//ver usuario
function ViewBusiness() {
  let me = this;
  let url = me.url_base + "business/get-business";

  axios({
    method: "GET",
    url: url,
    headers: { token: me.token,module: me.module, role: 3, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.business.id_company = response.data.result.id_company;
        me.business.bg_header = response.data.result.bg_header;
        me.business.bg_sidebar = response.data.result.bg_sidebar;
        me.business.bg_sidebar_nav_dropdown_toggle = response.data.result.bg_sidebar_nav_dropdown_toggle;
        me.business.bg_sidebar_nav_dropdown_items = response.data.result.bg_sidebar_nav_dropdown_items;

      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}


function EditBusiness(me) {

  let url = me.url_base + "business/edit-theme";
  let data = new FormData();
  data.append("id_company", me.business.id_company);
  data.append("bg_header", me.business.bg_header);
  data.append("bg_sidebar", me.business.bg_sidebar);
  data.append("bg_sidebar_nav_dropdown_toggle", me.business.bg_sidebar_nav_dropdown_toggle);
  data.append("bg_sidebar_nav_dropdown_items", me.business.bg_sidebar_nav_dropdown_items);
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: { "Content-Type": "application/json", token: me.token,  module: me.module, role: 3,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        Swal.fire({ icon: 'success', text: 'Se ha modificado los datos de la empresa', timer: 3000,})
        window.location.reload();
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

  this.errors.bg_header = this.business.bg_header.length == 0 ? true : false;
  this.errors.bg_sidebar = this.business.bg_sidebar.length == 0 ? true : false;
  this.errors.bg_sidebar_nav_dropdown_toggle = this.business.bg_sidebar_nav_dropdown_toggle.length == 0 ? true : false;
  this.errors.bg_sidebar_nav_dropdown_items = this.business.bg_sidebar_nav_dropdown_items.length == 0 ? true : false;


  if (this.errors.bg_header) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.bg_sidebar) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.bg_sidebar_nav_dropdown_toggle) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.bg_sidebar_nav_dropdown_items) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }


  let me = this;

  if (!this.validate) {
    Swal.fire({
      title: "Esta seguro de modificar los tema de la empresa ?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Estoy de acuerdo!",
    }).then((result) => {
      if (result.value) {
        this.EditBusiness(me);
      }
    });

  }

}
</script>

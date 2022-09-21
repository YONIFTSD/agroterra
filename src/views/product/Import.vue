<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Producto - Importar</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" autocomplete="off">
              <b-row>
                <b-col md="3">
                  <b-form-group label="">
                   <b-button type="submit" class="form-control" @click="ExportTemplateResource"  variant="success" >Descargar Recursos <i class="fas fa-download"></i></b-button >
                  </b-form-group>
                </b-col>
                <b-col md="3">
                  <b-form-group label="">
                   <b-button type="submit" class="form-control" @click="ExportTemplateProducts"  variant="success" >Descargar Plantilla <i class="fas fa-download"></i></b-button >
                  </b-form-group>
                </b-col>
                <b-col md="4">
                  <b-form-group>
                    <b-input-group>
                      <b-form-file @change="UploadFile" accept=".xlsx" v-model="file_excel" placeholder="Seleccione el inventario en excel..." drop-placeholder="Suelta la imagen aquí..."></b-form-file>
                    </b-input-group>
                  </b-form-group>
                </b-col>
                

                <b-col md="2">
                  <b-form-group label="">
                   <b-button type="submit"  @click="Validate"  class="form-control"  variant="primary" >Importar Productos <i class="fas fa-upload"></i></b-button >
                  </b-form-group>
                </b-col>
              </b-row>

  
                  <b-row>
                    <b-col md="12" class="mt-3 text-center">
                      <!-- <small  v-if="errors.initial_kardex_detail"  class="form-text text-danger">Ingrese los productos</small> -->
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

import vSelect from "vue-select";
import 'vue-select/dist/vue-select.css';
import "vue-select/src/scss/vue-select.scss";


const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState } from "vuex";
import LoadingComponent from './../pages/Loading'

export default {
  name: "UsuarioAdd",
  components:{
      vSelect,
      Keypress: () => import('vue-keypress'),
    LoadingComponent,
  },
  data() {
    return {
      isLoading: false,
      module: "Product",
      role: 2,
      file_excel: null,
      file_excel_name: '',
    };
  },
  mounted() {
 
  },
  methods: {
    UploadFile,
    UploadExcel,
    Validate,
    ExportTemplateProducts,
    ExportTemplateResource,
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

function ExportTemplateProducts() {
  let url = this.url_base + "/excel-template-products";
  window.open(url,'_blank');
}
function ExportTemplateResource() {
  let url = this.url_base + "/excel-template-resource";
  window.open(url,'_blank');
}
function UploadFile(e) {
  this.file_excel_name = e.target.files[0];
}
function Validate() {
    if (this.file_excel_name.length == 0) {
       Swal.fire({ icon: 'error', text: 'Seleccione un archivo excel', timer: 3000,})
       return false;
    }

    Swal.fire({
    title: 'Esta seguro de importar los productos ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.UploadExcel();
    }
  })
}
function UploadExcel() {

  this.isLoading = true;
  let me = this;
  let url = me.url_base + "product/import-excel";
  let data = new FormData();
  data.append("file_excel", this.file_excel_name);
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: { "Content-Type": "application/json", token: me.token, module: me.module, role: 2,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.file_excel = null;
        Swal.fire({ icon: 'success', text: 'Se ha Importado los el inventario', timer: 3000,})
        me.isLoading = false;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
        me.isLoading = false;
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      me.isLoading = false;
    });
}
</script>

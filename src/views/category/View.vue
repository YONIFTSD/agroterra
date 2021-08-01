<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Categoria - Ver</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form">
              <b-row>
                <b-col md="3">
                  <b-form-group>
                    <b-card-img :src="url_base + category.photo"></b-card-img>
                  </b-form-group>
                </b-col>

                <b-col md="9">
                    <b-row>

                      <b-col md="4">
                        <b-form-group label="Nombre:">
                          <b-form-input type="text" disabled ref="name" v-model="category.name" placeholder="Ingrese su nombre"></b-form-input>
                          <small v-if="errors.name" class="form-text text-danger">Ingrese un nombre</small>
                        </b-form-group>
                      </b-col>
            
                      <b-col md="6">
                        <b-form-group label="Descripción :" required>
                          <b-form-input type="text" disabled ref="description" v-model="category.description"></b-form-input>
                        </b-form-group>
                      </b-col>
            
                      <b-col md="2">
                        <b-form-group label="Estado :"  label-for="input-1">
                          <select ref="state" disabled v-model="category.state" class="form-control">
                            <option value="1">Activo</option>
                            <option value="0">Inactivo</option>
                          </select>
                        </b-form-group>
                      </b-col>
            

                      <b-col md="5"></b-col>
                      <b-col md="2">
                        <b-link class="btn form-control btn-primary" :to="{ path: '/categoria/listar' }" append>REGRESAR</b-link>
                      </b-col>

                    </b-row>
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
  props: ["id_category"],
  components:{
    LoadingComponent,
  },
  data() {
    return {
      isLoading: false,
      module:'Category',
      category: {
        id_category: "",
        name: "",
        photo: "",
        description: "",
        state: 1,
      },

      ubigens: [],
      //errors
      errors: {
        name: false,
        name: false,
      },
      validate: false,
    };
  },
  mounted() {
    this.ViewCategory();
  },
  methods: {
    ViewCategory,

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
function ViewCategory() {
  let id_category = je.decrypt(this.id_category);
  let me = this;
  let url = this.url_base + "category/view/" + id_category;
  me.isLoading = true;
  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: 5,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.category.id_category = response.data.result.id_category;
        me.category.name = response.data.result.name;
        me.category.description = response.data.result.description;
        me.category.photo = response.data.result.photo;
        me.category.state = response.data.result.state;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
      me.isLoading = false;
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      me.isLoading = false;
    });
}

</script>

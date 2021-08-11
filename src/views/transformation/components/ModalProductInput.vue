<template>
  <div>
    <b-modal size="xl" hide-footer v-model="modalProductsInput" class="w-100" title="Productos Transformados">
      <b-row>
        <b-col md="12">
          <b-form-group label="Buscar producto :">
            <b-form-input type="text" ref="search_product" v-model="search_product" @keyup="SearchProducts"></b-form-input>
            
          </b-form-group>
        </b-col>
        <b-col md="12">
          <div class="table-responsive mt-3">
            <table class="table table-hover table-bordered">
              <thead>
                <tr>
                  <th width="5%"  class="text-center align-middle">#</th>
                  <th width="8%"  class="text-center align-middle">Código</th>
                  <th width="55%" class="text-center align-middle">Nombre</th>
                  <th width="10%" class="text-center align-middle">Cantidad</th>
                  <th width="10%" class="text-center align-middle">Capacidad</th>
                  <th width="10%" class="text-center align-middle">Acciones</th>
                </tr>
              </thead>
              <tbody v-for="(item, it) in products" :key="it">
                <tr>
                  <td class="text-center">{{ it + 1 }}</td>
                  <td class="text-left">{{ item.code }}</td>
                  <td class="text-left">{{ item.name +  " - " + item.presentation }}</td>
                  <td class="text-center">
                    <input type="number" min="1" value="1" :ref="'mODCantidad'+item.id_product" class="form-control">
                  </td>
                  <td class="text-center">
                    <input type="number" min="0" value="0" :ref="'mODCapacity'+item.id_product" class="form-control">
                  </td>
                  <td class="text-center">
                      <button type="button" @click="AddProduct(item.id_product)" class="btn btn-info">
                        <i class="fas fa-plus-square"></i>
                      </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
// import Notifications from 'vue-notification/dist/ssr.js';


export default {
  name: "ModalsProduct",
  data() {
    return {
        modalProductsInput:false,
        module:'Transformation',
        role:0,
        search_product:'',
        products: [],
        id_product:'',
        index:'',
    };
  },
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalProductsInputShow', (role,index,id_product) => {
      this.modalProductsInput = true;
      this.role = role;
      this.index = index;
      this.id_product = id_product;
    });
    
  },
  methods: {
      SearchProducts,
      AddProduct,
      ...mapActions('Transform',['mLoadAddTransformInputDetail','mLoadUpdateRemainingCapacity']),
      
  },
  computed: {
    ...mapState('Transform',['transform_output_detail','transform_input_detail']),
    ...mapState(["url_base"]),
    token: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.api_token;
    },
  },
};


function AddProduct(id_product) {
  
    let quantity = this.$refs['mODCantidad'+id_product][0]['value'];
    let capacity = this.$refs['mODCapacity'+id_product][0]['value'];
    let me = this;
    let url = this.url_base + "product/view/" + id_product;
    let id_reference = this.id_product;
    let indexr = this.index; 
    axios({
      method: "GET",
      url: url,
      headers: {token: this.token, module: this.module,role: this.role, },
    })
    .then(function (response) {
      if (response.data.status == 200) {
        let total_capacity = parseFloat(quantity) * parseFloat(capacity);
        let validate = false;
        let output_remaining_capacity = me.transform_output_detail[indexr].remaining_capacity;
        let output_total_capacity = me.transform_output_detail[indexr].total_capacity;

       
        let quantity_final = parseFloat(quantity);
        for (let index = 0; index < me.transform_input_detail.length; index++) {
          const element = me.transform_input_detail[index];
          if (element.id_reference == id_reference) {
            quantity_final += parseFloat(element.quantity); 
          }
        }
        let total_capacity_final = parseFloat(quantity_final) * parseFloat(capacity);
        if (output_total_capacity >= total_capacity_final) {
            validate = true;
        }
         

        
        let detail = {
          id_product: response.data.result.id_product,
          code: response.data.result.code,
          name: response.data.result.name,
          presentation: response.data.result.presentation,
          unit_measure: response.data.result.unit_measure,
          igv: response.data.result.igv,
          existence_type: response.data.result.existence_type,
          quantity: quantity,
          capacity: parseFloat(capacity).toFixed(2),
          total_capacity: total_capacity.toFixed(2),
          id_reference: id_reference,
        }
        if (validate) {
          me.mLoadAddTransformInputDetail(detail);
        }
        

        
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      console.log(error);
      // Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });

   
}
//Buscar productos
function SearchProducts() {
  let me = this;
  let search = this.search_product == "" ? "all" : this.search_product;
  let url = this.url_base + "search-products-transforms/"+this.id_establishment+"/"+"2"+"/"+ search;

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.products = response.data.result;
      } else {
        me.products = [];
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      
    });
}
</script>

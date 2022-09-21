<template>
  <div>
    <b-modal size="xl" hide-footer v-model="modalProducts" class="w-100" title="Productos">
      <b-row>
        <b-col md="12">
          <b-form-group label="Buscar producto :">
            <b-form-input
              type="text"
              ref="search_product"
              v-model="search_product"
              @keyup="SearchProducts"
              autofocus
            ></b-form-input>
            
          </b-form-group>
        </b-col>

        <b-col md="12">
          <div class="table-responsive mt-3">
            <table class="table table-hover table-bordered">
              <thead>
                <tr>
                  <th width="3%"  class="text-center align-middle">#</th>
                  <th width="8%"  class="text-center align-middle">Código</th>
                  <th width="30%"  class="text-center align-middle">Nombre</th>
                  <th width="10%"  class="text-center align-middle">Categoria</th>
                  <th width="15%"  class="text-center align-middle">U. M.</th>
                  <th width="10%"  class="text-center align-middle">Cantidad</th>
                  <th width="10%"  class="text-center align-middle">P. Unit</th>
                  <th width="10%"  class="text-center align-middle">Desc.</th>
                  <th width="5%"  class="text-center align-middle">Acciones</th>

                </tr>
              </thead>
              <tbody v-for="(item, it) in products" :key="item.id_product">
                <tr>
                  <td class="text-center">{{ it + 1 }}</td>
                  <td class="text-center">{{ item.code }}</td>
                  <td class="text-left">{{ item.name + (item.presentation.length == 0 ? '':' - '+item.presentation) }}</td>
                  <td class="text-left">{{ item.category_name }}</td>
                  <td class="text-left">
                    <b-form-select :ref="'mIDUM'+item.id_product" v-model="item.unit_measure" :options="unit_measure"></b-form-select>
                  </td>
                  <td class="text-center">
                    <input type="number" step="any" value="1.00" :ref="'mIDCantidad'+item.id_product" class="form-control text-right">
                  </td>
                  <td class="text-center">
                    <input type="number" step="any" value="0.00" :ref="'mIDUnitPrice'+item.id_product" class="form-control text-right">
                  </td>
                  <td class="text-center">
                    <input type="number" step="any" value="0.00" :ref="'mIDDiscount'+item.id_product" class="form-control text-right">
                  </td>
                  <td class="text-center">
                      <b-button type="button" @click="AddProduct(item.id_product)" variant="primary">
                        <i class="fas fa-plus-square"></i>
                      </b-button>
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
import { mapState,mapMutations,mapActions } from "vuex";
import EventBus from "@/assets/js/EventBus";
import CodeToName from "@/assets/js/CodeToName";

export default {
  name: "ModalsProduct",
  props: ["type_discount"],
  data() {
    return {
        modalProducts:false,
        module:'Shopping',
        role:0,
        search_product:'',
        products: [],
        unit_measure:[
          {value:'4A',text:'BOBINAS'},
          {value:'BJ',text:'BALDE'},
          {value:'BLL',text:'BARRILES'},
          {value:'BG',text:'BOLSA'},
          {value:'BO',text:'BOTELLAS'},
          {value:'BX',text:'CAJA'},
          {value:'CMK',text:'CENTIMETRO CUADRADO'},
          {value:'CMQ',text:'CENTIMETRO CUBICO'},
          {value:'CMT',text:'CENTIMETRO LINEAL'},
          {value:'CEN',text:'CIENTO DE UNIDADES'},
          {value:'CY',text:'CILINDRO'},
          {value:'DZN',text:'DOCENA'},
          {value:'DZP',text:'DOCENA POR 10**6'},
          {value:'BE',text:'FARDO'},
          {value:'GLI',text:'GALON INGLES (4,545956L)'},
          {value:'GRM',text:'GRAMO'},
          {value:'KGM',text:'KILOGRAMO'},
          {value:'CA',text:'LATAS'},
          {value:'LBR',text:'LIBRAS'},
          {value:'LTR',text:'LITRO'},
          {value:'MTR',text:'METRO'},
          {value:'MGM',text:'MILIGRAMOS'},
          {value:'MIL',text:'MILLARES'},
          {value:'UM',text:'MILLON DE UNIDADES'},
          {value:'ONZ',text:'ONZAS'},
          {value:'PF',text:'PALETAS'},
          {value:'PK',text:'PAQUETE'},
          {value:'GRM',text:'GRAMO'},
          {value:'PR',text:'PAR'},
          {value:'FOT',text:'PIES'},
          {value:'FTK',text:'PIES CUADRADOS'},
          {value:'FTQ',text:'PIES CUBICOS'},
          {value:'C62',text:'PIEZAS'},
          {value:'NIU',text:'UNIDAD (BIENES) '},
          {value:'ZZ',text:'UNIDAD (SERVICIOS)'},
          {value:'GRM',text:'US GALON (3,7843 L)'},
          {value:'GLL',text:'GRAMO'},
          {value:'TNE',text:'TONELADAS'},
        ],
    };
  },
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalProductsShow', (role) => {
      this.modalProducts = true;
      this.role = role;
    });
    
  },
  methods: {
      SearchProducts,
      AddProduct,
      NameUnitMeasure,
      ...mapActions('PurchaseOrder',['mLoadAddShoppingDetail']),
      ...mapActions('PurchaseOrder',['mLoadTotalsShoppingDetail']),
      
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

function NameUnitMeasure(code) {
  return CodeToName.NameUnitMeasure(code);
}

function AddProduct(id_product) {
  
  let quantity = this.$refs['mIDCantidad'+id_product][0]['value'];
  let unit_price = this.$refs['mIDUnitPrice'+id_product][0]['value'];
  let discount = this.$refs['mIDDiscount'+id_product][0]['value'];
  let unit_measure = this.$refs['mIDUM'+id_product][0]['value'];
  
  let percentage_discount = 0;
  if (this.type_discount == 1) {
    percentage_discount = parseFloat(unit_price) * parseFloat(discount) / 100;
    discount = parseFloat(discount).toFixed(2);
  }
  if (this.type_discount == 2) {
    percentage_discount = parseFloat(discount).toFixed(2);
    discount = parseFloat(discount) * 100 / parseFloat(unit_price);
  }
  
  
  let me = this;
  let url = this.url_base + "product/view/"+id_product;

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role:this.role,
    },
  })
    .then(function (response) {
      
      if (response.data.status == 200) {
        
        let total_value = parseFloat(quantity) *  parseFloat(unit_price);
        let detail = {
          id_input_detail : 0,
          id_product : response.data.result.id_product,
          code : response.data.result.code,
          name : response.data.result.name + (response.data.result.presentation.length == 0 ? '':' - '+response.data.result.presentation),
          presentation : response.data.result.presentation,
          unit_measure : unit_measure,
          igv : response.data.result.igv,
          quantity : parseFloat(quantity).toFixed(2),
          type_discount: me.type_discount,
          percentage_discount: parseFloat(percentage_discount).toFixed(2),
          package: (1).toFixed(0),

          unit_value: parseFloat(unit_price).toFixed(5),
          unit_discount: parseFloat(discount).toFixed(5),
          net_unit_value: parseFloat(unit_price).toFixed(5),
          unit_igv: (0).toFixed(5),
          unit_price: (0).toFixed(5),

          total_value: (total_value).toFixed(5),
          total_discount: parseFloat(0).toFixed(5),
          net_total_value: (total_value).toFixed(5),
          total_igv: (0).toFixed(5),
          total_price: (0).toFixed(5),
        }

        me.mLoadAddShoppingDetail(detail);
        me.mLoadTotalsShoppingDetail();
        me.$notify({ group: 'alert', title: 'Sistema', text:'Se ha agregado el producto '+ detail.name + ' - ' + detail.presentation, type: 'success'});
      } else {
        
      }
    })

    
}

//Buscar productos
function SearchProducts() {
  let me = this;
  let search = this.search_product == "" ? "all" : this.search_product;
  let url = this.url_base + "search-products";
  let data = {
    search : search
  };
  axios({
    method: "POST",
    url: url,
    data:data,
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

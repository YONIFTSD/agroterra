<template>
  <div>
    <b-modal size="xl" hide-footer v-model="modalProducts" class="w-100" title="Productos">
      <b-tabs content-class="mt-3">
        <b-tab title="Buscar" active>
          <b-row>
            <b-col md="12">
              <b-form-group label="Buscar producto :">
                <b-form-input autofocus type="search" ref="search_product" v-model="search_product" @keyup="SearchProducts"></b-form-input>
                
              </b-form-group>
            </b-col>
            <b-col md="12">
              <div class="table-responsive mt-3">
                <table class="table table-hover table-bordered">
                  <thead>
                    <tr>
                      <th width="5%"  class="text-center align-middle">#</th>
                      <th width="8%"  class="text-center align-middle">Código</th>
                      <th width="45%"  class="text-center align-middle">Nombre</th>
                      <th width="10%"  class="text-center align-middle">Categoria</th>
                      <th width="10%"  class="text-center align-middle">U.M.</th>
                      <th width="10%"  class="text-center align-middle">Cantidad</th>
                      <th width="10%"  class="text-center align-middle">Acciones</th>

                    </tr>
                  </thead>
                  <tbody v-for="(item, it) in products" :key="item.id_product">
                    <tr>
                      <td class="text-center">{{ it + 1 }}</td>
                      <td class="text-left">{{ item.code }}</td>
                      <td class="text-left">{{ item.name + (item.presentation.length == 0 ? '': ' - '+item.presentation)  }}</td>
                      <td class="text-left">{{ item.category_name }}</td>
                      <td class="text-left">{{ NameUnitMeasure(item.unit_measure) }}</td>
                      <td class="text-center">
                        <input type="number" step="any" value="1.00" :ref="'mIDCantidad'+item.id_product" class="form-control text-right">
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
        </b-tab>
        <b-tab title="Registrar">
          <b-form id="Form" autocomplete="off" @submit.prevent="Validate">
          <b-row>
            <b-col md="3">
              <b-form-group label="Categoria :">
                <b-form-select @change="ListSubcategories" v-model="product.id_category" :options="categories"></b-form-select>
                <small v-if="errors.id_category" class="form-text text-danger">Seleccione una categoria</small>
              </b-form-group>
            </b-col>

            <b-col md="3">
              <b-form-group label="Subcategoria :">
                <b-form-select v-model="product.id_subcategory" :options="subcategories"></b-form-select>
              </b-form-group>
            </b-col>

            <b-col md="3">
              <b-form-group label="Marca :">
                <b-form-select v-model="product.id_brand" :options="brands"></b-form-select>
                <small v-if="errors.id_brand" class="form-text text-danger">Seleccione una marca</small>
              </b-form-group>
            </b-col>

            <b-col md="3">
              <b-form-group label="Codigo:">
                <b-form-input readonly type="text" class="text-center" ref="code" v-model="product.code"></b-form-input>
                <small v-if="errors.code" class="form-text text-danger" >Ingrese un código</small>
              </b-form-group>
            </b-col>

            <b-col md="12">
              <b-form-group label="Nombre:">
                <b-form-input  type="text" ref="name" v-model="product.name" ></b-form-input>
                <small v-if="errors.name" class="form-text text-danger">Ingrese un nombre</small>
              </b-form-group>
            </b-col>

            <b-col md="4">
              <b-form-group label="Presentación :">
                <b-form-input  type="text" ref="presentation" v-model="product.presentation" ></b-form-input>
                <small v-if="errors.presentation" class="form-text text-danger">Ingrese una presentacion</small>
              </b-form-group>
            </b-col>

            <b-col md="5">
              <b-form-group label="Composición :">
                <b-form-input  type="text" ref="composition" v-model="product.composition" ></b-form-input>
                <small v-if="errors.composition" class="form-text text-danger">Ingrese una composición</small>
              </b-form-group>
            </b-col>

            <b-col md="3">
              <b-form-group label="Unidad de Medida :">
                <b-form-select v-model="product.unit_measure" :options="unit_measure"></b-form-select>
              </b-form-group>
            </b-col>


            <b-col md="12">
              <b-form-group label="Descripción:">
                <b-form-textarea ref="description"  v-model="product.description"></b-form-textarea>
              </b-form-group>
            </b-col>

        
            <b-col md="3">
              <b-form-group label="IGV :">
                <select ref="igv" v-model="product.igv" class="form-control">
                  <option value="10">Gravado</option>
                  <option value="20">Exonerado</option>
                  <option value="30">Inafecto</option>
                </select>
              </b-form-group>
            </b-col>

            <b-col md="3">
              <b-form-group label="Transformable ? :">
                <select  ref="transform" v-model="product.transform" class="form-control" >
                  <option value="0">NO</option>
                  <option value="1">Transformable</option>
                  <option value="2">Transformado</option>
                </select>
              </b-form-group>
            </b-col>

              <b-col md="3">
              <b-form-group label="Producto Interno :">
                <b-form-select type="text" v-model="product.internal_product" :options="internal_product"></b-form-select>
              </b-form-group>
            </b-col>

            <b-col md="3">
              <b-form-group label="Codigo de Barras:">
                <b-form-input type="text" v-model="product.barcode"></b-form-input>
              </b-form-group>
            </b-col>


            <b-col md="5"></b-col>
            <b-col md="2">
              <b-button type="submit" class="form-control"  variant="primary" ><i class="fas fa-save"></i> Guardar (F4)</b-button >
            </b-col>

          </b-row>
          </b-form>
        </b-tab>
      </b-tabs>

      
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
import CodeToName from "@/assets/js/CodeToName";

export default {
  name: "ModalsProduct",
  data() {
    return {
        modalProducts:false,
        module:'Input',
        role:0,
        search_product:'',
        products: [],

         product: {
          id_category: "",
          id_subcategory: "",
          id_brand: "",
          id_provider: "",
          code: "",
          name: "",
          presentation: "",
          composition: "",
          barcode: "",
          description: "",
          existence_type: "01",
          unit_measure: "NIU",
          igv: "10",
          internal_product: 0,
          transform: 0,
          photo: "",
          unspsc_code:'23251602',
          commissionable: 0,
          commission: 0.0,
          purchase_price: 0.0,
          regular_price: 0.0,
          sale_price: 0.0,
          gross_weight: 0.0,
          weight_cost: 0.0,
          people_who_bought_this:0,
          people_who_see_this:0,
          outstanding:0,
          offer:0,
          web:0,
          state: 1,
        },
        categories: [],
        subcategories:[
          {value:'',text:'Ninguna'}
        ],
        brands: [],
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
          {value:'MTK',text:'METRO CUADRADO'},
          {value:'MTQ',text:'METRO CUBICO'},
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
        ],
        commissionable:[
          {value:0,text:'NO'},
          {value:1,text:'SI - Importe'},
          {value:2,text:'SI - Porcentaje'},
        ],
        internal_product :[
          {value:0,text:'NO'},
          {value:1,text:'SI'},
        ],
        errors: {
          id_category: false,
          id_brand: false,
          id_provider: false,
          code: false,
          name: false,
          state: false,
        },
        validate: false,
    };
  },
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalProductsShow', (role) => {
      this.modalProducts = true;
      this.role = role;

      this.ListCategories();
      this.ListBrands();
      this.GetCorrelative();
    });

  },
  methods: {
      SearchProducts,
      AddProduct,
      NameUnitMeasure,
      ...mapActions('Input',['mLoadAddInputDetail']),

      ListCategories,
      ListSubcategories,
      ListBrands,
      GetCorrelative,
      NewProduct,
      Validate,
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
    quantity = quantity.length == 0 ? 1:quantity;
    let me = this;
    let url = this.url_base + "product/view/" + id_product;

    axios({
      method: "GET",
      url: url,
      headers: {
        token: this.token,
        module: this.module,
        role: this.role,
      },
    })
    .then(function (response) {
      if (response.data.status == 200) {
          
        let detail = {
          id_product: response.data.result.id_product,
          code: response.data.result.code,
          name: response.data.result.name,
          presentation: response.data.result.presentation,
          unit_measure: response.data.result.unit_measure,
          igv: response.data.result.igv,
          existence_type: response.data.result.existence_type,
          quantity: parseFloat(quantity).toFixed(2),
          package: parseFloat(0).toFixed(0),
          expiration_date: '',
        }
        
        me.mLoadAddInputDetail(detail);
        me.$notify({ group: 'alert', title: 'Sistema', text:'Se ha agregado producto '+detail.name + ' - '+detail.presentation, type: 'success'})

        
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


function GetCorrelative() {
  let me = this;
  let url = this.url_base + "product/correlative";

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: this.role,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.product.code = response.data.result.number;
      } 
    })
}
//listar usuario
function ListCategories() {
  let me = this;
  let url = this.url_base + "active-categories";

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
    },
  })
    .then(function (response) {
      me.categories = [{value:'',text:'Seleccione una categoria'}];
      if (response.data.status == 200) {
        for (let index = 0; index < response.data.result.length; index++) {
          const element = response.data.result[index];
           me.categories.push({value:element.id_category,text:element.name});
        }
       
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function ListBrands() {
  let me = this;
  let url = this.url_base + "active-brands";

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
    },
  })
    .then(function (response) {
      me.brands = [{value:'',text:'Seleccione una marca'}];
      if (response.data.status == 200) {
        for (let index = 0; index < response.data.result.length; index++) {
          const element = response.data.result[index];
           me.brands.push({value:element.id_brand,text:element.name});
        }
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function ListSubcategories() {
  if (this.product.id_category.length == 0) {
    this.subcategories = [{value:'',text:'Ninguna'}];
    this.product.id_subcategory = '';
    return false;
  }
  let me = this;
  let url = this.url_base + "active-subcategories/"+this.product.id_category;
  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
    },
  })
    .then(function (response) {
      me.subcategories = [{value:'',text:'Ninguna'}];
      if (response.data.status == 200) {
        for (let index = 0; index < response.data.result.length; index++) {
          const element = response.data.result[index];
           me.subcategories.push({value:element.id_subcategory,text:element.name});
        }
      }
    })
}



function NewProduct() {
 

  let me = this;
  let url = me.url_base + "product/add";

  let data = new FormData();
  data.append("id_category", this.product.id_category);
  data.append("id_subcategory", this.product.id_subcategory);
  data.append("id_brand", this.product.id_brand);
  data.append("id_provider", 1);
  data.append("code", this.product.code);
  data.append("name", this.product.name);
  data.append("barcode", this.product.barcode);
  data.append("description", this.product.description);
  data.append("existence_type", this.product.existence_type);
  data.append("unit_measure", this.product.unit_measure);
  data.append("igv", this.product.igv);
  data.append("internal_product", this.product.internal_product);
  data.append("transform", this.product.transform);
  data.append("photo", this.product.photo);
  data.append("unspsc_code", this.product.unspsc_code);
  data.append("purchase_price", this.product.purchase_price);
  data.append("regular_price", this.product.regular_price);
  data.append("sale_price", this.product.sale_price);
  data.append("commissionable", this.product.commissionable);
  data.append("commission", this.product.commission);
  
  data.append("presentation", this.product.presentation);
  data.append("composition", this.product.composition);
  data.append("gross_weight", this.product.gross_weight);
  data.append("weight_cost", this.product.weight_cost);

  data.append("people_who_bought_this", this.product.people_who_bought_this);
  data.append("people_who_see_this", this.product.people_who_see_this);
  data.append("outstanding", this.product.outstanding);
  data.append("offer", this.product.offer);
  data.append("web", this.product.web);

  data.append("state", this.product.state);

  me.isLoading = true;
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: { "Content-Type": "application/json", token: me.token, module: 'Product', role: 2,},
  })
    .then(function (response) {
      if (response.data.status == 201) {
        me.product.id_category = "";
        me.product.id_subcategory = "";
        me.product.id_brand = "";
        me.product.code = "";
        me.product.name = "";
        me.product.presentation = "";
        me.product.composition = "";
        me.product.short_name = "";
        me.product.barcode = "";
        me.product.description = "";
        me.product.existence_type = "01";
        me.product.unit_measure = "NIU";
        me.product.igv = "10";
        me.product.photo = "";
        me.product.internal_product = 0;
        me.product.transform = 0;
        me.product.commissionable = 0;
        me.product.commission = 0.00;
        me.product.photo = '';

        me.product.purchase_price = 0.00;
        me.product.regular_price = 0.00;
        me.product.sale_price = 0.00;
        me.product.gross_weight = 0.00;
        me.product.weight_cost = 0.00;

        me.product.people_who_bought_this = 0;
        me.product.people_who_see_this = 0;
        me.product.outstanding = 0;
        me.product.offer = 0;
        me.product.web = 0;
        me.product.state = 1;
        me.GetCorrelative();
        
        Swal.fire({ icon: 'success', text: 'Se ha registrado el nuevo producto', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: response.data.message, timer: 3000,})
      }
      me.isLoading = false;
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      me.isLoading = false;
    });
}

function Validate() {

  this.errors.id_category = this.product.id_category.length == 0 ? true : false;
  this.errors.id_brand = this.product.id_brand.length == 0 ? true : false;
  this.errors.name = this.product.name.length == 0 ? true : false;
  this.errors.code = this.product.code.length == 0 ? true : false;
  this.errors.state = this.product.state.length == 0 ? true : false;

  if (this.errors.id_category) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_brand) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.code) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.name) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.state) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

  let me = this;

  if (!this.validate) {
    Swal.fire({
      title: "Esta seguro de registrar el producto ?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Estoy de acuerdo!",
    }).then((result) => {
      if (result.value) {
        this.NewProduct();
      }
    });

  }

}
</script>

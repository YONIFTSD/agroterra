<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Producto - Nuevo</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>

                <b-col md="3">
                  <b-form-group>
                    <b-card-img src="https://loisjeans.id/skin/frontend/base/default/images/catalog/product/placeholder/image.jpg"></b-card-img>
                  </b-form-group>
                  <b-form-group>
                    <b-form-file @change="onFileChange" v-model="photo" placeholder="Seleccione un foto..." drop-placeholder="Suelta la imagen aquí..."></b-form-file>
                    <small v-if="errors.photo" class="form-text text-danger">Seleccione un foto</small>
                  </b-form-group>
                </b-col>

                <b-col md="9">

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
                        <select  ref="unit_measure" v-model="product.unit_measure" class="form-control" >
                          <option value="NIU">UNIDAD (BIENES)</option>
                          <option value="ZZ">UNIDAD (SERVICIOS)</option>
                        </select>
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
                      <b-form-group label="Peso Bruto :">
                        <b-form-input type="number" class="text-right" step="any" ref="gross_weight" v-model="product.gross_weight"></b-form-input>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label="Peso Costo :">
                        <b-form-input type="number" class="text-right" step="any" ref="weight_cost" v-model="product.weight_cost"></b-form-input>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label="Comisionable :">
                        <select ref="commissionable" v-model="product.commissionable" class="form-control">
                          <option value="1">SI</option>
                          <option value="0">NO</option>
                        </select>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label="Comisión :">
                        <b-form-input type="number" class="text-right" step="any" ref="commission" v-model="product.commission"></b-form-input>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label="Producto Interno :">
                        <select ref="internal_product" v-model="product.internal_product" class="form-control">
                          <option value="1">SI</option>
                          <option value="0">NO</option>
                        </select>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label="Codigo de Barras:">
                        <b-form-input type="text" v-model="product.barcode"></b-form-input>
                      </b-form-group>
                    </b-col>

                    <b-col md="9">
                      <b-form-group label="Proveedor :">
                      <v-select placeholder="Seleccione un proveedor" class="w-100" :filterable="false" label="name" v-model="mprovider" @search="SearchProvider" :options="providers"></v-select>
                      <small v-if="errors.id_provider" class="form-text text-danger">Seleccione un proveedor</small>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label="Estado :">
                        <select ref="state" v-model="product.state" class="form-control">
                          <option value="1">Activo</option>
                          <option value="0">Inactivo</option>
                        </select>
                      </b-form-group>
                    </b-col>

                        

                        <b-col md="3"></b-col>
                        <b-col md="6">
                          <b-button type="submit" class="form-control bg-primary text-white"  variant="primary" >GUARDAR</b-button >
                        </b-col>

                    </b-row>

                    
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

import vSelect from "vue-select";
import 'vue-select/dist/vue-select.css';
import "vue-select/src/scss/vue-select.scss";


const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState } from "vuex";

export default {
  name: "UsuarioAdd",
  components:{
      vSelect,
  },
  data() {
    return {
      module: "Product",
      role: 2,
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
        state: 1,
      },
      mprovider :{id:1, name:'Proveedor varios'},
      providers: [],
      categories: [],
      subcategories:[
        {value:'',text:'Ninguna'}
      ],
      brands: [],
      photo: null,
      //errors
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
  mounted() {
    this.ListCategories();
    this.ListBrands();
    this.GetCorrelative();
  },
  methods: {
    onFileChange,
    ListCategories,
    ListSubcategories,
    ListBrands,
    GetCorrelative,
    AddProduct,
    Validate,
    SearchProvider,
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

function onFileChange(e) {
  // e.preventDefault();
  this.product.photo = e.target.files[0];
}

function SearchProvider(search, loading) {
  
    let me = this;
    let url = this.url_base + "search-providers/" + search;
    if (search !== "") {
      loading(true);
      axios({
        method: "GET",
        url: url,
      }).then(function (response) {
            me.providers = response.data.result;
            loading(false);
      })
    }
    
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



function AddProduct(_this) {
 

  let me = _this;
  let url = me.url_base + "product/add";

  let data = new FormData();
  data.append("id_category", this.product.id_category);
  data.append("id_subcategory", this.product.id_subcategory);
  data.append("id_brand", this.product.id_brand);
  data.append("id_provider", me.mprovider.id);
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

  data.append("state", this.product.state);

  axios({
    method: "POST",
    url: url,
    data: data,
    headers: { "Content-Type": "application/json", token: me.token, module: me.module, role: 2,},
  })
    .then(function (response) {
      if (response.data.status == 201) {
        me.product.id_category = "";
        me.product.id_subcategory = "";
        me.product.id_brand = "";
        me.mprovider = {id:1, name:'Proveedor varios'};
        me.product.code = "";
        me.product.name = "";
        me.product.presentation = "";
        me.product.composition = "";
        me.product.short_name = "";
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
        
        me.photo = null;
        me.product.state = 1;
        me.GetCorrelative();
        
        Swal.fire({ icon: 'success', text: 'Se ha registrado el nuevo producto', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function Validate() {

  this.errors.id_category = this.product.id_category.length == 0 ? true : false;
  this.errors.id_brand = this.product.id_brand.length == 0 ? true : false;
  this.errors.id_provider = this.mprovider == null ? true : false;
  this.errors.name = this.product.name.length == 0 ? true : false;
  this.errors.code = this.product.code.length == 0 ? true : false;
  this.errors.state = this.product.state.length == 0 ? true : false;

  if (this.errors.id_category) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_brand) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_provider) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
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
        this.AddProduct(me);
      }
    });

  }

}
</script>

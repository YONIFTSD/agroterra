<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Producto - Editar</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>

                <b-col md="3">
                  <b-form-group>
                       <b-card-img :src="url_base + product.photo"></b-card-img>
                  </b-form-group>
                  <b-form-group>
                    <b-form-file @change="onFileChange" v-model="photo" placeholder="Seleccione un foto..." drop-placeholder="Suelta la imagen aquí..."></b-form-file>
                    <small v-if="errors.photo" class="form-text text-danger">Seleccione un foto</small>
                  </b-form-group>
                </b-col>

                <b-col md="9">
                  <b-tabs content-class="mt-3">
                    <b-tab title="Datos Principales" active>
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
                    </b-tab>
                    <b-tab title="Datos Secundarios">

                      <b-row>
                        <b-col md="3">
                          <b-form-group label="Comisionable :">
                            <b-form-select type="text" v-model="product.commissionable" :options="commissionable"></b-form-select>
                          </b-form-group>
                        </b-col>

                        <b-col md="3">
                          <b-form-group label="Comisión :">
                            <b-form-input type="number" class="text-right" step="any" ref="commission" v-model="product.commission"></b-form-input>
                          </b-form-group>
                        </b-col>

                        

                        <b-col md="3">
                          <b-form-group label="Peso Bruto :">
                            <b-form-input type="number" class="text-right" step="any" ref="gross_weight" v-model="product.gross_weight"></b-form-input>
                          </b-form-group>
                        </b-col>
                        
                       

                        <b-col md="3">
                          <b-form-group label="Web:">
                            <b-form-select type="text" v-model="product.web" :options="web"></b-form-select>
                          </b-form-group>
                        </b-col>

                        <b-col md="3">
                          <b-form-group label="P. destacado:">
                            <b-form-select type="text" v-model="product.outstanding" :options="outstanding"></b-form-select>
                          </b-form-group>
                        </b-col>

                        <b-col md="3">
                          <b-form-group label="Oferta:">
                            <b-form-select type="text" v-model="product.offer" :options="offer"></b-form-select>
                          </b-form-group>
                        </b-col>

                        <b-col md="3">
                          <b-form-group label="Compraron esto:">
                            <b-form-input type="number" step="any" v-model="product.people_who_bought_this"></b-form-input>
                          </b-form-group>
                        </b-col>

                        <b-col md="3">
                          <b-form-group label="Vieron esto:">
                            <b-form-input type="number" step="any" v-model="product.people_who_see_this"></b-form-input>
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

                        <b-col md="5"></b-col>
                            <b-col md="2">
                              <b-button type="submit" class="form-control"  variant="primary" ><i class="fas fa-save"></i> Guardar (F4)</b-button >
                            </b-col>
                      </b-row>
                    </b-tab>
                  </b-tabs>
                  

                    
                </b-col>
                
              </b-row>
            </b-form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <LoadingComponent :is-visible="isLoading"/>
    <Keypress key-event="keyup" :key-code="115" @success="Validate" />
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
  name: "ProductEdit",
  props: ["id_product"],
  components:{
      vSelect,
      Keypress: () => import('vue-keypress'),
      LoadingComponent,
  },
  data() {
    return {
      isLoading: false,
      module: "Product",
      role: 3,
     product: {
        id_category: "",
        id_subcategory: "",
        id_brand: "",
        id_provider: "",
        code: "",
        name: "",
        barcode: "",
        description: "",
        existence_type: "01",
        unit_measure: "NIU",
        igv: "10",
        internal_product: 0,
        transform: 0,
        photo: "",
        photo: "",
        unspsc_code:'23251602',
        commissionable: 0,
        commission: 0.0,
        purchase_price: 0.0,
        regular_price: 0.0,
        sale_price: 0.0,
        people_who_bought_this:0,
        people_who_see_this:0,
        outstanding:0,
        offer:0,
        web:0,
        state: 1,
      },
      mprovider :{id:1, name:'Proveedor varios'},
      providers: [],
      categories: [],
      subcategories:[
        {value:'0',text:'Ninguna'}
      ],
      brands: [],
      photo: null,
      commissionable:[
        {value:0,text:'NO'},
        {value:1,text:'SI - Importe'},
        {value:2,text:'SI - Porcentaje'},
      ],
      internal_product :[
        {value:0,text:'NO'},
        {value:1,text:'SI'},
      ],
      outstanding:[
        {value:0,text:'NO'},
        {value:1,text:'SI'},
      ],
      offer:[
        {value:0,text:'NO'},
        {value:1,text:'SI'},
      ],
      web:[
        {value:0,text:'NO'},
        {value:1,text:'SI'},
      ],
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
    this.ViewProduct();
  },
  methods: {
    onFileChange,
    ListCategories,
    ListSubcategories,
    ListBrands,
    ViewProduct,
    EditProduct,
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


function ListSubcategories() {
  if (this.product.id_category.length == 0) {
    this.subcategories = [{value:'0',text:'Ninguna'}];
    this.product.id_subcategory = '0';
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
      me.subcategories = [{value:'0',text:'Ninguna'}];
      if (response.data.status == 200) {
        for (let index = 0; index < response.data.result.length; index++) {
          const element = response.data.result[index];
           me.subcategories.push({value:element.id_subcategory,text:element.name});
        }
      }
    })
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


//ver usuario
function ViewProduct() {
  let id_product = je.decrypt(this.id_product);
  let me = this;
  let url = this.url_base + "product/view/" + id_product;
  me.isLoading = true;
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
        me.product.id_product = response.data.result.id_product;
        me.product.id_subcategory = response.data.result.id_subcategory;
        me.product.id_category = response.data.result.id_category;
        me.product.id_brand = response.data.result.id_brand;
        me.product.id_provider = response.data.result.id_provider;
        me.product.code = response.data.result.code;
        me.product.name = response.data.result.name;
        me.product.presentation = response.data.result.presentation;
        me.product.composition = response.data.result.composition;
        me.product.transform = response.data.result.transform;
        me.product.barcode = response.data.result.barcode;
        me.product.description = response.data.result.description;
        me.product.existence_type = response.data.result.existence_type;
        me.product.unit_measure = response.data.result.unit_measure;
        me.product.igv = response.data.result.igv;
        me.product.internal_product = response.data.result.internal_product;
        me.product.photo = response.data.result.photo;
        me.product.unspsc_code = response.data.result.unspsc_code;
        me.product.purchase_price = response.data.result.purchase_price;
        me.product.regular_price = response.data.result.regular_price;
        me.product.sale_price = response.data.result.sale_price;
        me.product.commissionable = response.data.result.commissionable;
        me.product.commission = response.data.result.commission;
        me.product.gross_weight = response.data.result.gross_weight;
        me.product.weight_cost = response.data.result.weight_cost;
        me.product.people_who_bought_this = response.data.result.people_who_bought_this;
        me.product.people_who_see_this = response.data.result.people_who_see_this;
        me.product.outstanding = response.data.result.outstanding;
        me.product.offer = response.data.result.offer;
        me.product.web = response.data.result.web;
        me.product.state = response.data.result.state;
        me.mprovider = {id: response.data.result.id_provider, name : response.data.result.provider_name}
        me.ListSubcategories();
        
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

//editar usuario
function EditProduct(_this) {

  let me = _this;
  let url = me.url_base + "product/edit";
  let data = new FormData();
  data.append("id_product", me.product.id_product);
  data.append("id_category", me.product.id_category);
  data.append("id_subcategory", me.product.id_subcategory);
  data.append("id_brand", me.product.id_brand);
  data.append("id_provider", me.mprovider.id);
  data.append("code", me.product.code);
  data.append("name", me.product.name);
  data.append("barcode", me.product.barcode);
  data.append("description", me.product.description);
  data.append("existence_type", me.product.existence_type);
  data.append("unit_measure", me.product.unit_measure);
  data.append("transform", me.product.transform);
  data.append("igv", me.product.igv);
  data.append("internal_product", me.product.internal_product);
  data.append("photo", me.product.photo);
  data.append("unspsc_code", me.product.unspsc_code);
  data.append("purchase_price", me.product.purchase_price);
  data.append("regular_price", me.product.regular_price);
  data.append("sale_price", me.product.sale_price);
  data.append("commissionable", me.product.commissionable);
  data.append("commission", me.product.commission);
  data.append("presentation", this.product.presentation);
  data.append("composition", this.product.composition);
  data.append("gross_weight", this.product.gross_weight);
  data.append("weight_cost", this.product.weight_cost);
  data.append("people_who_bought_this", this.product.people_who_bought_this);
  data.append("people_who_see_this", this.product.people_who_see_this);
  data.append("outstanding", this.product.outstanding);
  data.append("offer", this.product.offer);
  data.append("web", this.product.web);
  data.append("state", me.product.state);

  me.isLoading = true;
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      token: me.token,
      module: me.module,
      role: 3,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        Swal.fire({ icon: 'success', text: 'Se ha modificado el producto', timer: 3000,})
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

//validacion de formulario
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
      title: "Esta seguro de modificar el producto ?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Estoy de acuerdo!",
    }).then((result) => {
      if (result.value) {
        this.EditProduct(me);
      }
    });

  }

}
</script>

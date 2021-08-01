<template>
  <div>
    <b-modal size="xl" hide-footer v-model="modalProducts" class="w-100" title="Determinación de Precios">
      <b-form id="Form" @submit.prevent="Validate">
      <b-row>
        <b-col md="3">
          <b-form-group label="Código :">
            <b-form-input type="text" readonly v-model="product_price.code"></b-form-input>
          </b-form-group>
        </b-col>

        <b-col md="6">
          <b-form-group label="Nombre :">
            <b-form-input type="text" readonly v-model="product_price.name"></b-form-input>
          </b-form-group>
        </b-col>

        <b-col md="3">
          <b-form-group label="Marca :">
            <b-form-input type="text" readonly v-model="product_price.brand_name"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="3">
          <b-form-group label="Costo :">
            <b-form-input @change="CalculatePriceCost" type="number" step="any" class="text-right" v-model="product_price.purchase_price"></b-form-input>
            <small v-if="errors.purchase_price"  class="form-text text-danger" >Ingrese una costo</small>
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group label="Tipo de Cambio :">
            <b-form-input @change="CalculatePriceCost" type="number" step="any" class="text-right" v-model="product_price.exchange_rate"></b-form-input>
            <small v-if="errors.exchange_rate"  class="form-text text-danger" >Ingrese un tiempo de cambio</small>
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group label="Gastos :">
            <b-form-input @change="CalculatePriceCost" type="number" step="any" class="text-right" v-model="product_price.expenses"></b-form-input>
            <small v-if="errors.expenses"  class="form-text text-danger" >Ingrese un gasto</small>
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group label="Precio Final :">
            <b-form-input disabled @change="CalculatePriceCost" type="number" step="any" class="text-right" v-model="product_price.price_final"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>


      <b-row>
        <b-col md="4">
          <div class="table-responsive">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th class="text-center" colspan="5">Historial de Precios</th>
                  </tr>
                  <tr>
                    <th width="30%" class="text-center">Fecha</th>
                    <th width="20%" class="text-center">Moneda</th>
                    <th width="20%" class="text-center">T. C.</th>
                    <th width="20%" class="text-center">Precio</th>
                    <th width="10%" class="text-center">Acc.</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in history_prices" :key="it">
                  <tr>
                    <td class="text-center"> {{ item.broadcast_date }}</td>
                    <td class="text-center"> {{ item.coin }}</td>
                    <td class="text-right"> {{ item.exchange_rate }}</td>
                    <td class="text-right"> {{ item.unit_price }}</td>
                    <td class="text-center">
                      <b-button title="Seleccionar Precio" class="btn btn-sm" type="button" @click="SelectPrice(it)" variant="primary" ><i class="fas fa-check-square"></i></b-button>
                    </td>
                  </tr>
                </tbody>
              </table>
          </div>
        
        </b-col>
        <b-col md="4">
            <b-form-group  label-cols-sm="7" label="Gastos Fijos :" class="text-right">
              <b-form-input @change="DeterminatePriceFinal(1)" class="text-right" type="number" step="any" v-model="product_price.fixed_costs"></b-form-input>
            </b-form-group>
            <b-form-group  label-cols-sm="7" label="Utilidad Minima % :" class="text-right">
              <b-form-input @change="DeterminatePriceFinal(1)" class="text-right" type="number" step="any" v-model="product_price.minimal_utility"></b-form-input>
            </b-form-group>
            <b-form-group  label-cols-sm="7" label="Utilidad Maxima % :" class="text-right">
              <b-form-input @change="DeterminatePriceFinal(1)" class="text-right" type="number" step="any" v-model="product_price.maximum_utility"></b-form-input>
            </b-form-group>
            <b-form-group  label-cols-sm="7" label="Precio Regular :" class="text-right">
              <b-form-input class="text-right" type="number" step="any" v-model="product_price.regular_price"></b-form-input>
            </b-form-group>
        </b-col>
        <b-col md="4">
            <b-form-group  label-cols-sm="7" label="Costo Real + IGV :" class="text-right">
              <b-form-input @change="DeterminatePriceFinal(2)" class="text-right" type="number" step="any" v-model="product_price.real_cost"></b-form-input>
            </b-form-group>
            <b-form-group  label-cols-sm="7" label="Precio Minimo :" class="text-right">
              <b-form-input @change="DeterminatePriceFinal(2)" class="text-right" type="number" step="any" v-model="product_price.minimal_price"></b-form-input>
            </b-form-group>
            <b-form-group  label-cols-sm="7" label="Precio de Venta :" class="text-right">
              <b-form-input @change="DeterminatePriceFinal(2)" class="text-right" type="number" step="any" v-model="product_price.sale_price"></b-form-input>
            </b-form-group>
            <b-form-group  label-cols-sm="7" label="Precio Online :" class="text-right">
              <b-form-input class="text-right" type="number" step="any" v-model="product_price.online_price"></b-form-input>
            </b-form-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="8"> </b-col>
        <!-- <b-col md="2"> <b-button class="form-control" @click="DeterminatePriceFinal(1)" variant="primary" type="button">COMPRAS</b-button> </b-col> -->
        <b-col md="2"> <b-button class="form-control" @click="DeterminatePriceFinal(1)" variant="info" type="button">ACTUALIZAR</b-button> </b-col>
        <b-col md="2"> <b-button class="form-control" variant="primary" type="submit"><i class="fas fa-save"></i> Guardar (F4)</b-button> </b-col>
      </b-row>

      </b-form>
    </b-modal>

    <LoadingComponent :is-visible="isLoading"/>

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
import LoadingComponent from './../../pages/Loading'

export default {
  name: "ModalsProduct",
   components:{
    LoadingComponent,
  },
  data() {
    return {
        isLoading:false,
        modalProducts:false,
        module:'ProductPrice',
        role:3,
        history_prices: [],
        product_price: {
          id_product_price:0,
          id_establishment:0,
          id_product:0,

          purchase_price:0,
          exchange_rate:0,
          expenses:0,
          price_final:0,

          fixed_costs:0,
          minimal_utility:0,
          maximum_utility:0,

          real_cost:0,
          minimal_price:0,
          sale_price:0,

          regular_price:0,
          online_price:0,
         
        },

        errors:{
          price:false,
        }
    };
  },
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalProductPriceShow', (id_product) => {
      this.isLoading = true;
      this.modalProducts = true;
      this.product_price.id_product = id_product;
      this.ViewProductPrice();
      this.ViewHistoryProductPrice();
    });
    
  },
  methods: {
      ViewProductPrice,
      ViewHistoryProductPrice,
      CalculatePriceCost,
      DeterminatePriceFinal,
      Validate,
      SaveProductPrice,
      SelectPrice,
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

function ViewProductPrice() {
  
  let me = this;
  let url = this.url_base + "product/view-product-price/"+this.product_price.id_product+"/"+ this.id_establishment;

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role:this.role,},
  })
    .then(function (response) {
      
      if (response.data.status == 200) {
        me.product_price = response.data.result;
      } else {
        
      }
      me.isLoading = false;
    })

    
}

function ViewHistoryProductPrice() {
  
  let me = this;
  let url = this.url_base + "product/view-history-product-price/"+this.product_price.id_product;

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role:this.role,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.history_prices = response.data.result;
      } 
    })

    
}

function SelectPrice(index) {
  let price_product = parseFloat(this.history_prices[index].unit_price);
  let exchange_rate_usd = parseFloat(this.history_prices[index].exchange_rate_usd);

  this.product_price.purchase_price = price_product;
  if (this.history_prices[index].coin == "PEN") {
    this.product_price.exchange_rate = 1;
  }else{
    this.product_price.exchange_rate = exchange_rate_usd;
  }
  this.product_price.expenses = parseFloat(this.product_price.expenses);

  this.product_price.price_final = (this.product_price.purchase_price * this.product_price.exchange_rate) + this.product_price.expenses;

  this.product_price.purchase_price = this.product_price.purchase_price.toFixed(2);
  this.product_price.exchange_rate = this.product_price.exchange_rate.toFixed(2);
  this.product_price.expenses = this.product_price.expenses.toFixed(2);
  this.product_price.price_final = this.product_price.price_final.toFixed(2);
  this.DeterminatePriceFinal(1);
}

function CalculatePriceCost() {

  this.product_price.purchase_price = this.product_price.purchase_price.length == 0 ? 0 : parseFloat(this.product_price.purchase_price);
  this.product_price.exchange_rate = this.product_price.exchange_rate.length == 0 ? 1 : parseFloat(this.product_price.exchange_rate);
  this.product_price.expenses = this.product_price.expenses.length == 0 ? 0 : parseFloat(this.product_price.expenses);
  this.product_price.price_final = (this.product_price.purchase_price * this.product_price.exchange_rate) + this.product_price.expenses;

  this.product_price.purchase_price = this.product_price.purchase_price.toFixed(2);
  this.product_price.exchange_rate = this.product_price.exchange_rate.toFixed(2);
  this.product_price.expenses = this.product_price.expenses.toFixed(2);
  this.product_price.price_final = this.product_price.price_final.toFixed(2);
  this.DeterminatePriceFinal(1);
}

function DeterminatePriceFinal(type) {
  
  let price_final =  parseFloat(this.product_price.price_final);

  if (type == 1) {
      this.product_price.real_cost = price_final / (1 - (parseFloat(this.product_price.fixed_costs) / 100));
      this.product_price.minimal_price = price_final / (1 - (parseFloat(this.product_price.minimal_utility) / 100));
      this.product_price.sale_price = price_final / (1 - (parseFloat(this.product_price.maximum_utility) / 100));
  }
  if (type == 2) {
      this.product_price.fixed_costs = (1 - (price_final / parseFloat(this.product_price.real_cost)) )  * 100;
      this.product_price.minimal_utility = (1 - (price_final / parseFloat(this.product_price.minimal_price)) )  * 100;
      this.product_price.maximum_utility = (1 - (price_final / parseFloat(this.product_price.sale_price)) )  * 100;
  }

  this.product_price.real_cost = parseFloat(this.product_price.real_cost).toFixed(2);
  this.product_price.minimal_price = parseFloat(this.product_price.minimal_price).toFixed(2);
  this.product_price.sale_price = parseFloat(this.product_price.sale_price).toFixed(2);
  this.product_price.fixed_costs = parseFloat(this.product_price.fixed_costs).toFixed(2);
  this.product_price.minimal_utility = parseFloat(this.product_price.minimal_utility).toFixed(2);
  this.product_price.maximum_utility = parseFloat(this.product_price.maximum_utility).toFixed(2);


}

//Buscar productos
function SaveProductPrice(_this) {
  
  let me = _this;
  let url = me.url_base + "product/determine-price";
  me.product_price.id_establishment = me.id_establishment;
  let data = me.product_price;
  me.isLoading = true;
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: { token: me.token, module: me.module, role:me.role,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        EventBus.$emit('ListPriceProduct');
        me.modalProducts = false;
        me.isLoading = false;
        Swal.fire({ icon: 'success', text: 'Se ha determinado el precio del producto', timer: 3000,})
      }else{
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function Validate() {

  // this.errors.id_provider = this.provider == null || this.provider == {}  ? true : false;
  // if (this.errors.id_provider == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

  let me = this;

  Swal.fire({
    title: 'Esta seguro de guardar los precios?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      SaveProductPrice(me);
    }
  })
}
</script>

<template>
 <div class="col-md-12">
          <b-row>
            <b-col md="1">
              <b-form-group label="Registros">
                <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"></b-form-select>
              </b-form-group>
            </b-col>
            <b-col md="8">
            </b-col>
            <b-col md="3">
              <b-form-group label="Buscar" >
                <b-input-group>
                  <b-form-input id="filter-input" v-model="filter" type="search" placeholder="Buscar un producto"></b-form-input>
                  <b-input-group-append>
                    <b-button variant="primary" :disabled="!filter" @click="filter = ''">Limpiar</b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </b-col>
          </b-row>

          <!-- Main table element -->
          <b-table :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage"  :filter="filter" responsive="sm" :filter-included-fields="filterOn" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"  :sort-direction="sortDirection"  stacked="md" show-empty  small @filtered="onFiltered">

            <template  #cell(code)="row">
              <span>{{ row.item.code }}</span>
            </template>
            <template #cell(name)="row">
              <span class="text-left">{{ row.item.name }}</span>
            </template>
            <template #cell(quantity)="row">
              <b-input class="text-center" @change="UpdatePrices(row.item.index)" v-model="row.item.quantity"></b-input>
            </template>
            <template #cell(unit_price)="row">
              <b-input class="text-right" @change="UpdatePrices(row.item.index)" v-model="row.item.unit_price"></b-input>
            </template>
            <template #cell(total_price)="row">
              <span class="pr-2">{{ row.item.total_price }}</span>
            </template>

            <template #row-details="row">
              <b-card>
                <ul>
                  <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
                </ul>
              </b-card>
            </template>
          </b-table>

          <b-row>
            <b-col md="12" class="mt-3">
              <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="fill" size="sm" class="my-0"></b-pagination>
            </b-col>
          </b-row>
 </div>
</template>
<style>
tr .th-code {
  width: 7% !important;
}
tr .th-name {
  width: 65% !important;
}
tr .th-input {
  width: 10% !important;
}
tr .th-total-price {
  width: 8% !important;
}
</style>
<script>
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState,mapMutations,mapActions } from "vuex";
import EventBus from '@/assets/js/EventBus';

export default {
  name: "SaleDetail",
  data() {
    return {
        items: [
          { index:0, code: '00001100', name: 'Producto 1', quantity:0, unit_price:0, total_price:0 ,id_product:2},
          { index:1, code: '00001100', name: 'Producto 2', quantity:0, unit_price:0, total_price:0 ,id_product:2},
          { index:2, code: '00001100', name: 'Producto 3', quantity:0, unit_price:0, total_price:0 ,id_product:2},
          { index:3, code: '00001100', name: 'Producto 4', quantity:0, unit_price:0, total_price:0 ,id_product:2},
          { index:4, code: '00001100', name: 'Producto 5', quantity:0, unit_price:0, total_price:0 ,id_product:2},
          { index:5, code: '00001100', name: 'Producto 6', quantity:0, unit_price:0, total_price:0 ,id_product:2},
          { index:6, code: '00001100', name: 'Producto 7', quantity:0, unit_price:0, total_price:0 ,id_product:2},
          { index:7, code: '00001100', name: 'Producto 8', quantity:0, unit_price:0, total_price:0 ,id_product:2},
          { index:8, code: '00001100', name: 'Producto 9', quantity:0, unit_price:0, total_price:0 ,id_product:2},
          { index:9, code: '00001100', name: 'Producto 10', quantity:0, unit_price:0, total_price:0 ,id_product:2},
          { index:10, code: '00001100', name: 'Producto 11', quantity:0, unit_price:0, total_price:0 ,id_product:2},
          { index:11, code: '00001100', name: 'Producto 12', quantity:0, unit_price:0, total_price:0 ,id_product:2},
        ],
        fields: [
          { key: 'code', label: 'Código', sortable: true, class: 'text-center th-code', sortDirection: 'desc' },
          { key: 'name', label: 'Nombre', sortable: true, class: 'text-left th-name' },
          { key: 'quantity', label: 'Cantidad', sortable: true, class: 'text-center th-input' },
          { key: 'unit_price', label: 'P. Unit', sortable: true, class: 'text-center th-input' },
          { key: 'total_price', label: 'P. Total', sortable: true, class: 'text-right th-total-price'},
        ],
        totalRows: 1,
        currentPage: 1,
        perPage: 5,
        pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
        sortBy: '',
        sortDesc: false,
        sortDirection: 'asc',
        filter: null,
        filterOn: [],
    };
  },
  mounted() {
      this.totalRows = this.items.length
  },
  methods: {
    UpdatePrices(index){
      console.log(index);
      this.items[index].quantity = parseFloat(this.items[index].quantity);
      this.items[index].unit_price = parseFloat(this.items[index].unit_price);
      this.items[index].total_price = this.items[index].quantity * this.items[index].unit_price;
      this.items[index].unit_price = this.items[index].unit_price.toFixed(2);
      this.items[index].total_price = this.items[index].total_price.toFixed(2);
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    
  },
  computed: {
    sortOptions() {
        return this.fields
          .filter(f => f.sortable)
          .map(f => {
            return { text: f.label, value: f.key }
          })
    },
    ...mapState('InitialKardex',['initial_kardex_detail']),
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



</script>

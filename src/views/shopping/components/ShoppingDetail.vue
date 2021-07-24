<template>
  <div class="w-100">
        <div class="table-responsive mt-3">
              <table  class="table  table-bordered table-hover table-lg mt-lg mb-0">
                <thead >
                  <tr>
                    <th rowspan="2" width="3%" class="text-center">#</th>
                    <th rowspan="2" width="5%" class="text-center">Cod.</th>
                    <th rowspan="2" width="35%" class="text-center">Nombre</th>
                    <th rowspan="2" width="5%" class="text-center">UM</th>
                    <th rowspan="2" width="8%" class="text-center">Cantidad</th>
                    <th rowspan="2" width="9%" class="text-center">Imp. Unit.</th>
                    <th colspan="2" width="10%" class="text-center">Descuento</th>
                    <th rowspan="2" width="7%" class="text-center">V. Unit. <br> Neto</th>
                    <th rowspan="2" width="7%" class="text-center">Valor Total</th>
                    <th rowspan="2" width="8%" class="text-center">Bultos</th>
                    <th rowspan="2" width="5%" class="text-center"></th>
                  </tr>
                  <tr>
                    <th class="text-center">%</th>
                    <th class="text-center">Importe</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in shopping_detail" :key="item.id_product">
                  <tr>
                      <td class="align-middle text-center">{{ it + 1 }}</td>
                      <td class="align-middle text-left">{{ item.code }}</td>
                      <td class="align-middle text-left">{{ item.name +" - "+item.presentation }}</td>
                      <td class="align-middle text-center">{{ item.unit_measure }}</td>
                      <td class="align-middle text-center">
                        <input type="number" @change="EditDetail(item.id_product)" class="form-control text-center" v-model="item.quantity">
                      </td>
                      <td class="align-middle text-center">
                        <input type="number" step="any" @change="EditDetail(item.id_product)" class="form-control text-right" v-model="item.unit_value">
                      </td>
                      <td class="align-middle text-center">
                        <input type="number" step="any" @change="EditDetail(item.id_product)" class="form-control text-right" v-model="item.percentage_discount">
                      </td>
                      <td class="align-middle text-right">{{ item.unit_discount }}</td>
                      <td class="align-middle text-right">{{ item.net_unit_value }}</td>
                      <td class="align-middle text-right">{{ item.net_total_value }}</td>
                      <td class="align-middle text-center">
                        <input type="number" @change="EditDetail(item.id_product)" class="form-control text-right" v-model="item.package">
                      </td>
                      <td class="align-middle text-center">
                        <button type="button" @click="DeleteDetail(item.id_product)" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button>  
                      </td>

                  </tr>
                </tbody>
              </table>
            </div>
  </div>
</template>
<style scoped>
.table-responsive{
  min-height: 15px !important;
}
</style>
<script>
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState,mapMutations,mapActions } from "vuex";
import EventBus from '@/assets/js/EventBus';

export default {
  name: "ShoppingDetail",
  data() {
    return {

    };
  },
  mounted() {
    EventBus.$on('AddInputDetail', (detail) => {
      this.AddDetail(detail)
    });
    EventBus.$on('ResetInputDetail', () => {
      this.input_detail = [];
    });
    EventBus.$on('cInputDetail', (detail) => {
      this.input_detail = detail;
    });
  
  },
  methods: {
    EditDetail,
    DeleteDetail,
    ...mapActions('Shopping',['mLoadEditShoppingDetail']),
    ...mapActions('Shopping',['mLoadDeleteShoppingDetail']),
    
  },
  computed: {
    ...mapState('Shopping',['shopping_detail']),
    
    
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


function EditDetail(id_product) {
  let name = '';
  for (let index = 0; index < this.shopping_detail.length; index++) {
    const element = this.shopping_detail[index];
    if (element.id_product == id_product) {
      name = element.name + ' - ' +element.presentation;
      break;
    }
  }
  this.$notify({ group: 'alert', title: 'Sistema', text:'Se ha modificado el producto ' + name, type: 'warn'})
  this.mLoadEditShoppingDetail(id_product)
}

function DeleteDetail(id_product) {
  let name = '';
  for (let index = 0; index < this.shopping_detail.length; index++) {
    const element = this.shopping_detail[index];
    if (element.id_product == id_product) {
      name = element.name + ' - ' +element.presentation;
      break;
    }
  }
  this.$notify({ group: 'alert', title: 'Sistema', text:'Se ha eliminado el producto ' + name, type: 'warn'})
  this.mLoadDeleteShoppingDetail(id_product)
}
</script>

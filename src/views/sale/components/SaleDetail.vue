<template>
  <div class="w-100">
        <div class="table-responsive mt-3">
              <table  class="table  table-bordered table-hover table-lg mt-lg mb-0">
                <thead>
                  <tr>
                    <th width="5%" class="text-center">#</th>
                    <th width="8%" class="text-center">Codigo</th>
                    <th width="45%" class="text-center">Nombre</th>
                    <th width="5%" class="text-center">UM</th>
                    <th width="10%" class="text-center">Cantidad</th>
                    <th width="10%" class="text-center">P. Unit</th>
                    <th width="8%" class="text-center">P. Total</th>
                    <th width="5%" class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in sale_detail" :key="item.id_product">
                  <tr>
                      <td class="align-middle text-center">{{ it + 1 }}</td>
                      <td class="align-middle text-left">{{ item.code }}</td>
                      <td class="align-middle text-left">{{ item.name +" - "+item.presentation }}</td>
                      <td class="align-middle text-center">{{ item.unit_measure }}</td>
                      <td class="align-middle text-center">
                        <input :disabled="type_invoice == '07' && !(reason == '07')" type="number" @change="EditDetail(item.id_product)" class="form-control text-center" v-model="item.quantity">
                      </td>
                      <td class="align-middle text-center">
                        <input :disabled="(type_invoice == '07')" type="number" step="any" @change="EditDetail(item.id_product)" class="form-control text-right" v-model="item.unit_price">
                      </td>
                      <td class="align-middle text-right">{{ item.total_price }}</td>
                      <td class="align-middle text-center">
                        <button :disabled="type_invoice == '07' && !(reason == '07')" type="button" @click="DeleteDetail(item.id_product)" class="btn btn-danger"><i class="fas fa-trash-alt"></i></button>  
                      </td>

                  </tr>
                </tbody>
              </table>
        </div>
  </div>
</template>
<style scoped>
</style>
<script>
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState,mapMutations,mapActions } from "vuex";
import EventBus from '@/assets/js/EventBus';

export default {
  name: "SaleDetail",
   props: ["type_invoice","reason"],

  data() {
    return {

    };
  },
  mounted() {

  },
  methods: {
    EditDetail,
    DeleteDetail,
    ...mapActions('Sale',['mLoadEditSaleDetail']),
    ...mapActions('Sale',['mLoadDeleteSaleDetail']),
    
  },
  computed: {
    ...mapState('Sale',['sale_detail']),
    
    
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
  for (let index = 0; index < this.sale_detail.length; index++) {
    const element = this.sale_detail[index];
    if (element.id_product == id_product) {
      name = element.name + ' - ' +element.presentation;
      break;
    }
  }
  this.$notify({ group: 'alert', title: 'Sistema', text:'Se ha modificado el producto ' + name, type: 'warn'})
  this.mLoadEditSaleDetail(id_product);
  EventBus.$emit('TotalPaymentCash');
  EventBus.$emit('ChangeFeesCollectedModal');
}

function DeleteDetail(id_product) {
  let name = '';
  for (let index = 0; index < this.sale_detail.length; index++) {
    const element = this.sale_detail[index];
    if (element.id_product == id_product) {
      name = element.name + ' - ' +element.presentation;
      break;
    }
  }
  this.$notify({ group: 'alert', title: 'Sistema', text:'Se ha eliminado el producto ' + name, type: 'warn'})
  this.mLoadDeleteSaleDetail(id_product);
  EventBus.$emit('TotalPaymentCash');
  EventBus.$emit('ChangeFeesCollectedModal');
}
</script>

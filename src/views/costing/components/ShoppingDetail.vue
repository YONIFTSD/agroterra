<template>
  <div class="col-md-12">
        <div class="table-responsive mt-3">
              <table  class="table  table-bordered table-hover table-lg mt-lg mb-0">
                <thead >
                  <tr>
                    <th  width="3%" class="text-center">#</th>
                    <th  width="5%" class="text-center">Cod.</th>
                    <th  width="35%" class="text-center">Nombre</th>
                    <th  width="5%" class="text-center">UM</th>
                    <th  width="8%" class="text-center">Cantidad</th>
                    <th  width="7%" class="text-center">V. Unit.</th>
                    <th  width="7%" class="text-center">V. Total</th>
                    <th  width="7%" class="text-center">C. Unit</th>
                    <th  width="7%" class="text-center">C. Total</th>
                    <th  width="7%" class="text-center">CU + IGV</th>
                    <th  width="7%" class="text-center">CT + IGV</th>
                    <th  width="6%" class="text-center">Bultos</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in costing_detail" :key="item.id_product">
                  <tr>
                      <td class="align-middle text-center">{{ it + 1 }}</td>
                      <td class="align-middle text-left">{{ item.code }}</td>
                      <td class="align-middle text-left">{{ item.name }}</td>
                      <td class="align-middle text-center">{{ item.unit_measure }}</td>
                      <td class="align-middle text-right">{{ item.quantity }}</td>
                      <td class="align-middle text-right">{{ item.net_unit_value }}</td>
                      <td class="align-middle text-right">{{ item.net_total_value }}</td>
                      <td class="align-middle text-right">{{ item.unit_cost }}</td>
                      <td class="align-middle text-right">{{ item.total_cost }}</td>
                      <td class="align-middle text-right">{{ item.unit_cost_final }}</td>
                      <td class="align-middle text-right">{{ item.total_cost_final }}</td>
                      <td class="align-middle text-center">{{ item.package }}</td>
            

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
    ...mapActions('Costing',['mLoadEditCostingDetail']),
    ...mapActions('Costing',['mLoadDeleteCostingDetail']),
    
  },
  computed: {
    ...mapState('Costing',['costing_detail']),
    
    
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
  this.mLoadEditShoppingDetail(id_product)
}

function DeleteDetail(id_product) {
this.mLoadDeleteShoppingDetail(id_product)
}
</script>

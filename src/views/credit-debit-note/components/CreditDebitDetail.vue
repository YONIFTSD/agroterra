<template>
  <div class="col-md-12">
        <div class="table-responsive mt-3">
              <table  class="table  table-bordered table-hover table-lg mt-lg mb-0">
                <thead >
                  <tr>
                    <th width="3%" class="text-center">#</th>
                    <th width="6%" class="text-center">Cod.</th>
                    <th width="42%" class="text-center">Nombre</th>
                    <th width="8%" class="text-center">Cantidad</th>
                    <th width="9%" class="text-center">V. Unit.</th>
                    <th width="9%" class="text-center">P. Unit</th>
                    <th width="6%" class="text-center">V. Total</th>
                    <th width="6%" class="text-center">P. Total</th>
                    <th width="5%" class="text-center"></th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in credit_debit_detail" :key="it">
                  <tr>
                      <td class="align-middle text-center">{{ it + 1 }}</td>
                      <td class="align-middle text-left">{{ item.code }}</td>
                      <td class="align-middle text-left">
                        <input type="text" class="form-control" v-model="item.name">
                      </td>
                      <td class="align-middle text-center">
                        <input type="number" @change="EditDetail(it)" class="form-control text-center" v-model="item.quantity">
                      </td>
                      <td class="align-middle text-center">
                        <input type="number" step="any" @change="EditDetail(it,1)" class="form-control text-right" v-model="item.unit_value">
                      </td>
                      <td class="align-middle text-center">
                        <input type="number" step="any" @change="EditDetail(it,2)" class="form-control text-right" v-model="item.unit_price">
                      </td>
                      <td class="align-middle text-right">{{ item.total_value }}</td>
                      <td class="align-middle text-right">{{ item.total_price }}</td>
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
    ...mapActions('CreditDebitNote',['mLoadEditCreditDebitDetail']),
    ...mapActions('CreditDebitNote',['mLoadDeleteCreditDebitDetail']),
    
  },
  computed: {
    ...mapState('CreditDebitNote',['credit_debit_detail']),
    
    
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


function EditDetail(index,type) {
  let name = this.credit_debit_detail[index].name;
  this.$notify({ group: 'alert', title: 'Sistema', text:'Se ha modificado el producto ' + name, type: 'warn'})
  let data = { index:index,type:type };
  this.mLoadEditCreditDebitDetail(data)
}

function DeleteDetail(index) {
  let name = this.credit_debit_detail[index].name;
  this.$notify({ group: 'alert', title: 'Sistema', text:'Se ha eliminado el producto ' + name, type: 'warn'})
  this.mLoadDeleteCreditDebitDetail(index)
}
</script>

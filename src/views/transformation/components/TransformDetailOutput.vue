<template>
  <div class="col-md-12">
        <div class="table-responsive mt-3">
              <table  class="table  table-bordered table-hover table-lg mt-lg mb-0">
                <thead class="">
                  <tr>
                    <th width="5%" class="text-center">#</th>
                    <th width="8%" class="text-center">Codigo</th>
                    <th width="45%" class="text-center">Nombre</th>
                    <th width="5%" class="text-center">UM</th>
                    <th width="8%" class="text-center">Cantidad</th>
                    <th width="8%" class="text-center">Capacidad</th>
                    <th width="7%" class="text-center">Cap. Total</th>
                    <th width="5%" class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in transform_output_detail" :key="item.id_product">
                  <tr>
                      <td class="align-middle text-center">{{ it + 1 }}</td>
                      <td class="align-middle text-left">{{ item.code }}</td>
                      <td class="align-middle text-left">{{ item.name + " - "+item.presentation }}</td>
                      <td class="align-middle text-center">{{ item.unit_measure }}</td>
                      <td class="align-middle text-center">
                        <input type="number" min="1" @change="EditDetail(it)" class="form-control text-center" v-model="item.quantity">
                      </td>
                      <td class="align-middle text-center">
                        <input type="number" min="0" step="any" @change="EditDetail(it)" class="form-control text-right" v-model="item.capacity">
                      </td>
                      <td class="align-middle text-right">{{ item.total_capacity }}</td>
                      <td class="align-middle text-center">
                        <button type="button" @click="DeleteDetail(it)" class="btn btn-danger"><i class="fas fa-trash-alt"></i></button>  
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
  name: "SaleDetail",
  data() {
    return {

    };
  },
  mounted() {

  },
  methods: {
    EditDetail,
    DeleteDetail,
    ...mapActions('Transform',['mLoadEditTransformOutputDetail']),
    ...mapActions('Transform',['mLoadDeleteTransformOutputDetail']),
    
  },
  computed: {
    ...mapState('Transform',['transform_output_detail']),
    
    
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


function EditDetail(index) {
  this.mLoadEditTransformOutputDetail(index)
}

function DeleteDetail(index) {
this.mLoadDeleteTransformOutputDetail(index)
}
</script>

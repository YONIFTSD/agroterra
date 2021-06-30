<template>
  <div class="w-100">
        <div class="table-responsive mt-3">
              <table  class="table  table-bordered table-hover table-lg mt-lg mb-0">
                <thead class="">
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
                <tbody v-for="(item, it) in shopping_detail" :key="item.id_product">
                  <tr>
                      <td class="align-middle text-center">{{ it + 1 }}</td>
                      <td class="align-middle text-left">{{ item.code }}</td>
                      <td class="align-middle text-left">{{ item.name }}</td>
                      <td class="align-middle text-center">{{ item.unit_measure }}</td>
                      <td class="align-middle text-center">
                        <input type="number" @change="EditDetail(item.id_product)" class="form-control text-center" v-model="item.quantity">
                      </td>
                      <td class="align-middle text-center">
                        <input type="number" @change="EditDetail(item.id_product)" class="form-control text-right" v-model="item.unit_price">
                      </td>
                      <td class="align-middle text-right">{{ item.total_price }}</td>
                      <td class="align-middle text-center">
                        <button type="button" @click="DeleteDetail(item.id_product)" class="btn btn-danger"><i class="fas fa-trash-alt"></i></button>  
                      </td>

                  </tr>
                </tbody>
              </table>
            </div>
  </div>
</template>

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
    AddDetail,
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

function AddDetail() {
  
}

function EditDetail(id_product) {
  this.mLoadEditShoppingDetail(id_product)
}

function DeleteDetail(id_product) {
this.mLoadDeleteShoppingDetail(id_product)
}
</script>

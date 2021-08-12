<template>
  <div>
    <b-modal size="xl" hide-footer v-model="modalRequirement" class="w-100" title="Requerimientos">
      <b-row>
        <b-col md="12">
          <b-form-group label="Buscar Requerimiento :">
            <b-form-input type="text" ref="search" v-model="search" @keyup="ListRequirementsPending"></b-form-input>
            
          </b-form-group>
        </b-col>
        <b-col md="12">
          <div class="table-responsive mt-3">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th width="5%" class="text-center">#</th>
                    <th width="15%" class="text-center">Fecha</th>
                    <th width="20%" class="text-center">Comprobante</th>
                    <th width="50%" class="text-center">Establecimiento que solicito</th>
                    <th width="10%" class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="item.id_input">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-center"> {{ item.broadcast_date }}</td>
                    <td class="text-center"> {{ CodeInvoice(item.type_invoice)+ ' '+item.serie+'-'+item.number }}</td>
                    <td class="text-left"> {{ item.establishment_name }}</td>
                    <td class="text-center">
                      <b-button type="button" @click="ViewRequirement(item.id_requirement)" variant="primary">
                        <i class="fas fa-eye"></i>
                      </b-button>

                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
        </b-col>
      </b-row>

      <b-row class="mt-4">
              <b-col md="8">
                <b-pagination v-model="currentPage" v-on:input="ListRequirementsPending" :total-rows="rows" :per-page="perPage" align="center"></b-pagination>
              </b-col>
              <b-col md="4 text-center">
                <p>Pagina Actual: {{ currentPage }}</p>
              </b-col>
            </b-row>
    </b-modal>
  </div>
</template>
<style>



</style>
<script>
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState,mapActions } from "vuex";
import EventBus from "@/assets/js/EventBus";
import CodeToName from "@/assets/js/CodeToName";
export default {
  name: "ModalsProduct",
  data() {
    return {
        modalRequirement:false,
        module: 'Requirement',
        perPage: 15,
        currentPage: 1,
        rows: 0,
        data_table: [],
        role:2,
        search:'',
    };
  },
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalRequirementsShow', () => {
      this.modalRequirement = true;
      this.role = 1;
      this.ListRequirementsPending();
    });
    
  },
  methods: {
      ListRequirementsPending,
      CodeInvoice,
      ViewRequirement,

        ...mapActions('Output',['mLoadAddLinkageOutput','mLoadAddOutputDetail']),
      
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
function CodeInvoice(code) {
  return CodeToName.CodeInvoice(code);
}

function ListRequirementsPending() {


  let search = this.search == "" ? "all" : this.search;
  let me = this;
  let url = this.url_base + "requirement/list-pending/" + this.id_establishment + "/" + search + "?page=" + this.currentPage;


  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module,role: 1,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.rows = response.data.result.total;
        me.data_table = response.data.result.data;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function ViewRequirement(id_requirement) {
 let route = this.$router.resolve({
    name: "RequirementView",
    params: { id_requirement: je.encrypt(id_requirement) },
  });
  window.open(route.href, '_blank');
}
//Buscar productos
function SearchProducts() {
  let me = this;
  let search = this.search == "" ? "all" : this.search;
  let url = this.url_base + "search-products-stock/"+this.id_establishment+"/"+ search;

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.products = response.data.result;
      } else {
        me.products = [];
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      
    });
}
</script>

<template>
  <div>
    <b-modal size="xl" hide-footer v-model="modalTransfers" class="w-100" title="Salida por Transferencias">
      <b-row>
        <b-col md="12">
          <b-form-group label="Buscar Transferencia :">
            <b-form-input type="text" ref="search" v-model="search" @keyup="ListTransfers"></b-form-input>
            
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
                    <th width="35%" class="text-center">Establecimiento</th>
                    <th width="15%" class="text-center">Usuario</th>
                    <th width="10%" class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="item.id_input">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-center"> {{ item.broadcast_date }}</td>
                    <td class="text-center"> {{ CodeInvoice(item.type_invoice)+ ' '+item.serie+'-'+item.number }}</td>
                    <td class="text-left"> {{ item.establishment_name }}</td>
                    <td class="text-left"> {{ item.user }}</td>
                    <td class="text-center">
                      <b-button type="button" @click="ViewOutput(item.id_output)" variant="warning">
                        <i class="fas fa-eye"></i>
                      </b-button>
                      <b-button type="button" @click="AddTransfer(item.id_output)" variant="primary">
                        <i class="fas fa-plus-square"></i>
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
                <b-pagination v-model="currentPage" v-on:input="ListTransfers" :total-rows="rows" :per-page="perPage" align="center"></b-pagination>
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
        modalTransfers:false,
        module: 'Input',
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
    EventBus.$on('ModalTransfersShow', (role) => {
      this.modalTransfers = true;
      this.role = role;
      this.ListTransfers();
    });
    
  },
  methods: {
      ListTransfers,
      CodeInvoice,
      AddTransfer,
      ViewOutput,

        ...mapActions('Input',['mLoadAddLinkageInput','mLoadAddInputDetail']),
      
  },
  computed: {
    ...mapState(["url_base"]),
    ...mapState('Input',['linkages']),
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

function ListTransfers() {


  let search = this.search == "" ? "all" : this.search;
  let me = this;
  let url = this.url_base + "output/list-transfers/" + this.id_establishment + "/" + search + "?page=" + this.currentPage;


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

function AddTransfer(id_output) {
    let me = this;
    let url = this.url_base + "output/view/" + id_output;

    axios({
      method: "GET",
      url: url,
      headers: { token: this.token, module: this.module, role: this.role, },
    })
    .then(function (response) {
      if (response.data.status == 200) {
         let val_add = true;
         if (me.linkages.length > 0) {
           return false;
         }
        for (let index = 0; index < me.linkages.length; index++) {
          const element =  me.linkages[index];
          if (element.module == "Salida" && element.id_module == response.data.result.output.id_output) {
            val_add = false;
          }
        }
        if (val_add) {
          let linkage = {
            id_module: response.data.result.output.id_output,
            module: 'Salida',
            broadcast_date: response.data.result.output.broadcast_date,
            reference: CodeInvoice(response.data.result.output.type_invoice) + " " + response.data.result.output.serie + "-"+response.data.result.output.number,
          }
          let data = {
            type_invoice :  response.data.result.output.type_invoice,
            serie :  response.data.result.output.serie,
            number :  response.data.result.output.number,
            provider : {id:response.data.result.output.id_provider, name : response.data.result.output.provider_name + " - "+ response.data.result.output.provider_document_number} ,
          };
          EventBus.$emit('DataTransference',data);

          me.mLoadAddLinkageInput(linkage);

          let output_detail = response.data.result.output_detail;
          for (let index = 0; index < output_detail.length; index++) {
            const element = output_detail[index];
            let detail = {
              id_product: element.id_product,
              code: element.code,
              name: element.name,
              presentation: element.presentation,
              unit_measure: element.unit_measure,
              igv: element.igv,
              existence_type: element.existence_type,
              quantity: element.quantity,
              package: 0,
              expiration_date: '',

            }
            
            me.mLoadAddInputDetail(detail);
          }   
          
          me.$notify({ group: 'alert', title: 'Sistema', text:'Se ha adjuntado la transferencia ', type: 'success'})
        }else{
          me.$notify({ group: 'alert', title: 'Sistema', text:'La transferencia seleccionado ya se adjunto', type: 'warn'})
        }
        
        

        
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      console.log(error);
      // Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });

   
}

function ViewOutput(id_output) {
  let route = this.$router.resolve({
    name: "OutputView",
    params: { id_output: je.encrypt(id_output) },
  });
  window.open(route.href, '_blank');

  
}

</script>

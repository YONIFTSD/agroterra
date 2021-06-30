<template>
  <div>
    <b-modal size="md" class="modal-size" hide-footer v-model="modal_cpe_sunat" title="CPE SUNAT">
      <b-row>
        <b-col md="12">
 <b-form @submit.prevent="SearchVoucherSunat">
              <b-row>
                <b-col md="6">
                  <b-form-group label="Ruc del emisor :">
                    <b-form-input v-model="cpe.ruc_issuer" type="number" placeholder="Ingrese el ruc" required></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="Tipo de Comprobante:">
                    <b-form-select v-model="cpe.type_invoice" :options="type_invoice" required></b-form-select>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="Serie:">
                    <b-form-input v-model="cpe.serie" type="text" placeholder="Ingrese la serie" required></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="Numero:">
                    <b-form-input v-model="cpe.number" type="text" placeholder="Ingrese el numero" required></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="Fecha de Emisión:">
                    <b-form-input v-model="cpe.broadcast_date" class="text-center" type="date" placeholder="Seleccione una fecha" required></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="Total:">
                    <b-form-input v-model="cpe.total" class="text-right" type="number" step="any" placeholder="Ingrese un monto" required></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="12">
                  <b-form-group>
                    <b-button type="submit" class="form-control" variant="primary">Buscar</b-button>
                  </b-form-group>
                </b-col>
              </b-row>
              
        </b-form>
        </b-col>
      </b-row>
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
import { mapState } from "vuex";
import EventBus from "@/assets/js/EventBus";
var moment = require("moment");
import CodeToName from "@/assets/js/CodeToName";
import LoadingComponent from './../pages/Loading'
export default {
  name: "ModalClient",
    components:{
      LoadingComponent,
  },
  data() {
    return {
      isLoading: false,
        modal_cpe_sunat: false,
        cpe: {
          ruc_issuer: '',
          type_invoice: '03',
          serie: '',
          number: '',
          document_type: '',
          document_number: '',
          broadcast_date: '',
          total: 0,
        },
        type_invoice:[
          { value: '01', text:'01 - FACTURA ELECTRÓNICA'},
          { value: '03', text:'03 - BOLETA DE VENTA ELECTRÓNICA'},
          { value: '07', text:'07 - NOTA DE CRÉDITO ELECTRÓNICA'},
          { value: '08', text:'08 - NOTA DE DÉBITO ELECTRÓNICA'},
        ],
        document_type:[
          { value: '', text:'SIN DOCUMENTO'},
          { value: '1', text:'1 - DNI - DOC. NACIONAL DE IDENTIDAD'},
          { value: '6', text:'6 - RUC - REGISTRO ÚNICO DE CONTRIBUYENTE'},
        ],
    };
  },
  created (){
  
  },
  mounted () {
    EventBus.$on('ModalCPESunatShow', () => {
      this.modal_cpe_sunat = true;
    });
  },
  methods: {
    SearchVoucherSunat,
    CodeInvoice,
  },
  computed: {
    ...mapState(["url_base"]),
    token: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.api_token;
    }
  },
};
function CodeInvoice(code) {
  return CodeToName.CodeInvoice(code);
}

function SearchVoucherSunat() {
  this.isLoading = true;
  let me = this;
  let url = "https://apis.reyfact.com/cpe-validate-voucher";
  let data = {
    token : 'WiVRjaW02IXGC070tOEdjehzrbd0rYOAso1baByj',
    ruc : this.cpe.ruc_issuer,
    type_invoice : this.cpe.type_invoice,
    serie : this.cpe.serie,
    number : this.cpe.number,
    broadcast_date : moment(this.cpe.broadcast_date).local().format("DD/MM/YYYY"),
    total : this.cpe.total,
  }
  axios({
    method: "POST",
    url: url,  
    data: data,  
    headers: {"Content-Type": "application/json", },
    
  })
    .then(function (response) {
      if (response.data.success) {
        
        if (response.data.data.estadoCp == 0) {
           let info = "El comprobante "+me.CodeInvoice(me.cpe.type_invoice)+" "+me.cpe.serie+"-"+me.cpe.number+" no ha sido informado."
           Swal.fire({ icon: 'error', text: info})
        }else if(response.data.data.estadoCp == 1){
          let info = "El comprobante "+me.CodeInvoice(me.cpe.type_invoice)+" "+me.cpe.serie+"-"+me.cpe.number+" es un comprobante aceptado."
           Swal.fire({ icon: 'success', text: info})
        }else if(response.data.data.estadoCp == 2){
          let info = "El comprobante "+me.CodeInvoice(me.cpe.type_invoice)+" "+me.cpe.serie+"-"+me.cpe.number+" ha sido comunicado de baja."
           Swal.fire({ icon: 'warning', text: info})
        }else if(response.data.data.estadoCp == 3){
          let info = "El comprobante "+me.CodeInvoice(me.cpe.type_invoice)+" "+me.cpe.serie+"-"+me.cpe.number+" es un comprobante autorizado de la imprenta."
           Swal.fire({ icon: 'success', text: info})
        }else if(response.data.data.estadoCp == 4){
          let info = "El comprobante "+me.CodeInvoice(me.cpe.type_invoice)+" "+me.cpe.serie+"-"+me.cpe.number+" es un omprobante no autorizado de la imprenta."
           Swal.fire({ icon: 'warning', text: info})
        }
       
      }else{
        Swal.fire({ icon: 'error', text: 'A ocurrido un error'})
      }
      me.isLoading = false;
       
    })
    .catch((error) => {
      me.isLoading = false;
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}
</script>

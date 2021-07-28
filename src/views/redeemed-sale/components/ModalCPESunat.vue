<template>
  <div>
    <b-modal size="md" hide-footer v-model="modal_cpe_sunat" class="w-100" title="CPE SUNAT">
      <b-row>
        <b-col md="4" class="text-center">
          <b-button @click="DownloadResource('XML')" class="text-center" variant="primary">
            <img class="img-fluid" src="@/assets/icons/xml.png"/>
            <b-col md="12">
              <label class="text-center mt-2">Descargar <br> XML</label>
            </b-col>
          </b-button>
        </b-col>
        <b-col md="4" class="text-center">
          <b-button @click="DownloadResource('CDR')" class="text-center" variant="primary">
            <img class="text-center" src="@/assets/icons/cdr.png"/>
            <b-col md="12">
              <label class="text-center mt-2">Descargar <br> CDR</label>
            </b-col>
          </b-button>
        </b-col>
        <b-col md="4" class="text-center">
          <b-button @click="DownloadResource('PDF')" class="text-center" variant="primary">
            <img class="text-center" src="@/assets/icons/pdf.png"/>
            <b-col md="12">
              <label class="text-center mt-2">Descargar <br> PDF</label>
            </b-col>
          </b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="12" class="mt-3">
          <b-form-group label="Mensaje Sunat">
             <b-alert variant="success" show>{{sale.sunat_message}}</b-alert>
          </b-form-group>
        </b-col>
        <b-col md="12">
          <b-form-group label="Enviar por correo electrónico">
            <b-input-group>
            <b-form-input type="email" v-model="sale.email" class="form-control"></b-form-input>
            <b-input-group-append>
              <b-button @click="SendEmail" variant="primary"><i class="far fa-paper-plane"></i></b-button>
            </b-input-group-append>
          </b-input-group>
          </b-form-group>
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
import { mapState,mapActions } from "vuex";
import EventBus from "@/assets/js/EventBus";

import LoadingComponent from './../../pages/Loading'


export default {
  name: "ModalsProduct",
  components:{
      LoadingComponent,
  },
  data() {
    return {
        isLoading: false,
        modal_cpe_sunat:false,
        module:'Sale',
        id_sale:0,
        role:1,
        sale:{
          id_sale:'',
          sunat_message:'',
          email :'',
        }
    };
  },
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalCPESunatShow', (id_sale) => {
      this.modal_cpe_sunat = true;
      this.id_sale = id_sale;
      this.ViewSale();
    });
    
  },
  methods: {
      ViewSale,
      DownloadResource,
      SendEmail,
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

function ViewSale() {
  let me = this;
  let url = me.url_base + "sale/view/"+this.id_sale;
  axios({
    method: "GET",
    url: url,
    headers: {"Content-Type": "application/json", token: me.token, module: me.module,role: me.role, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.sale.sunat_message = response.data.result.sunat_message;
        me.sale.state = response.data.result.state;
        me.sale.id_sale = response.data.result.id_sale;
        me.sale.email = response.data.result.email;
      }
    })
   
}


function DownloadResource(resource) {
  let url = this.url_base + "sale-download-resource/"+this.id_sale+'/'+resource;
  window.open(url,'_blank');
}


function SendEmail() {
  if (this.sale.email.length == 0) {
    Swal.fire({ icon: 'warning', text: 'Ingrese un correo electrónico', timer: 3000,})
    return false;
  }
  let me = this;
  let url = me.url_base + "sale/send-voucher-email";
  let data = me.sale;
  me.isLoading = true;
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: {"Content-Type": "application/json", token: me.token, module: me.module,role: me.role, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.isLoading = false;
        Swal.fire({ icon: 'success', text: 'Se enviado el comprobante al correo exitosamente', timer: 3000,})
      }else{
        me.isLoading = false;
        Swal.fire({ icon: 'error', text: 'A ocurrido un error al enviar el correo', timer: 3000,})
      }
    })
}

</script>

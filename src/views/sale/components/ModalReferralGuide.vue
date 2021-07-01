<template>
  <div>
    <b-modal size="lg" ref="modal-referral-guide" hide-footer v-model="modal_referral_guide" class="w-100" title="GENERAR GUIA DE REMISIÓN">
      <b-row>
          <b-col md="4">
            <b-form-group label="Tipo de Comprobante :">
              <b-form-select @change="ListSerie" v-model="referral_guide.type_invoice" :options="type_invoices"></b-form-select>
            </b-form-group>
          </b-col>

          <b-col md="2">
            <b-form-group label="Serie :">
              <b-form-select @change="GetNumberBySerie" ref="id_serie" v-model="referral_guide.id_serie" :options="series"></b-form-select>
              <small v-if="errors.id_serie"  class="form-text text-danger" >Seleccione una serie</small>
            </b-form-group>
          </b-col>

          <b-col md="3">
            <b-form-group label="Numero :">
              <b-form-input class="text-center" readonly type="text" ref="number" v-model="referral_guide.number"></b-form-input>
              <small v-if="errors.number" class="form-text text-danger">Ingrese un numero de 8 digitos</small>
            </b-form-group>
          </b-col>

          <b-col md="3">
            <b-form-group label="Fecha Emision:">
              <b-form-input class="text-center" type="date" ref="broadcast_date" v-model="referral_guide.broadcast_date"></b-form-input>
              <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
            </b-form-group>
          </b-col>

          <b-col md="4">
          </b-col>

          <b-col md="4">
            <b-form-group label="">
              <b-button type="button" @click="Validate" variant="primary" class="btn form-control">Generar Guia de Remisión</b-button>
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
var moment = require("moment");
import LoadingComponent from './../../pages/Loading'

export default {
  name: "ModalsProduct",
  components:{
      LoadingComponent,
  },
  data() {
    return {

        isLoading: false,
        modal_referral_guide:false,
        module:'Sale',
        role:1,
        search_order:'',
        orders: [],
        id_sale : 0,

        series: [],
        type_invoices:[
          {value: "09", text : "Guía de remisión - Remitente"},
        ],
        referral_guide : {
          id_sale:0,
          id_establishment:0,
          type_invoice:'09',
          id_serie:'',
          serie:'',
          number:'',
          broadcast_date:moment(new Date()).local().format("YYYY-MM-DD"),
        },
        errors:{
          type_invoice:false,
          id_serie:false,
          number:false,
          broadcast_date:false,
        }

    };
  },
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalReferralGuideShow', (id_sale) => {
      this.isLoading = true;
      this.modal_referral_guide = true;
      this.id_sale = id_sale;
      this.ListSerie();
    });
    
  },
  methods: {
      ListSerie,
      GetNumberBySerie,
      Validate,
      AddReferralGuide,
      ...mapActions('Sale',['mLoadAddSaleDetail','mLoadAddLinkages']),
  },
  computed: {
    ...mapState(["url_base"]),
    token: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.api_token;
    },
    user: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user;
    },
    id_establishment: function () {
      let establishment = window.localStorage.getItem("id_establishment");
      establishment = JSON.parse(je.decrypt(establishment));
      return establishment;
    }
  },
};


function ListSerie() {

  let me = this;
  let url = this.url_base + "list-series/"+this.referral_guide.type_invoice+"/"+this.id_establishment;

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
    },
  })
    .then(function (response) {
      me.series = [];
      if (response.data.status == 200) {
        let data = response.data.result;
        for (let index = 0; index < data.length; index++) {
          me.series.push( { value : data[index].id_serie , text: data[index].serie } );
          me.referral_guide.id_serie = data[index].id_serie;
        }
        if (response.data.result.length == 0)  {
          me.referral_guide.id_serie = '';
          me.referral_guide.number = '';
        }else{
          me.GetNumberBySerie();
        }
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
      me.isLoading = false;
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function GetNumberBySerie() {
   let me = this;
  let url = this.url_base + "serie/view/"+this.referral_guide.id_serie;

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: 2,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.referral_guide.number = response.data.result.number;
      } else {
        me.referral_guide.number = '';
      }
    })
}

function Validate() {

  this.errors.type_invoice = this.referral_guide.type_invoice.length == 0 ? true : false;
  this.errors.id_serie = this.referral_guide.id_serie.length == 0 ? true : false;
  this.errors.number = this.referral_guide.number.length == 0 ? true : false;
  this.errors.broadcast_date = this.referral_guide.broadcast_date.length == 0 ? true : false;
  
  if (this.errors.type_invoice == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_serie == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.number == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  
  let me = this;
  Swal.fire({
    title: 'Esta seguro de generar la guia de remisión ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      AddReferralGuide(me);
    }
  })
}
function AddReferralGuide(me) {
  me.isLoading = true;
  let url = me.url_base + "sale/generate-referral-guide";
  me.referral_guide.id_sale = me.id_sale;
  me.referral_guide.id_user = me.user.id_user;
  me.referral_guide.id_establishment = me.id_establishment;
  let data = me.referral_guide;
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: { token: me.token, module: me.module, role: 1,},
  })
    .then(function (response) {
      if (response.data.status == 201) {
          me.$refs['modal-referral-guide'].hide()
          Swal.fire({ icon: 'success', text: 'Se ha generado la guia de remisión correctamente', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A Ocurrido un error', timer: 3000,})
      }
      me.isLoading = false;
    })
}
</script>

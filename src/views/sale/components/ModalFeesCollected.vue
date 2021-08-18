<template>
  <div>
    <b-modal size="md" hide-footer v-model="modal_fees_collected" class="w-100" title="CUOTAS">

             <div class="table-responsive mt-3">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th width="20%" class="text-center">Dias</th>
                    <th width="40%" class="text-center">Fecha</th>
                    <th width="35%" class="text-center">Total</th>
                    <th width="5%" class="text-center"></th>
                  </tr>
                </thead>
  
                <tbody v-for="(item, it) in fees_collected_modal" :key="it">
                  <tr>
                    <td class="text-center">
                      <b-form-input @change="UpdateFeeColleted(it)" class="text-center" v-model="item.days" type="number"></b-form-input>
                    </td>
                    <td class="text-center">
                      <b-form-input disabled class="text-center" :max="max_date" :min="min_date" v-model="item.date" type="date"></b-form-input>
                    </td>
                    <td class="text-right">
                        <b-form-input class="text-right" v-model="item.total" type="number" step="any"></b-form-input>
                    </td>
                    <td class="text-center">
                       <b-button @click="DeleteFeeCollected(it)" type="button" variant="danger"><i class="fas fa-trash"></i></b-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
             <b-link @click="AddFeeCollected"><i class="fas fa-plus"></i> Agregar cuota</b-link>

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
var moment = require("moment");


export default {
  name: "ModalsProduct",
  props: ["way_to_pay","broadcast_date","fees_collected"],
  data() {
    return {
        modal_fees_collected:false,
        fees_collected_modal: [],
        min_date:moment(new Date()).local().format("YYYY-MM-DD"),
        max_date:moment(new Date()).local().format("YYYY-MM-DD"),
        days:0,
    };
  },
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalFeesCollectedShow', () => {
      this.modal_fees_collected = true;
      this.fees_collected_modal = this.fees_collected;
    });

    EventBus.$on('ChangeFeesCollectedModal', () => {
      this.CalculateFeesCollected();
    });
    
    
  },
  methods: {
      AddFeeCollected,
      UpdateFeeColleted,
      DeleteFeeCollected,
      CalculateFeesCollected,
  },
  computed: {
    ...mapState(["url_base"]),
      ...mapState('Sale',['total_sale']),
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

function CalculateFeesCollected() {
  let total = this.total_sale.total;
  let payment_method = this.way_to_pay.split("-");
  if (payment_method[0] == "03") {
      let total_fee_collected = parseFloat(total) / parseFloat(this.fees_collected_modal.length);
      for (let index = 0; index < this.fees_collected_modal.length; index++) {
        this.fees_collected_modal[index].total = parseFloat(total_fee_collected).toFixed(2);
      }
      this.days = payment_method[1];
  }else{
    this.fees_collected_modal = [];
  }

  EventBus.$emit('ChangeFeesCollected',this.fees_collected_modal);
}

function UpdateFeeColleted(index) {
  let payment_type = this.way_to_pay.split('-');
  let days_payment = payment_type[1];

  this.fees_collected_modal[index].days = this.fees_collected_modal[index].days.length == 0 ? 1 :this.fees_collected_modal[index].days;
  this.fees_collected_modal[index].days = parseFloat(this.fees_collected_modal[index].days) < 0 ? 1: this.fees_collected_modal[index].days;
  this.fees_collected_modal[index].days = parseFloat(this.fees_collected_modal[index].days) > parseFloat(days_payment) ? days_payment: this.fees_collected_modal[index].days;
  let days = parseFloat(this.fees_collected_modal[index].days);
  this.fees_collected_modal[index].date = moment(this.min_date, "YYYY-MM-DD").add('days',parseInt(days)).local().format("YYYY-MM-DD");
}

function AddFeeCollected() {
this.min_date = this.broadcast_date;
let payment_type = this.way_to_pay.split('-');
let days = payment_type[1];
this.max_date = moment(this.min_date, "YYYY-MM-DD").add('days',parseInt(days)).local().format("YYYY-MM-DD");
this.fees_collected_modal.push({
   days: days,
   date: moment(this.min_date, "YYYY-MM-DD").add('days',parseInt(days)).local().format("YYYY-MM-DD"),
   total: (0).toFixed(2),
 })
 this.CalculateFeesCollected();
}

function DeleteFeeCollected(index) {
  this.fees_collected_modal.splice(index, 1);
  this.CalculateFeesCollected();
}

</script>

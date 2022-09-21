<template>
  <div>
    <b-row>
      <b-col md="12">
        <b-form-group>
          <label class="text-dark">Cliente: <span @click="modalClients" class="badge badge-secondary">Nuevo</span></label>
          <v-select @input="ChangeClient" placeholder="Seleccione un cliente" class="w-100" :filterable="false" label="full_name" v-model="client" @search="SearchClients" :options="clients"></v-select>
          <small v-if="errors.id_client" class="form-text text-danger" >Selccione un cliente</small>
        </b-form-group>
      </b-col>
    </b-row>
 
    <div class="table-responsive size-pos" :style="size_pos">
      <table class="table table-hover">
        <tbody  v-for="(item, it) in pos_detail" :key="it" >
          <tr>
            <td width="5%" class="text-center">{{ it + 1}}</td>
            <td width="52%" class="text-lefet">{{item.code}} | {{item.name }}</td>
            <td width="15%" class="text-center">
              <b-form-input @change="UpdateDetail(it)" class="form-control text-right" type="number" step="any" v-model="item.quantity"></b-form-input>
            </td>
            <td width="17%" class="text-center">
              <b-form-input @change="UpdateDetail(it)"  class="form-control text-right" type="number" step="any" v-model="item.unit_price"></b-form-input>
            </td>
            <td width="10%" class="text-right">{{item.total_price}}</td>
            <td width="5%" class="text-center">
              <button type="button" @click="DeleteDetail(it)" class="btn btn-danger"><i class="fas fa-trash-alt"></i></button>  
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <b-row class="border-top pt-2 border-bottom ">
      <b-col md="4">
        <b-form-group label="">
          <b-form-select @change="mLoadTotalPOSDetail" v-model="sale.coin" :options="coins"></b-form-select>
        </b-form-group>
      </b-col>
      <b-col md="4" class="text-left">
        <strong style="font-size: 23px" class="text-dark">TOTAL</strong>
      </b-col>
      <b-col md="4" class="text-right">
        <strong style="font-size: 23px" class="text-dark">{{ sale.coin == "PEN" ? "S/":"$"}} {{total_pos.total}}</strong>
      </b-col>
      <b-col md="2">
          <b-button  class="form-control" @click="modalSizePOSShow" type="button" variant="info"><i class="fas fa-cogs"></i></b-button>
      </b-col>
       <b-col md="10">
          <b-button class="form-control" @click="Payment" type="button" variant="primary"><i class="fas fa-money-bill"></i> Pagar (F4)</b-button>
      </b-col>
    </b-row>



  <b-modal title="Tamaño del POS" hide-title hide-footer ref="modal-size-pos">
    <b-form @submit.prevent="UpdateSize">
     
      <b-row>
        <b-col md="6">
          <b-form-group label="Altura del POS:">
            <b-form-input v-model="size_pos_value" type="number" step="any"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label=".">
            <b-button  ref="buttonconfirmsale" type="submit" variant="primary" class="form-control">Guardar</b-button>
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>
  </b-modal>
  <Keypress key-event="keyup" :key-code="115" @success="Payment" />
  </div>
</template>
<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
.size-pos{
  min-height: var(--size-pos);
}

.text-total{
  font-size: 14px;
  font-weight: 500;
}
</style>>
<script>
import vSelect from "vue-select";
import 'vue-select/dist/vue-select.css';
import "vue-select/src/scss/vue-select.scss";
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState,mapActions } from "vuex";
import EventBus from "@/assets/js/EventBus";

export default {
  name: "ModalsProduct",
  components:{
    vSelect,
    Keypress: () => import('vue-keypress'),
  },
  data() {
    return {
      isLoading: false,
      module: 'POS',
      role: 2,
      size_pos_value:0,
      size_pos: '--size-pos: 370px',
      coins:[
        {value: "PEN", text : "Soles"},
        {value: "USD", text : "Dolares"},
      ],
      clients: [],
      client: {id:1,full_name:'CLIENTES VARIOS - 00000000'},

      errors:{
        id_warehouse:false,
        coin:false,
      }
      

    };
  },
  mounted () {
    EventBus.$on('GetDataClient', (data) => {
      this.client = {id:data.id_client,full_name:data.name+" - "+data.document_number};
      this.ChangeClient();
    });
     this.client = this.mclient;
     this.ViewEstablishment();
  },
  methods: {
    SearchClients,
    modalClients,
    UpdateDetail,
    DeleteDetail,
    ChangeClient,
    Payment,
    ViewEstablishment,

    modalSizePOSShow,
    UpdateSize,
    AddressClient,

    ...mapActions('SalePOS',['mLoadEditPOSDetail','mLoadDeletePOSDetail','mLoadEditClient','mLoadTotalPOSDetail','mLoadEditClientAddress']),
      
  },
  computed: {
      ...mapState('SalePOS',['pos_detail','total_pos','mclient','sale']),
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

function AddressClient() {

  let me = this;
  if (this.client == null) {
    me.mLoadEditClientAddress('');
    return false;
  }
  
  let url = this.url_base + "client/view/"+this.client.id;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: this.role, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.mLoadEditClientAddress(response.data.result.address);
      } 
    })
}

function ViewEstablishment() {
  let me = this;
  let url = me.url_base + "establishment/view/" + this.id_establishment;
  axios({
    method: "GET",
    url: url,
    headers: { token: me.token, module: me.module, role: me.role, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.size_pos = '--size-pos: '+response.data.result.size_pos+'px';
        me.size_pos_value = response.data.result.size_pos;
       
      }
    })
  
}
function modalSizePOSShow() {
this.$refs['modal-size-pos'].show();
}
function UpdateSize() {
  let me = this;
  let url = me.url_base + "establishment/update-size-pos";
  let data = {
    id_establishment: this.id_establishment,
    size_pos: this.size_pos_value,
  };
 
  axios({
    method: "PUT",
    url: url,
    data: data,
    headers: { "Content-Type": "application/json", token: me.token, module: me.module, role: me.role, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.size_pos = '--size-pos: '+response.data.result.size_pos+'px';
        me.size_pos_value = response.data.result.size_pos;
        Swal.fire({ icon: 'success', text: 'Se ha modificado el tamaño POS', timer: 3000,})
        window.location.reload();
      } 
    })
}

function SearchClients(search, loading) {
  
   let me = this;
    let url = this.url_base + "search-clients/" + search;
    if (search !== "") {
      loading(true);
      axios({
        method: "GET",
        url: url,
      }).then(function (response) {
            me.clients = response.data;
            loading(false);
      })
    }
}
function ChangeClient() {
  this.mLoadEditClient(this.client);
  this.AddressClient();
}
function modalClients() {
  EventBus.$emit('ModalClientsShow');
}

function UpdateDetail(index) {
  this.mLoadEditPOSDetail(index);
  this.$notify({ group: 'alert', title: 'Sistema', text:'Se ha modificado el producto ' + this.pos_detail[index].name+" - "+this.pos_detail[index].presentation, type: 'warn'})
}

function DeleteDetail(index) {
  this.$notify({ group: 'alert', title: 'Sistema', text:'Se ha eliminado el producto ' + this.pos_detail[index].name+" - "+this.pos_detail[index].presentation, type: 'warn'})
  this.mLoadDeletePOSDetail(index);
  
}

function Payment() {

  if (this.pos_detail.length == 0) {
    Swal.fire({ icon: 'warning', text: 'Se requeire agregar productos para continuar con el pago', timer: 2000,}); 
    return false;
  }
  for (let index = 0; index < this.pos_detail.length; index++) {
    const element = this.pos_detail[index];
    if (parseFloat(element.total_price) == 0) {
      Swal.fire({ icon: 'warning', text: 'Verifique que ningun producto tenga precio 0', timer: 2000,}); 
      return false;
    }
  }
  EventBus.$emit('ChangeTypeProcess',2);
}

</script>

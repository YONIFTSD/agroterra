<template>
  <div class="w-100">
        <div class="table-responsive mt-3">
          <table  class="table  table-bordered table-hover table-lg mt-lg mb-0">
            <thead >
              <tr>
                <th rowspan="2" width="3%" class="text-center">#</th>
                <th rowspan="2" width="5%" class="text-center">Cod.</th>
                <th rowspan="2" width="30%" class="text-center">Nombre</th>
                <th rowspan="2" width="13%" class="text-center">UM</th>
                <th rowspan="2" width="8%" class="text-center">Cantidad</th>
                <th rowspan="2" width="9%" class="text-center">Imp. Unit.</th>
                <th colspan="2" width="9%" class="text-center">Descuento</th>
                <th rowspan="2" width="7%" class="text-center">V. Unit. <br> Neto</th>
                <th rowspan="2" width="7%" class="text-center">P. Unit.</th>
                <th rowspan="2" width="5%" class="text-center">P. Total</th>
                <th rowspan="2" width="5%" class="text-center"></th>
              </tr>
              <tr>
                <th class="text-center">%</th>
                <th class="text-center">Importe</th>
              </tr>
            </thead>
            <tbody v-for="(item, it) in shopping_detail" :key="it">
              <tr>
                  <td class="align-middle text-center">{{ it + 1 }}</td>
                  <td class="align-middle text-left">{{ item.code }}</td>
                  <td class="text-left">
                    <b-form-input class="form-control" v-model="item.name"></b-form-input>
                  </td>
                  <td class="align-middle text-center">
                    <b-form-select v-model="item.unit_measure" :options="unit_measure"></b-form-select>
                  </td>
                  <td class="align-middle text-center">
                    <input type="number" step="any" @change="EditDetail(it)" class="form-control text-right" v-model="item.quantity">
                  </td>
                  <td class="align-middle text-center">
                    <input type="number" step="any" @change="EditDetail(it)" class="form-control text-right" v-model="item.unit_value">
                  </td>
                  <td class="align-middle text-center">
                    <input type="number" step="any" @change="EditDetail(it)" class="form-control text-right" v-model="item.percentage_discount">
                  </td>
                  <td class="align-middle text-right">{{ item.unit_discount }}</td>
                  <td class="align-middle text-right">{{ item.net_unit_value }}</td>
                  <td class="align-middle text-right">{{ item.unit_price }}</td>
                  <td class="align-middle text-right">{{ item.total_price }}</td>
                  <td class="align-middle text-center">
                    <button type="button" @click="DeleteDetail(it)" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button>  
                  </td>

              </tr>
            </tbody>
          </table>
        </div>
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

.text-total{
  font-size: 14px;
  font-weight: 500;
}
</style>
<script>
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState,mapMutations,mapActions } from "vuex";
import EventBus from '@/assets/js/EventBus';
import CodeToName from "@/assets/js/CodeToName";

export default {
  name: "ShoppingDetail",
  props: ["type_discount"],
  data() {
    return {
        unit_measure:[
          {value:'4A',text:'BOBINAS'},
          {value:'BJ',text:'BALDE'},
          {value:'BLL',text:'BARRILES'},
          {value:'BG',text:'BOLSA'},
          {value:'BO',text:'BOTELLAS'},
          {value:'BX',text:'CAJA'},
          {value:'CMK',text:'CENTIMETRO CUADRADO'},
          {value:'CMQ',text:'CENTIMETRO CUBICO'},
          {value:'CMT',text:'CENTIMETRO LINEAL'},
          {value:'CEN',text:'CIENTO DE UNIDADES'},
          {value:'CY',text:'CILINDRO'},
          {value:'DZN',text:'DOCENA'},
          {value:'DZP',text:'DOCENA POR 10**6'},
          {value:'BE',text:'FARDO'},
          {value:'GLI',text:'GALON INGLES (4,545956L)'},
          {value:'GRM',text:'GRAMO'},
          {value:'KGM',text:'KILOGRAMO'},
          {value:'CA',text:'LATAS'},
          {value:'LBR',text:'LIBRAS'},
          {value:'LTR',text:'LITRO'},
          {value:'MTR',text:'METRO'},
          {value:'MGM',text:'MILIGRAMOS'},
          {value:'MIL',text:'MILLARES'},
          {value:'UM',text:'MILLON DE UNIDADES'},
          {value:'ONZ',text:'ONZAS'},
          {value:'PF',text:'PALETAS'},
          {value:'PK',text:'PAQUETE'},
          {value:'GRM',text:'GRAMO'},
          {value:'PR',text:'PAR'},
          {value:'FOT',text:'PIES'},
          {value:'FTK',text:'PIES CUADRADOS'},
          {value:'FTQ',text:'PIES CUBICOS'},
          {value:'C62',text:'PIEZAS'},
          {value:'NIU',text:'UNIDAD (BIENES) '},
          {value:'ZZ',text:'UNIDAD (SERVICIOS)'},
          {value:'GRM',text:'US GALON (3,7843 L)'},
          {value:'GLL',text:'GRAMO'},
          {value:'TNE',text:'TONELADAS'},
        ],
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
    NameUnitMeasure,
    ...mapActions('PurchaseOrder',['mLoadEditShoppingDetail']),
    ...mapActions('PurchaseOrder',['mLoadDeleteShoppingDetail']),
    
  },
  computed: {
    ...mapState('PurchaseOrder',['shopping_detail']),
    
    
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
function NameUnitMeasure(code) {
  return CodeToName.NameUnitMeasure(code);
}

function EditDetail(index) {
  let name = this.shopping_detail[index].name + ' - ' +this.shopping_detail[index].presentation;
  this.$notify({ group: 'alert', title: 'Sistema', text:'Se ha modificado el producto ' + name, type: 'warn'})
  this.mLoadEditShoppingDetail(index)
}

function DeleteDetail(index) {
  let name = this.shopping_detail[index].name + ' - ' +this.shopping_detail[index].presentation;
  this.$notify({ group: 'alert', title: 'Sistema', text:'Se ha eliminado el producto ' + name, type: 'warn'})
  this.mLoadDeleteShoppingDetail(index)
}
</script>

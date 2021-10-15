<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Empresa - Editar</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-tabs align="center" content-class="mt-3">
                <b-tab title="Datos de Empresa" active>
                  <b-row>

                    <b-col md="3">
                      <b-form-group>
                          <b-card-img :src="url_base + business.logo"></b-card-img>
                      </b-form-group>
                      <b-form-group>
                        <b-form-file accept="image/png, image/jpeg" @change="onLogoChange" v-model="logo" placeholder="Seleccione un foto..." drop-placeholder="Suelta la imagen aquí..."></b-form-file>
                        <small v-if="errors.logo" class="form-text text-danger">Seleccione un foto</small>
                      </b-form-group>

                      <b-form-group label="Precio del producto :">
                        <b-form-select v-model="business.type_price" :options="type_prices"></b-form-select>
                        <small v-if="errors.type_price" class="form-text text-danger">Seleccione una opción</small>
                      </b-form-group>

                      <b-form-group label="Tipo de cambio :">
                        <b-form-input type="number" step="any"  class="text-right" v-model="business.exchange_rate" ></b-form-input>
                        <small v-if="errors.exchange_rate" class="form-text text-danger">Ingrese un tipo de cambio</small>
                      </b-form-group>


                    </b-col>

                    <b-col md="9">

                      <b-row>
                        <b-col md="4">
                          <b-form-group label="Ruc :">
                            <b-form-input v-model="business.document_number"></b-form-input>
                            <small v-if="errors.document_number" class="form-text text-danger">Ingrese un nro ruc</small>
                          </b-form-group>
                        </b-col>

                        <b-col md="8">
                          <b-form-group label="Razón Social :">
                            <b-form-input v-model="business.name"></b-form-input>
                            <small v-if="errors.name" class="form-text text-danger">Ingrese una razón social</small>
                          </b-form-group>
                        </b-col>

                        <b-col md="8">
                          <b-form-group label="Nombre Comercial :">
                            <b-form-input v-model="business.tradename"></b-form-input>
                            <small v-if="errors.tradename" class="form-text text-danger">Ingrese un nombre comercial</small>
                          </b-form-group>
                        </b-col>

                        <b-col md="4">
                          <b-form-group label="Pais :">
                            <b-form-select v-model="business.country_code" :options="countries"></b-form-select>
                            <small v-if="errors.country_code" class="form-text text-danger">Seleccione un pais</small>
                          </b-form-group>
                        </b-col>

                        <b-col md="5">
                          <b-form-group label="Ubigeo :">
                            <v-select placeholder="Seleccione un ubigeo" label="text" class="w-100"  v-model="ubigee" :options="ubigees"></v-select>
                            <small v-if="errors.ubigee" class="form-text text-danger">Seleccione un ubigeo</small>
                          </b-form-group>
                        </b-col>

                        <b-col md="7">
                          <b-form-group label="Dirección :">
                            <b-form-input v-model="business.address"></b-form-input>
                            <small v-if="errors.address" class="form-text text-danger">ingrese una dirección</small>
                          </b-form-group>
                        </b-col>

                        <b-col md="3">
                          <b-form-group label="Usuario Sol :">
                            <b-form-input v-model="business.user_sol"></b-form-input>
                            <small v-if="errors.user_sol" class="form-text text-danger">Ingrese un usuario SOL</small>
                          </b-form-group>
                        </b-col>

                        <b-col md="3">
                          <b-form-group label="Clave Sol :">
                            <b-form-input type="password" v-model="business.password_sol"></b-form-input>
                            <small v-if="errors.password_sol"  class="form-text text-danger">Ingrese una clave SOL</small>
                          </b-form-group>
                        </b-col>

                        <b-col md="3">
                          <b-form-group label="Certificado :">
                            <b-form-input disabled v-model="business.certificate"></b-form-input>
                          </b-form-group>
                        </b-col>

                        <b-col md="3">
                          <b-form-group label="Clave Certificado :">
                            <b-form-input  type="password" v-model="business.password_certificate"></b-form-input>
                          </b-form-group>
                        </b-col>

                        <b-col md="6">
                          <b-form-group label="Descripción :">
                            <b-form-input v-model="business.description"></b-form-input>
                            <small v-if="errors.description" class="form-text text-danger">ingrese una descripción</small>
                          </b-form-group>
                        </b-col>

                        <b-col md="6">
                          <b-form-group label="Email de Backup :">
                            <b-form-input type="email" v-model="business.email_backup"></b-form-input>
                            <small v-if="errors.email_backup" class="form-text text-danger">ingrese una email</small>
                          </b-form-group>
                        </b-col>

                        <b-col md="6">
                          <b-form-group label="Email :">
                            <b-form-input v-model="business.email"></b-form-input>
                            <small v-if="errors.email" class="form-text text-danger">Ingrese un email</small>
                          </b-form-group>
                        </b-col>

                        <b-col md="3">
                          <b-form-group label="Celular :">
                            <b-form-input v-model="business.phone"></b-form-input>
                            <small v-if="errors.phone" class="form-text text-danger">ingrese un teléfono</small>
                          </b-form-group>
                        </b-col>

                        <b-col md="3">
                          <b-form-group label="Tipo Proceso :">
                            <b-form-select v-model="business.process_type" :options="process_type"></b-form-select>
                            <small v-if="errors.process_type" class="form-text text-danger">Seleccione un proceso</small>
                          </b-form-group>
                        </b-col>

                        <b-col md="3"></b-col>
                        <b-col md="3">
                          <b-button type="button" @click="ModalThemeShow" class="form-control text-white"  variant="primary" >Tema</b-button >
                        </b-col>
                        <b-col md="3">
                          <b-button type="submit" class="form-control text-white"  variant="primary" >Guardar</b-button >
                        </b-col>

                    </b-row>

                    
                </b-col>
                
                  </b-row>
                </b-tab>
                <b-tab title="Cuentas Bancarias">
                  <b-row>
                      <b-col md="5">
                        <b-form-group label="Banco :">
                          <b-form-select  v-model="bank_account.bank" :options="bank"></b-form-select>
                          <small v-if="errors.bank" class="form-text text-danger">Ingrese un banco</small>
                        </b-form-group>
                      </b-col>
                      <b-col md="2">
                        <b-form-group label="Moneda :">
                          <b-form-select  v-model="bank_account.coin" :options="coin"></b-form-select>
                          <small v-if="errors.bank" class="form-text text-danger">Ingrese un banco</small>
                        </b-form-group>
                      </b-col>
                      <b-col md="2">
                        <b-form-group label="Cuenta :">
                          <b-form-input  v-model="bank_account.account"></b-form-input>
                          <small v-if="errors.bank" class="form-text text-danger">Ingrese un banco</small>
                        </b-form-group>
                      </b-col>
                      <b-col md="2">
                        <b-form-group label="CCI :">
                          <b-form-input  v-model="bank_account.cci"></b-form-input>
                        </b-form-group>
                      </b-col>
                      <b-col md="1">
                        <b-form-group label=".">
                          <b-button type="button" @click="AddBankAccount" class="form-control" variant="primary"><i class="fas fa-save"></i></b-button>
                        </b-form-group>
                      </b-col>
                  </b-row>

                  <div class="table-responsive mt-3 height-table">
                    <table class="table table-hover table-bordered">
                      <thead>
                        <tr>
                          <th width="5%" class="text-center">#</th>
                          <th width="50%" class="text-center">Banco</th>
                          <th width="10%" class="text-center">Moneda</th>
                          <th width="15%" class="text-center">Cuenta</th>
                          <th width="15%" class="text-center">CCI</th>
                          <th width="5%" class="text-center">Acc.</th>
                        </tr>
                      </thead>
                      <tbody v-for="(item, it) in business.bank_account" :key="it">
                        <tr>
                          <td class="text-center">{{ it + 1 }}</td>
                          <td class="text-left"> {{ NameBank(item.bank)  }}</td>
                          <td class="text-center"> {{ item.coin  }}</td>
                          <td class="text-left"> {{ item.account  }}</td>
                          <td class="text-left"> {{ item.cci  }}</td>
                          <td class="text-center">
                            <button type="button" @click="DeleteBankAccount(it)" class="btn btn-danger"><i class="fas fa-trash-alt"></i></button>  
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>


                  <b-row>
                    <b-col md="3"></b-col>
                    <b-col md="3">
                      <b-button type="button" @click="ModalThemeShow" class="form-control text-white"  variant="primary" >Tema</b-button >
                    </b-col>
                    <b-col md="3">
                      <b-button type="submit" class="form-control text-white"  variant="primary" >Guardar</b-button >
                    </b-col>
                  </b-row>
                  
                  
                </b-tab>
              </b-tabs>
            </b-form>

       
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <ModalTheme />
  </div>
</template>

<script>
import vSelect from "vue-select";
import 'vue-select/dist/vue-select.css';
import "vue-select/src/scss/vue-select.scss";

const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState } from "vuex";
import ModalTheme from './../components/ModalThemeApp'
import EventBus from "@/assets/js/EventBus";
import CodeToName from "@/assets/js/CodeToName";
export default {
  name: "ProductEdit",
  props: ["id_product"],
  components:{
      vSelect,
      ModalTheme
  },
  data() {
    return {
      module: "Business",
      role: 3,
      business: {
        id_company: "",
        document_type: "",
        document_number: "",
        name: "",
        tradename: "",
        description: "",
        ubigee: "",
        country_code: "",
        user_sol: "",
        password_sol: "",
        certificate:'',
        certificate_change:'',
        password_certificate: "",
        process_type: '',
        logo: "",
        logo_change: "",
        phone: "",
        email:'',
        invoice_url: '',
        type_print:'',
        email_backup:'',
        state: 1,
        type_price: 1,
        exchange_rate:0,
        bank_account:[],
      },
      bank_account:{
        bank:'',
        coin:'PEN',
        account:'',
        cci:'',
      },
      countries:[
        {value:'PE', text:'Perú'}
      ],
      process_type:[
        {value :1, text :'Producción'},
        {value :3, text :'Beta'},
      ],
      type_prices : [
        {value:1,text:'Precio General'},
        {value:2,text:'Precio por Establecimiento'},

      ],
      coin:[
        {value: "PEN", text : "Soles"},
        {value: "USD", text : "Dolares"},
      ],
      bank:[
        {value :'', text:'Seleccione una opción'},
        {value :'001', text:'BANCO CENTRAL DE RESERVA DEL PERU'},
        {value :'002', text:'BANCO DE CREDITO DEL PERU'},
        {value :'003', text:'BANCO INTERNACIONAL DEL PERU'},
        {value :'005', text:'BANCO LATINO'},
        {value :'007', text:'BANCO CITIBANK N.A.'},
        {value :'008', text:'BANCO STANDARD CHARTERED'},
        {value :'009', text:'BCO.SCOTIABANK PERU SAA (ANTES WIESE SUDAMERIS)'},
        {value :'011', text:'BANCO CONTINENTAL'},
        {value :'018', text:'BANCO DE LA NACION'},
        {value :'023', text:'BANCO COMERCIO'},
        {value :'026', text:'BANCO NORBANK'},
        {value :'037', text:'BANCO DEL PROGRESO'},
        {value :'038', text:'BANCO INTERAMERICANO DE FINANZAS'},
        {value :'041', text:'BANCO SUDAMERICANO'},
        {value :'043', text:'BANCO DEL TRABAJO'},
        {value :'044', text:'BANCO SOLVENTA'},
        {value :'045', text:'BANCO SERBANCO'},
        {value :'046', text:'BANK BOSTON N.A. SUCURSAL DEL PERU'},
        {value :'047', text:'ORION CORPORACION DE CREDITO'},
        {value :'048', text:'BANCO NUEVO PAIS'},
        {value :'049', text:'MIBANCO'},
        {value :'050', text:'BANQUE NATIONALE DE PARIS - ANDES S.A.'},
        {value :'053', text:'BANCO HSBC'},
        {value :'056', text:'BANCO SANTANDER PERU S.A.'},
        {value :'071', text:'CORPORACION FINANCIERA DE DESARROLLO - COFIDE'},
        {value :'083', text:'SOLUCION - FINANCIERA DE CREDITO DEL PERU'},
        {value :'086', text:'FINANDAEWOO S.A.'},
        {value :'087', text:'FINANCIERA C.M.R.'},
        {value :'088', text:'VOLVO FINANCE PERU'},
        {value :'089', text:'FINANCIERA CORDILLERA S.A.'},
        {value :'091', text:'GENERALI PERU CIA. SEGUROS'},
        {value :'092', text:'LA VITALICIA'},
        {value :'093', text:'REASEGURADORA PERUANA'},
        {value :'094', text:'SEGUROS LA FENIX PERUANA'},
        {value :'095', text:'SECREX  CIA. SEGUROS'},
        {value :'099', text:'OTROS'},
      ],
      
      ubigee : null,
      ubigees : [],
      logo: null,
      certificate: null,
      //errors
      errors: {
        document_number: false,
        name: false,
        tradename: false,
        ubigee: false,
        address: false,
        user_sol: false,
        password_sol: false,
        process_type: false,
        phone: false,
        email: false,
        invoice_url: false,
        type_print:false,
      },
      validate: false,
    };
  },
  mounted() {
    this.ListUbigeos();
    
  },
  methods: {
    ListUbigeos,
    onLogoChange,
    ViewBusiness,
    onCertificateChange,
    EditBusiness,
    Validate,

    SelectUbigee,
    ModalThemeShow,

    AddBankAccount,
    DeleteBankAccount,
    NameBank,
    
  },

  computed: {
    ...mapState(["url_base"]),
    token: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.api_token;
    },
  },
};
function ModalThemeShow() {
  EventBus.$emit('ModalThemeAppShow');
}
function onLogoChange(e) {
  this.business.logo_change = e.target.files[0];
}
function onCertificateChange(e) {
  this.business.certificate_change = e.target.files[0];
}

function ListUbigeos() {
 this.ubigees = [];
  let url = this.url_base + "list-ubigee";
  let me = this;
  axios({
    method: "GET",
    url: url,
  }).then(function (response) {
    for (let index = 0; index < response.data.length; index++) {
      const element = response.data[index];
      me.ubigees.push({value:element.id_ubigee,text:element.department+', '+element.province+', '+element.district })
    }
    me.ViewBusiness(me);
  })
  
}

function AddBankAccount() {
  if (this.bank_account.bank.length == 0) {
    Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); 
    return false;
  }
  if (this.bank_account.coin.length == 0) {
    Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); 
    return false;
  }
  if (this.bank_account.account.length == 0) {
    Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); 
    return false;
  }
  if (this.bank_account.cci.length == 0) {
    Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); 
    return false;
  }
  this.business.bank_account.push({ 
    bank : this.bank_account.bank,
    coin : this.bank_account.coin,
    account : this.bank_account.account,
    cci : this.bank_account.cci
  });

  this.bank_account.bank = '';
  this.bank_account.coin = '';
  this.bank_account.account = '';
  this.bank_account.cci = '';
}
function NameBank(code) {
  return CodeToName.NameBank(code);
}
function DeleteBankAccount(index) {
  this.business.bank_account.splice(index, 1);
}

//ver usuario
function ViewBusiness(me) {

  let url = me.url_base + "business/get-business";

  axios({
    method: "GET",
    url: url,
    headers: { token: me.token,module: me.module, role: 3, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.business.id_company = response.data.result.id_company;
        me.business.document_type = response.data.result.document_type;
        me.business.document_number = response.data.result.document_number;
        me.business.name = response.data.result.name;
        me.business.tradename = response.data.result.tradename;
        me.business.description = response.data.result.description;
        me.business.ubigee = response.data.result.ubigee;
        me.business.address = response.data.result.address;
        me.business.country_code = response.data.result.country_code;
        me.business.user_sol = response.data.result.user_sol;
        me.business.password_sol = response.data.result.password_sol;
        me.business.existence_type = response.data.result.existence_type;
        me.business.certificate = response.data.result.certificate;
        me.business.password_certificate = response.data.result.password_certificate;
        me.business.process_type = response.data.result.process_type;
        me.business.logo = response.data.result.logo;
        me.business.phone = response.data.result.phone;
        me.business.email = response.data.result.email;
        me.business.invoice_url = response.data.result.invoice_url;
        me.business.state = response.data.result.state;
        me.business.type_price = response.data.result.type_price;
        me.business.exchange_rate = response.data.result.exchange_rate;
        me.business.email_backup = response.data.result.email_backup;
        me.business.bank_account = response.data.result.bank_account;
        for (let index = 0; index < me.ubigees.length; index++) {
          const element = me.ubigees[index];
          if (element.value == me.business.ubigee) {
            me.ubigee = {value: element.value, text: element.text};
            break;
          }
        }
      
        
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function SelectUbigee() {
  let me = this;
  console.log("select")
  for (let index = 0; index < me.ubigees.length; index++) {
    const element = me.ubigees[index];
    if (element.value == me.business.ubigee) {
      me.ubigee = {value: element.value, text: element.text};
      break;
    }
  }
}

//editar usuario
function EditBusiness(me) {

  let url = me.url_base + "business/edit";
  let data = new FormData();
  data.append("id_company", me.business.id_company);
  data.append("document_type", me.business.document_type);
  data.append("document_number", me.business.document_number);
  data.append("name", me.business.name);
  data.append("tradename", me.business.tradename);
  data.append("description", me.business.description);
  data.append("ubigee", me.ubigee.value);
  data.append("address", me.business.address);
  data.append("country_code", me.business.country_code);
  data.append("user_sol", me.business.user_sol);
  data.append("password_sol", me.business.password_sol);
  data.append("certificate", me.business.certificate);
  data.append("password_certificate", me.business.password_certificate);
  data.append("process_type", me.business.process_type);
  data.append("logo", me.business.logo_change);
  data.append("type_price", me.business.type_price);
  data.append("exchange_rate", me.business.exchange_rate);
  data.append("email_backup", me.business.email_backup);
  data.append("phone", me.business.phone);
  data.append("email", me.business.email);
  data.append("bank_account", JSON.stringify(me.business.bank_account));
  
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: { "Content-Type": "application/json", token: me.token,  module: me.module, role: 3,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.logo = null;
        me.business.logo = response.data.result.logo;
        Swal.fire({ icon: 'success', text: 'Se ha modificado los datos de la empresa', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

//validacion de formulario
function Validate() {

  this.errors.document_number = this.business.document_number.length == 0 ? true : false;
  this.errors.name = this.business.name.length == 0 ? true : false;
  this.errors.tradename = this.business.tradename.length == 0 ? true : false;
  this.errors.ubigee = this.ubigee == null ? true : false;
  this.errors.address = this.business.address.length == 0 ? true : false;
  this.errors.user_sol = this.business.user_sol.length == 0 ? true : false;
  this.errors.password_sol = this.business.password_sol.length == 0 ? true : false;
  this.errors.process_type = this.business.process_type.length == 0 ? true : false;
  this.errors.phone = this.business.phone.length == 0 ? true : false;
  this.errors.email = this.business.email.length == 0 ? true : false;



  if (this.errors.document_number) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.name) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.tradename) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.ubigee) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.address) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.user_sol) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.password_sol) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.process_type) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.phone) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.email) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }




  let me = this;

  if (!this.validate) {
    Swal.fire({
      title: "Esta seguro de modificar los datos de la empresa ?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Estoy de acuerdo!",
    }).then((result) => {
      if (result.value) {
        this.EditBusiness(me);
      }
    });

  }

}
</script>

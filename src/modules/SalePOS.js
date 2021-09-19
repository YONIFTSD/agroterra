import converter from "@/assets/js/NumberToLetters";
var moment = require("moment");
const state = {
    mclient: {id:1,full_name:'CLIENTES VARIOS - 00000000'},
    sale: {
        id_sale: "",
        id_client: "",
        id_serie: "",
        id_warehouse: "",
        type_operation: "01",
        linkages: [],
        type_invoice: "03",
        serie: "",
        number: "",
        broadcast_date: moment(new Date()).local().format("YYYY-MM-DD"),
        broadcast_time: "",
        expiration_date: moment(new Date()).local().format("YYYY-MM-DD"),
        web_pay: 0,
        coin: "PEN",
        address: '',
        license_plate: '',
        way_to_pay: "01-000",
        payment_type: "01",
        payment_method: "008",
        payment_deadline: "0",
        fees_collected:[],
        observation: "",
        modified_document_type: "",
        modified_serie: "",
        modified_number: "",
        modified_emission_date: "",
        reason: "",
        support: "",
        sunat_message: "",
        hash_cpe: "",
        hash_cdr: "",
        taxed_operation: '0.00',
        exonerated_operation: '0.00',
        unaffected_operation: '0.00',
        discount: '0.00',
        subtotal: '0.00',
        igv: '0.00',
        total: '0.00',
        state: '1',
        number_to_letters: '',
      },
    pos_detail: [],

    total_pos:{
        taxed_operation: (0).toFixed(2),
        exonerated_operation: (0).toFixed(2),
        unaffected_operation: (0).toFixed(2),
        discount: (0).toFixed(2),
        subtotal: (0).toFixed(2),
        igv: (0).toFixed(2),
        total: (0).toFixed(2),
        number_to_letters: "",
    }
}

//to handle state
const getters = {}

//to handle actions
const actions = {

    mLoadEditClient(context,client) {
        context.commit('mUpdateClient',client);
    },

    mLoadEditWarehouse(context,id_warehouse) {
        context.commit('mUpdateWarehouse',id_warehouse);
    },
    mLoadEditCoin(context,coin) {
        context.commit('mUpdateCoin',coin);
    },

    mLoadAddPOSDetail(context,product) {
        
        let validate = true;
        let detail = context.state.pos_detail;
        for (let index = 0; index < detail.length; index++) {
            if (detail[index].id_product == product.id_product) {
                detail[index].quantity = parseFloat(detail[index].quantity) + parseFloat(product.quantity);
                detail[index].total_price = parseFloat(detail[index].unit_price) * parseFloat(detail[index].quantity);
                detail[index].unit_price = parseFloat(detail[index].unit_price).toFixed(2);
                detail[index].total_price = parseFloat(detail[index].total_price).toFixed(2);
                validate = false;
                context.dispatch('mLoadTotalPOSDetail');
                break;
            }
        }
        if (validate) {
            context.commit('mAddPOSDetail',product);
            context.dispatch('mLoadTotalPOSDetail');
        }
        
    },

    mLoadEditPOSDetail(context,index){
        let detail = context.state.pos_detail;
        detail[index].quantity = detail[index].quantity.length == 0 ? 0 : parseFloat(detail[index].quantity) ;
        detail[index].unit_price = detail[index].unit_price.length == 0 ? (0).toFixed(2) : parseFloat(detail[index].unit_price).toFixed(2);
        detail[index].total_price = parseFloat(detail[index].unit_price) * parseFloat(detail[index].quantity);
        detail[index].total_price = parseFloat(detail[index].total_price).toFixed(2);
        context.dispatch('mLoadTotalPOSDetail');
    },

    mLoadDeletePOSDetail(context,index){
        context.commit('mDeletePOSDetail',index);
        context.dispatch('mLoadTotalPOSDetail');
    },

    mLoadResetPOSDetail(context){
        context.commit('mResetPOSDetail');
        context.dispatch('mLoadTotalPOSDetail');
    },


    mLoadTotalPOSDetail(context){
        let total = {
            taxed_operation:0,
            exonerated_operation:0,
            unaffected_operation:0,
            discount:0,
            subtotal:0,
            igv:0,
            total:0,
            number_to_letters:''
        }
        let detail = context.state.pos_detail;
        let coin = context.state.sale.coin;
        for (let index = 0; index < detail.length; index++) {
            if (detail[index].igv == '10') {
                total.taxed_operation += parseFloat(detail[index].total_price);
            }
            if (detail[index].igv == '20') {
                total.exonerated_operation += parseFloat(detail[index].total_price);
            }
            if (detail[index].igv == '30') {
                total.unaffected_operation += parseFloat(detail[index].total_price);
            }
        }
        total.total = (total.taxed_operation + total.exonerated_operation + total.unaffected_operation);
        total.igv = total.taxed_operation - (total.taxed_operation / 1.18);
        total.subtotal = total.total  - total.igv;
        total.taxed_operation = total.taxed_operation - total.igv;

        total.taxed_operation = total.taxed_operation.toFixed(2);
        total.exonerated_operation = total.exonerated_operation.toFixed(2);
        total.unaffected_operation = total.unaffected_operation.toFixed(2);
        total.discount = total.discount.toFixed(2);
        total.subtotal = total.subtotal.toFixed(2);
        total.igv = total.igv.toFixed(2);
        total.total = total.total.toFixed(2);
        
        converter.NumberToLettersApi(total.total,coin ).then((data) => {
        if (data.status == 200) {
            total.number_to_letters = 'SON : '+ data.result;
        }else{
            total.number_to_letters =  "SON : " +converter.NumberToLetters(total.total);
        } 
        });

        context.commit('mTotalPOS',total);
        

    },


}

//to handle mutations
const mutations = {

    mAddPOSDetail(state, detail) {
        state.pos_detail.push(detail);
    },

    mDeletePOSDetail(state, index) {
        state.pos_detail.splice(index,1);
    },
    mTotalPOS(state,total){
        state.total_pos = total;
    }
    ,
    mResetPOSDetail(state) {
        state.pos_detail = [];
        state.mclient = {id:1,full_name:'CLIENTES VARIOS - 00000000'};
    },
    mUpdateClient(state,client){
        state.mclient = client;
    },
    mUpdateWarehouse(state,id_warehouse){
        state.sale.id_warehouse = id_warehouse;
    },
    mUpdateCoin(state,coin){
        state.sale.coin = coin;
    }
    
    
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
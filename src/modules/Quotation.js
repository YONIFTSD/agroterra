const axios = require("axios").default;
const je = require("json-encrypt");
import converter from "@/assets/js/NumberToLetters";

//to handle state
const state = {
    quotation_detail: [],
    coin:'PEN',
    igv_percentage: 1.18,
    total_quotation:{
        taxed_operation: (0).toFixed(2),
        exonerated_operation: (0).toFixed(2),
        unaffected_operation: (0).toFixed(2),
        discount: (0).toFixed(2),
        subtotal: (0).toFixed(2),
        igv: (0).toFixed(2),
        total: (0).toFixed(2),
        number_to_letters: "",
    },
}

//to handle state
const getters = {}

//to handle actions
const actions = {
    mLoadIgvPercentage(context,igv_percentage) {
        let val_igv_percentage = parseFloat("1."+igv_percentage);
        context.commit('mEditIgvPercentaje',val_igv_percentage);
    },

    mLoadEditCoin(context,coin) {
        context.commit('mEditCoin',coin);
        context.dispatch('mLoadTotalQuotationDetail');
    },
    mLoadAddQuotationDetail(context,product) {
        let validate = true;
        let detail = context.state.quotation_detail;
        for (let index = 0; index < detail.length; index++) {
            if (detail[index].id_product == product.id_product) {
                detail[index].quantity = parseFloat(detail[index].quantity) + parseFloat(product.quantity);
                detail[index].total_price = parseFloat(detail[index].unit_price) * parseFloat(detail[index].quantity);
                detail[index].quantity = parseFloat(detail[index].quantity).toFixed(2);
                detail[index].unit_price = parseFloat(detail[index].unit_price).toFixed(2);
                detail[index].total_price = parseFloat(detail[index].total_price).toFixed(2);
                validate = false;
                context.dispatch('mLoadTotalQuotationDetail');
                break;
            }
        }
        if (validate) {
            context.commit('mAddQuotationDetail',product);
            context.dispatch('mLoadTotalQuotationDetail');
        }
        
    },

    mLoadEditQuotationDetail(context,id_product){
        let detail = context.state.quotation_detail;
        for (let index = 0; index < detail.length; index++) {
            if (detail[index].id_product == id_product) {
                detail[index].quantity = detail[index].quantity.length == 0 ? 0 : parseFloat(detail[index].quantity) ;
                detail[index].unit_price = detail[index].unit_price.length == 0 ? (0).toFixed(2) : parseFloat(detail[index].unit_price).toFixed(2);
                detail[index].total_price = parseFloat(detail[index].unit_price) * parseFloat(detail[index].quantity);
                detail[index].quantity = parseFloat(detail[index].quantity).toFixed(2);
                detail[index].total_price = parseFloat(detail[index].total_price).toFixed(2);
                context.dispatch('mLoadTotalQuotationDetail');
                break;
            }
        }
    },

    mLoadDeleteQuotationDetail(context,id_product){
        let detail = context.state.quotation_detail;

        for (let index = 0; index < detail.length; index++) {
            if (detail[index].id_product == id_product) {
                context.commit('mDeleteQuotationDetail',index);
                break;
            }
        }
        context.dispatch('mLoadTotalQuotationDetail');
    },

    mLoadResetQuotationDetail(context){
        context.commit('mResertQuotationDetail');
        context.dispatch('mLoadTotalQuotationDetail');
    },


    mLoadTotalQuotationDetail(context){
        
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
        let igv_percentage = context.state.igv_percentage;
        let detail = context.state.quotation_detail;
        let coin = context.state.coin;

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
        total.igv = total.taxed_operation - (total.taxed_operation / igv_percentage);
        total.subtotal = total.total  - total.igv;
        total.taxed_operation = total.taxed_operation - total.igv;

        total.taxed_operation = total.taxed_operation.toFixed(2);
        total.exonerated_operation = total.exonerated_operation.toFixed(2);
        total.unaffected_operation = total.unaffected_operation.toFixed(2);
        total.discount = total.discount.toFixed(2);
        total.subtotal = total.subtotal.toFixed(2);
        total.igv = total.igv.toFixed(2);
        total.total = total.total.toFixed(2);
        
        converter.NumberToLettersApi(total.total,coin).then((data) => {
        if (data.status == 200) {
            total.number_to_letters = 'SON : '+ data.result;
        }else{
            total.number_to_letters =  "SON : " +converter.NumberToLetters(total.total);
        } 
        });

        context.commit('mTotalSale',total);
    },


}

//to handle mutations
const mutations = {
    mEditIgvPercentaje(state, igv_percentage) {
        state.igv_percentage = parseFloat(igv_percentage);
    },
    
    mAddQuotationDetail(state, detail) {
        state.quotation_detail.push(detail);
    },

    mDeleteQuotationDetail(state, index) {
        state.quotation_detail.splice(index,1);
    },

    mTotalSale(state,total){
        state.total_quotation = total;
    },
    mResertQuotationDetail(state) {
        state.quotation_detail = [];
        state.coin = 'PEN';
    },
    mEditCoin(state,coin) {
        state.coin = coin;
    },

}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
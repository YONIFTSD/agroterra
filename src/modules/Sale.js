const axios = require("axios").default;
const je = require("json-encrypt");
import converter from "@/assets/js/NumberToLetters";

//to handle state
const state = {
    sale_detail: [],
    coin:'PEN',
    total_sale:{
        taxed_operation: (0).toFixed(2),
        exonerated_operation: (0).toFixed(2),
        unaffected_operation: (0).toFixed(2),
        discount: (0).toFixed(2),
        subtotal: (0).toFixed(2),
        igv: (0).toFixed(2),
        total: (0).toFixed(2),
        number_to_letters: "",
    },
    module_sp: 'Sale',
    role_sp: '2',
    linkages:[],
}

//to handle state
const getters = {}

//to handle actions
const actions = {
    mLoadEditCoin(context,coin) {
        context.commit('mEditCoin',coin);
        context.dispatch('mLoadTotalSaleDetail');
    },
    mLoadAddSaleDetail(context,product) {
        let validate = true;
        let detail = context.state.sale_detail;
        for (let index = 0; index < detail.length; index++) {
            if (detail[index].id_product == product.id_product) {
                detail[index].quantity = parseFloat(detail[index].quantity) + parseFloat(product.quantity);
                detail[index].total_price = parseFloat(detail[index].unit_price) * parseFloat(detail[index].quantity);
                detail[index].unit_price = parseFloat(detail[index].unit_price).toFixed(2);
                detail[index].total_price = parseFloat(detail[index].total_price).toFixed(2);
                validate = false;
                context.dispatch('mLoadTotalSaleDetail');
                break;
            }
        }
        if (validate) {
            context.commit('mAddSaleDetail',product);
            context.dispatch('mLoadTotalSaleDetail');
        }
        
    },

    mLoadEditSaleDetail(context,id_product){
        let detail = context.state.sale_detail;
        for (let index = 0; index < detail.length; index++) {
            if (detail[index].id_product == id_product) {
                detail[index].quantity = detail[index].quantity.length == 0 ? 0 : parseFloat(detail[index].quantity) ;
                detail[index].unit_price = detail[index].unit_price.length == 0 ? (0).toFixed(2) : parseFloat(detail[index].unit_price).toFixed(2);
                detail[index].total_price = parseFloat(detail[index].unit_price) * parseFloat(detail[index].quantity);
                detail[index].total_price = parseFloat(detail[index].total_price).toFixed(2);
                context.dispatch('mLoadTotalSaleDetail');
                break;
            }
        }
    },

    mLoadDeleteSaleDetail(context,id_product){
        let detail = context.state.sale_detail;

        for (let index = 0; index < detail.length; index++) {
            if (detail[index].id_product == id_product) {
                context.commit('mDeleteSaleDetail',index);
                break;
            }
        }
        context.dispatch('mLoadTotalSaleDetail');
    },

    mLoadResetSaleDetail(context){
        context.commit('mResertSaleDetail');
        context.dispatch('mLoadTotalSaleDetail');
    },


    mLoadTotalSaleDetail(context){
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
        let detail = context.state.sale_detail;
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
        
        converter.NumberToLettersApi(total.total,coin).then((data) => {
        if (data.status == 200) {
            total.number_to_letters = 'SON : '+ data.result;
        }else{
            total.number_to_letters =  "SON : " +converter.NumberToLetters(total.total);
        } 
        });

        context.commit('mTotalSale',total);
        

    },


    ///LINKEAGES
    mLoadAddLinkages(context,linkage){
        context.commit('mAddLinkages',linkage);
    },

    mLoadDeleteLinkages(context,index){
        context.commit('mDeleteLinkages',index);
    },

    mLoadResetLinkages(context){
        context.commit('mResetLinkages');
    }

}

//to handle mutations
const mutations = {

    mAddSaleDetail(state, detail) {
        state.sale_detail.push(detail);
    },

    mDeleteSaleDetail(state, index) {
        state.sale_detail.splice(index,1);
    },

    mTotalSale(state,total){
        state.total_sale = total;
    },
    mResertSaleDetail(state) {
        state.sale_detail = [];
        state.coin = 'PEN';
    },
    mEditCoin(state,coin) {
        state.coin = coin;
    },

    mAddLinkages(state, linkage) {
        state.linkages.push(linkage);
    },
    mDeleteLinkages(state, index) {
        state.linkages.splice(index,1);
    },
    mResetLinkages(state) {
        state.linkages = [];
    },
    
    
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
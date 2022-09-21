const axios = require("axios").default;
const je = require("json-encrypt");
import converter from "@/assets/js/NumberToLetters";

//to handle state
const state = {
    sale_detail: [],
    coin:'PEN',
    igv_percentage: 1.18,
    total_sale:{
        check_contingency:"0",
        check_detraction:"0",
        check_retention:"0",
        check_discount:"0",
        taxed_operation: (0).toFixed(2),
        exonerated_operation: (0).toFixed(2),
        percentage_detraction: (0).toFixed(2),
        detraction: (0).toFixed(2),
        retention: (0).toFixed(2),
        retention: (0).toFixed(2),
        discount: (0).toFixed(2),
        subtotal: (0).toFixed(2),
        igv: (0).toFixed(2),
        total: (0).toFixed(2),
        net_total: (0).toFixed(2),
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
    mLoadIgvPercentage(context,igv_percentage) {
        let val_igv_percentage = parseFloat("1."+igv_percentage);
        context.commit('mEditIgvPercentaje',val_igv_percentage);
    },

    mLoadEditCoin(context,coin) {
        context.commit('mEditCoin',coin);
        context.dispatch('mLoadTotalSaleDetail');
    },
    mLoadEditCheck(context,data) {
        context.state.total_sale.check_contingency = data.check_contingency;
        context.state.total_sale.check_retention = data.check_retention;
        context.state.total_sale.check_discount = data.check_discount;
        context.state.total_sale.check_detraction = data.check_detraction;
        context.state.total_sale.percentage_detraction = data.percentage_detraction;
        
        context.dispatch('mLoadTotalSaleDetail');
    },
    
    mLoadAddSaleDetail(context,product) {
        let validate = true;
        let detail = context.state.sale_detail;
        for (let index = 0; index < detail.length; index++) {
            if (detail[index].id_product == product.id_product) {
                detail[index].quantity = parseFloat(detail[index].quantity) + parseFloat(product.quantity);
                detail[index].total_price = parseFloat(detail[index].unit_price) * parseFloat(detail[index].quantity);
                detail[index].quantity = parseFloat(detail[index].quantity).toFixed(2);
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
                detail[index].quantity = parseFloat(detail[index].quantity).toFixed(2);
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
        context.state.total_sale.check_contingency = "0";
        context.state.total_sale.check_detraction = "0";
        context.state.total_sale.check_retention = "0";
        context.state.total_sale.check_discount = "0";
        context.state.total_sale.percentage_detraction = 0;
        // context.state.total_sale.igv_percentage = 0;
        context.commit('mResertSaleDetail');
        context.dispatch('mLoadTotalSaleDetail');
    },


    mLoadTotalSaleDetail(context){

        // debugger 
        let total = {
            taxed_operation:0,
            exonerated_operation:0,
            unaffected_operation:0,
            percentage_detraction:0,
            detraction:0,
            retention:0,
            discount:0,
            subtotal:0,
            igv:0,
            total:0,
            number_to_letters:''
        }
     
        let igv_percentage = context.state.igv_percentage;
        let detail = context.state.sale_detail;
        let total_sale = context.state.total_sale;
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

        if(total_sale.check_retention == "1"){
            total.retention = parseFloat(total.total) * parseFloat(0.03);
        }else{
            total.retention = parseFloat(0).toFixed(2);
        }

        if(total_sale.check_detraction == "1"){
            total.percentage_detraction = total_sale.percentage_detraction.length == 0 ? 0:total_sale.percentage_detraction;
            if (parseFloat(total.percentage_detraction) >= 1.5 && parseFloat(total.percentage_detraction) <= 12) {
                total.detraction = parseFloat(total.total) * (parseFloat(total.percentage_detraction) / 100);
                total.detraction = Math.round(total.detraction)
            }else{
                total.detraction = parseFloat(0).toFixed(2);
                total.percentage_detraction = parseFloat(0).toFixed(2);
            }
            
        }else{
            total.detraction = parseFloat(0).toFixed(2);
            total.percentage_detraction = parseFloat(0).toFixed(2);
        }
        total.net_total = parseFloat(total.total) - parseFloat(total.detraction) - parseFloat(total.retention);

        total.retention = parseFloat(total.retention).toFixed(2);
        total.percentage_detraction = parseFloat(total.percentage_detraction).toFixed(2);
        total.detraction = parseFloat(total.detraction).toFixed(2);
        total.net_total = parseFloat(total.net_total).toFixed(2);

        total.check_contingency = total_sale.check_contingency;
        total.check_detraction = total_sale.check_detraction;
        total.check_retention = total_sale.check_retention;
        total.check_discount = total_sale.check_discount; 

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
    
    mEditIgvPercentaje(state, igv_percentage) {
        state.igv_percentage = parseFloat(igv_percentage);
    },

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
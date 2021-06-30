const axios = require("axios").default;
const je = require("json-encrypt");
//to handle state
const state = {
    shopping_detail: [],
    munit_value:'0',
    linkages:[],
    total_shopping:{
        expenses: (0).toFixed(2),
        taxed_operation: (0).toFixed(2),
        exonerated_operation: (0).toFixed(2),
        unaffected_operation: (0).toFixed(2),
        discount: (0).toFixed(2),
        subtotal: (0).toFixed(2),
        igv: (0).toFixed(2),
        total: (0).toFixed(2),
    },
    module_sp: 'Shopping',
    role_sp: '2',
}

//to handle state
const getters = {}

//to handle actions
const actions = {

    mLoadAddShoppingDetail(context,product) {
        let validate = true;
        let detail = context.state.shopping_detail;
        let unit_value = context.state.munit_value;
        for (let index = 0; index < detail.length; index++) {
            if (detail[index].id_product == product.id_product) {

                detail[index].quantity = parseFloat(detail[index].quantity) + parseFloat(product.quantity);
                detail[index].unit_value = detail[index].unit_value.length == 0 ? (0).toFixed(2) : parseFloat(detail[index].unit_value).toFixed(2);
                detail[index].percentage_discount = detail[index].percentage_discount.length == 0 ? (0).toFixed(2) : parseFloat(detail[index].percentage_discount).toFixed(2);
                detail[index].unit_discount = (parseFloat(detail[index].percentage_discount) * parseFloat(detail[index].unit_value)) / 100;
                detail[index].total_discount = (parseFloat(detail[index].unit_discount) * parseFloat(detail[index].quantity));
                
                
                if (unit_value == "1") {
                    let net_unit_value = (parseFloat(detail[index].unit_value) - parseFloat(detail[index].unit_discount));
                    if (detail[index].igv == "10") {
                        detail[index].unit_price = net_unit_value;
                        detail[index].net_unit_value = net_unit_value / 1.18;
                        detail[index].unit_igv = parseFloat(detail[index].unit_price) - parseFloat(detail[index].net_unit_value);
                    }else{
                        detail[index].unit_igv = 0;
                        detail[index].net_unit_value = net_unit_value;
                        detail[index].unit_price = net_unit_value;
                    }
                }else{
                    let net_unit_value = (parseFloat(detail[index].unit_value) - parseFloat(detail[index].unit_discount));
                    if (detail[index].igv == "10") {
                        detail[index].unit_igv = net_unit_value * 0.18;
                        detail[index].net_unit_value = net_unit_value;
                        detail[index].unit_price = parseFloat(detail[index].net_unit_value) + parseFloat(detail[index].unit_igv);
                    }else{
                        detail[index].unit_igv = 0;
                        detail[index].net_unit_value = net_unit_value;
                        detail[index].unit_price = net_unit_value;
                    }
                }

                detail[index].total_value = parseFloat(detail[index].unit_value) * parseFloat(detail[index].quantity);
                detail[index].net_total_value = parseFloat(detail[index].net_unit_value) * parseFloat(detail[index].quantity);
                detail[index].total_igv = parseFloat(detail[index].unit_igv) * parseFloat(detail[index].quantity);
                detail[index].total_price = parseFloat(detail[index].unit_price) * parseFloat(detail[index].quantity);
                

                detail[index].unit_discount = detail[index].unit_discount.toFixed(2);
                detail[index].net_unit_value = detail[index].net_unit_value.toFixed(2);
                detail[index].unit_igv = detail[index].unit_igv.toFixed(2);
                detail[index].unit_price = detail[index].unit_price.toFixed(2);
                
                detail[index].total_value = detail[index].total_value.toFixed(2);
                detail[index].total_discount = detail[index].total_discount.toFixed(2);
                detail[index].net_total_value = detail[index].net_total_value.toFixed(2);
                detail[index].total_igv = detail[index].total_igv.toFixed(2);
                detail[index].total_price = detail[index].total_price.toFixed(2);

                validate = false;
                context.dispatch('mLoadTotalsShoppingDetail');
                break;
            }
        }
        if (validate) {
            context.commit('mAddShoppingDetail',product);
            context.dispatch('mLoadTotalsShoppingDetail');
        }
        
    },

    mLoadUnitValue(context,value){
        context.commit('mUnitValueShopping',value);
    },

    mLoadExpensesValue(context,value){
        context.commit('mExpensesValueShopping',value);
    },
    
    mLoadEditShoppingDetail(context,id_product){
        let detail = context.state.shopping_detail;
        let unit_value = context.state.munit_value;
        for (let index = 0; index < detail.length; index++) {
            if (detail[index].id_product == id_product) {
                detail[index].quantity = detail[index].quantity.length == 0 ? 0 : parseFloat(detail[index].quantity);
                detail[index].unit_value = detail[index].unit_value.length == 0 ? (0).toFixed(2) : parseFloat(detail[index].unit_value).toFixed(2);
                
                detail[index].percentage_discount = detail[index].percentage_discount.length == 0 ? (0).toFixed(2) : parseFloat(detail[index].percentage_discount).toFixed(2);
                detail[index].unit_discount = (parseFloat(detail[index].percentage_discount) * parseFloat(detail[index].unit_value)) / 100;
                detail[index].total_discount = (parseFloat(detail[index].unit_discount) * parseFloat(detail[index].quantity));
                

                if (unit_value == "1") {
                    let net_unit_value = (parseFloat(detail[index].unit_value) - parseFloat(detail[index].unit_discount));
                    if (detail[index].igv == "10") {
                        detail[index].unit_price = net_unit_value;
                        detail[index].net_unit_value = net_unit_value / 1.18;
                        detail[index].unit_igv = parseFloat(detail[index].unit_price) - parseFloat(detail[index].net_unit_value);
                    }else{
                        detail[index].unit_igv = 0;
                        detail[index].net_unit_value = net_unit_value;
                        detail[index].unit_price = net_unit_value;
                    }
                }else{
                    let net_unit_value = (parseFloat(detail[index].unit_value) - parseFloat(detail[index].unit_discount));
                    if (detail[index].igv == "10") {
                        detail[index].unit_igv = net_unit_value * 0.18;
                        detail[index].net_unit_value = net_unit_value;
                        detail[index].unit_price = parseFloat(detail[index].net_unit_value) + parseFloat(detail[index].unit_igv);
                    }else{
                        detail[index].unit_igv = 0;
                        detail[index].net_unit_value = net_unit_value;
                        detail[index].unit_price = net_unit_value;
                    }
                }

                
                detail[index].total_value = parseFloat(detail[index].unit_value) * parseFloat(detail[index].quantity);
                detail[index].net_total_value = parseFloat(detail[index].net_unit_value) * parseFloat(detail[index].quantity);
                detail[index].total_igv = parseFloat(detail[index].unit_igv) * parseFloat(detail[index].quantity);
                detail[index].total_price = parseFloat(detail[index].unit_price) * parseFloat(detail[index].quantity);
                

                detail[index].unit_discount = detail[index].unit_discount.toFixed(2);
                detail[index].net_unit_value = detail[index].net_unit_value.toFixed(2);
                detail[index].unit_igv = detail[index].unit_igv.toFixed(2);
                detail[index].unit_price = detail[index].unit_price.toFixed(2);
                
                detail[index].total_value = detail[index].total_value.toFixed(2);
                detail[index].total_discount = detail[index].total_discount.toFixed(2);
                detail[index].net_total_value = detail[index].net_total_value.toFixed(2);
                detail[index].total_igv = detail[index].total_igv.toFixed(2);
                detail[index].total_price = detail[index].total_price.toFixed(2);

                context.dispatch('mLoadTotalsShoppingDetail');
                break;
            }
        }
    },

    mLoadDeleteShoppingDetail(context,id_product){
        let detail = context.state.shopping_detail;

        for (let index = 0; index < detail.length; index++) {
            if (detail[index].id_product == id_product) {
                context.commit('mDeleteShoppingDetail',index);
                context.dispatch('mLoadTotalsShoppingDetail');
                break;
            }
        }
    },

    mLoadResetShoppingDetail(context){
        context.commit('mResertShoppingDetail');
        context.dispatch('mLoadTotalsShoppingDetail');
    },

    mLoadTotalsShoppingDetail(context){

        let total = {
            expenses: parseFloat(context.state.total_shopping.expenses),
            taxed_operation:0,
            exonerated_operation:0,
            unaffected_operation:0,
            discount:0,
            subtotal:0,
            igv:0,
            total:0
        }
        let detail = context.state.shopping_detail;

        for (let index = 0; index < detail.length; index++) {
            total.discount += parseFloat(detail[index].total_discount);
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

        let igv_expenses = total.expenses - (total.expenses / 1.18)
        total.total = (total.taxed_operation + total.exonerated_operation + total.unaffected_operation + total.expenses);
        total.igv = total.taxed_operation - (total.taxed_operation / 1.18);
        total.taxed_operation = total.taxed_operation - total.igv;
        total.igv = parseFloat(total.igv) + parseFloat(igv_expenses);
        total.subtotal = total.total  - total.igv;
  
        total.expenses = total.expenses.toFixed(2);
        total.taxed_operation = total.taxed_operation.toFixed(2);
        total.exonerated_operation = total.exonerated_operation.toFixed(2);
        total.unaffected_operation = total.unaffected_operation.toFixed(2);
        total.discount = total.discount.toFixed(2);
        total.subtotal = total.subtotal.toFixed(2);
        total.igv = total.igv.toFixed(2);
        total.total = total.total.toFixed(2);
            
        context.commit('mTotalsShopping',total);
        

    },








    //LINKAGES
    mLoadAddLinkages(context,linkage) {
        let validate = true;
        let linkages = context.state.linkages;
        for (let index = 0; index < linkages.length; index++) {
            if (linkages[index].id_linkage == linkage.id_linkage) {
                validate = false;
                break;
            }
        }

        if (validate) {
            context.commit('mAddLinkages',linkage);
        }
    },

    mLoadDeleteLinkages(context,index){
        context.commit('mDeleteLinkages',index);
    },

}

//to handle mutations
const mutations = {

    mUnitValueShopping(state,value){
        state.munit_value = value;
    },

    mExpensesValueShopping(state,value){
        state.total_shopping.expenses = value;
    },

    mAddShoppingDetail(state, detail) {
        state.shopping_detail.push(detail);
    },

    mDeleteShoppingDetail(state, index) {
        state.shopping_detail.splice(index,1);
    },

    mTotalsShopping(state,total){
        state.total_shopping = total;
    }
    ,
    mResertShoppingDetail(state) {
        state.shopping_detail = [];
        state.total_shopping.expenses = 0;
        state.linkages = [];
    },



    mAddLinkages(state, linkage) {
        state.linkages.push(linkage);
    },

    mDeleteLinkages(state, index) {
        state.linkages.splice(index,1);
    },

}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
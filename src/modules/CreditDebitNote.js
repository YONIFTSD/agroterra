
//to handle state
const state = {
    credit_debit_detail: [],
    munit_value:'0',
    linkages:[],
    total_credit_debit:{
        taxed_operation: (0).toFixed(2),
        exonerated_operation: (0).toFixed(2),
        unaffected_operation: (0).toFixed(2),
        discount: (0).toFixed(2),
        subtotal: (0).toFixed(2),
        igv: (0).toFixed(2),
        total: (0).toFixed(2),
    },
}

//to handle state
const getters = {}

//to handle actions
const actions = {

    mLoadAddCreditDebitDetail(context,product) {
        context.commit('mAddCreditDebitDetail',product);
        context.dispatch('mLoadTotalsCreditDebitDetail'); 
    },

    mLoadUnitValue(context,value){
        context.commit('mUnitValueCreditDebit',value);
    },

    mLoadExpensesValue(context,value){
        context.commit('mExpensesValueCreditDebit',value);
    },
    
    mLoadEditCreditDebitDetail(context,data){
        let detail = context.state.credit_debit_detail;
        
        if (data.type == 1) {
            let unit_value = detail[data.index].unit_value.length == 0 ? 0:parseFloat(detail[data.index].unit_value);
            if (detail[data.index].igv == "10") {
                detail[data.index].unit_value = unit_value;
                detail[data.index].unit_igv = unit_value * 0.18;
                detail[data.index].unit_price = parseFloat(detail[data.index].unit_value) + parseFloat(detail[data.index].unit_igv);
            }else{
                detail[data.index].unit_igv = 0;
                detail[data.index].unit_value = unit_value;
                detail[data.index].unit_price = unit_value;
            }
        }
        if (data.type == 2) {
            let unit_price = detail[data.index].unit_price.length == 0 ? 0:parseFloat(detail[data.index].unit_price);
            if (detail[data.index].igv == "10") {
                detail[data.index].unit_price = unit_price;
                detail[data.index].unit_value = unit_price / 1.18;
                detail[data.index].unit_igv = parseFloat(detail[data.index].unit_price) - parseFloat(detail[data.index].unit_value);
            }else{
                detail[data.index].unit_igv = 0;
                detail[data.index].unit_value = unit_price;
                detail[data.index].unit_price = unit_price;
            }
        }

        detail[data.index].total_value = parseFloat(detail[data.index].unit_value) * parseFloat(detail[data.index].quantity);
        detail[data.index].total_igv = parseFloat(detail[data.index].unit_igv) * parseFloat(detail[data.index].quantity);
        detail[data.index].total_price = parseFloat(detail[data.index].unit_price) * parseFloat(detail[data.index].quantity);

        detail[data.index].unit_value = parseFloat(detail[data.index].unit_value).toFixed(2);
        detail[data.index].unit_igv = parseFloat(detail[data.index].unit_igv).toFixed(2);
        detail[data.index].unit_price = parseFloat(detail[data.index].unit_price).toFixed(2);
        
        detail[data.index].total_value = detail[data.index].total_value.toFixed(2);
        detail[data.index].total_igv = detail[data.index].total_igv.toFixed(2);
        detail[data.index].total_price = detail[data.index].total_price.toFixed(2);

        context.dispatch('mLoadTotalsCreditDebitDetail');
    
    },

    mLoadDeleteCreditDebitDetail(context,index){
        context.commit('mDeleteCreditDebitDetail',index);
        context.dispatch('mLoadTotalsCreditDebitDetail');
    },

    mLoadResetCreditDebitDetail(context){
        context.commit('mResetLinkages');
        context.commit('mResertCreditDebitDetail');
        context.dispatch('mLoadTotalsCreditDebitDetail');
    },

    mLoadTotalsCreditDebitDetail(context){

        let total = {
            taxed_operation:0,
            exonerated_operation:0,
            unaffected_operation:0,
            discount:0,
            subtotal:0,
            igv:0,
            total:0
        }
        let detail = context.state.credit_debit_detail;
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
        total.taxed_operation = total.taxed_operation - total.igv;
        total.igv = total.igv;
        total.subtotal = total.total  - total.igv;
  
        total.taxed_operation = total.taxed_operation.toFixed(2);
        total.exonerated_operation = total.exonerated_operation.toFixed(2);
        total.unaffected_operation = total.unaffected_operation.toFixed(2);
        total.discount = total.discount.toFixed(2);
        total.subtotal = total.subtotal.toFixed(2);
        total.igv = total.igv.toFixed(2);
        total.total = total.total.toFixed(2);
        context.commit('mTotalsCreditDebit',total);
        

    },








    //LINKAGES
    mLoadAddLinkages(context,linkage) {
        let validate = true;
        context.commit('mResetLinkages');
        context.dispatch('mLoadResetCreditDebitDetail');
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
        context.dispatch('mLoadResetCreditDebitDetail');
    },

}

//to handle mutations
const mutations = {

    mUnitValueCreditDebit(state,value){
        state.munit_value = value;
    },

    mExpensesValueCreditDebit(state,value){
        state.total_credit_debit.expenses = value;
    },

    mAddCreditDebitDetail(state, detail) {
        state.credit_debit_detail.push(detail);
    },

    mDeleteCreditDebitDetail(state, index) {
        state.credit_debit_detail.splice(index,1);
    },

    mTotalsCreditDebit(state,total){
        state.total_credit_debit = total;
    }
    ,
    mResertCreditDebitDetail(state) {
        state.credit_debit_detail = [];
        state.total_credit_debit.expenses = 0;
        state.linkages = [];
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
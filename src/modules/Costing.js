const axios = require("axios").default;
const je = require("json-encrypt");
//to handle state
const state = {
    costing_detail: [],
    expenses:[],
    proration_type_costing:'',
    total_costing:{
        amount_note: (0).toFixed(2),
        invoice_expenses: (0).toFixed(2),
        taxed_operation_final: (0).toFixed(2),
        exonerated_operation_final: (0).toFixed(2),
        unaffected_operation_final: (0).toFixed(2),
        discount_final: (0).toFixed(2),
        subtotal_final: (0).toFixed(2),
        igv_final: (0).toFixed(2),
        total_final: (0).toFixed(2),
    },
}

//to handle state
const getters = {}

//to handle actions
const actions = {

    mLoadAddCostingDetail(context,product) {
        let validate = true;
        let detail = context.state.costing_detail;
        let unit_value = context.state.proration_type;
        // for (let index = 0; index < detail.length; index++) {
        //     if (detail[index].id_product == product.id_product) {
        //         detail[index].quantity = parseFloat(detail[index].quantity) + parseFloat(product.quantity);
        //         detail[index].quantity = parseFloat(detail[index].quantity).toFixed(2);
        //         validate = false;
        //         context.dispatch('mLoadTotalsCostingDetail');
        //         break;
        //     }
        // }
        // if (validate) {
            context.commit('mAddCostingDetail',product);
            context.dispatch('mLoadTotalsCostingDetail');
        // }
        
    },

    mLoadProrationTypeValue(context,value){
        context.commit('mProrationTypeValueCosting',value);
    },

    mLoadInvoiceExpensesValue(context,value){
        context.commit('mInvoiceExpensesValueCosting',value);
    },

    mLoadEditCostingDetail(context,index){
        let detail = context.state.costing_detail;
        let unit_value = context.state.munit_value;
        
        // for (let index = 0; index < detail.length; index++) {
            // if (detail[index].id_product == id_product) {
                detail[index].quantity = detail[index].quantity.length == 0 ? 0 : parseFloat(detail[index].quantity);
                detail[index].quantity = parseFloat(detail[index].quantity).toFixed(2);
                context.dispatch('mLoadTotalsCostingDetail');
        //         break;
        //     }
        // }
    },

    mLoadResetCostingDetail(context){
        context.commit('mResertCostingDetail');
        context.commit('mProrationTypeValueCosting','');
        context.dispatch('mLoadTotalsCostingDetail');
    },

    mLoadTotalsCostingDetail(context){
        
        let proration_type = context.state.proration_type_costing;
        let total = {
            amount_note: 0,
            invoice_expenses: parseFloat(context.state.total_costing.invoice_expenses),
            taxed_operation_final: 0,
            exonerated_operation_final: 0,
            unaffected_operation_final: 0,
            discount_final: 0,
            subtotal_final: 0,
            igv_final: 0,
            total_final: 0,
        }
        let detail = context.state.costing_detail;
        let base_expense = parseFloat(total.invoice_expenses) / 1.18;
        let igv_expense = parseFloat(base_expense) * 0.18;
        
        if (proration_type != "") {
            if (proration_type == 1) {
                let packages = 0;
                for (let index = 0; index < detail.length; index++) {
                    packages += parseFloat(detail[index].package);
                }
                let distribution_factor = parseFloat(base_expense) / parseFloat(packages);
                for (let index = 0; index < detail.length; index++) {
                  detail[index].total_freight_value = parseFloat(detail[index].package) * parseFloat(distribution_factor);
                  detail[index].unit_freight_value = parseFloat(detail[index].total_freight_value) / parseFloat(detail[index].quantity);
                  detail[index].total_cost = parseFloat(detail[index].net_total_value) + parseFloat(detail[index].total_freight_value);
                  detail[index].unit_cost = parseFloat(detail[index].total_cost) / parseFloat(detail[index].quantity);
                  
                  if (detail[index].igv == '10') {
                    detail[index].total_cost_igv = parseFloat(detail[index].total_cost) * parseFloat(0.18);
                    detail[index].total_cost_final = parseFloat(detail[index].total_cost) + parseFloat(detail[index].total_cost_igv);
                    detail[index].unit_cost_igv = parseFloat(detail[index].total_cost_igv) / parseFloat(detail[index].quantity);
                    detail[index].unit_cost_final = parseFloat(detail[index].total_cost_final) / parseFloat(detail[index].quantity);
                  }else{
                    detail[index].total_cost_igv = parseFloat(detail[index].total_freight_value) * parseFloat(0.18);
                    detail[index].total_cost_final = parseFloat(detail[index].total_cost) + parseFloat(detail[index].total_cost_igv);
                    detail[index].unit_cost_igv = parseFloat(detail[index].total_cost_igv) / parseFloat(detail[index].quantity);
                    detail[index].unit_cost_final = parseFloat(detail[index].total_cost_final) / parseFloat(detail[index].quantity);
                  }

                  detail[index].unit_freight_value = parseFloat(detail[index].unit_freight_value).toFixed(5);
                  detail[index].total_freight_value = parseFloat(detail[index].total_freight_value).toFixed(5);
                  detail[index].unit_cost = parseFloat(detail[index].unit_cost).toFixed(5);
                  detail[index].unit_cost_igv = parseFloat(detail[index].unit_cost_igv).toFixed(5);
                  detail[index].unit_cost_final = parseFloat(detail[index].unit_cost_final).toFixed(5);
                  detail[index].total_cost = parseFloat(detail[index].total_cost).toFixed(5);
                  detail[index].total_cost_igv = parseFloat(detail[index].total_cost_igv).toFixed(5);
                  detail[index].total_cost_final = parseFloat(detail[index].total_cost_final).toFixed(5);
                  

                }
                // console.log(detail)
                context.commit('mCostingDetail',detail);
            }

            if (proration_type == 2) {
                let gross_weight = 0;
                for (let index = 0; index < detail.length; index++) {
                    gross_weight += parseFloat(detail[index].gross_weight * detail[index].quantity);
                }
                let distribution_factor = parseFloat(base_expense) / parseFloat(gross_weight);
                console.log(distribution_factor);
                for (let index = 0; index < detail.length; index++) {
                  detail[index].total_freight_value = parseFloat(detail[index].gross_weight * detail[index].quantity) * parseFloat(distribution_factor);
                  detail[index].unit_freight_value = parseFloat(detail[index].gross_weight) * parseFloat(distribution_factor);
                  detail[index].total_cost = parseFloat(detail[index].net_total_value) + parseFloat(detail[index].total_freight_value);
                  detail[index].unit_cost = parseFloat(detail[index].total_cost) / parseFloat(detail[index].quantity);
                  
                  if (detail[index].igv == '10') {
                    detail[index].total_cost_igv = parseFloat(detail[index].total_cost) * parseFloat(0.18);
                    detail[index].total_cost_final = parseFloat(detail[index].total_cost) + parseFloat(detail[index].total_cost_igv);
                    detail[index].unit_cost_igv = parseFloat(detail[index].total_cost_igv) / parseFloat(detail[index].quantity);
                    detail[index].unit_cost_final = parseFloat(detail[index].total_cost_final) / parseFloat(detail[index].quantity);
                  }else{
                    detail[index].total_cost_igv = parseFloat(detail[index].total_freight_value) * parseFloat(0.18);
                    detail[index].total_cost_final = parseFloat(detail[index].total_cost) + parseFloat(detail[index].total_cost_igv);
                    detail[index].unit_cost_igv = parseFloat(detail[index].total_cost_igv) / parseFloat(detail[index].quantity);
                    detail[index].unit_cost_final = parseFloat(detail[index].total_cost_final) / parseFloat(detail[index].quantity);
                  }

                  detail[index].unit_freight_value = parseFloat(detail[index].unit_freight_value).toFixed(5);
                  detail[index].total_freight_value = parseFloat(detail[index].total_freight_value).toFixed(5);
                  detail[index].unit_cost = parseFloat(detail[index].unit_cost).toFixed(5);
                  detail[index].unit_cost_igv = parseFloat(detail[index].unit_cost_igv).toFixed(5);
                  detail[index].unit_cost_final = parseFloat(detail[index].unit_cost_final).toFixed(5);
                  detail[index].total_cost = parseFloat(detail[index].total_cost).toFixed(5);
                  detail[index].total_cost_igv = parseFloat(detail[index].total_cost_igv).toFixed(5);
                  detail[index].total_cost_final = parseFloat(detail[index].total_cost_final).toFixed(5);
                }
                console.log(detail)
                context.commit('mCostingDetail',detail);
            }

            if (proration_type == 3) {
                let quantities = 0;
                for (let index = 0; index < detail.length; index++) {
                    quantities += parseFloat(detail[index].quantity);
                }
                let distribution_factor = parseFloat(base_expense) / parseFloat(quantities);
                for (let index = 0; index < detail.length; index++) {
                    detail[index].total_freight_value = parseFloat(detail[index].quantity) * parseFloat(distribution_factor);
                    detail[index].unit_freight_value = distribution_factor;
                    detail[index].total_cost = parseFloat(detail[index].net_total_value) + parseFloat(detail[index].total_freight_value);
                    detail[index].unit_cost = parseFloat(detail[index].total_cost) / parseFloat(detail[index].quantity);
                    
                    if (detail[index].igv == '10') {
                      detail[index].total_cost_igv = parseFloat(detail[index].total_cost) * parseFloat(0.18);
                      detail[index].total_cost_final = parseFloat(detail[index].total_cost) + parseFloat(detail[index].total_cost_igv);
                      detail[index].unit_cost_igv = parseFloat(detail[index].total_cost_igv) / parseFloat(detail[index].quantity);
                      detail[index].unit_cost_final = parseFloat(detail[index].total_cost_final) / parseFloat(detail[index].quantity);
                    }else{
                      detail[index].total_cost_igv = parseFloat(detail[index].total_freight_value) * parseFloat(0.18);
                      detail[index].total_cost_final = parseFloat(detail[index].total_cost) + parseFloat(detail[index].total_cost_igv);
                      detail[index].unit_cost_igv = parseFloat(detail[index].total_cost_igv) / parseFloat(detail[index].quantity);
                      detail[index].unit_cost_final = parseFloat(detail[index].total_cost_final) / parseFloat(detail[index].quantity);
                    }
                    detail[index].unit_freight_value = parseFloat(detail[index].unit_freight_value).toFixed(5);
                    detail[index].total_freight_value = parseFloat(detail[index].total_freight_value).toFixed(5);
                    detail[index].unit_cost = parseFloat(detail[index].unit_cost).toFixed(5);
                    detail[index].unit_cost_igv = parseFloat(detail[index].unit_cost_igv).toFixed(5);
                    detail[index].unit_cost_final = parseFloat(detail[index].unit_cost_final).toFixed(5);
                    detail[index].total_cost = parseFloat(detail[index].total_cost).toFixed(5);
                    detail[index].total_cost_igv = parseFloat(detail[index].total_cost_igv).toFixed(5);
                    detail[index].total_cost_final = parseFloat(detail[index].total_cost_final).toFixed(5);

                  }
                //   console.log(detail)
                  context.commit('mCostingDetail',detail);
            }

            if (proration_type == 4) {
                let total_value = 0;
                for (let index = 0; index < detail.length; index++) {
                    total_value += parseFloat(detail[index].net_total_value);
                }
                let distribution_factor = parseFloat(base_expense) / parseFloat(total_value);
                for (let index = 0; index < detail.length; index++) {
                    detail[index].total_freight_value = parseFloat(detail[index].net_total_value) * parseFloat(distribution_factor);
                    detail[index].unit_freight_value = parseFloat(detail[index].net_unit_value) * parseFloat(distribution_factor);
                    detail[index].total_cost = parseFloat(detail[index].net_total_value) + parseFloat(detail[index].total_freight_value);
                    detail[index].unit_cost = parseFloat(detail[index].total_cost) / parseFloat(detail[index].quantity);
                    
                    if (detail[index].igv == '10') {
                      detail[index].total_cost_igv = parseFloat(detail[index].total_cost) * parseFloat(0.18);
                      detail[index].total_cost_final = parseFloat(detail[index].total_cost) + parseFloat(detail[index].total_cost_igv);
                      detail[index].unit_cost_igv = parseFloat(detail[index].total_cost_igv) / parseFloat(detail[index].quantity);
                      detail[index].unit_cost_final = parseFloat(detail[index].total_cost_final) / parseFloat(detail[index].quantity);
                    }else{
                      detail[index].total_cost_igv = parseFloat(detail[index].total_freight_value) * parseFloat(0.18);
                      detail[index].total_cost_final = parseFloat(detail[index].total_cost) + parseFloat(detail[index].total_cost_igv);
                      detail[index].unit_cost_igv = parseFloat(detail[index].total_cost_igv) / parseFloat(detail[index].quantity);
                      detail[index].unit_cost_final = parseFloat(detail[index].total_cost_final) / parseFloat(detail[index].quantity);
                    }
                    detail[index].unit_freight_value = parseFloat(detail[index].unit_freight_value).toFixed(5);
                    detail[index].total_freight_value = parseFloat(detail[index].total_freight_value).toFixed(5);
                    detail[index].unit_cost = parseFloat(detail[index].unit_cost).toFixed(5);
                    detail[index].unit_cost_igv = parseFloat(detail[index].unit_cost_igv).toFixed(5);
                    detail[index].unit_cost_final = parseFloat(detail[index].unit_cost_final).toFixed(5);
                    detail[index].total_cost = parseFloat(detail[index].total_cost).toFixed(5);
                    detail[index].total_cost_igv = parseFloat(detail[index].total_cost_igv).toFixed(5);
                    detail[index].total_cost_final = parseFloat(detail[index].total_cost_final).toFixed(5);

                  }
                //   console.log(detail)
                  context.commit('mCostingDetail',detail);
            }
        }



        for (let index = 0; index < detail.length; index++) {
            total.discount_final += parseFloat(detail[index].total_discount);
            if (detail[index].igv == '10') {
                total.taxed_operation_final += parseFloat(detail[index].total_cost_final);
            }
            if (detail[index].igv == '20') {
                total.exonerated_operation_final += parseFloat(detail[index].total_cost_final);
            }
            if (detail[index].igv == '30') {
                total.unaffected_operation_final += parseFloat(detail[index].total_cost_final);
            }
        }

 
        total.total_final = (total.taxed_operation_final + total.exonerated_operation_final + total.unaffected_operation_final);
        total.igv_final = total.taxed_operation_final - (total.taxed_operation_final / 1.18);
        total.taxed_operation_final = total.taxed_operation_final - total.igv_final;
        total.subtotal_final = total.total_final - total.igv_final;

        total.invoice_expenses = total.invoice_expenses.toFixed(2);
        total.taxed_operation_final = total.taxed_operation_final.toFixed(2);
        total.exonerated_operation_final = total.exonerated_operation_final.toFixed(2);
        total.unaffected_operation_final = total.unaffected_operation_final.toFixed(2);
        total.discount_final = total.discount_final.toFixed(2);
        total.subtotal_final = total.subtotal_final.toFixed(2);
        total.igv_final = total.igv_final.toFixed(2);
        total.total_final = total.total_final.toFixed(2);
            
        context.commit('mTotalsCosting',total);
        

    },







    mLoadAddCostingExpenses(context,expenses) {
        let validate = true;
        let detail = context.state.expenses;
        for (let index = 0; index < detail.length; index++) {
            if (detail[index].module == expenses.module && detail[index].id_module == expenses.id_module) {
                validate = false;
                break;
            }
        }
        if (validate) {
            context.commit('mAddCostingExpenses',expenses);
            context.dispatch('mLoadTotalCostingExpenses');
        }
        
    },

    mLoadDeleteCostingExpenses(context,index){
        context.commit('mDeleteCostingExpenses',index);
        context.dispatch('mLoadTotalCostingExpenses');
    },

    mLoadResetCostingExpenses(context){
        context.commit('mResertCostingExpenses');
        context.dispatch('mLoadTotalCostingExpenses');
    },

    mLoadTotalCostingExpenses(context){
        let detail = context.state.expenses;
        let total = 0;
        for (let index = 0; index < detail.length; index++) {
            if (detail[index].module == "PurchaseExpense") {
                total += parseFloat(detail[index].total);
            }
            if (detail[index].module == "Shopping") {
                total += parseFloat(detail[index].total);
            }
            if (detail[index].module == "CreditDebitNote") {
                if (detail[index].type_invoice == "07") {
                    total -= parseFloat(detail[index].total);  
                }
                if (detail[index].type_invoice == "08") {
                    total += parseFloat(detail[index].total);  
                }
                
            }
            
        }
        context.commit('mInvoiceExpensesValueCosting',total);
        context.dispatch('mLoadTotalsCostingDetail');
        
    },

    
    
}

//to handle mutations
const mutations = {


    mProrationTypeValueCosting(state,value){
        state.proration_type_costing = value;
    },

    mInvoiceExpensesValueCosting(state,value){
        state.total_costing.invoice_expenses = value;
    },

    mAddCostingDetail(state, detail) {
        state.costing_detail.push(detail);
    },

    mCostingDetail(state, detail) {
        state.costing_detail = detail;
    },

    mDeleteCostingDetail(state, index) {
        state.costing_detail.splice(index,1);
    },

    mTotalsCosting(state,total){
        state.total_costing = total;
    }
    ,
    mResertCostingDetail(state) {
        state.costing_detail = [];
  
    },





    mAddCostingExpenses(state, detail) {
        state.expenses.push(detail);
    },
    mDeleteCostingExpenses(state, index) {
        state.expenses.splice(index,1);
    },
    mResertCostingExpenses(state) {
        state.expenses = [];
    },

}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
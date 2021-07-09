//to handle state
const state = {
    mexchange_document: {
        total: (0).toFixed(2),
        applied: (0).toFixed(2),
        balance: (0).toFixed(2),
    },
    account_pay: [],
    bill_exchange: [],
}

//to handle state
const getters = {}

//to handle actions
const actions = {

    mLoadAddAccountPay(context,account) {
        let detail = context.state.account_pay;
        let validate = true;
        for (let index = 0; index < detail.length; index++) {
            const element = detail[index];
            if (element.id_account_pay == account.id_account_pay) {
                validate = false;
                break;
            }
        }
        if (validate) {
            context.commit('mAddAccountPay',account);
            context.dispatch('mLoadTotalAccountPay');
        }
        
    },
    mLoadDeleteAccountPay(context,index){
        context.commit('mDeleteAccountPay',index);
        context.dispatch('mLoadTotalAccountPay');
    },

    mLoadTotalAccountPay(context){
        let detail = context.state.account_pay;
        let total = 0;
        for (let index = 0; index < detail.length; index++) {
            const element = detail[index];
            total += parseFloat(element.total);
        }
        total = total.toFixed(2);
        context.commit('mTotalExchangeDocument',total);
    },

    mLoadAddBillExchange(context,bill_exchange) {
        context.commit('mAddBillExchange',bill_exchange);
    },
    mLoadDeleteBillExchange(context,index){
        context.commit('mDeleteBillExchange',index);
    },
    mLoadResetExchangeDocument(context){
        context.commit('mResetExchangeDocument');
    },

}

//to handle mutations
const mutations = {

    mAddAccountPay(state, account) {
        state.account_pay.push(account);
    },
    mDeleteAccountPay(state, index) {
        state.account_pay.splice(index,1);
    },

    mAddBillExchange(state, bill) {
        state.bill_exchange.push(bill);
        state.mexchange_document.applied = parseFloat(state.mexchange_document.applied) + parseFloat(bill.total);
        state.mexchange_document.applied = state.mexchange_document.applied.toFixed(2);
        state.mexchange_document.balance = parseFloat(state.mexchange_document.balance) - parseFloat(bill.total);
        state.mexchange_document.balance = state.mexchange_document.balance.toFixed(2);
    },
    mDeleteBillExchange(state, index) {
        let total = state.bill_exchange[index].total;
        state.bill_exchange.splice(index,1);
        state.mexchange_document.applied = parseFloat(state.mexchange_document.applied) - parseFloat(total);
        state.mexchange_document.applied = state.mexchange_document.applied.toFixed(2);
        state.mexchange_document.balance = parseFloat(state.mexchange_document.balance) + parseFloat(total);
        state.mexchange_document.balance = state.mexchange_document.balance.toFixed(2);
    },

    mResetExchangeDocument(state) {
        state.account_pay = [];
        state.bill_exchange = [];
        state.mexchange_document = { total: (0).toFixed(2), applied:(0).toFixed(2),  balance:(0).toFixed(2), };
    },
    mTotalExchangeDocument(state, total) {
        state.mexchange_document.total = total;
        state.mexchange_document.balance = total;
    },
    

}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
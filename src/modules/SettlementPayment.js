//to handle state
const state = {
    msettlement_payment: {
        coin:'PEN',
        total: (0).toFixed(2),
        applied: (0).toFixed(2),
        balance: (0).toFixed(2),
    },
    account_pay: [],
    payments: [],
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
            if (element.id_module == account.id_module && element.module == account.module) {
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

    mLoadAddPayment(context,payment) {
        let detail = context.state.payments;
        let validate = true;
        for (let index = 0; index < detail.length; index++) {
            const element = detail[index];
            if (element.id_payment == payment.id_payment) {
                validate = false;
                break;
            }
        }
        if (validate) {
            context.commit('mAddPayment',payment);
        }
        
    },
    mLoadDeletePayment(context,index){
        context.commit('mDeletePayment',index);
    },
    mLoadResetPayment(context){
        context.commit('mResetPayment');
    },
    mLoadResetSettlementPayment(context){
        context.commit('mResetSettlementPayment');
    },
    mLoadUpdateSettlementPaymentCoin(context,coin){
        context.commit('mUpdateSettlementPaymentCoin',coin);
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

    mAddPayment(state, payment) {
        state.payments.push(payment);
        state.msettlement_payment.applied = parseFloat(state.msettlement_payment.applied) + parseFloat(payment.amount_final);
        state.msettlement_payment.applied = state.msettlement_payment.applied.toFixed(2);
        state.msettlement_payment.balance = parseFloat(state.msettlement_payment.balance) - parseFloat(payment.amount_final);
        state.msettlement_payment.balance = state.msettlement_payment.balance.toFixed(2);
    },
    mDeletePayment(state, index) {
        let total = state.payments[index].amount_final;
        state.payments.splice(index,1);
        state.msettlement_payment.applied = parseFloat(state.msettlement_payment.applied) - parseFloat(total);
        state.msettlement_payment.applied = state.msettlement_payment.applied.toFixed(2);
        state.msettlement_payment.balance = parseFloat(state.msettlement_payment.balance) + parseFloat(total);
        state.msettlement_payment.balance = state.msettlement_payment.balance.toFixed(2);
    },

    mResetPayment(state) {
        state.payments = [];
    },

    mResetSettlementPayment(state) {
        state.account_pay = [];
        state.payments = [];
        state.msettlement_payment = { coin:'PEN', total: (0).toFixed(2), applied:(0).toFixed(2),  balance:(0).toFixed(2), };
    },

    mTotalExchangeDocument(state, total) {
        state.msettlement_payment.total = total;
        state.msettlement_payment.balance = total;
    },

    mUpdateSettlementPaymentCoin(state,coin) {
        state.msettlement_payment.coin = coin;
    },
    

}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
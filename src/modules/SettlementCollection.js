//to handle state
const state = {
    msettlement_collection: {
        coin:'PEN',
        total: (0).toFixed(2),
        applied: (0).toFixed(2),
        balance: (0).toFixed(2),
    },
    account_receivable: [],
    charges: [],
}

//to handle state
const getters = {}

//to handle actions
const actions = {

    mLoadAddAccountReceivable(context,account) {
        let detail = context.state.account_receivable;
        let validate = true;
        for (let index = 0; index < detail.length; index++) {
            const element = detail[index];
            if (element.id_module == account.id_module && element.module == account.module) {
                validate = false;
                break;
            }
        }
        if (validate) {
            context.commit('mAddAccountReceivable',account);
            context.dispatch('mLoadTotalAccountReceivable');
        }
        
    },
    mLoadDeleteAccountReceivable(context,index){
        context.commit('mDeleteAccountReceivable',index);
        context.dispatch('mLoadTotalAccountReceivable');
    },

    mLoadTotalAccountReceivable(context){
        let detail = context.state.account_receivable;
        let total = 0;
        for (let index = 0; index < detail.length; index++) {
            const element = detail[index];
            total += parseFloat(element.total);
        }
        total = total.toFixed(2);
        context.commit('mTotalSettlementCollection',total);
    },

    mLoadAddCharge(context,payment) {
        let detail = context.state.charges;
        let validate = true;
        for (let index = 0; index < detail.length; index++) {
            const element = detail[index];
            if (element.id_charge == payment.id_charge) {
                validate = false;
                break;
            }
        }
        if (validate) {
            context.commit('mAddCharge',payment);
        }
        
    },
    mLoadDeleteCharge(context,index){
        context.commit('mDeleteCharge',index);
    },
    mLoadResetCharge(context){
        context.commit('mResetCharge');
    },
    mLoadResetSettlementCollection(context){
        context.commit('mResetSettlementCollection');
    },
    mLoadUpdateSettlementChargeCoin(context,coin){
        context.commit('mUpdateSettlementChargeCoin',coin);
    },
    
    

}

//to handle mutations
const mutations = {

    mAddAccountReceivable(state, account) {
        state.account_receivable.push(account);
    },
    mDeleteAccountReceivable(state, index) {
        state.account_receivable.splice(index,1);
    },

    mAddCharge(state, payment) {
        state.charges.push(payment);
        state.msettlement_collection.applied = parseFloat(state.msettlement_collection.applied) + parseFloat(payment.amount_final);
        state.msettlement_collection.applied = state.msettlement_collection.applied.toFixed(2);
        state.msettlement_collection.balance = parseFloat(state.msettlement_collection.balance) - parseFloat(payment.amount_final);
        state.msettlement_collection.balance = state.msettlement_collection.balance.toFixed(2);
    },
    mDeleteCharge(state, index) {
        let total = state.charges[index].amount_final;
        state.charges.splice(index,1);
        state.msettlement_collection.applied = parseFloat(state.msettlement_collection.applied) - parseFloat(total);
        state.msettlement_collection.applied = state.msettlement_collection.applied.toFixed(2);
        state.msettlement_collection.balance = parseFloat(state.msettlement_collection.balance) + parseFloat(total);
        state.msettlement_collection.balance = state.msettlement_collection.balance.toFixed(2);
    },

    mResetCharge(state) {
        state.charges = [];
    },

    mResetSettlementCollection(state) {
        state.account_receivable = [];
        state.charges = [];
        state.msettlement_collection = { coin:'PEN', total: (0).toFixed(2), applied:(0).toFixed(2),  balance:(0).toFixed(2), };
    },

    mTotalSettlementCollection(state, total) {
        state.msettlement_collection.total = total;
        state.msettlement_collection.balance = total;
    },

    mUpdateSettlementChargeCoin(state,coin) {
        state.msettlement_collection.coin = coin;
    },
    

}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
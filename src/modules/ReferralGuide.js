//to handle state
const state = {
    referral_guide_detail: [],
    total_weight:'0.00',
}

//to handle state
const getters = {}

//to handle actions
const actions = {

    mLoadAddReferralGuideDetail(context,product) {
        let validate = true;
        let detail = context.state.referral_guide_detail;
        for (let index = 0; index < detail.length; index++) {
            if (detail[index].id_product == product.id_product) {
                detail[index].quantity = parseFloat(detail[index].quantity) + parseFloat(product.quantity);
                
                detail[index].weight_unit = parseFloat(product.weight_unit);
                detail[index].weight_total = parseFloat(detail[index].weight_unit) * parseFloat(detail[index].quantity);

                detail[index].quantity = parseFloat(detail[index].quantity).toFixed(2);
                detail[index].weight_unit = detail[index].weight_unit.toFixed(2);
                detail[index].weight_total = detail[index].weight_total.toFixed(2);
                validate = false;
                context.dispatch('mLoadTotalReferralGuideDetail');
                break;
            }
        }
        if (validate) {
            context.commit('mAddReferralGuideDetail',product);
            context.dispatch('mLoadTotalReferralGuideDetail');
        }
        
    },

    mLoadEditReferralGuideDetail(context,index){
        let detail = context.state.referral_guide_detail;
        detail[index].quantity = detail[index].quantity.length == 0 ? 0 : parseFloat(detail[index].quantity) ;
        detail[index].weight_unit = detail[index].weight_unit.length == 0 ? 0 : parseFloat(detail[index].weight_unit);
        detail[index].weight_total = parseFloat(detail[index].weight_unit) * parseFloat(detail[index].quantity);

        detail[index].quantity = detail[index].quantity.toFixed(2);
        detail[index].weight_unit = detail[index].weight_unit.toFixed(2);
        detail[index].weight_total = detail[index].weight_total.toFixed(2);

        context.dispatch('mLoadTotalReferralGuideDetail');

    },

    mLoadDeleteReferralGuideDetail(context,index){
        context.commit('mDeleteReferralGuideDetail',index);
        context.dispatch('mLoadTotalReferralGuideDetail');
    },

    mLoadResetReferralGuideDetail(context){
        context.commit('mResertReferralGuideDetail');
        context.dispatch('mLoadTotalReferralGuideDetail');
    },


    mLoadTotalReferralGuideDetail(context){
        let detail = context.state.referral_guide_detail;
        let total = 0;
        for (let index = 0; index < detail.length; index++) {
            const element = detail[index];
            total += parseFloat(element.weight_total);
        }
        total = total.toFixed(2);
        context.commit('mTotalWeightReferralGuideDetail', total);
        
    },


}

//to handle mutations
const mutations = {

    mAddReferralGuideDetail(state, detail) {
        state.referral_guide_detail.push(detail);
    },
    mDeleteReferralGuideDetail(state, index) {
        state.referral_guide_detail.splice(index,1);
    },
    mResertReferralGuideDetail(state) {
        state.referral_guide_detail = [];
    },
    mTotalWeightReferralGuideDetail(state,total) {
        state.total_weight = total;
    },

}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
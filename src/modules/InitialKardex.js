//to handle state
const state = {
    initial_kardex_detail: [],
}

//to handle state
const getters = {}

//to handle actions
const actions = {

    mLoadAddInitialKardexDetail(context,product) {
        context.commit('mAddInitialKardexDetail',product);
    },

    mLoadEditInitialKardexDetail(context,id_product){
        let detail = context.state.initial_kardex_detail;
        for (let index = 0; index < detail.length; index++) {
            if (detail[index].id_product == id_product) {
                detail[index].quantity = detail[index].quantity.length == 0 ? 0 : parseFloat(detail[index].quantity) ;
                detail[index].quantity = parseFloat(detail[index].quantity).toFixed(2);
                break;
            }
        }
    },

    mLoadDeleteInitialKardexDetail(context,id_product){
        let detail = context.state.initial_kardex_detail;

        for (let index = 0; index < detail.length; index++) {
            if (detail[index].id_product == id_product) {
                context.commit('mDeleteInitialKardexDetail',index);
                break;
            }
        }
    },

    mLoadResetInitialKardexDetail(context){
        context.commit('mResertInitialKardexDetail');
    },

}

//to handle mutations
const mutations = {

    mAddInitialKardexDetail(state, detail) {
        state.initial_kardex_detail.push(detail);
    },

    mDeleteInitialKardexDetail(state, index) {
        state.initial_kardex_detail.splice(index,1);
    },
    mResertInitialKardexDetail(state) {
        state.initial_kardex_detail = [];
        state.linkages = [];
    },

    mAddLinkageInput(state, linkage) {
        state.linkages.push(linkage);
    },
    mDeleteLinkageInput(state, index) {
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
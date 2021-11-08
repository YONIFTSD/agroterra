//to handle state
const state = {
    input_detail: [],
    linkages: [],
}

//to handle state
const getters = {}

//to handle actions
const actions = {

    mLoadAddInputDetail(context,product) {
        let validate = true;
        let detail = context.state.input_detail;
        for (let index = 0; index < detail.length; index++) {
            if (detail[index].id_product == product.id_product) {
                detail[index].quantity = parseFloat(detail[index].quantity) + parseFloat(product.quantity);
                detail[index].quantity = parseFloat(detail[index].quantity).toFixed(2);
                validate = false;
                break;
            }
        }
        if (validate) {
            context.commit('mAddInputDetail',product);
        }
        
    },

    mLoadEditInputDetail(context,index){
        let detail = context.state.input_detail;
        detail[index].quantity = detail[index].quantity.length == 0 ? 0 : parseFloat(detail[index].quantity) ;
        detail[index].quantity = parseFloat(detail[index].quantity).toFixed(2);
    },

    mLoadDeleteInputDetail(context,index){
        context.commit('mDeleteInputDetail',index);
    },

    mLoadResetInputDetail(context){
        context.commit('mResertInputDetail');
    },


    mLoadAddLinkageInput(context,linkage) {
        let validate = true;
        let detail = context.state.linkages;
        for (let index = 0; index < detail.length; index++) {
            if (detail[index].id_module == linkage.id_module && detail[index].module == linkage.module) {
                validate = false;
                break;
            }
        }
        if (validate) {
            context.commit('mAddLinkageInput',linkage);
        }
        
    },
    mLoadDeleteLinkageInput(context,index){
        context.commit('mDeleteLinkageInput',index);
    },

}

//to handle mutations
const mutations = {

    mAddInputDetail(state, detail) {
        state.input_detail.push(detail);
    },

    mDeleteInputDetail(state, index) {
        state.input_detail.splice(index,1);
    },
    mResertInputDetail(state) {
        state.input_detail = [];
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
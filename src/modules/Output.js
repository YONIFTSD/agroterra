//to handle state
const state = {
    output_detail: [],
    linkages:[],
}

//to handle state
const getters = {}

//to handle actions
const actions = {

    mLoadAddOutputDetail(context,product) {
        let validate = true;
        let detail = context.state.output_detail;
        for (let index = 0; index < detail.length; index++) {
            if (detail[index].id_product == product.id_product) {
                detail[index].quantity = parseFloat(detail[index].quantity) + parseFloat(product.quantity);
                validate = false;
                break;
            }
        }
        if (validate) {
            context.commit('mAddOutputDetail',product);
        }
        
    },

    mLoadEditOutputDetail(context,index){
        let detail = context.state.output_detail;
        detail[index].quantity = detail[index].quantity.length == 0 ? 0 : parseFloat(detail[index].quantity) ;
          
    },

    mLoadDeleteOutputDetail(context,index){
        context.commit('mDeleteOutputDetail',index);
         
    },

    mLoadResetOutputDetail(context){
        context.commit('mResertOutputDetail');
    },

    mLoadAddLinkageOutput(context,linkage) {
        let validate = true;
        let detail = context.state.linkages;
        for (let index = 0; index < detail.length; index++) {
            if (detail[index].id_module == linkage.id_module && detail[index].module == linkage.module) {
                validate = false;
                break;
            }
        }
        if (validate) {
            context.commit('mAddLinkageOutput',linkage);
        }
        
    },
    mLoadDeleteLinkageOutput(context,index){
        context.commit('mDeleteLinkageOutput',index);
    },

}

//to handle mutations
const mutations = {

    mAddOutputDetail(state, detail) {
        state.output_detail.push(detail);
    },

    mDeleteOutputDetail(state, index) {
        state.output_detail.splice(index,1);
    },
    mResertOutputDetail(state) {
        state.output_detail = [];
        state.linkages = [];
    },

    mAddLinkageOutput(state, linkage) {
        state.linkages.push(linkage);
    },
    mDeleteLinkageOutput(state, index) {
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
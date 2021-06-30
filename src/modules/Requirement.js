//to handle state
const state = {
    requirement_detail: [],
}

//to handle state
const getters = {}

//to handle actions
const actions = {

    mLoadAddRequirementDetail(context,product) {
        let validate = true;
        let detail = context.state.requirement_detail;
        for (let index = 0; index < detail.length; index++) {
            if (detail[index].id_product == product.id_product) {
                detail[index].quantity = parseFloat(detail[index].quantity) + parseFloat(product.quantity);
                validate = false;
                break;
            }
        }
        if (validate) {
            context.commit('mAddRequirementDetail',product);
        }
        
    },

    mLoadEditRequirementDetail(context,index){
        let detail = context.state.requirement_detail;
        detail[index].quantity = detail[index].quantity.length == 0 ? 0 : parseFloat(detail[index].quantity) ;
         
    },

    mLoadDeleteRequirementDetail(context,index){
        
        context.commit('mDeleteRequirementDetail',index);
            
        
    },

    mLoadResetRequirementDetail(context){
        context.commit('mResertRequirementDetail');
    },


}

//to handle mutations
const mutations = {

    mAddRequirementDetail(state, detail) {
        state.requirement_detail.push(detail);
    },

    mDeleteRequirementDetail(state, index) {
        state.requirement_detail.splice(index,1);
    },
    mResertRequirementDetail(state) {
        state.requirement_detail = [];
    },

}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
//to handle state
const state = {
    transform_output_detail: [],
    transform_input_detail: [],
}

//to handle state
const getters = {}

//to handle actions
const actions = {

    mLoadAddTransformOutputDetail(context,product) {
        let validate = true;
        let detail = context.state.transform_output_detail;
        for (let index = 0; index < detail.length; index++) {
            if (detail[index].id_product == product.id_product) {
                detail[index].quantity = parseFloat(detail[index].quantity) + parseFloat(product.quantity);
                detail[index].total_capacity = parseFloat(detail[index].quantity) *  parseFloat(detail[index].capacity);
                detail[index].remaining_capacity = parseFloat(detail[index].quantity) *  parseFloat(detail[index].capacity);
                
                detail[index].quantity = parseFloat(detail[index].quantity).toFixed(2);
                detail[index].capacity = detail[index].capacity.toFixed(2);
                detail[index].total_capacity = detail[index].total_capacity.toFixed(2);
                detail[index].remaining_capacity = detail[index].remaining_capacity.toFixed(2);

                validate = false;
                break;
            }
        }
        if (validate) {
            context.commit('mAddTransformOutputDetail',product);
        }
    },
    mLoadEditTransformOutputDetail(context,index){
        let detail = context.state.transform_output_detail;
        detail[index].quantity = detail[index].quantity.length == 0 ? 0 : parseFloat(detail[index].quantity);
        detail[index].capacity = detail[index].capacity.length == 0 ? 0 : parseFloat(detail[index].capacity);
        detail[index].total_capacity = parseFloat(detail[index].quantity) *  parseFloat(detail[index].capacity);
        detail[index].remaining_capacity = parseFloat(detail[index].quantity) *  parseFloat(detail[index].capacity);
        
        detail[index].capacity = detail[index].capacity.toFixed(2);
        detail[index].total_capacity = detail[index].total_capacity.toFixed(2);
        detail[index].remaining_capacity = detail[index].remaining_capacity.toFixed(2);
    },
    mLoadDeleteTransformOutputDetail(context,index){
        context.commit('mDeleteTransformOutputDetail',index);
    },
    mLoadResetTransformOutputDetail(context){
        context.commit('mResertTransformOutputDetail');
    },
    mLoadUpdateRemainingCapacity(context,id_reference) {
        let output_detail = context.state.transform_output_detail;
        let input_detail = context.state.transform_input_detail;
        for (let index = 0; index < output_detail.length; index++) {
            if (output_detail[index].id_product == id_reference) {
                let total_capacity = 0;
                for (let index1 = 0; index1 < input_detail.length; index1++) {
                    const element1 = input_detail[index1];
                    if (element1.id_reference == id_reference) {
                        total_capacity += parseFloat(element1.total_capacity);
                    }
                }
                output_detail[index].remaining_capacity = parseFloat(output_detail[index].total_capacity) - parseFloat(total_capacity); 
                output_detail[index].remaining_capacity = parseFloat(output_detail[index].remaining_capacity).toFixed(2);
                break;
            }
            
        }
        
      
    },






    mLoadAddTransformInputDetail(context,product) {
        let validate = true;
        let detail = context.state.transform_input_detail;
        for (let index = 0; index < detail.length; index++) {
            if (detail[index].id_product == product.id_product && detail[index].id_reference == product.id_reference) {
                detail[index].quantity = parseFloat(detail[index].quantity) + parseFloat(product.quantity);
                detail[index].capacity = parseFloat(product.capacity);
                detail[index].total_capacity = parseFloat(detail[index].quantity) *  parseFloat(detail[index].capacity);

                detail[index].capacity = detail[index].capacity.toFixed(2);
                detail[index].total_capacity = detail[index].total_capacity.toFixed(2);

                validate = false;
                context.dispatch('mLoadUpdateRemainingCapacity',product.id_reference);
                break;
            }
        }
        if (validate) {
            context.commit('mAddTransformInputDetail',product);
            context.dispatch('mLoadUpdateRemainingCapacity',product.id_reference);
        }
    },
    mLoadEditTransformInputDetail(context,index){
        let detail = context.state.transform_input_detail;
        detail[index].quantity = detail[index].quantity.length == 0 ? 0 : parseFloat(detail[index].quantity);
        detail[index].capacity = detail[index].capacity.length == 0 ? 0 : parseFloat(detail[index].capacity);
        detail[index].total_capacity = parseFloat(detail[index].quantity) *  parseFloat(detail[index].capacity);
        detail[index].id_reference = detail[index].id_reference;
        
        detail[index].capacity = detail[index].capacity.toFixed(2);
        detail[index].total_capacity = detail[index].total_capacity.toFixed(2);
    },
    mLoadDeleteTransformInputDetail(context,index){
        let detail = context.state.transform_input_detail;
        let id_reference = detail[index].id_reference;
        context.commit('mDeleteTransformInputDetail',index);
        context.dispatch('mLoadUpdateRemainingCapacity',id_reference);
    },
    mLoadResetTransformInputDetail(context){
        let detail = context.state.transform_output_detail;
        for (let index = 0; index < detail.length; index++) {
            detail[index].remaining_capacity = parseFloat(detail[index].total_capacity).toFixed(2);
        }
        context.commit('mResertTransformInputDetail');
    },


}

//to handle mutations
const mutations = {

    mAddTransformOutputDetail(state, detail) {
        state.transform_output_detail.push(detail);
    },
    mDeleteTransformOutputDetail(state, index) {
        state.transform_output_detail.splice(index,1);
    },
    mResertTransformOutputDetail(state) {
        state.transform_output_detail = [];
    },



    mAddTransformInputDetail(state, detail) {
        state.transform_input_detail.push(detail);
    },
    mDeleteTransformInputDetail(state, index) {
        state.transform_input_detail.splice(index,1);
    },
    mResertTransformInputDetail(state) {
        state.transform_input_detail = [];
    },

}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
const axios = require("axios").default;
const je = require("json-encrypt");
//to handle state
const state = {
    search_rc: '',
    room_control_rc: [],
    room_rc: {},
 
    module_rc: 'RoomControl',
    role_rc: '1',
}

//to handle state
const getters = {}

//to handle actions
const actions = {

    mLoadListRoomControl(context) {
        // Generar token
        let user = window.localStorage.getItem("user");
        user = JSON.parse(JSON.parse(je.decrypt(user)));
        let token = user.api_token;

        // obtener datos
        let url_base = 'http://localhost:8080/';
        let search = context.state.search_rc == "" ? "all" : context.state.search_rc;
        let url = url_base + "room-control/list/" + search;
        axios({
            method: "GET",
            url: url,
            headers: {
                token: token,
                module: context.state.module_rc,
                role: context.state.role_rc,
            },
        })
        .then(function (response) {
            if (response.data.status == 200) {
                context.commit('mListRoomControl',response.data.result);
            } 
        })
    },
    mShowModalMinibar(context){
        context.commit('mSetModalMinibar',true);
    }

}

//to handle mutations
const mutations = {

    mSetSearch(state, data) {
        state.search_rc = data;
    },
    mListRoomControl(state, data) {
        state.room_control_rc = data;
    },


}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
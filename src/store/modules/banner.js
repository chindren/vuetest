import {reqBannerList} from '../../utils/http'
const state = {
    list:[]
}

const mutations = {
    changeList(state,arr){
        state.list = arr;
    }
}

const actions = {
    reqList(context){
        reqBannerList().then(res=>{
            context.commit('changeList', res.data.list)
        })
    }
}

const getters = {
    getList(state){
        return state.list
    }
}

export default {
    state, mutations, getters, actions,
    namespaced: true
}
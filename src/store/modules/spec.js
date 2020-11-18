import { reqSpecsList, reqSpecsAll } from '../../utils/http'
const state = {
    list: [],
    total: 0,
    size: 2,
    page: 1
}

const mutations = {
    changeList(state, arr) {
        state.list = arr;
    },
    changeTotal(state, arr) {
        state.total = arr;
    },
    changePage(state, arr) {
        state.page = arr;
    }
}

const actions = {
    reqList(context, bool) {
        // 10.修改条件
        let params = bool ? {} : { page: context.state.page, size: context.state.size }
        reqSpecsAll().then(res => {
            context.commit('changeTotal', res.data.list[0].total)
        })
        // 如果穿的是一个空对象，获取所有的信息？？？？？？？？？？？？？？？？？？？？
        reqSpecsList(params).then(res => {
            let list = res.data.list;
            if (list.length === 0) {
                // 切记！！！不能直接让context.state.page--，因为就相当于直接操作page变量，
                //在这里想要改变state里的变量，只能通过mutations里面的change函数改变
                context.commit('changePage', context.state.page - 1)
                // 如果当前页面没有数据，则获取前一页的数据
                context.dispatch("reqList")
            }

            //attrs JSON.parse()
            list.forEach(item => {
                item.attrs = JSON.parse(item.attrs)
            })
            context.commit('changeList', res.data.list)
        })
    },
    //修改页码
    changePage(context, page) {
        //修改页码
        context.commit("changePage", page)
        //从新请求数据
        context.dispatch("reqList")
    }
}

const getters = {
    getList(state) {
        return state.list
    },
    getTotal(state) {
        return state.total
    },
    size(state){
        return state.size
    },
}

export default {
    state, mutations, getters, actions,
    namespaced: true
}
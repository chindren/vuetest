export const state={
    // 4.初始值,防止一旦刷新，里面的值就不存在了
    userInfo:sessionStorage.getItem("userInfo")?JSON.parse(sessionStorage.getItem("userInfo")):{}
}
export const mutations={
    changeUserInfo(state,obj){
        // vuex和本地存储同步
        state.userInfo=obj
        if(obj.token){
            sessionStorage.setItem("userInfo",JSON.stringify(obj))
        }else{
            sessionStorage.removeItem("userInfo")
        }
        
    }
}
export const getters={
    userInfo(state){
        return state.userInfo
    }
}
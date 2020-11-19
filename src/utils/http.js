import axios from "axios"
import qs from "qs"
import {errorAlert} from "./alert"
import Vue from 'vue'
import store from "../store"
import router from "../router"

let baseUrl="/aa"
// 在vue原型上添加，谁都可以用
Vue.prototype.$imgUrl="http://localhost:3000"

//请求拦截
axios.interceptors.request.use(req => {
    if (req.url != baseUrl + "/api/userlogin") {
        // 把响应头放进去
        req.headers.authorization = store.state.userInfo.token;
    }
    return req
})

//响应拦截
axios.interceptors.response.use(res=>{
    console.log("本次请求地址是："+res.config.url);
    console.log(res);
    if(res.data.code != 200){
        errorAlert(res.data.msg);
    }
    if(res.data.msg==="登录已过期或访问权限受限"){//掉线了
        //清除登录信息
        store.dispatch("changeUser",{})
        //跳转到登录页
        router.push("/login")
    }
    return res
})

/*=========================菜单管理 开始================== */

export const reqMenuAdd=(form)=>{
    return axios({
        url: baseUrl+"/api/menuadd",
        method:"post",
        data: qs.stringify(form)
    })
}

export const reqMenuList=(form)=>{
    return axios({
        url: baseUrl+"/api/menulist",
        method:"get",
        params:{
            istree: false
        }
    })
}

export const reqMenuDel=(id)=>{
    return axios({
        url: baseUrl+"/api/menudelete",
        method:"post",
        // 不管是params还是data传参，传的必须是一个json对象，不能单单只传一个数字过去
        data: qs.stringify({id:id})
    })
}

// 35.获取一条数据
export const reqMenuDetail=(id)=>{
    return axios({
        url:baseUrl+"/api/menuinfo",
        method:"get",
        params:{
            id:id
        }
    })
}

//38.修改
export const reqMenuUpdate=(form)=>{
    return axios({
        url:baseUrl+"/api/menuedit",
        method:"post",
        data:qs.stringify(form)
    })
}

/*=========================菜单管理 结束================== */


/*=========================角色管理 开始================== */

// 角色添加
export const reqRoleAdd=(user)=>{
    return axios({
        url: baseUrl+"/api/roleadd",
        method:"post",
        data: qs.stringify(user)
    })
}
// 角色列表
export const reqRoleList=()=>{
    return axios({
        url: baseUrl+"/api/rolelist",
        method:"get"
    })
}

// 角色获取一条
export const reqRoleDetail=(id)=>{
    return axios({
        url: baseUrl+"/api/roleinfo",
        method:"get",
        params:{
            id:id
        }
    })
}

//38.修改
export const reqRoleupdate=(user)=>{
    return axios({
        url:baseUrl+"/api/roleedit",
        method:"post",
        data:qs.stringify(user)
    })
}

// 角色删除
export const reqRoleDel=(id)=>{
    return axios({
        url: baseUrl+"/api/roledelete",
        method:"post",
        data:qs.stringify({id:id})
    })
}
/*=========================角色管理 结束================== */

/*=========================管理员管理 开始================== */

// 管理员添加
export const reqManageAdd=(manager)=>{
    return axios({
        url: baseUrl+"/api/useradd",
        method:"post",
        data: qs.stringify(manager)
    })
}
// 管理员总数
export const reqManageAll=()=>{
    return axios({
        url: baseUrl+"/api/usercount",
        method:"get"
    })
}
// 管理员列表
// num={size:"",page:""}
/****************参数是一个对象************************ */
export const reqManageList=(num)=>{
    return axios({
        url: baseUrl+"/api/userlist",
        method:"get",
        params:num
    })
}

// 管理员获取一条
export const reqManageDetail=(uid)=>{
    return axios({
        url: baseUrl+"/api/userinfo",
        method:"get",
        params:{
            uid:uid
        }
    })
}

//38.管理员修改
export const reqManageupdate=(manager)=>{
    return axios({
        url:baseUrl+"/api/useredit",
        method:"post",
        data:qs.stringify(manager)
    })
}

// 管理员删除
export const reqManageDel=(uid)=>{
    return axios({
        url: baseUrl+"/api/userdelete",
        method:"post",
        data:qs.stringify({uid:uid})
    })
}
/*=========================管理员管理 结束================== */

/*=========================登录管理 开始================== */

// 角色添加
// login={phone:phone,password:password}
export const reqLogin=(login)=>{
    return axios({
        url: baseUrl+"/api/userlogin",
        method:"post",
        data: qs.stringify(login)
    })
}
/*=========================登录管理 结束================== */

/*=========================会员管理 开始================== */


// 会员列表
export const reqMemberList=()=>{
    return axios({
        url: baseUrl+"/api/memberlist",
        method:"get"
    })
}

// 会员获取一条
export const reqMemberDetail=(uid)=>{
    return axios({
        url: baseUrl+"/api/memberinfo",
        method:"get",
        params:{
            uid:uid
        }
    })
}

//38.会员修改
export const reqMemberupdate=(member)=>{
    return axios({
        url:baseUrl+"/api/memberedit",
        method:"post",
        data:qs.stringify(member)
    })
}

/*=========================会员管理 结束================== */

/*=========================商品分类管理 开始================== */

// 商品分类添加
export const reqCateAdd=(cate)=>{
    // 上传文件的方法
    let d = new FormData()
    /*
    d.append("name",12)
    d.append("img",file)
    d.append("age",20)
    */
    for (let i in cate) {
        d.append(i, cate[i])
    }
    return axios({
        url: baseUrl+"/api/cateadd",
        method:"post",
        data: d
    })
}
// 商品分类列表
// 列表 p={istree:true}  p={pid:1}
// 如果获取所有的数据直接istrue: true，如果获取某个分类下的二级分类，把二级分类的id传进去
export const reqCateList=(cate)=>{
    return axios({
        url: baseUrl+"/api/catelist",
        method:"get",
        // 如果参数是对象，params里面就不用套{}
        params:cate
    })
}

// 商品分类获取一条
export const reqCateDetail=(id)=>{
    return axios({
        url: baseUrl+"/api/cateinfo",
        method:"get",
        params:{
            id:id
        }
    })
}

//38.商品分类修改
export const reqCateupdate=(cate)=>{
    let d=new FormData()
    for(let i in cate){
        d.append(i,cate[i])
    }
    return axios({
        url:baseUrl+"/api/cateedit",
        method:"post",
        data:d
    })
}

//38.商品分类删除
export const reqCateDel=(id)=>{
    return axios({
        url:baseUrl+"/api/catedelete",
        method:"post",
        data:qs.stringify({id:id})
    })
}

/*=========================商品分类管理 结束================== */

/*=========================商品规格管理 开始================== */

// 商品规格添加
export const reqSpecsAdd=(specs)=>{
    return axios({
        url: baseUrl+"/api/specsadd",
        method:"post",
        data:qs.stringify(specs)
    })
}
// 商品规格总数
export const reqSpecsAll=()=>{
    return axios({
        url: baseUrl+"/api/specscount",
        method:"get"
    })
}
// 商品规格列表
// Specs={size:2,page:1}
export const reqSpecsList=(Specs)=>{
    return axios({
        url: baseUrl+"/api/specslist",
        method:"get",
        // 如果参数是对象，params里面就不用套{}
        params:Specs
    })
}

// 商品规格获取一条
export const reqSpecsDetail=(id)=>{
    return axios({
        url: baseUrl+"/api/specsinfo",
        method:"get",
        params:{
            id:id
        }
    })
}

//38.商品规格修改
export const reqSpecsupdate=(specs)=>{
    return axios({
        url:baseUrl+"/api/specsedit",
        method:"post",
        data:specs
    })
}

//38.商品规格删除
export const reqSpecsDel=(id)=>{
    return axios({
        url:baseUrl+"/api/specsdelete",
        method:"post",
        data:qs.stringify({id:id})
    })
}

/*=========================商品规格管理 结束================== */

/*=========================商品管理 开始================== */

// 商品添加
export const reqGoodsAdd=(goods)=>{
    // 上传文件的方法
    let d = new FormData()
    for (let i in goods) {
        d.append(i, goods[i])
    }
    return axios({
        url: baseUrl+"/api/goodsadd",
        method:"post",
        data: d
    })
}
// 商品总数
export const reqGoodsAll=()=>{
    return axios({
        url: baseUrl+"/api/goodscount",
        method:"get"
    })
}
// 商品列表
export const reqGoodsList=(goods)=>{
    return axios({
        url: baseUrl+"/api/goodslist",
        method:"get",
        // 如果参数是对象，params里面就不用套{}
        params:goods
    })
}

// 商品获取一条
export const reqGoodsDetail=(id)=>{
    return axios({
        url: baseUrl+"/api/goodsinfo",
        method:"get",
        params:{
            id:id
        }
    })
}

//38.商品修改
export const reqGoodsupdate=(goods)=>{
    // 上传文件的方法
    let d = new FormData()
    for (let i in goods) {
        d.append(i, goods[i])
    }
    return axios({
        url:baseUrl+"/api/goodsedit",
        method:"post",
        data:d
    })
}

//38.商品删除
export const reqGoodsDel=(id)=>{
    return axios({
        url:baseUrl+"/api/goodsdelete",
        method:"post",
        data:qs.stringify({id:id})
    })
}

/*=========================商品管理 结束================== */

/*=========================轮播图管理 开始================== */
// 轮播图添加
export const reqBannerAdd=(form)=>{
    let d = new FormData();
    for(let i in form){
        d.append(i,form[i])
    }
    return axios({
        url: baseUrl+"/api/banneradd",
        method:"post",
        data: d
    })
}

// 轮播图列表
export const reqBannerList=()=>{
    return axios({
        url: baseUrl+"/api/bannerlist",
        method:"get"
    })
}

// 35.获取一条数据
export const reqBannerDetail=(id)=>{
    return axios({
        url:baseUrl+"/api/bannerinfo",
        method:"get",
        params:{
            id:id
        }
    })
}

//38.轮播图修改
export const reqBannerUpdate=(form)=>{
    let d = new FormData()
    for(let i in form){
        d.append(i,form[i])
    }
    return axios({
        url:baseUrl+"/api/banneredit",
        method:"post",
        data:d
    })
}
// 轮播图删除
export const reqBannerDel=(id)=>{
    return axios({
        url: baseUrl+"/api/bannerdelete",
        method:"post",
        // 不管是params还是data传参，传的必须是一个json对象，不能单单只传一个数字过去
        data: qs.stringify({id:id})
    })
}

/*=========================轮播图管理 结束================== */
/*=========================限时秒杀管理 开始================== */
// 限时秒杀添加
export const reqSeckAdd=(form)=>{
    // let d = new FormData();
    // for(let i in form){
    //     d.append(i,form[i])
    // }
    return axios({
        url: baseUrl+"/api/seckadd",
        method:"post",
        data: form
    })
}

// 限时秒杀列表
export const reqSeckList=()=>{
    return axios({
        url: baseUrl+"/api/secklist",
        method:"get"
    })
}

// 35.获取一条数据
export const reqSeckDetail=(id)=>{
    return axios({
        url:baseUrl+"/api/seckinfo",
        method:"get",
        params:{
            id:id
        }
    })
}

//38.限时秒杀修改
export const reqSeckUpdate=(form)=>{
    // let d = new FormData()
    // for(let i in form){
    //     d.append(i,form[i])
    // }
    return axios({
        url:baseUrl+"/api/seckedit",
        method:"post",
        data:form
    })
}
// 限时秒杀删除
export const reqSeckDel=(id)=>{
    return axios({
        url: baseUrl+"/api/seckdelete",
        method:"post",
        // 不管是params还是data传参，传的必须是一个json对象，不能单单只传一个数字过去
        data: qs.stringify({id:id})
    })
}

/*=========================限时秒杀管理 结束================== */
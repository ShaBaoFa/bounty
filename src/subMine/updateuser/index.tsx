import {View, Text, Button} from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'
import tokenStore from "@store/token";
import {useEffect, useState} from "react";

import mineApi from "@src/apis/mine";
export default function Updateuser() {

  useLoad(() => {
    console.log('Page loaded.')
  })
  const update = async (e) => {
      console.log(e)
      const rew = await mineApi.updateuserinfo({
          userinfo: {
              nickName: e.target.value.nickname,
              avatarUrl: avatar
          },
          unionid: tokenStore.userinfo.unionid
      })
      if (rew.code == 200) {
          Taro.showToast({
                title: '修改成功',
                icon: 'success',
                duration: 2000
          })
          tokenStore.setUserinfo({
                ...tokenStore.userinfo,
                nickname: e.target.value.nickname,
                avatar: avatar
          })
          setTimeout(()=>{
          Taro.navigateBack()
            },2000)
      }
      console.log(rew)
  }
    const [nickname, setnickname] = useState('')
    const [avatar, setavatar] = useState('')
  const onChooseAvatar =async (e) => {
    console.log(e)
      Taro.uploadFile({
          url: 'https://api.zeecheese.top/uploadavatarurl', //仅为示例，非真实的接口地址

          filePath: e.detail.avatarUrl,
          name: 'file',
          success (res){
              const data = res.data
              console.log(res.data)

              setavatar(data)
          }
      })
  }

  //
  useEffect(()=>{
    setavatar(tokenStore.userinfo.avatar)
    setnickname(tokenStore.userinfo.nickname)
      // console.log(JSON.stringify(tokenStore))

  },[])

  return (
    <View className='updatauser'>
        <view className="p-3 mt-20">
            <form onSubmit={(e)=>update(e)} >
                <button className="h-30  btn-without-border items-center" open-type="chooseAvatar" onChooseAvatar={(e)=>onChooseAvatar(e)} style={{border: 'none',borderRadius: 0}}>
                    <div style={{width: '100%'}}>点击更换头像</div>
                    <image className="w-20 h-20 shadow rounded-full mr-2 mx-auto" src={avatar} />
                </button>
                <input onChange={e=>{
                    setnickname(e.target.value)
                }} value={nickname} name="nickname" max-length="20"   type="nickname"  className="weui-input" placeholder="请输入昵称"/>


                <button  form-type="submit" className="bg-red-600 mt-5 py-2 text-white text-lg" >确认修改</button>

            </form>

        </view>

    </View>
  )
}

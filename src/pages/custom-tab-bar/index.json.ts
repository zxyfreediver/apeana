import { Tabbar } from "@taroify/core"
import { FriendsOutlined, HomeOutlined, Search, SettingOutlined } from "@taroify/icons"

function BasicTabbar() {
  return (
    <Tabbar>
      <Tabbar.TabItem icon={<HomeOutlined />}>标签</Tabbar.TabItem>
      <Tabbar.TabItem icon={<Search />}>标签</Tabbar.TabItem>
      <Tabbar.TabItem icon={<FriendsOutlined />}>标签</Tabbar.TabItem>
      <Tabbar.TabItem icon={<SettingOutlined />}>标签</Tabbar.TabItem>
    </Tabbar>
  )
}

export default BasicTabbar

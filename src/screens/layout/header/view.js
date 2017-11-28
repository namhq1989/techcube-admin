import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd'
import { ImageConst, MenuConst } from '../../../configs/index'
import { ProfileMenuView } from './profile-menu'
import './style.less'

const { Header } = Layout
const MenuItem = Menu.Item
const HOME_KEY = 'home'

class HeaderView extends React.Component {
  static propTypes = {
    profile: PropTypes.object,
    location: PropTypes.object,
    logout: PropTypes.func
  }

  // On select profile menu
  selectProfileItem = (key) => {
    if (key === 'logout') {
      this.props.logout()
    }
  }

  render() {
    const { profile, location } = this.props

    let pathname = location ? location.pathname.substring(1) : HOME_KEY
    if (!pathname) {
      pathname = HOME_KEY
    }

    return (
      <Header className="app-header">
        <img
          className="app-logo"
          alt=""
          src={ImageConst.iconAdmin}
        />
        <Menu
          mode="horizontal"
          selectedKeys={[pathname]}
        >
          {
            MenuConst.map((item) => {
              return (
                <MenuItem key={item.id}>
                  <Link to={`/${item.id}`}>
                    <Icon type={item.icon} />
                    <span>{item.name}</span>
                  </Link>
                </MenuItem>
              )
            })
          }
        </Menu>

        <ProfileMenuView
          onSelectMenuItem={this.selectProfileItem}
          profile={profile}
        />
      </Header>
    )
  }
}

export default HeaderView

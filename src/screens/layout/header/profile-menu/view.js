import React from 'react'
import PropTypes from 'prop-types'
import { Badge, Dropdown, Icon, Menu } from 'antd'
import { Link } from 'react-router-dom'
import './style.less'

const profileMenu = []

class ProfileMenuView extends React.Component {
  static propTypes = {
    onSelectMenuItem: PropTypes.func,
    profile: PropTypes.object
  }

  // On select profile menu
  selectMenu = ({ key }) => {
    this.props.onSelectMenuItem(key)
  }

  render() {
    const { profile } = this.props

    if (!profile) {
      return (
        <div />
      )
    }

    const menu = (
      <Menu onClick={this.selectMenu} className="profile-menu" selectedKeys={[]}>
        {
          profileMenu.map((child) => {
            if (!child.isDivider) {
              return (
                <Menu.Item key={child.id} className="profile-menu-item">
                  <Link to={`/${child.id}`}>
                    <Icon type={child.icon} />
                    <span>{child.name}</span>
                    {
                      child.badge ?
                        <Badge count={child.badge} overflowCount={99} />
                      : null
                    }
                  </Link>
                </Menu.Item>
              )
            } else {
              return (
                <Menu.Divider key={child.id} />
              )
            }
          })
        }
        <Menu.Item key="logout" className="profile-menu-item">
          <div>
            <Icon type="logout" />
            <span>Đăng xuất</span>
          </div>
        </Menu.Item>
      </Menu>
    )

    return (
      <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
        <div className="header-profile">
          <Icon type="caret-down" />
          <div className="current-info">
            <p>{profile.name}</p>
            <span>{profile.email}</span>
          </div>
        </div>
      </Dropdown>
    )
  }
}

export default ProfileMenuView

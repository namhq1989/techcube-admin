import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'dva/router'
import { connect } from 'dva'
import { Layout } from 'antd'
import styles from './style.less'

import { HeaderView } from './header'

class LayoutView extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func
  }

  // On logout
  logout = () => {
    this.props.dispatch({
      type: 'app/logout'
    })
  }

  render() {
    const { children, app, location } = this.props
    return (
      <Layout className={styles.appLayout}>
        <Layout style={{ minHeight: '100vh' }}>
          {
            app.profile ?
              <HeaderView
                profile={app.profile}
                logout={this.logout}
                location={location}
              />
            : null
          }
          <Layout>
            {children}
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(LayoutView))

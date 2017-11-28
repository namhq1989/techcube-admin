/* eslint-disable react/no-danger */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Layout } from 'antd'
import './style.less'

class HomeView extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    loading: PropTypes.object
  }

  render() {
    return (
      <Layout className="container">
        <Layout className="page-content page-home">
          <div>Home view</div>
        </Layout>
      </Layout>
    )
  }
}

export default connect(({ home, loading }) => ({ home, loading }))(HomeView)

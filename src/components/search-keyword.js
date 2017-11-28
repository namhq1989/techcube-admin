import React from 'react'
import PropTypes from 'prop-types'
import { Input, Col } from 'antd'
import './style.less'

const Search = Input.Search

class RcSearchKeyword extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    onSearch: PropTypes.func
  }

  render() {
    return (
      <Col xs={24} sm={24} md={8} lg={8} xl={8} className="rc-component">
        <div className="section-title">
          <h4>Tìm kiếm</h4>
        </div>
        <Search
          className="section-filter"
          size="large"
          placeholder={this.props.placeholder}
          onSearch={this.props.onSearch}
        />
      </Col>
    )
  }
}

export default RcSearchKeyword

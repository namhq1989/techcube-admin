import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'antd'
import './style.less'

class RcBreadcrumb extends React.Component {
  static propTypes = {
    icon: PropTypes.string,
    fileSelect: PropTypes.func
  }

  // Component method
  handleFileUpload = (event) => {
    this.props.fileSelect(event.target.files[0])
  }

  render() {
    const { icon } = this.props

    return (
      <div>
        <label htmlFor="file-upload-input">
          <Icon type={icon} />
        </label>
        <input type="file" id="file-upload-input" onChange={this.handleFileUpload} />
      </div>
    )
  }
}

export default RcBreadcrumb

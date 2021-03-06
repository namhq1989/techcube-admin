/* eslint-disable react/no-danger */

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import lodash from 'lodash'
import { connect } from 'dva'
import { Layout, Row, Table, Button, Col, Upload } from 'antd'
import { RcSearchKeyword } from '../../components'
import { format } from '../../utils'
import './style.less'

const colums = (context) => {
  const { page, limit } = context.props.customers.filter
  return [{
    title: '#',
    dataIndex: '',
    render: (value, row, index) => {
      return <span>{(page * limit) + (index + 1)}</span>
    }
  }, {
    title: 'Tên',
    dataIndex: 'name',
    render: (value, row) => {
      return <Link to={`/customers/${row._id}`}>{value}</Link>
    }
  }, {
    title: 'Công ty',
    dataIndex: 'company',
    render: (value) => {
      return <span>{value}</span>
    }
  }, {
    title: 'Số điện thoại',
    dataIndex: 'phone',
    render: (value) => {
      return <span>{format.phone(value)}</span>
    }
  }, {
    title: 'Email',
    dataIndex: 'email',
    render: (value) => {
      return <span>{value}</span>
    }
  }, {
    title: 'Thống kê',
    dataIndex: 'statistic',
    render: (value) => {
      return <span>{`${value.event || 0} sự kiện - ${value.checkin} lần quét mã`}</span>
    }
  }, {
    title: 'Ngày tạo',
    dataIndex: 'createdAt',
    sorter: true,
    render: (value) => {
      return format.date(value)
    }
  }]
}

class CustomersView extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    loading: PropTypes.object
  }

  componentDidMount() {
    // Load data
    this.onFilterChange()
  }

  // Change filter
  onFilterChange = (newFilter = {}) => {
    const filter = this.mergeState(newFilter)
    const query = lodash.pick(filter, ['page', 'keyword', 'sort'])
    this.loadRecentCustomers(query)
  }

  // On table page change
  onTablePageChange = (pagination, filters, sorter) => {
    const { current } = pagination
    const { field, order } = sorter
    let sort = field
    if (order === 'descend') {
      sort = `-${sort}`
    }
    const filter = this.mergeState({ page: current, sort })
    const query = lodash.pick(filter, ['page', 'keyword', 'sort'])
    // Decrease page filter 1
    query.page -= 1
    this.loadRecentCustomers(query)
  }

  mergeState = (newFilter = {}) => {
    let { customers: { filter } } = this.props
    filter = lodash.merge(filter, newFilter)
    return filter
  }

  // Load recent customers
  loadRecentCustomers = (filter) => {
    this.props.dispatch({
      type: 'customers/recent',
      payload: { ...filter }
    })
  }

  // Search customer with keyword
  search = (keyword) => {
    this.onFilterChange({ keyword })
  }

  // Upload excel file
  uploadExcel = (file) => {
    this.props.dispatch({
      type: 'customers/importExcel',
      payload: {
        file
      }
    })
  }

  render() {
    const { customers: { data, filter, importFailed }, loading } = this.props

    return (
      <Layout className="container">
        <Layout className="page-content page-customers">
          <Row gutter={16}>
            <RcSearchKeyword
              placeholder="Tên/SĐT/Email/Công ty"
              onSearch={this.search}
            />
            <Col xs={24} sm={24} md={8} lg={8} xl={8} className="group-buttons">
              <Link to={'/customers/new'}>
                <Button type="primary" icon="plus-circle-o">Tạo mới</Button>
              </Link>
              <Upload
                name="file"
                accept=".xlsx"
                beforeUpload={(file) => {
                  this.uploadExcel(file)
                  return false
                }}
                showUploadList={false}
              >
                <Button icon="upload">
                  Import Excel
                </Button>
              </Upload>
            </Col>
          </Row>
          {
            !importFailed.length ? null
            :
            <Row>
              <div className="section-title">
                <h4>Import trùng email:</h4>
              </div>
              {
                importFailed.map((email, index) => {
                  return <span className="duplicate-email" key={index}>{email}</span>
                })
              }
            </Row>
          }
          <Row>
            <div className="section-title">
              <h4>Danh sách ({format.number(filter.total)})</h4>
            </div>
            <Table
              className="app-table background-white"
              defaultCurrent={0}
              columns={colums(this)}
              dataSource={data}
              rowKey="_id"
              pagination={{ pageSize: filter.limit, total: filter.total, current: filter.page + 1 }}
              onChange={this.onTablePageChange}
              loading={loading.effects['customers/recent']}
            />
          </Row>
        </Layout>
      </Layout>
    )
  }
}

export default connect(({ customers, loading }) => ({ customers, loading }))(CustomersView)

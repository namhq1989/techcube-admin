/* eslint-disable react/no-danger */

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import lodash from 'lodash'
import { connect } from 'dva'
import { Layout, Row, Table, Button } from 'antd'
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
    const { customers: { isLoaded } } = this.props

    // Return if already loaded
    if (isLoaded) {
      return
    }

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

  render() {
    const { customers: { data, filter }, loading } = this.props

    return (
      <Layout className="container">
        <Layout className="page-content">
          <Row gutter={16}>
            <RcSearchKeyword
              placeholder="Tên/SĐT/Email/Công ty"
              onSearch={this.search}
            />
            {/* <div className="group-buttons float-right">
              <Button type="primary" >
                <Link to={'/customers/new'}>Tạo mới</Link>
              </Button>
              <Button className="background-export">
                Xuất Excel
              </Button>
            </div> */}
          </Row>
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

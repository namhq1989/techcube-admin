/* eslint-disable react/no-danger */

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import lodash from 'lodash'
import { connect } from 'dva'
import { Layout, Row, Table } from 'antd'
import { RcRangePicker } from '../../components'
import { format } from '../../utils'
import './style.less'

const colums = (context) => {
  const { page, limit } = context.props.activities.filter
  return [{
    title: '#',
    dataIndex: '',
    render: (value, row, index) => {
      return <span>{(page * limit) + (index + 1)}</span>
    }
  }, {
    title: 'Sự kiện',
    dataIndex: 'event',
    render: (value) => {
      return <Link to={`/events/${value._id}`}>{value.name}</Link>
    }
  }, {
    title: 'Khách hàng',
    dataIndex: 'customer',
    key: 'name',
    render: (value) => {
      return <Link to={`/customers/${value._id}`}>{value.name}</Link>
    }
  }, {
    title: 'Công ty',
    dataIndex: 'customer',
    key: 'company',
    render: (value) => {
      return <span>{value.company}</span>
    }
  }, {
    title: 'Khu vực',
    dataIndex: 'area',
    render: (value) => {
      return value.name
    }
  }, {
    title: 'Người quét',
    dataIndex: 'byStaff',
    render: (value) => {
      return <Link to={`/staffs/${value._id}/edit`}>{value.name}</Link>
    }
  }, {
    title: 'Thời gian',
    dataIndex: 'date',
    sorter: true,
    render: (value) => {
      return format.date(value)
    }
  }]
}

class ActivitiesView extends React.Component {
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
    const query = lodash.pick(filter, ['page', 'start', 'end', 'sort'])
    this.loadRecentActivities(query)
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
    const query = lodash.pick(filter, ['page', 'start', 'end', 'sort'])
    // Decrease page filter 1
    query.page -= 1
    this.loadRecentActivities(query)
  }

  mergeState = (newFilter = {}) => {
    let { activities: { filter } } = this.props
    filter = lodash.merge(filter, newFilter)
    return filter
  }

  // Load recent activities
  loadRecentActivities = (filter) => {
    this.props.dispatch({
      type: 'activities/recent',
      payload: { ...filter }
    })
  }

  // Rangepicker selected
  dateSelected = (start, end) => {
    this.onFilterChange({ start, end })
  }

  render() {
    const { activities: { data, filter }, loading } = this.props

    return (
      <Layout className="container">
        <Layout className="page-content">
          <Row gutter={16}>
            <RcRangePicker
              onOk={this.dateSelected}
              start={filter.start}
              end={filter.end}
            />
          </Row>
          <Row>
            <div className="section-title">
              <h4>Lịch sử ({format.number(filter.total)})</h4>
            </div>
            <Table
              className="app-table background-white"
              defaultCurrent={0}
              columns={colums(this)}
              dataSource={data}
              rowKey="_id"
              pagination={{ pageSize: filter.limit, total: filter.total, current: filter.page + 1 }}
              onChange={this.onTablePageChange}
              loading={loading.effects['activities/recent']}
            />
          </Row>
        </Layout>
      </Layout>
    )
  }
}

export default connect(({ activities, loading }) => ({ activities, loading }))(ActivitiesView)

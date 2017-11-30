/* eslint-disable react/no-danger */

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import lodash from 'lodash'
import { connect } from 'dva'
import { Layout, Row, Table, Button, Col, Tag } from 'antd'
import { RcSearchKeyword } from '../../components'
import { format } from '../../utils'

const colums = (context) => {
  const { page, limit } = context.props.events.filter
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
      return <Link to={`/events/${row._id}`}>{value}</Link>
    }
  }, {
    title: 'Địa điểm',
    dataIndex: 'address',
    render: (value) => {
      return <span>{value}</span>
    }
  }, {
    title: 'Bắt đầu',
    dataIndex: 'startAt',
    render: (value) => {
      return format.date(value)
    }
  }, {
    title: 'Kết thúc',
    dataIndex: 'endAt',
    render: (value) => {
      return format.date(value)
    }
  }, {
    title: 'Thống kê',
    dataIndex: 'statistic',
    render: (value) => {
      return <span>{`${value.checkin} lần quét mã`}</span>
    }
  }, {
    title: '',
    dataIndex: 'active',
    render: (value) => {
      if (value) {
        return <Tag color="green">Active</Tag>
      } else {
        return <Tag color="red">Inactive</Tag>
      }
    }
  }]
}

class EventsView extends React.Component {
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
    this.loadRecentEvents(query)
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
    this.loadRecentEvents(query)
  }

  mergeState = (newFilter = {}) => {
    let { events: { filter } } = this.props
    filter = lodash.merge(filter, newFilter)
    return filter
  }

  // Load recent events
  loadRecentEvents = (filter) => {
    this.props.dispatch({
      type: 'events/recent',
      payload: { ...filter }
    })
  }

  // Search events with keyword
  search = (keyword) => {
    this.onFilterChange({ keyword })
  }

  render() {
    const { events: { data, filter }, loading } = this.props

    return (
      <Layout className="container">
        <Layout className="page-content page-customers">
          <Row gutter={16}>
            <RcSearchKeyword
              placeholder="Tên"
              onSearch={this.search}
            />
            <Col xs={24} sm={24} md={8} lg={8} xl={8} className="group-buttons">
              <Link to={'/events/new'}>
                <Button type="primary" icon="plus-circle-o">Tạo mới</Button>
              </Link>
            </Col>
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
              loading={loading.effects['events/recent']}
            />
          </Row>
        </Layout>
      </Layout>
    )
  }
}

export default connect(({ events, loading }) => ({ events, loading }))(EventsView)

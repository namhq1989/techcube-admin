import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import lodash from 'lodash'
import { connect } from 'dva'
import { Layout, Row, Table, Button, Col, Tag, Icon } from 'antd'
import { RcSearchKeyword } from '../../components'
import { format, roleText } from '../../utils'
import { AppConst } from '../../configs'

const colums = (context) => {
  const { page, limit } = context.props.staffs.filter
  return [{
    title: '#',
    dataIndex: '',
    render: (value, row, index) => {
      return <span>{(page * limit) + (index + 1)}</span>
    }
  }, {
    title: 'Tên',
    dataIndex: 'name',
    render: (value) => {
      return value
      // return <Link to={`/staffs/${row._id}`}>{value}</Link>
    }
  }, {
    title: 'Email',
    dataIndex: 'email',
    render: (value) => {
      return <span>{value}</span>
    }
  }, {
    title: 'Role',
    dataIndex: 'role',
    render: (value) => {
      return <span>{roleText(value)}</span>
    }
  }, {
    title: 'Trạng thái',
    dataIndex: 'active',
    render: (value, row) => {
      const props = {}
      if (row.role !== AppConst.roles.admin) {
        props.onClick = () => context.changeStatus(row._id)
      }

      if (value) {
        return <Tag color="green" {...props}>Active</Tag>
      } else {
        return <Tag color="red" {...props}>Inactive</Tag>
      }
    }
  }, {
    title: 'Ngày tạo',
    dataIndex: 'createdAt',
    sorter: true,
    render: (value) => {
      return format.date(value)
    }
  }, {
    title: '',
    dataIndex: '',
    render: (value, row) => {
      return <Link to={`/staffs/${row._id}/edit`}><Icon type="edit" /></Link>
    }
  }]
}

class StaffsView extends React.Component {
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
    this.loadRecentStaffs(query)
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
    this.loadRecentStaffs(query)
  }

  mergeState = (newFilter = {}) => {
    let { staffs: { filter } } = this.props
    filter = lodash.merge(filter, newFilter)
    return filter
  }

  // Load recent staffs
  loadRecentStaffs = (filter) => {
    this.props.dispatch({
      type: 'staffs/recent',
      payload: { ...filter }
    })
  }

  // Search staff with keyword
  search = (keyword) => {
    this.onFilterChange({ keyword })
  }

  changeStatus = (staffId) => {
    this.props.dispatch({
      type: 'staffs/changeStatus',
      staffId
    })
  }

  render() {
    const { staffs: { data, filter }, loading } = this.props

    return (
      <Layout className="container">
        <Layout className="page-content page-customers">
          <Row gutter={16}>
            <RcSearchKeyword
              placeholder="Tên"
              onSearch={this.search}
            />
            <Col xs={24} sm={24} md={8} lg={8} xl={8} className="group-buttons">
              <Link to={'/staffs/new'}>
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
              loading={loading.effects['staffs/recent']}
            />
          </Row>
        </Layout>
      </Layout>
    )
  }
}

export default connect(({ staffs, loading }) => ({ staffs, loading }))(StaffsView)

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Link } from 'react-router-dom'
import lodash from 'lodash'
import { Layout, Row, Col, Button, Table, Form, Tooltip, Tag } from 'antd'
import { format } from '../../../utils'

const FormItem = Form.Item

const colums = (context) => {
  const { page, limit } = context.props.eventShow.filter
  return [{
    title: '#',
    dataIndex: '',
    render: (value, row, index) => {
      return <span>{(page * limit) + (index + 1)}</span>
    }
  }, {
    title: 'Khách hàng',
    dataIndex: 'customer',
    render: (value) => {
      return <Link to={`/customers/${value._id}`}>{value.name}</Link>
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


class EventShowView extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    loading: PropTypes.object
  }

  componentWillMount() {
    const eventId = this.props.match.params.id
    this.props.dispatch({
      type: 'eventShow/load',
      eventId
    })
    this.loadRecentCheckin(this.props.filter)
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
    const query = lodash.pick(filter, ['page', 'sort'])
    // Decrease page filter 1
    query.page -= 1
    this.loadRecentCheckin(query)
  }

  mergeState = (newFilter = {}) => {
    let { eventShow: { filter } } = this.props
    filter = lodash.merge(filter, newFilter)
    return filter
  }

  // Load recent checkin
  loadRecentCheckin = (filter) => {
    const eventId = this.props.match.params.id
    this.props.dispatch({
      type: 'eventShow/checkin',
      payload: { ...filter },
      eventId
    })
  }

  // Change status
  changeStatus = () => {
    const eventId = this.props.match.params.id
    this.props.dispatch({
      type: 'eventShow/changeStatus',
      eventId
    })
  }

  render() {
    const { eventShow: { data, checkin, filter, active }, loading } = this.props

    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18
      }
    }

    if (!data) {
      return null
    }

    let btnChangeStatus = (
      <Button
        type="primary" size="small"
        onClick={this.changeStatus}
      >
        Active
      </Button>
    )
    if (active) {
      btnChangeStatus = (
        <Button
          type="danger" ghost size="small"
          onClick={this.changeStatus}
        >
          Deactive
        </Button>
      )
    }

    return (
      <Layout className="container">
        <Layout className="page-content page-customer-show">
          <Row>
            <Col lg={12} md={12} sm={24} xs={24} className="padding-right-8">
              <div className="section-title">
                <h4>Thông tin</h4>
                <div className="group-buttons float-right">
                  {
                    btnChangeStatus
                  }
                  <Link to={`/events/${this.props.match.params.id}/edit`}>
                    <Button type="primary" icon="edit" size="small">Chỉnh sửa</Button>
                  </Link>
                </div>
              </div>
              <Form className="background-white">
                <FormItem
                  label="Tên"
                  {...formItemLayout}
                >
                  <span className="ant-form-text">{data.name}</span>
                </FormItem>
                <FormItem
                  label="Địa điểm"
                  {...formItemLayout}
                >
                  <span className="ant-form-text">{data.address}</span>
                </FormItem>
                <FormItem
                  label="Mô tả"
                  {...formItemLayout}
                >
                  <span className="ant-form-text">{data.desc}</span>
                </FormItem>
                <FormItem
                  label="Bắt đầu"
                  {...formItemLayout}
                >
                  <span className="ant-form-text">{format.date(data.startAt)}</span>
                </FormItem>
                <FormItem
                  label="Kết thúc"
                  {...formItemLayout}
                >
                  <span className="ant-form-text">{format.date(data.endAt)}</span>
                </FormItem>
                <FormItem
                  label="Khách hàng dự kiến"
                  {...formItemLayout}
                >
                  <span className="ant-form-text">{format.number(data.estimateCustomers || 0)}</span>
                </FormItem>
                <FormItem
                  label="Khách hàng thực tế"
                  {...formItemLayout}
                >
                  <span className="ant-form-text">{format.number(data.statistic.customer || 0)}</span>
                </FormItem>
                <FormItem
                  label="Thống kê"
                  {...formItemLayout}
                >
                  <div className="ant-form-text">
                    <Tag color="#168dcc">{format.number(data.statistic.checkin || 0)} lần quét mã</Tag>
                  </div>
                </FormItem>
              </Form>
            </Col>
            <Col lg={12} md={12} sm={24} xs={24} className="padding-left-8">
              <div className="section-title">
                <h4>Lịch sử quét mã ({format.number(filter.total)})</h4>
              </div>
              <Table
                className="app-table background-white"
                defaultCurrent={0}
                columns={colums(this)}
                dataSource={checkin}
                rowKey="_id"
                pagination={{ pageSize: filter.limit, total: filter.total, current: filter.page + 1 }}
                onChange={this.onTablePageChange}
                loading={loading.effects['eventShow/checkin']}
              />
            </Col>
          </Row>
        </Layout>
      </Layout>
    )
  }
}

export default connect(({ eventShow, loading }) => ({ eventShow, loading }))(EventShowView)

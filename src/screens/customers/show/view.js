import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import QRCode from 'qrcode'
import { Link } from 'react-router-dom'
import lodash from 'lodash'
import { Layout, Row, Col, Button, Table, Form, Tooltip, Tag } from 'antd'
import { format } from '../../../utils'
import './style.less'

const FormItem = Form.Item

const colums = (context) => {
  const { page, limit } = context.props.customerShow.filter
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
    title: 'Khu vực',
    dataIndex: 'area',
    render: (value) => {
      return value.name
    }
  }, {
    title: 'Người quét',
    dataIndex: 'byStaff',
    render: (value) => {
      if (!value) {
        return ''
      }
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


class CustomerShowView extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    loading: PropTypes.object
  }

  componentWillMount() {
    const customerId = this.props.match.params.id
    this.props.dispatch({
      type: 'customerShow/load',
      payload: {
        customerId
      }
    })
    this.loadRecentCheckin(this.props.filter)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.customerShow.data && nextProps.customerShow.data.qrCode) {
      setTimeout(() => {
        QRCode.toCanvas(document.getElementById('canvas'), nextProps.customerShow.data.qrCode, () => {})
      }, 1000)
    }
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
    let { customerShow: { filter } } = this.props
    filter = lodash.merge(filter, newFilter)
    return filter
  }

  // Load recent checkin
  loadRecentCheckin = (filter) => {
    const customerId = this.props.match.params.id
    this.props.dispatch({
      type: 'customerShow/checkin',
      payload: { customerId, ...filter }
    })
  }

  // Resend email to customer
  resendEmail = () => {
    const customerId = this.props.match.params.id
    this.props.dispatch({
      type: 'customerShow/resend',
      customerId
    })
  }

  render() {
    const { customerShow: { data, checkin, filter }, loading } = this.props

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

    return (
      <Layout className="container">
        <Layout className="page-content page-customer-show">
          <Row>
            <Col lg={12} md={12} sm={24} xs={24} className="padding-right-8">
              <div className="section-title">
                <h4>Thông tin</h4>
                <div className="group-buttons float-right">
                  <Tooltip title="Gửi lại email chứa mã QR cho khách hàng">
                    <Button
                      type="primary"
                      icon="mail"
                      size="small"
                      onClick={this.resendEmail}
                      disabled={loading.effects['customerShow/resend']}
                    >
                      Gửi Email
                    </Button>
                  </Tooltip>
                  <Link to={`/customers/${this.props.match.params.id}/edit`}>
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
                  label="Công ty"
                  {...formItemLayout}
                >
                  <span className="ant-form-text">{data.company}</span>
                </FormItem>
                <FormItem
                  label="Số điện thoại"
                  {...formItemLayout}
                >
                  <span className="ant-form-text">{format.phone(data.phone)}</span>
                </FormItem>
                <FormItem
                  label="Email"
                  {...formItemLayout}
                >
                  <span className="ant-form-text">{data.email}</span>
                </FormItem>
                <FormItem
                  label="Ghi chú"
                  {...formItemLayout}
                >
                  <span className="ant-form-text">{data.note}</span>
                </FormItem>
                <FormItem
                  label="Thống kê"
                  {...formItemLayout}
                >
                  <div className="ant-form-text">
                    <Tag color="#168dcc">{format.number(data.statistic.event || 0)} sự kiện</Tag>
                    <Tag color="#168dcc">{format.number(data.statistic.checkin || 0)} lần quét mã</Tag>
                  </div>
                </FormItem>
                <FormItem
                  label="Ngày tạo"
                  {...formItemLayout}
                >
                  <span className="ant-form-text">{format.date(data.createdAt)}</span>
                </FormItem>
                <FormItem
                  label="Mã QR"
                  {...formItemLayout}
                >
                  <canvas id="canvas" />
                </FormItem>
              </Form>
            </Col>
            <Col lg={12} md={12} sm={24} xs={24} className="padding-left-8">
              <div className="section-title">
                <h4>Lịch sử quét mã ({format.number(filter.total)})</h4>
              </div>
              <Table
                className="background-white"
                defaultCurrent={0}
                columns={colums(this)}
                dataSource={checkin}
                rowKey="_id"
                pagination={{ pageSize: filter.limit, total: filter.total, current: filter.page + 1 }}
                onChange={this.onTablePageChange}
                loading={loading.effects['customerShow/checkin']}
              />
            </Col>
          </Row>
        </Layout>
      </Layout>
    )
  }
}

export default connect(({ customerShow, loading }) => ({ customerShow, loading }))(CustomerShowView)

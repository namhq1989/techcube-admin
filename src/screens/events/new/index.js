/* eslint-disable react/no-danger */

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'dva'
import moment from 'moment'
import { Layout, Row, Col, Button, Form, Input, Icon, DatePicker } from 'antd'
import { MessageConst, AppConst } from '../../../configs'
import { RcNotification } from '../../../components'
import './style.less'

const FormItem = Form.Item

class EventNewForm extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    loading: PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = {
      name: '',
      address: '',
      desc: '',
      estimateCustomers: 1000,
      startAt: moment().add(7, 'd').startOf('d'),
      endAt: moment().add(9, 'd').endOf('d'),
      isSubmitting: false,
      isLoaded: false
    }
  }

  componentWillMount() {
    const eventId = this.props.match.params.id
    if (eventId && eventId !== 'new') {
      this.props.dispatch({
        type: 'events/load',
        payload: {
          eventId
        }
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.events.event && !this.state.isLoaded) {
      this.setEvent(nextProps.events.event)
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'events/editUnmount'
    })
  }

  setEvent(event) {
    this.setState({
      ...event,
      startAt: moment(event.startAt),
      endAt: moment(event.endAt),
      isLoaded: true
    })
  }

  resetState() {
    this.setState({
      isSubmitting: false
    }, () => {
      this.props.form.resetFields()
    })
  }

  submit = () => {
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (!error) {
        this.setState({
          isSubmitting: true
        }, () => {
          this.props.dispatch({
            type: 'events/create',
            payload: values
          })
        })
      } else {
        RcNotification(MessageConst.Common.InvalidForm, AppConst.notification.error)
      }
    })
  }

  update = () => {
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (!error) {
        this.setState({
          isSubmitting: true
        }, () => {
          this.props.dispatch({
            type: 'events/update',
            payload: values,
            eventId: this.props.match.params.id
          })
        })
      } else {
        RcNotification(MessageConst.Common.InvalidForm, AppConst.notification.error)
      }
    })
  }

  render() {
    const { loading } = this.props
    const { getFieldDecorator } = this.props.form
    const { name, address, desc, estimateCustomers, startAt, endAt, isLoaded } = this.state
    const isCreating = loading.effects['events/create']
    const isUpdating = loading.effects['events/update']

    return (
      <Layout className="container">
        <Layout className="page-content page-customer-new">
          <Row type="flex" align="center">
            <Col span={10}>
              <div className="section-title">
                <h4>{isLoaded ? 'Chỉnh sửa' : 'Thêm sự kiện'}</h4>
              </div>
              <Form className="form-container">
                <FormItem label="Tên" hasFeedback>
                  {getFieldDecorator('name', {
                    initialValue: name,
                    rules: [{
                      min: 2, message: MessageConst.Event.NameRequired
                    }]
                  })(
                    <Input
                      prefix={<Icon type="rocket" />}
                      type="text" size="large" name="name"
                    />
                  )}
                </FormItem>
                <FormItem label="Địa chỉ" hasFeedback>
                  {getFieldDecorator('address', {
                    initialValue: address
                  })(
                    <Input
                      prefix={<Icon type="environment-o" />}
                      type="text" size="large" name="address"
                    />
                  )}
                </FormItem>
                <FormItem label="Mô tả" hasFeedback>
                  {getFieldDecorator('desc', {
                    initialValue: desc
                  })(
                    <Input.TextArea
                      name="desc"
                      autosize={{ minRows: 4, maxRows: 6 }}
                    />
                  )}
                </FormItem>
                <FormItem label="Khách hàng dự kiến" hasFeedback>
                  {getFieldDecorator('estimateCustomers', {
                    initialValue: estimateCustomers
                  })(
                    <Input
                      prefix={<Icon type="team" />}
                      type="number" min="0" size="large" name="estimateCustomers"
                    />
                  )}
                </FormItem>
                <Row>
                  <Col span={12}>
                    <FormItem label="Bắt đầu">
                      {getFieldDecorator('startAt', {
                        initialValue: startAt
                      })(
                        <DatePicker
                          showTime
                          format={AppConst.format.date}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="Kết thúc">
                      {getFieldDecorator('endAt', {
                        initialValue: endAt
                      })(
                        <DatePicker
                          showTime
                          format={AppConst.format.date}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                {
                  isLoaded
                  ?
                    <FormItem className="button-groups">
                      <Link to={`/events/${this.props.match.params.id}`}>
                        <Button
                          type="default"
                          htmlType="button"
                          className="zody-button float-left"
                          size="default"
                          disabled={isUpdating}
                        >
                          Quay lại
                        </Button>
                      </Link>
                      <Button
                        type="primary"
                        htmlType="button"
                        className="zody-button float-right"
                        onClick={this.update}
                        size="default"
                        disabled={isUpdating}
                      >
                        Cập nhật
                      </Button>
                    </FormItem>
                  :
                    <FormItem className="button-groups">
                      <Link to={'/events'}>
                        <Button
                          type="default"
                          htmlType="button"
                          className="zody-button float-left"
                          size="default"
                          disabled={isCreating}
                        >
                          Quay lại
                        </Button>
                      </Link>
                      <Button
                        type="primary"
                        htmlType="button"
                        className="zody-button float-right"
                        onClick={this.submit}
                        size="default"
                        disabled={isCreating}
                      >
                        Tạo
                      </Button>
                    </FormItem>
                }
              </Form>
            </Col>
          </Row>
        </Layout>
      </Layout>
    )
  }
}

const EventNewView = Form.create()(EventNewForm)
export default connect(({ events, loading }) => ({ events, loading }))(EventNewView)

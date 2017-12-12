/* eslint-disable react/no-danger */

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'dva'
import moment from 'moment'
import { Layout, Row, Col, Button, Form, Input, Icon, DatePicker } from 'antd'
import { MessageConst, AppConst } from '../../../configs'
import { RcNotification } from '../../../components'

const FormItem = Form.Item

class AreaNewForm extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    loading: PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = {
      name: '',
      numOfCheckin: 0,
      startAt: moment().add(7, 'd').startOf('d'),
      endAt: moment().add(9, 'd').endOf('d'),
      isSubmitting: false,
      isLoaded: false
    }
  }

  componentWillMount() {
    const areaId = this.props.match.params.id
    if (areaId && areaId !== 'new') {
      this.props.dispatch({
        type: 'areas/load',
        payload: {
          areaId
        }
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.areas.area && !this.state.isLoaded) {
      this.setArea(nextProps.areas.area)
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'areas/editUnmount'
    })
  }

  setArea(area) {
    this.setState({
      ...area,
      startAt: moment(area.startAt),
      endAt: moment(area.endAt),
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
          values.eventId = this.props.match.params.eventId
          this.props.dispatch({
            type: 'areas/create',
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
          values.eventId = this.props.match.params.eventId
          this.props.dispatch({
            type: 'areas/update',
            payload: values,
            areaId: this.props.match.params.id
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
    const { name, numOfCheckin, startAt, endAt, isLoaded } = this.state
    const isCreating = loading.effects['areas/create']
    const isUpdating = loading.effects['areas/update']

    return (
      <Layout className="container">
        <Layout className="page-content page-customer-new">
          <Row type="flex" align="center">
            <Col span={10}>
              <div className="section-title">
                <h4>{isLoaded ? 'Chỉnh sửa' : 'Thêm khu vực'}</h4>
              </div>
              <Form className="form-container">
                <FormItem label="Tên" hasFeedback>
                  {getFieldDecorator('name', {
                    initialValue: name,
                    rules: [{
                      required: true, message: MessageConst.Area.NameRequired
                    }]
                  })(
                    <Input
                      prefix={<Icon type="pushpin-o" />}
                      type="text" size="large" name="name"
                    />
                  )}
                </FormItem>
                <FormItem label="Số lần được checkin" hasFeedback>
                  {getFieldDecorator('numOfCheckin', {
                    initialValue: numOfCheckin
                  })(
                    <Input
                      prefix={<Icon type="environment-o" />}
                      type="number" size="large" name="numOfCheckin"
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
                      <Link to={`/events/${this.props.match.params.eventId}`}>
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
                      <Link to={`/events/${this.props.match.params.eventId}`}>
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

const AreaNewView = Form.create()(AreaNewForm)
export default connect(({ areas, loading }) => ({ areas, loading }))(AreaNewView)

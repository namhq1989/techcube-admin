/* eslint-disable react/no-danger */

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'dva'
import { Layout, Row, Col, Button, Form, Input, Icon, Switch } from 'antd'
import { MessageConst, AppConst } from '../../../configs'
import { RcNotification } from '../../../components'
import './style.less'
import { format } from '../../../utils'

const FormItem = Form.Item

class CustomerNewForm extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    loading: PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = {
      name: '',
      email: '',
      phone: '',
      company: '',
      note: '',
      keepCreate: true,
      isSubmitting: false,
      isLoaded: false
    }
  }

  componentWillMount() {
    const customerId = this.props.match.params.id
    if (customerId && customerId !== 'new') {
      this.props.dispatch({
        type: 'customers/load',
        payload: {
          customerId
        }
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.customers.isCreateSuccess && this.state.isSubmitting) {
      this.resetState()
    } else if (nextProps.customers.customer && !this.state.isLoaded) {
      this.setCustomer(nextProps.customers.customer)
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'customers/editUnmount'
    })
  }

  setCustomer(customer) {
    this.setState({
      ...customer,
      phone: format.phone(customer.phone).split(' ').join(''),
      keepCreate: false,
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
            type: 'customers/create',
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
            type: 'customers/update',
            payload: values,
            customerId: this.props.match.params.id
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
    const { name, email, phone, company, note, keepCreate, isLoaded } = this.state
    const isCreating = loading.effects['customers/create']
    const isUpdating = loading.effects['customers/update']

    return (
      <Layout className="container">
        <Layout className="page-content page-customer-new">
          <Row type="flex" align="center">
            <Col span={10}>
              <div className="section-title">
                <h4>{isLoaded ? 'Chỉnh sửa' : 'Thêm khách hàng'}</h4>
              </div>
              <Form className="form-container">
                <FormItem label="Tên" hasFeedback>
                  {getFieldDecorator('name', {
                    initialValue: name,
                    rules: [{
                      min: 2, message: MessageConst.Customer.NameRequired
                    }]
                  })(
                    <Input
                      prefix={<Icon type="user" />}
                      type="text" size="large" name="name"
                    />
                  )}
                </FormItem>
                <FormItem label="Email" hasFeedback>
                  {getFieldDecorator('email', {
                    initialValue: email,
                    rules: [{
                      pattern: AppConst.regex.email, message: MessageConst.Common.InvalidEmail
                    }]
                  })(
                    <Input
                      prefix={<Icon type="mail" />}
                      type="email" size="large" name="email"
                    />
                  )}
                </FormItem>
                <FormItem label="Số điện thoại" hasFeedback>
                  {getFieldDecorator('phone', {
                    initialValue: phone,
                    rules: [{
                      pattern: AppConst.regex.phone, message: MessageConst.Common.InvalidPhone
                    }]
                  })(
                    <Input
                      prefix={<Icon type="mobile" />}
                      type="text" size="large" name="phone"
                    />
                  )}
                </FormItem>
                <FormItem label="Công ty" hasFeedback>
                  {getFieldDecorator('company', {
                    initialValue: company
                  })(
                    <Input
                      prefix={<Icon type="home" />}
                      type="text" size="large" name="company"
                    />
                  )}
                </FormItem>
                <FormItem label="Ghi chú" hasFeedback>
                  {getFieldDecorator('note', {
                    initialValue: note
                  })(
                    <Input.TextArea
                      prefix={<Icon type="lock" />}
                      name="note"
                      autosize={{ minRows: 4, maxRows: 6 }}
                    />
                  )}
                </FormItem>
                {
                  isLoaded ? null
                  :
                  <FormItem label="Tiếp tục tạo khách hàng mới">
                    {getFieldDecorator('keepCreate', {
                      initialValue: keepCreate
                    })(
                      <Switch size="small" name="keepCreate" />
                    )}
                  </FormItem>
                }
                {
                  isLoaded
                  ?
                    <FormItem className="button-groups">
                      <Link to={`/customers/${this.props.match.params.id}`}>
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
                      <Link to={'/customers'}>
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

const CustomerNewView = Form.create()(CustomerNewForm)
export default connect(({ customers, loading }) => ({ customers, loading }))(CustomerNewView)

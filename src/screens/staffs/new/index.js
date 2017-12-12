/* eslint-disable react/no-danger */

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'dva'
import { Layout, Row, Col, Button, Form, Input, Icon, Select } from 'antd'
import { MessageConst, AppConst } from '../../../configs'
import { RcNotification } from '../../../components'
import { roleText } from '../../../utils'
import './style.less'

const FormItem = Form.Item
const Option = Select.Option

class StaffNewForm extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    loading: PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'staff',
      isSubmitting: false,
      isLoaded: false
    }
  }

  componentWillMount() {
    const staffId = this.props.match.params.id
    if (staffId && staffId !== 'new') {
      this.props.dispatch({
        type: 'staffs/load',
        payload: {
          staffId
        }
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.staffs.staff && !this.state.isLoaded) {
      this.setStaff(nextProps.staffs.staff)
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'staffs/editUnmount'
    })
  }

  setStaff(staff) {
    this.setState({
      ...staff,
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
            type: 'staffs/create',
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
            type: 'staffs/update',
            payload: values,
            staffId: this.props.match.params.id
          })
        })
      } else {
        RcNotification(MessageConst.Common.InvalidForm, AppConst.notification.error)
      }
    })
  }

  handleChange = (value) => {
    this.setState({
      role: value
    })
  }

  // Check confirm password
  checkConfirmPassword = (rule, value, callback) => {
    if (value && value !== this.props.form.getFieldValue('password')) {
      callback(MessageConst.Staff.WrongConfirmPassword)
    } else {
      callback()
    }
  }

  render() {
    const { loading } = this.props
    const { getFieldDecorator } = this.props.form
    const { name, role, email, password, confirmPassword, isLoaded } = this.state
    const isCreating = loading.effects['staffs/create']
    const isUpdating = loading.effects['staffs/update']

    const commonRules = [{
      min: 6, message: MessageConst.Staff.PasswordMinLength
    }, {
      max: 32, message: MessageConst.Staff.PasswordMaxLength
    }]

    return (
      <Layout className="container">
        <Layout className="page-content page-customer-new">
          <Row type="flex" align="center">
            <Col span={10}>
              <div className="section-title">
                <h4>{isLoaded ? 'Chỉnh sửa' : 'Thêm nhân viên'}</h4>
              </div>
              <Form className="form-container">
                <FormItem label="Tên" hasFeedback>
                  {getFieldDecorator('name', {
                    initialValue: name,
                    rules: [{
                      min: 3, message: MessageConst.Staff.NameRequired
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
                <FormItem label="Role">
                  {getFieldDecorator('role', {
                    initialValue: role
                  })(
                    <Select onChange={this.handleChange}>
                      <Option value={AppConst.roles.staff}>{roleText(AppConst.roles.staff)}</Option>
                      <Option value={AppConst.roles.cashier}>{roleText(AppConst.roles.cashier)}</Option>
                      <Option value={AppConst.roles.admin}>{roleText(AppConst.roles.admin)}</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem label="Mật khẩu" hasFeedback>
                  {getFieldDecorator('password', {
                    initialValue: password,
                    rules: [{
                      required: !isLoaded, message: MessageConst.Staff.NewPasswordRequired
                    }].concat(commonRules)
                  })(
                    <Input
                      prefix={<Icon type="lock" />}
                      type="password" placeholder="Mật khẩu" size="large" name="password"
                    />
                  )}
                </FormItem>
                <FormItem label="Xác nhận mật khẩu" hasFeedback>
                  {getFieldDecorator('confirmPassword', {
                    initialValue: confirmPassword,
                    rules: [{
                      required: !isLoaded, message: MessageConst.Staff.ConfirmPasswordRequired
                    }, {
                      validator: isLoaded ? this.checkConfirmPassword : null
                    }].concat(commonRules)
                  })(
                    <Input
                      prefix={<Icon type="lock" />}
                      type="password" placeholder="Xác nhận mật khẩu" size="large" name="confirmPassword"
                    />
                  )}
                </FormItem>
                {
                  isLoaded
                  ?
                    <FormItem className="button-groups">
                      <Link to="/staffs">
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
                      <Link to="/staffs">
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

const StaffNewView = Form.create()(StaffNewForm)
export default connect(({ staffs, loading }) => ({ staffs, loading }))(StaffNewView)

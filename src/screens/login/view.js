import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Form, Input, Button } from 'antd'
import { ImageConst, AppConst, MessageConst } from '../../configs'
import { RcNotification } from '../../components'
import './style.less'

const FormItem = Form.Item

class LoginForm extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    loading: PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: ''
    }
  }

  componentDidMount() {
    document.getElementById('email').focus()
  }

  // Input on enter
  onEnter = (e) => {
    if (e.keyCode === 13) {
      this.submitLogin()
    }
  }

  // Input change event
  handleChange = (e) => {
    const newState = {}
    newState[e.target.name] = e.target.value
    this.setState(newState)
  }

  // Submit login
  submitLogin = () => {
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (!error) {
        this.props.dispatch({
          type: 'login/login',
          payload: values
        })
      } else {
        RcNotification(MessageConst.Common.InvalidForm, AppConst.notification.error)
      }
    })
  }

  render() {
    const { loading } = this.props
    const { email, password } = this.state
    const { getFieldDecorator } = this.props.form

    return (
      <div className="login-page">
        <Row type="flex" justify="center" align="top">
          <Col xs={18} sm={18} md={8} className="page-container">
            <img src={ImageConst.logoAdmin} className="logo" alt="" />
            <Form className="form-container">
              <FormItem hasFeedback>
                {getFieldDecorator('email', {
                  initialValue: email,
                  rules: [{
                    required: true, message: MessageConst.Common.EmailRequired
                  }, {
                    pattern: AppConst.regex.email, message: MessageConst.Common.InvalidEmail
                  }]
                })(
                  <Input
                    addonBefore={<img src={ImageConst.iconEmail} alt="" />}
                    type="email" placeholder="Email" size="large" name="email"
                    onChange={this.handleChange}
                    onKeyDown={this.onEnter}
                  />
                )}
              </FormItem>
              <FormItem hasFeedback>
                {getFieldDecorator('password', {
                  initialValue: password,
                  rules: [{
                    min: 6, message: MessageConst.Login.PasswordMinLength
                  }]
                })(
                  <Input
                    addonBefore={<img src={ImageConst.iconPassword} alt="" />}
                    type="password" placeholder="Mật khẩu" size="large" name="password"
                    onChange={this.handleChange}
                    onKeyDown={this.onEnter}
                  />
                )}
              </FormItem>
              <FormItem>
                <Button
                  type="primary"
                  htmlType="button"
                  className="zody-button"
                  loading={loading.effects['login/login']}
                  size="large"
                  onClick={this.submitLogin}
                >
                  Đăng nhập
                </Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </div>
    )
  }
}

const LoginView = Form.create()(LoginForm)
export default connect(({ loading }) => ({ loading }))(LoginView)

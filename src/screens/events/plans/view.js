/* eslint-disable react/no-danger */

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'dva'
import { Layout, Row, Col, Button, Form, Input, Icon, Checkbox } from 'antd'
import { MessageConst, AppConst } from '../../../configs'
import { RcNotification } from '../../../components'

const FormItem = Form.Item

class PlanNewForm extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    loading: PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = {
      name: '',
      fee: 0,
      areas: [],
      isSubmitting: false,
      isLoaded: false
    }
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'plans/listAreas',
      payload: {
        eventId: this.props.match.params.eventId
      }
    })

    const planId = this.props.match.params.id
    if (planId && planId !== 'new') {
      this.props.dispatch({
        type: 'plans/load',
        payload: {
          planId
        }
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.plans.plan && !this.state.isLoaded) {
      this.setPlan(nextProps.plans.plan)
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'areas/editUnmount'
    })
  }

  setPlan(plan) {
    this.setState({
      ...plan,
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
          values.areas = this.state.areas
          this.props.dispatch({
            type: 'plans/create',
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
          values.areas = this.state.areas
          this.props.dispatch({
            type: 'plans/update',
            payload: values,
            planId: this.props.match.params.id
          })
        })
      } else {
        RcNotification(MessageConst.Common.InvalidForm, AppConst.notification.error)
      }
    })
  }

  handleChange = (areas) => {
    this.setState({
      areas
    })
  }

  render() {
    const { loading, plans: { listAreas } } = this.props
    const { getFieldDecorator } = this.props.form
    const { name, areas, fee, isLoaded } = this.state
    const isCreating = loading.effects['plans/create']
    const isUpdating = loading.effects['plans/update']

    return (
      <Layout className="container">
        <Layout className="page-content page-customer-new">
          <Row type="flex" align="center">
            <Col span={10}>
              <div className="section-title">
                <h4>{isLoaded ? 'Chỉnh sửa' : 'Thêm gói dịch vụ'}</h4>
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
                      prefix={<Icon type="schedule" />}
                      type="text" size="large" name="name"
                    />
                  )}
                </FormItem>
                <FormItem label="Phí" hasFeedback>
                  {getFieldDecorator('fee', {
                    initialValue: fee
                  })(
                    <Input
                      prefix={<Icon type="environment-o" />}
                      type="number" size="large" name="fee"
                    />
                  )}
                </FormItem>
                <FormItem label="Khu vực">
                  {getFieldDecorator('areas', {
                    initialValue: areas
                  })(
                    <Checkbox.Group onChange={this.handleChange} name="areas">
                      <Row>
                        {
                          listAreas.map((area, index) => {
                            return (
                              <Col span={8} key={index}>
                                <Checkbox defaultChecked value={area._id}>{area.name}</Checkbox>
                              </Col>
                            )
                          })
                        }
                      </Row>
                    </Checkbox.Group>
                  )}
                </FormItem>
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

const PlanNewView = Form.create()(PlanNewForm)
export default connect(({ plans, loading }) => ({ plans, loading }))(PlanNewView)

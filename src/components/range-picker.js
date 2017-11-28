/**
 * More detail at:
 * https://ant.design/components/date-picker/
 */

import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { DatePicker, Col } from 'antd'
import { AppConst } from '../configs'
import './style.less'

moment.locale('vi')
const RangePicker = DatePicker.RangePicker
const lang = {
  timeSelect: 'Chọn giờ'
}

class RcRangePicker extends React.Component {
  static propTypes = {
    onOk: PropTypes.func,
    start: PropTypes.string,
    end: PropTypes.string,
    isNoHour: PropTypes.bool
  }

  constructor(props) {
    super(props)

    this.state = {
      start: this.props.start ? moment(this.props.start) : moment().subtract(1, 'month').startOf('d'),
      end: this.props.end ? moment(this.props.end) : moment().endOf('d')
    }
  }

  onChange = (dates) => {
    this.setState({
      start: dates[0],
      end: dates[1]
    })
  }

  onOk = () => {
    this.props.onOk(this.state.start.toISOString(), this.state.end.toISOString())
  }

  render() {
    return (
      <Col xs={24} sm={24} md={8} lg={8} xl={8} className="rc-component">
        <div className="section-title">
          <h4>Thời gian</h4>
        </div>
        <RangePicker
          className="rc-rangepicker"
          size="large"
          allowClear={false}
          defaultValue={[this.state.start, this.state.end]}
          ranges={{ 'Hôm nay': [moment(), moment()], 'Tháng này': [moment().startOf('month'), moment().endOf('month')] }}
          showTime
          locale={lang}
          format={this.props.isNoHour ? AppConst.format.dateWithNoHour : AppConst.format.date}
          onChange={this.onChange}
          onOk={this.onOk}
        />
      </Col>
    )
  }
}

export default RcRangePicker

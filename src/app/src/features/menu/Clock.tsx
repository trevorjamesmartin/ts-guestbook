import React from 'react';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'; // dependent on utc plugin
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

class Clock extends React.Component<any> {
  state: any;
  interval: any;
  format: string;
  config: any;
  constructor(props: any) {
    const { clockConfig, } = props;
    super(props);
    this.format = clockConfig?.seconds ? 'LTS' : 'LT';
    if (clockConfig?.military) {
      this.format = 'HH:mm:ss';
    }
    this.config = clockConfig;
    this.state = {
      time: dayjs(new Date()).format(this.format)
    };
  };

  componentDidMount() {
    this.format = this.config?.seconds ? 'LTS' : 'LT';
    if (this.config?.military) {
      this.format = 'HH:mm:ss';
    }
    this.interval = setInterval(() => this.setState({
      time: dayjs(new Date()).format(this.format)
    }), 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <span className="app-clock">{this.state.time}</span>
    );
  }
}

export default Clock;

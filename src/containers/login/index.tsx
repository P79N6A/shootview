import * as React from 'react';
import { Toast } from 'antd-mobile';
import {
    Form, Icon, Input, Button, Checkbox,
} from 'antd';
import dsbridge from 'dsbridge';
import './index.less';
// import 'antd-mobile/dist/antd-mobile.css';

interface IProps {
    form:any
}

interface IState {
    hasError: boolean;
    value: string;
}

class Login extends React.Component<IProps, IState> {

    public readonly state: IState = {
        hasError: false,
        value: '',
    }

    onErrorClick = () => {
        if (this.state.hasError) {
            Toast.info('请输入11位手机号码');
        }
    }

    onChange = (value: any) => {
        if (value.replace(/\s/g, '').length < 11) {
            this.setState({
                hasError: true,
            });
        } else {
            this.setState({
                hasError: false,
            });
        }
        this.setState({
            value,
        });
    }

    handleSubmit = (e:any) => {
        e.preventDefault();
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                console.log('Received values of form: ', values);
                dsbridge.call('login', JSON.stringify(values), (ret) => {
                    if (ret === 'error') {
                        Toast.fail('登录错误，请输入正确的账号');
                        return;
                    }

                    localStorage.setItem('user_phone', values.phone);

                    if (values.custom) {
                        location.hash = `#artist/${values.phone}`;
                    } else {
                        location.hash = `#home/${values.phone}`;
                    }
                });
            }
        });
    }

    handleSignUp = (e: any) => {
        location.hash = `#signup`;

    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                    {getFieldDecorator('phone', {
                        rules: [{ required: true, message: '请输入您的手机号码' }],
                    })(
                        <Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="手机号码" />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码' }],
                    })(
                        <Input size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('custom', {
                        valuePropName: 'checked',
                        initialValue: false,
                    })(
                        <Checkbox>是否摄影师</Checkbox>
                    )}
                    <a className="login-form-forgot" href="#/signup">忘记密码</a>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        登录
                    </Button>
                    <Button type="primary" onClick={this.handleSignUp} className="login-form-button">
                        注册
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Login);

export default WrappedNormalLoginForm;
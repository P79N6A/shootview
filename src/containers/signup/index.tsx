import {
    Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,
} from 'antd';
import * as React from 'react';
import {Toast} from 'antd-mobile';
import dsbridge from 'dsbridge';
import './index.less';

const {Option} = Select;
const AutoCompleteOption = AutoComplete.Option;

interface IProps {
    form: any
}

interface IState {
    confirmDirty: boolean
    autoCompleteResult: Array<string>
}

const residences = [
    {
        value: 'hangzhou',
        label: '浙江',
        children: [{
            value: 'hangzhou',
            label: '杭州',
            children: [
                {
                    value: 'xihu',
                    label: '西湖',
                },
                {
                    value: 'shangcheng',
                    label: '上城',
                }
            ],
        }],
    }, {
        value: 'jiangsu',
        label: '江苏',
        children: [{
            value: 'nanjing',
            label: '南京',
            children: [
                {
                    value: 'xuanwu',
                    label: '玄武区',
                },
                {
                    value: 'jianye',
                    label: '建邺区',
                },
                {
                    value: 'qinhuai',
                    label: '秦淮区',
                },
            ],
        }],
    }, {
        value: 'tianjin',
        label: '天津',
    }
];

class RegistrationForm extends React.Component<IProps, IState> {
    public readonly state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err: any, values: any) => {
            if (!err) {
                console.log('Received values of form: ', values);
                dsbridge.call('register', JSON.stringify(values), (ret) => {
                    if (ret === 'error') {
                        Toast.fail('注册错误，请正确填写信息');
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

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次密码输入不一致');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    }

    handleWebsiteChange = (value) => {
        let autoCompleteResult = [];
        if (!value) {
            autoCompleteResult = [];
        } else {
            autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
        }
        this.setState({autoCompleteResult});
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {autoCompleteResult} = this.state;

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{width: 70}}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        );


        return (
            <Form {...formItemLayout} className={'signup-form'} onSubmit={this.handleSubmit}>
                <Form.Item
                    label="手机号码"
                >
                    {getFieldDecorator('phone', {
                        rules: [{required: true, message: '请输入手机号码'}],
                    })(
                        <Input addonBefore={prefixSelector} style={{width: '100%'}}/>
                    )}
                </Form.Item>
                <Form.Item
                    label="密码"
                >
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true, message: '请输入密码',
                        }, {
                            validator: this.validateToNextPassword,
                        }],
                    })(
                        <Input type="password"/>
                    )}
                </Form.Item>
                <Form.Item
                    label="再次输入密码"
                >
                    {getFieldDecorator('confirm', {
                        rules: [{
                            required: true, message: '请再次输入密码',
                        }, {
                            validator: this.compareToFirstPassword,
                        }],
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur}/>
                    )}
                </Form.Item>
                <Form.Item
                    label={(
                        <span>
                            用户名&nbsp;
                            <Tooltip title="你的用户名">
                                <Icon type="question-circle-o"/>
                            </Tooltip>
                        </span>
                    )}
                >
                    {getFieldDecorator('nickname', {
                        rules: [{required: true, message: '请填写用户名', whitespace: true}],
                    })(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item
                    label="居住地"
                >
                    {getFieldDecorator('residence', {
                        initialValue: ['jiangsu', 'nanjing', 'xuanwu'],
                        rules: [{type: 'array', required: true, message: '请选择居住地'}],
                    })(
                        <Cascader options={residences}/>
                    )}
                </Form.Item>
                <Form.Item
                    label="是否是摄影师"
                >
                    {getFieldDecorator('custom', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(
                        <Checkbox>是否是摄影师</Checkbox>
                    )}
                </Form.Item>
                {/*<Form.Item
                    label="Captcha"
                    extra="We must make sure that your are a human."
                >
                    <Row gutter={8}>
                        <Col span={12}>
                            {getFieldDecorator('captcha', {
                                rules: [{required: true, message: 'Please input the captcha you got!'}],
                            })(
                                <Input/>
                            )}
                        </Col>
                        <Col span={12}>
                            <Button>Get captcha</Button>
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    {getFieldDecorator('agreement', {
                        valuePropName: 'checked',
                    })(
                        <Checkbox>I have read the <a href="">agreement</a></Checkbox>
                    )}
                </Form.Item>*/}
                <Form.Item {...tailFormItemLayout}>
                    <Button className={'signup-form-button'} type="primary" htmlType="submit">注册</Button>
                </Form.Item>
            </Form>
        );
    }
}

const WrappedRegistrationForm = Form.create({name: 'register'})(RegistrationForm);

export default WrappedRegistrationForm;
import * as React from 'react';
import { Toast,NavBar } from 'antd-mobile';
import {
    Form, Icon, Input, Button, Checkbox,
} from 'antd';
import dsbridge from 'dsbridge';
import './index.less';


interface IProps {
    form:any
}

interface IState {
    hasError: boolean;
    value: string;
}

class Artist extends React.Component<IProps, IState> {

    handleSubmit = (e:any) => {
        e.preventDefault();
        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                console.log('Received values of form: ', values);
                dsbridge.call('insertAlbum', JSON.stringify(values), (ret) => {
                    if (ret === 'error') {
                        Toast.fail('提交失败');
                        return;
                    }

                    Toast.success('提交成功');

                });
            }
        });
    }

    renderNav() {
        const onLeftClick = () => {
            history.back();
        }

        return (
            <NavBar
                mode="dark"
                icon={<Icon type="left" />}
                onLeftClick={onLeftClick}
                /*rightContent={[
                    <Icon key="1" type="ellipsis" />
                ]}*/
            >NavBar</NavBar>
        )
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                {this.renderNav()}
                <Form onSubmit={this.handleSubmit} className="artist-form">
                    <Form.Item>
                        {getFieldDecorator('phone', {
                            rules: [{ required: true, message: '请输入您的手机号码' }],
                        })(
                            <Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="手机号码" />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('cover', {
                            rules: [{ required: true, message: '请填写封面' }],
                        })(
                            <Input size="large" placeholder="封面" />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: '请填写标题' }],
                        })(
                            <Input size="large" placeholder="标题" />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('price', {
                            rules: [{ required: true, message: '请填写价格' }],
                        })(
                            <Input size="large" placeholder="价格" />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('type', {
                            rules: [{ required: true, message: '请填写类型' }],
                        })(
                            <Input size="large" placeholder="类型" />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('content', {
                            rules: [{ required: true, message: '请填写个人资料' }],
                        })(
                            <Input size="large" placeholder="个人资料" />
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

const WrappedNormalArtistForm = Form.create({ name: 'normal_artist' })(Artist);

export default WrappedNormalArtistForm;
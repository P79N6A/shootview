import * as React from 'react';
import { Carousel, WingBlank, NavBar, Icon, Card, WhiteSpace, Button, Toast } from 'antd-mobile';
import { Modal,Form,DatePicker,Select,Input } from 'antd';
import './index.less';
import dsbridge from 'dsbridge';
import {RouteComponentProps} from 'react-router';
import {IAlbum, IRouteParams} from '../home';


export interface IProps extends RouteComponentProps<IRouteParams> {
    form: any
}

export interface IState {
}

const { Option } = Select;

const mockData = [
    {
        phone: 15912341112,
        cover: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
        title: '资深摄影师个人摄影展示',
        price: 1200,
        type: '个人',
        content: '个人资深摄影师',
        images: [
            'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
        ]
    },
    {
        phone: 15912341113,
        cover: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
        title: '资深摄影师个人摄影展示',
        price: 1200,
        type: '个人',
        content: '个人资深摄影师',
        images: [
            'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
        ]
    }
]

class Detail extends React.Component<IProps, IState> {

    state = {
        imgHeight: 176,
        visible: false,
        confirmLoading: false,
        album: null
    }
    componentDidMount() {
        const phone = this.props.match.params.phone;

        dsbridge.call('getAlbumByPhone', `${phone}`, (ret:string) => {
            if (ret === 'error') {
                Toast.fail('目前没有摄影师');
                return;
            }

            if (ret) {
                try {
                    this.setState({
                        album: JSON.parse(ret)
                    })
                } catch (e) {
                    Toast.fail('目前没有摄影师');
                }
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


    renderCarousel() {
        let {
            album
        } = this.state;

        const phone = this.props.match.params.phone;

        if (!album || !album.cover) {
            album = mockData[0];
        }
        console.log(album);
        return (
            <Carousel
                autoplay={false}
                infinite
                style={{width: '100%'}}
            >
                    <a
                        key={album.cover}
                        href={'javascript:;'}
                        style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
                    >
                        <img
                            src={`${album.cover}`}
                            alt=""
                            style={{ width: '100%', verticalAlign: 'top' }}
                            onLoad={() => {
                                // fire window resize event to change height
                                window.dispatchEvent(new Event('resize'));
                                this.setState({ imgHeight: 'auto' });
                            }}
                        />
                    </a>
            </Carousel>
        )
    }

    renderCard() {
        let {
            album
        } = this.state;

        const phone = this.props.match.params.phone;

        if (!album) {
            album = mockData[0];
        }
        return (
            <WingBlank size="lg">
                <WhiteSpace size="lg" />
                <Card>
                    <Card.Header
                        title={`￥${album.price}`}
                        extra={<span>作品类型</span>}
                    />
                    <Card.Body>
                        <div>{`${album.title}`}</div>
                    </Card.Body>
                    <Card.Footer content={`${album.title}`} extra={<div>{`电话:${album.phone}`}</div>} />
                </Card>
                <WhiteSpace size="lg" />
            </WingBlank>
        )
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = (e) => {
        e.preventDefault();
        this.setState({
            confirmLoading: true
        });
        setTimeout(() => {
            this.setState({
                visible: false,
                confirmLoading: false,
            });
        }, 2000);

        const userPhone = localStorage.getItem('user_phone');

        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                console.log('Received values of form: ', values);

                const result = {
                    customerPhone: userPhone,
                    artistPhone: values.phone,
                    status: 1
                }

                dsbridge.call('insertOrder', JSON.stringify(result), (ret) => {
                    if (ret === 'error') {
                        Toast.fail('订单出错');
                        return;
                    }

                    location.hash = `#order`;
                });
            }
        });
    }

    handleSubmit() {

    }

    renderModal() {

        const { visible, confirmLoading } = this.state;

        const { getFieldDecorator } = this.props.form;

        const config = {
            rules: [{ type: 'object', required: true, message: 'Please select time!' }],
        };

        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        );

        return (
            <Modal
                title="订单"
                visible={visible}
                onOk={this.handleOk}
                okText={'提交'}
                cancelText={'取消'}
                confirmLoading={confirmLoading}
                onCancel={this.handleCancel}
            >
                <Form onSubmit={this.handleSubmit}>
                    <Form.Item
                        label="预约时间"
                    >
                        {getFieldDecorator('date-time-picker', config)(
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                        )}
                    </Form.Item>
                    <Form.Item
                        label="联系电话"
                    >
                        {getFieldDecorator('phone', {
                            rules: [{ required: true, message: '请输入联系电话' }],
                        })(
                            <Input type={'number'} addonBefore={prefixSelector} style={{ width: '100%' }} />
                        )}
                    </Form.Item>
                    <Form.Item
                        label="拍摄地点"
                    >
                        {getFieldDecorator('address', {
                            rules: [{ required: true, message: '请输入拍摄地点' }],
                        })(
                            <Input style={{ width: '100%' }} />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        )
    }

    /*renderDialog() {
        return (
            <WingBlank size="lg">
                <Button onClick={() => prompt(
                    '订单',
                    '请填写订单',
                    (login, password) => console.log(`login: ${login}, password: ${password}`),
                    'login-password',
                    undefined,
                    ['Please input name', 'Please input password'],
                )}
                >login-password</Button>

                <WhiteSpace size="lg" />
            </WingBlank>
        )
    }*/

    handleOrder() {
        /*Toast.loading('Loading...', 2, () => {
            console.log('Load complete !!!');
        }, true);*/

    }


    render() {
        return (
            <div className={'detail'}>
                {this.renderNav()}
                {this.renderCarousel()}
                {this.renderCard()}
                {this.renderModal()}
                <div className={'detail-order'}>
                    <Button onClick={this.showModal} type={'warning'} size="large">预约摄影</Button>
                </div>
            </div>
        )
    }
}

const WrappedTimeRelatedForm = Form.create({ name: 'time_related_controls' })(Detail);

export default WrappedTimeRelatedForm;


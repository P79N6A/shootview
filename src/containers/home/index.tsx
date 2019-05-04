import * as React from 'react';
import { Card } from 'antd';
import {  NavBar, Icon } from 'antd-mobile';
const { Meta } = Card;
import {RouteComponentProps} from 'react-router';
import dsbridge from 'dsbridge';

import './index.less';
import {Toast} from 'antd-mobile';

export interface IAlbum {

    phone: number
    /**
     * 封面
     */
    cover: string

    /**
     * 标题
     */
    title: string

    /**
     * 价格
     */
    price: string

    /**
     * 作品类型
     */
    type: string

    /**
     * 个人资料
     */
    content: string

    /**
     * 图集列表
     */
    images: string[]
}

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


export interface IRouteParams {
    phone: string
}

export interface IProps extends RouteComponentProps<IRouteParams> {
}

export interface IState {
    albumList: IAlbum[]
}

class Home extends React.Component<IProps, IState> {
    state = {
        albumList: []
    }

    componentDidMount() {
        dsbridge.call('getAllAlbums', '', (ret:string) => {
            if (ret === 'error') {
                Toast.fail('目前没有摄影师');
                return;
            }

            if (ret) {
                try {
                    this.setState({
                        albumList: JSON.parse(ret)
                    })
                } catch (e) {
                    Toast.fail('目前没有摄影师');
                }
            }
        });
    }

    handleClick(data: IAlbum) {
        Toast.success('进入摄影师预约页');
        location.hash = `#detail/${data.phone}`;
        /*if (data.phone) {
            location.hash = `#detail/${data.phone}`;
        }*/
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


    renderList() {
        const {
            albumList
        } = this.state;

        if (albumList && albumList.length > 0) {
            return albumList.map((value: IAlbum, index) => {
                return (
                    <Card
                        hoverable
                        cover={<img alt="example" src={value.cover} />}
                        onClick={this.handleClick.bind(this, value)}
                    >
                        <Meta
                            title={value.title}
                            description={value.price}
                        />
                    </Card>
                )
            })
        }

        return [
            (
                <Card
                    hoverable
                    onClick={this.handleClick.bind(this, mockData[0])}
                    cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                >
                    <Meta
                        title="北京摄影师"
                        description="￥1000"
                    />
                </Card>
            ),
            (
                <Card
                    hoverable
                    onClick={this.handleClick.bind(this, mockData[1])}
                    cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                >
                    <Meta
                        title="南京摄影师"
                        description="￥1200"
                    />
                </Card>
            )
        ];

    }


    render() {
        console.log(this.props.match.params.phone);

        return (
            <div className={'tourist'}>
                {this.renderNav()}
                {/*<Row gutter={4}>
                    <Col span={12}>
                        <Card
                            hoverable
                            cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                        >
                            <Meta
                                title="北京大牛摄影师"
                                description="￥1000"
                            />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card
                        hoverable
                        cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                    >
                        <Meta
                            title="江苏大牛摄影师"
                            description="￥1000"
                        />
                    </Card>
                    </Col>
                </Row>*/}
                {this.renderList()}
            </div>
        )
    }
}

export default Home;


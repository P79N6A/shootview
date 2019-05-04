import * as React from 'react';
import {List, Toast} from 'antd-mobile';
import { Card,Button } from 'antd';

import './index.less';
import dsbridge from 'dsbridge';


export interface IProps {

}

export interface IState {

}

const Item = List.Item;

class Order extends React.Component<IProps, IState> {

    state = {
        orders: []
    }

    componentDidMount() {
        const userPhone = localStorage.getItem('user_phone');
        dsbridge.call('getAllOrders', userPhone, (ret) => {
            if (ret === 'error') {
                Toast.fail('订单出错');
                return;
            }

            try {
                this.setState({
                    orders: JSON.parse(ret)
                })
            } catch (e) {

            }

        });
    }

    handleCancel(index: number) {
        const array = this.state.orders;
        array.splice(index, 1);
        this.setState({
            orders: array
        })
    }


    renderItem() {
        const {
            orders
        } = this.state;

        if (!orders || orders.length <= 0) {
            return [];
        }

        return orders.map((val, index) => {
            return (
                <Item>
                    <Card
                        size="small"
                        title="已预约"
                        extra={<Button onClick={this.handleCancel.bind(this, index)} type="primary">取消订单</Button>}
                        style={{ width: '100%' }}
                    >
                        <p>{val.artistPhone}</p>
                    </Card>
                </Item>
            )
        })

    }

    render() {
        return (
            <div className={'order'}>
                <List>
                    {this.renderItem()}
                </List>
            </div>
        )
    }
}

export default Order;
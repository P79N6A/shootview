import * as React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import Login from '../login';
import SignUp from '../signup';
import Detail from '../detail';
import Order from '../order';
import { createHashHistory } from 'history';
import Home from '../home';
import Artist from '../artist';

const Main = function(): JSX.Element {
    return (
        <Router history={createHashHistory()}>
        <Switch>
            <Route path="/" component={Login} exact={true}/>
            <Route path="/signup" component={SignUp} />
            <Route path="/home/:phone" component={Home} />
            <Route path="/detail/:phone" component={Detail} />
            <Route path="/order/:phone" component={Order} />
            <Route path="/artist/:phone" component={Artist} />
            {/*<Route path="/login" component={Login} />
            <Route path="/edit" component={Edit} />
            <Route path="/room/:keciId" component={TeacherRoom} />
            <Route path="/debug" component={Debug} exact={true} />*/}
        </Switch>
    </Router>
);
}

export default hot(module)(Main);
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch, Link} from 'react-router-dom';

import Top from './common/pages/Top';
import Example from './common/pages/Example';
import About from './common/pages/About';
import Register from './auth/register/Register';
import LogIn from './auth/login/LogIn';
import User from './user/User';
import Chat from './chat/chat/Chat';
import PrivateChat from './chat/privatechat/PrivateChat';
import GroupChat from './chat/groupchat/GroupChat';
import HeaderPrimary from './common/header/components/HeaderPrimary';
import Wordle from './wordle/Wordle';
import WordleManage from './wordle/WordleManage';
import Page404 from './common/pages/Page404';

import AxiosInterceptors from './contexts/AxiosInterceptors';
import ProvideAuth, { PrivateRoute, PublicRoute } from './contexts/AuthContext'
import ProvideNoification from './contexts/NotificationContext';
import YupCustom from './contexts/YupCustom';

function App(): React.ReactElement {
    return (
        <AxiosInterceptors>
            <YupCustom>
                <ProvideAuth> 
                    <ProvideNoification>
                        <BrowserRouter>
                            <HeaderPrimary>
                                <Switch>
                                    <Route path='/' exact component={Top} />
                                    <Route path='/example' exact component={Example} />
                                    <PrivateRoute path='/about' exact><About/></PrivateRoute>
                                    <PublicRoute path='/register' exact><Register/></PublicRoute>
                                    <PublicRoute path='/login' exact><LogIn/></PublicRoute>
                                    <Route path='/user/:id' exact component={User} />
                                    <PrivateRoute key={'index'} path='/chat' exact><Chat/></PrivateRoute>
                                    <PrivateRoute path='/privatechat/:id' exact><PrivateChat/></PrivateRoute>
                                    <PrivateRoute path='/groupchat/:id' exact><GroupChat/></PrivateRoute>
                                    <PrivateRoute key={'category'} path='/category/:category_id' exact><Chat/></PrivateRoute>
                                    <PrivateRoute key={'wordlecreate'} path='/wordle/create' exact><WordleManage/></PrivateRoute>
                                    <PrivateRoute key={'wordlemanage'} path='/wordle/manage/:wordle_id' exact><WordleManage/></PrivateRoute>
                                    <Route key={'wordletag'} path='/wordle/tag/:wordle_tag_id' exact component={Top}></Route>
                                    {/* リンクから直接飛んで来たらページ内で固有ゲームIDを付与してURLを書き換える？ */}
                                    {/* <PrivateRoute path='/wordle/game/:id' exact><Wordle/></PrivateRoute> */}
                                    <PrivateRoute path='/wordle/game/:wordle_id/:game_uuid' exact><Wordle/></PrivateRoute>
                                    <Route path='*' exact component={Page404} />
                                </Switch>
                            </HeaderPrimary>
                        </BrowserRouter>
                    </ProvideNoification>
                </ProvideAuth>
            </YupCustom>
        </AxiosInterceptors>
    );
}

ReactDOM.render((
    <App />
), document.getElementById('app'))

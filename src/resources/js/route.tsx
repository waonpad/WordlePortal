import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '@/common/errorboundary/components/ErrorFallBack';

import View from '@/View';
import Top from '@/common/pages/top/Top';
import Example from '@/common/pages/Example';
import About from '@/common/pages/About';
import Register from '@/auth/register/Register';
import LogIn from '@/auth/login/LogIn';
import User from '@/user/User';
import HeaderPrimary from '@/common/header/headerprimary/components/HeaderPrimary';
import Wordle from '@/wordle/wordle/Wordle';
import WordleManage from '@/wordle/wordlemanage/WordleManage';
import Page404 from '@/common/pages/Page404';

import AxiosInterceptors from '@/contexts/AxiosInterceptors';
import ProvideAuth, { PrivateRoute, PublicRoute } from '@/contexts/AuthContext'
import ProvideNoification from '@/contexts/NotificationContext';
import YupCustom from '@/contexts/YupCustom';

import Test from '@/test/Test';

function App(): React.ReactElement {
    return (
        <View>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <BrowserRouter>
                    <AxiosInterceptors>
                        <YupCustom>
                            <ProvideAuth> 
                                <ProvideNoification>
                                    <HeaderPrimary>
                                        <Switch>

                                            <Route path='/test' exact component={Test} />

                                            <Route path='/' exact component={Top} />
                                            <Route path='/example' exact component={Example} />
                                            <PrivateRoute path='/about' exact><About/></PrivateRoute>
                                            <PublicRoute path='/register' exact><Register/></PublicRoute>
                                            <PublicRoute path='/login' exact><LogIn/></PublicRoute>
                                            <Route path='/user/:screen_name' exact component={User} />
                                            <Route path='/user/:screen_name/follows' exact component={User} />
                                            <Route path='/user/:screen_name/followers' exact component={User} />
                                            <Route path='/user/:screen_name/wordle' exact component={User} />
                                            <Route path='/user/:screen_name/wordle/game' exact component={User} />
                                            <Route path='/user/:screen_name/wordle/like' exact component={User} />
                                            <PrivateRoute path='/wordle/create' exact><WordleManage/></PrivateRoute>
                                            <PrivateRoute path='/wordle/manage/:wordle_id' exact><WordleManage/></PrivateRoute>
                                            <Route path='/wordle/index' exact component={Top}></Route>
                                            <Route path='/wordle/follows' exact component={Top}></Route>
                                            <Route path='/wordle/tag/:wordle_tag_id' exact component={Top}></Route>
                                            <Route path='/wordle/search/:wordle_search_param' exact component={Top}></Route>
                                            <Route path='/wordle/game/index' exact component={Top}></Route>
                                            <Route path='/wordle/game/follows' exact component={Top}></Route>
                                            <Route path='/wordle/game/tag/:game_tag_id' exact component={Top}></Route>
                                            <Route path='/wordle/game/search/:wordle_game_search_param' exact component={Top}></Route>
                                            <PrivateRoute path='/wordle/game/play/:game_uuid' exact><Wordle/></PrivateRoute>
                                            <Route path='*' exact component={Page404} />
                                        </Switch>
                                    </HeaderPrimary>
                                </ProvideNoification>
                            </ProvideAuth>
                        </YupCustom>
                    </AxiosInterceptors>
                </BrowserRouter>
            </ErrorBoundary>
        </View>
    );
}

ReactDOM.render((
    <App />
), document.getElementById('app'))

import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Box, Grid, Typography, Avatar, Card, CardContent, Button, Collapse, IconButton, List, Divider } from '@mui/material';
import PaginationPrimary from '@/common/pagination/paginationprimary/components/PaginationPrimary';
import SuspensePrimary from '@/common/suspense/suspenseprimary/components/SuspensePrimary';
import UserListItem from '@/user/components/UserListItem';
import { UserListProps } from '@/user/types/UserType';
import SimpleTextListItem from '@/common/listitem/simpletextlistitem/components/SimpleTextListItem';

function UserList(props: UserListProps): React.ReactElement {
    const {head, request_config, listen, no_item_text} = props;

    const [users, setUsers] = useState<any[]>([]);
    const [users_loading, setusersLoading] = useState<boolean>(true);

    // API /////////////////////////////////////////////////////////////////////////
    const getUsers = (paginate: 'prev' | 'next') => {
        axios.get(`/api/${request_config.api_url}`, {params: {...request_config.params, per_page: 10, paginate: paginate, start: users.length > 0 ? users[0].id : null, last: users.length > 0 ? users.slice(-1)[0].id : null}}).then(res => {
            if(res.data.status === true) {
                var res_data = res.data;
                request_config.response_keys.forEach(key => {
                    res_data = res_data[key];
                });

                setUsers(res_data.reverse());
                setusersLoading(false);
            }
            else if (res.data.status === false) {
                // TODO: ユーザーが存在しない時の処理
            }
        })
    }

    useEffect(() => {
        getUsers('prev');
    }, []);

    /////////////////////////////////////////////////////////////////////////
    // チャンネル関連のコードは今は必要無いので書いていない
    /////////////////////////////////////////////////////////////////////////

    // Page Change ///////////////////////////////////////////////////////////////////////
    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        getUsers(event.currentTarget.value as 'prev' | 'next');
    }
    /////////////////////////////////////////////////////////////////////////


    // フォロー /////////////////////////////////////////////////////////////////////////
    const followToggle = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const screen_name = event.currentTarget.value;

        axios.post('/api/user/followtoggle', {screen_name: screen_name}).then(res => {
            if(res.data.status === true) {
                setUsers((users) => users.map((user) => (user.screen_name === screen_name ? {...user, follow: res.data.follow} : user)));
            }
            else if (res.data.status === false) {
                // TODO: 失敗時の処理
            }
        })
    }
    /////////////////////////////////////////////////////////////////////////

    return (
        <Card elevation={1}>
            {head}
            <List sx={{minWidth: '100%', bgcolor: 'background.paper'}}>
                {
                    users_loading ?
                    <SuspensePrimary open={users_loading} backdrop={false} />
                    :
                    users.length > 0 ?
                    <React.Fragment>
                        {
                            users.map((user: any, index: number) => (
                                <React.Fragment key={index}>
                                    <UserListItem
                                        user={user}
                                        followToggle={followToggle}
                                    />
                                    <Divider />
                                </React.Fragment>
                            ))
                        }
                        <PaginationPrimary
                            handlePageChange={handlePageChange}
                        />
                    </React.Fragment>
                    :
                    <SimpleTextListItem text={no_item_text} />
                }
            </List>
        </Card>
    )
}

export default UserList;
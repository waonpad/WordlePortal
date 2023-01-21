import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Box, Grid, Typography, Avatar, Card, CardContent, Button, Collapse, IconButton, List, ListItem, Divider } from '@mui/material';
import PaginationPrimary from '@/common/pagination/paginationprimary/components/PaginationPrimary';
import SuspensePrimary from '@/common/suspense/suspenseprimary/components/SuspensePrimary';
import SimpleTextListItem from '@/common/listitem/simpletextlistitem/components/SimpleTextListItem';
import { useNotification } from '@/contexts/NotificationContext';
import { NotificationListProps } from '@/common/notification/types/NotificationListType';
import NotificationListItemFollow from './NotificationListItemFollow';
import ButtonGroupPrimary from '@/common/button/buttongroupprimary/components/ButtonGroupPrimary';

function NotificationList(props: NotificationListProps): React.ReactElement {
    const {head, forwardRef, no_item_text} = props;

    const notification = useNotification();

    const [display_notification_list, setDisplayNotificationList] = useState<'unread' | 'all'>('unread');

    const handleDisplayNotificationListChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setDisplayNotificationList(event.currentTarget.value as 'unread' | 'all');
    }

    // const [notifications, setNotifications] = useState<any[]>([]);
    // const [notifications_loading, setNotificationsLoading] = useState<boolean>(true);

    // // API /////////////////////////////////////////////////////////////////////////
    // const getNotifications = () => {
    //     axios.get(`/api/${request_config.api_url}`, {params: {...request_config.params}}).then(res => {
    //         if(res.data.status === true) {
    //             var res_data = res.data;
    //             request_config.response_keys.forEach(key => {
    //                 res_data = res_data[key];
    //             });

    //             setNotifications(res_data.reverse());
    //             setNotificationsLoading(false);
    //         }
    //         else if (res.data.status === false) {
    //             // TODO:
    //         }
    //     })
    // }

    // useEffect(() => {
    //     getNotifications();
    // }, []);

    return (
        <Card elevation={1} ref={forwardRef}>
            <ButtonGroupPrimary
                head={true}
                items={[
                    {
                        text: 'Unread',
                        value: 'unread',
                        onClick: handleDisplayNotificationListChange,
                        active: display_notification_list === 'unread'
                    },
                    {
                        text: 'All',
                        value: 'all',
                        onClick: handleDisplayNotificationListChange,
                        active: display_notification_list === 'all'
                    },
                ]}
            />
            <List sx={{minWidth: '100%', bgcolor: 'background.paper', pt: 0, pb: 0}}>
                {
                    notification!.notifications_loading ?
                    <SuspensePrimary open={true} backdrop={false} />
                    :
                    (display_notification_list === 'unread' ? notification!.unread_notifications.length > 0 : notification!.all_notifications.length > 0) ?
                    <React.Fragment>
                        {
                            (display_notification_list === 'unread' ? notification!.unread_notifications : notification!.all_notifications).map((notification: any, index: number) => (
                                <React.Fragment key={index}>
                                    {
                                        notification.resource_type === 'App\\Models\\Follow' ?
                                        <NotificationListItemFollow
                                            follow_notification={notification}
                                        />
                                        :
                                        notification.resource_type === 'App\\Models\\WordleLike' ?
                                        <Typography>wordlelike</Typography>
                                        :
                                        notification.resource_type === 'App\\Models\\WordleComment' ?
                                        <Typography>wordlecomment</Typography>
                                        :
                                        <Typography>err</Typography>
                                    }
                                    <Divider />
                                </React.Fragment>
                            ))
                        }
                    </React.Fragment>
                    :
                    <SimpleTextListItem text={no_item_text} />
                }
            </List>
        </Card>
    )
}

export default NotificationList;
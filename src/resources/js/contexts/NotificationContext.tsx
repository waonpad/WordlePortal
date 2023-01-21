import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import React, {useContext, createContext, useState, ReactNode, useEffect } from "react";

export type NotificationsProps = {
    notifications_loading: boolean;
    all_notifications: any[];
    unread_notifications: any[];
    readNotification: (notification_id: any) => void;
    readAllNotifications: () => void;
}

const notificationContext = createContext<NotificationsProps | null>(null);

type Props = {
    children: ReactNode
}

declare var window: {
    Echo: any;
}

const ProvideNoification = ({children}: Props) => {
    const notification = useProvideNoification();
    return (
        <notificationContext.Provider value={notification}>
            {children}
        </notificationContext.Provider>
    )
}
export default ProvideNoification

export const useNotification = () => {
    return useContext(notificationContext)
}

const useProvideNoification = () => {
    const auth = useAuth();

    const [notifications_loading, setNotificationsLoading] = useState<boolean>(true);
    const [all_notifications, setAllNotifications] = useState<any[]>([]);
    const [unread_notifications, setUnreadNotifications] = useState<any[]>([]);

    useEffect(() => {
        if(auth?.user !== null) {
            const api1 = axios.get('/api/notification/unread');
            const api2 = axios.get('/api/notification/index');

            axios.all([api1, api2]).then(axios.spread((res1, res2) => {
                if (res1.data.status === true) {
                    setUnreadNotifications(res1.data.unread_notifications);

                    window.Echo.private('App.Models.User.' + auth?.user?.id)
                    .notification((notification: any) => {
                        console.log(notification);
                        setUnreadNotifications((unread_notifications) => [...unread_notifications, notification]);
                        setAllNotifications((all_notifications) => [...all_notifications, notification]);
                    })
                }
                if (res2.data.status === true) {
                    setAllNotifications(res2.data.notifications);
                }
                setNotificationsLoading(false);
            }))
        }
    }, [auth?.user])


    const readNotification = (notification_id: any) => {
        axios.post('/api/notification/read', {notification_id: notification_id}).then(res => {
            if (res.data.status === true) {
                console.log('read: ' + notification_id);
            }
        })
    }

    const readAllNotifications = () => {
        axios.post('/api/notification/readall').then(res => {
            if (res.data.status === true) {
                console.log('readAll');
                setUnreadNotifications([]);
            }
        })
    }

    return {
        notifications_loading,
        all_notifications,
        unread_notifications,
        readNotification,
        readAllNotifications
    }
}
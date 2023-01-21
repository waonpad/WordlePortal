import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import React, {useContext, createContext, useState, ReactNode, useEffect } from "react";

export type NotificationsProps = {
    notifications_loading: boolean;
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
    const [unread_notifications, setUnreadNotifications] = useState<any[]>([]);

    useEffect(() => {
        if(auth?.user !== null) {
            axios.get('/api/notification/unread').then(res => {
                if (res.data.status === true) {
                    const exist_resource_notifications = res.data.unread_notifications.filter((notification: any) => (
                        notification.resource !== null
                    ))

                    setUnreadNotifications(exist_resource_notifications);
                    setNotificationsLoading(false);
                }
            })

            window.Echo.private('App.Models.User.' + auth?.user?.id)
            .notification((notification: any) => {
                console.log(notification);
                setUnreadNotifications((unread_notifications) => [...unread_notifications, notification]);
            })
        }

        // readNotification("37d6b77b-ec53-4858-b0e4-ab9eaa5d4e07");

        // readAllNotifications();
    }, [auth?.user])


    const readNotification = (notification_id: any) => {
        axios.post('/api/notification/read', {notification_id: notification_id}).then(res => {
            if (res.data.status === true) {
                console.log(res);
            }
        })
    }

    const readAllNotifications = () => {
        axios.post('/api/notifications/readall').then(res => {
            if (res.data.status === true) {
                console.log(res);
            }
        })
    }

    return {
        notifications_loading,
        unread_notifications,
        readNotification,
        readAllNotifications
    }
}
import axios from 'axios';
import { useAuth } from "./AuthContext";
import React, {useContext, createContext, useState, ReactNode, useEffect } from "react";
import { useErrorHandler } from 'react-error-boundary';

const notificationContext = createContext<any>(null);

type Props = {
    children: ReactNode
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

    const [unread_notifications, setUnreadNotifications] = useState<any[]>([]);

    useEffect(() => {
    if(auth?.user !== null) {
        axios.get('/api/notification/unread').then(res => {
            if (res.data.status === true) {
                // console.log(res);
                setUnreadNotifications(res.data.unread_notifications);

                // setInitialLoad(false);
            }
        })

        window.Echo.private('App.Models.User.' + auth?.user?.id)
        .notification((notification: any) => {
            console.log(notification);
            setUnreadNotifications([...unread_notifications, notification]);
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
        unread_notifications,
        readNotification,
        readAllNotifications
    }
}
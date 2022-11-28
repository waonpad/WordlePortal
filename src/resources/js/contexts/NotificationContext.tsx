import axios from 'axios';
import { useAuth } from "./AuthContext";
import React, {useContext, createContext, useState, ReactNode, useEffect } from "react"

type Props = {
    children: ReactNode
}

const notificationContext = createContext<any>(null);

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
            if (res.status === 200) {
                console.log(res);
                setUnreadNotifications(res.data.unread_notifications);

                // setInitialLoad(false);
            }
        }).catch((error) => {
            // console.log(error);
            // setInitialLoad(false);
        });

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
            if (res.status === 200) {
                console.log(res);
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    const readAllNotifications = () => {
        axios.post('/api/notifications/readall').then(res => {
            if (res.status === 200) {
                console.log(res);
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    return {
        unread_notifications,
        readNotification,
        readAllNotifications
    }
}
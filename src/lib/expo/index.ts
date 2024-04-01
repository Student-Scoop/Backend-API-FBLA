import { safe } from '../errors';
import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';

const expo = new Expo();

export async function sendPushNotifications(notifications: ExpoPushMessage[]) {
    for (let notification of notifications) {
        if (!Expo.isExpoPushToken(notification.to)) {
            notifications.splice(notifications.indexOf(notification), 1);
            continue;
        }
    }
      
    let chunks = expo.chunkPushNotifications(notifications);
        
    let tickets: ExpoPushTicket[] = [];
    for (let chunk of chunks) {
        let ticketChunk = await safe(expo.sendPushNotificationsAsync(chunk));
        if (ticketChunk.error) continue;
        
        tickets.push(...ticketChunk.data);
        
    }

    return tickets;
}
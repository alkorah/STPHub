import { app, InvocationContext } from "@azure/functions";
import { QueueServiceClient } from "@azure/storage-queue";
import axios from 'axios';

export async function ReadfromIntake(queueItem: unknown, context: InvocationContext): Promise<void> {
    try {
        const currentDateTime = new Date();
        const currentDay = currentDateTime.getUTCDay();
        const currentHour = currentDateTime.getUTCHours();
        const currentMinute = currentDateTime.getUTCMinutes();

        // Convert to EST
        const estHour = (currentHour - 5 + 24) % 24;
        const isWeekday = currentDay >= 1 && currentDay <= 5;
        const isWorkingHours = estHour >= 8 && (estHour < 17 || (estHour === 17 && currentMinute === 0));

        if (!isWeekday || !isWorkingHours) {
            context.log('Current time is outside of the desired range. Skipping message processing.');
            return;
        }

        context.log('Storage queue function processed work item:', queueItem);
        context.log('Message:', JSON.stringify(queueItem));
        context.log('expirationTime =', context.triggerMetadata.expirationTime);
        context.log('insertionTime =', context.triggerMetadata.insertionTime);
        context.log('nextVisibleTime =', context.triggerMetadata.nextVisibleTime);
        context.log('id =', context.triggerMetadata.id);
        context.log('popReceipt =', context.triggerMetadata.popReceipt);
        context.log('dequeueCount =', context.triggerMetadata.dequeueCount);

        const maxDequeueCount = process.env.MAX_DEQUEUE_COUNT;

        // Check if dequeueCount exceeds the threshold
    //     if (context.triggerMetadata.dequeueCount > maxDequeueCount) {
    //         context.log('dequeueCount exceeds the threshold. Moving the message to the error queue.');
    //         await errorQueueClient.sendMessage(JSON.stringify(queueItem));
    //         return;
    //     }

    //     try {
    //         const response = await axios.get('https://example.com');
    //         context.log(response.data);
    //     } catch (error) {
    //         context.log(`Error making network call: ${error}`);
    //     }

    //     // Add your message processing logic here
    } catch (error) {
        context.log(`Error processing message: ${error}`);
        throw error;  // Rethrow the error to let the runtime know that the function failed
    }
}

app.storageQueue('ReadfromIntake', {
    queueName: 'ins-address-change-intake-queue',
    connection: 'AzureWebJobsStorage',
    handler: ReadfromIntake
});

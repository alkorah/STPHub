import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { QueueServiceClient } from "@azure/storage-queue";

let sequenceNumber = 0;

export async function test(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    
    const name = request.query.get('name') || await request.text() || 'world';

    // Use the existing queue
    const queueName = "ins-address-change-intake-queue";

    // Instantiate a QueueServiceClient which will be used to create a QueueClient and to list all the queues
    const queueServiceClient = QueueServiceClient.fromConnectionString(process.env["AzureWebJobsStorage"] as string);

    // Get a QueueClient which will be used to create and manipulate a queue
    const queueClient = queueServiceClient.getQueueClient(queueName);

    // Insert the name into the queue with a sequence number
    sequenceNumber++;
    const message = `${sequenceNumber}: ${name}`;
    await queueClient.sendMessage(Buffer.from(message).toString('base64'));

    return { body: `Hello, ${message}!` };
};

app.http('test', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: test
});
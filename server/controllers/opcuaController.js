
// opcuaController.js
import { OPCUAClient, TimestampsToReturn, AttributeIds } from 'node-opcua';

let client, session, subscription;

async function createOPCUAClient(endpoint) {
  if (!client) {
    client = OPCUAClient.create({
      endpointMustExist: false,
    });

    client.on("backoff", (retry, delay) => {
      console.log("Retrying to connect to", endpoint, "attempt", retry);
    });

    console.log("Connecting to", endpoint);
    await client.connect(endpoint);
    console.log("Connected to", endpoint);

    session = await client.createSession();
    console.log("Session created");

    subscription = await session.createSubscription2({
      requestedPublishingInterval: 1000,
      requestedLifetimeCount: 60,
      requestedMaxKeepAliveCount: 5,
      maxNotificationsPerPublish: 512,
      publishingEnabled: true,
      priority: 10,
    });

    subscription.on("keepalive", () => {
      console.log("Keepalive");
    }).on("terminated", () => {
      console.log("Subscription Terminated");
    });
  }
}

async function getValueFromOPCUA(nodeIds) {
  const parameters = {
    samplingInterval: 100,
    discardOldest: true,
    queueSize: 100,
  };

  if (!subscription) {
    throw new Error("Subscription not initialized.");
  }

  try {
    const values = await Promise.all(nodeIds.map(async (id) => {
      const itemToMonitor = {
        nodeId: id,
        attributeId: AttributeIds.Value,
      };

      const monitoredItem = await subscription.monitor(
        itemToMonitor,
        parameters,
        TimestampsToReturn.Both    
      );

      return new Promise((resolve, reject) => {
        monitoredItem.on("changed", (dataValue) => {
          const data = {
            value: dataValue.value.value,
            timestamp: dataValue.serverTimestamp,
            nodeId: id,
            browseName: "tags"
          };
          resolve(data);
          console.log(data)
        });

        monitoredItem.on("err", (error) => {
          reject(error);
        });
      });
    }));

    return values;
  } catch (error) {
    console.error("Error monitoring OPC UA items:", error);
    throw error;
  }
}

export { createOPCUAClient, getValueFromOPCUA };
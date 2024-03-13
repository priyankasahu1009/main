// Import necessary modules and functions
import express from 'express';
import db from '../utils/db.js';
import register from '../controllers/registerController.js';
import login from '../controllers/loginController.js';
import logout from '../controllers/logoutController.js';
import verifyUser from '../middlewares/verifyUser.js';
import homeController from '../controllers/homeController.js';
import addMachine from '../controllers/addMachineController.js';
import getMachines from '../controllers/getMachineController.js';
// import { createOPCUAClient, getValueFromOPCUA } from '../controllers/opcuaController.js';
import { selectAddressFromOpcuaNodes } from '../utils/opcua_node.js';
 import { OPCUAClient, TimestampsToReturn, AttributeIds } from 'node-opcua';
import { io } from '../app.js';
// import { Server as socketIO } from 'socket.io'; // Import Server class from socket.io
// import http from 'http'; 
// const app = express();
// const server = http.createServer(app); // Create a server using Express app
// const io = new socketIO(server); // Pass the server instance to socket.io

// Create an express router
const router = express.Router();

// Define routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/', verifyUser, homeController);
router.post('/add-machine', addMachine);
router.get('/get-machines', getMachines);

router.get('/data/:machineId', async (req, res) => {
  try {
    const machineId = req.params.machineId;
    const sql = 'SELECT endpoint_url FROM opc_ua_config WHERE id = ?';

    db.query(sql, [machineId], async (err, machines) => {
      if (err) {
        console.error('Error fetching machines:', err);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (machines.length === 0) {
        return res.status(404).json({ error: "Machine not found" });
      }

      const opcServerEndpoint = machines[0].endpoint_url;

      selectAddressFromOpcuaNodes(async (err, addresses) => {
        if (err) {
          console.error('Error fetching OPC UA addresses:', err);
          return res.status(500).json({ error: "Internal server error" });
        }

        try {
          const client = OPCUAClient.create({
            endpointMustExist: false,
          });

          await client.connect(opcServerEndpoint);

          const session = await client.createSession();

          const subscription = await session.createSubscription2({
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

          const nodeIdToRead = addresses.map(address => {
            const parts = address.split('|');
            return `ns=3;i=${parts[2]}`;
          });

          const parameters = {
            samplingInterval: 100,
            discardOldest: true,
            queueSize: 100,
          };

          nodeIdToRead.forEach(async (id) => {
            const itemToMonitor = {
              nodeId: id,
              attributeId: AttributeIds.Value,
            };

            const monitoredItem = await subscription.monitor(
              itemToMonitor,
         parameters,
              TimestampsToReturn.Both
            );

            monitoredItem.on("changed", (dataValue) => {
              const data = {
                value: dataValue.value.value,
                timestamp: dataValue.serverTimestamp,
                nodeId: id,
                browseName: "tags"
              };
              // console.log(data);
              // Emit the data to all connected clients via Socket.IO
              // io.on("connection", (socket) => {
              //   console.log("New User Connected",socket.id);
              // });
              io.sockets.emit('opcData', { data });
            });

            monitoredItem.on("err", (error) => {
              console.error("Error monitoring OPC UA items:", error);
            });
          });

        } catch (error) {
          console.error("Error fetching OPC UA data:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      });
    });
  } catch (error) {
    console.error("Error fetching OPC UA data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

# SCIoT Project

**Project name**: Tyre Pressure Detection
<br>
**Student name**: Michele Delli Paoli
<br>
**Student ID**: 0522500797
<br>
<br>

### Description



##### 1) Application Goal
The system allows to monitor the pressure of a car's tyre, in order to alert the driver:
* in case a tyre puncture occurs;
* just to report low tyre pressure.

<br>

##### 2) Scenario
The system elaborates data recorded by a simulated sensor and sends back to the console a specific message, which will be:
1. "**Low tyre pressure registered!**": if the recorded pressure is lower than the standard one;
2. "**Tyre pressure restored!**": if the sensor records a pressure greater or equals than the standard one, while the previously recorded pressure was lower than the standard one.
3. "**Optimal tyre pressure!**": if the sensor records a pressure greater or equals than the standard one, and the previously recorded pressure was greater or equals than the standard one too.
4. "**Warning, possible tyre puncture!**": if the sensor records a continuous drop in pressure during a small period of time. <br>
More specifically, to simulate a tyre puncture, we will suppose to record **5 tyre pressure decreasing values** in a period of time of **1 minute**.

<br>

##### 3) Architecture
The system is composed by several functions in Node.js, two loggers and a MySQL Databse.
<br>

###### Functions:
* **Simulate Low Tyre Pressure**: it simulates a **drop** in tyre pressure by sending a message to the topic "iot/tyre/pressure" with a pressure value **lower** than the standard one.


* **Simulate Tyre Puncture**: it simulates a **puncture** by sending **5 decreasing pressure messages** to the topic "iot/tyre/pressure".<br>
Note: each of these 5 pressure value is lower than the one recorded before and always lower than the standard value one.

* **Restore Tyre Pressure**: it simulates the act of **inflating** the tyre by sending a message to the topic "iot/tyre/pressure" with a pressure value **greater or equals** than the standard one.


* **Consume Tyre Pressure**: it is triggered by an incoming message on the topic  "iot/tyre/pressure", and **insert** into a Relational Database a record composed by the **pressure value** and the associated **timestamp**.


* **Interpreter**: a function which **retrieves** the **last 5 records** from Database and **interprets** the **data**:

    1. if these 5 timestamps **fit** into a period of time of **1 minute** and the corresponding pressure values are **sorted** in **decreasing order**, then the function will send a message to the topic "iot/console" reporting: "**Warning, possible tyre puncture!**"; 
    2. if these timestamps **don't fit** into a period of time of **1 minute**, or **only** the **last pressure value** is **lower** than the standard one, then the function will send a message to the topic "iot/console" reporting: "**Low tyre pressure registered!**";
    3. if the **last pressure value** is **greater** or **equals** to the **standard one**, while the second-last pressure value is lower than the standard one, the function will send a message to topic "iot/console" reporting: "**Tyre pressure restored!**".
<br>

###### Loggers:
* **logger.js**: it logs incoming messages on the topic "**iot/tyre/pressure**".

* **loggerConsole.js**: it logs incoming messages on the topic "**iot/console**".
<br>

###### MySQL Database:
* **MySQL Instance**: a single Table which is composed by three columns: **id**, **pressure**, **timestamp**.

<br>

![](SchemeProject.png)
*Figure 1: System Architecture.*

<br>
<br>

##### 4) Setup Components
To run the system, you must install the following components:

* **Docker**: it is a Container Orchestration platform which allows you to deploy and run portable applications with ease.

* **Docker Compose**: it is a tool useful to configure the components of a  Microservices Architecture by using a single YAML file.

* **Nuclio**: executed on a Container, it enables you to **run a function** when an event is triggered.
More specifically, Nuclio creates a Container in which it deploys each function.

* **RabbitMQ**: executed on Container, it is a **Message broker** useful to post messages on topics. It uses either MQTT and AMQP protocol.

<br>
<br>

##### 5) Building the system by using Docker
1. Run Nuclio on Docker by executing the following command:
 ```shell
        docker run -p 8070:8070 -v /var/run/docker.sock:/var/run/docker.sock -v /tmp:/tmp nuclio/dashboard:stable-amd64
```
2. Run RabbitMQ on Docker by executing the following command:
 ```shell
        docker run -p 9000:15672 -p 1883:1883 -p 5672:5672 cyrilix/rabbitmq-mqtt
```
3. Open your Browser and type into the Address bar the following URL to visualize the Nuclio Dashboard:
```shell
        localhost:8070
```
4. Check your local IP Address by executing the following command (only on Linux):
```shell
        hostname -I
```

<br>

5. On the Nuclio Dashboard, click on "Create project" button.
6. Create the "Simulate Low Tyre Pressure" function by importing the ***mqtt_simulate_low_tyre_pressure*** YAML file.

7. Edit the "Simulate Low Tyre Pressure" function by replacing the [localIpAddress] parameter with your local IP Address in the following:
```shell
    Line of code:
        amqp.connect('amqp://guest:guest@[localIpAddress]:5672').then(function(conn) {


    In Triggers configuration:
        guest:guest@[localIpAddress]:1883
```

8. Click the "Deploy" button to deploy the function.



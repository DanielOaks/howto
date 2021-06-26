---
layout: guide
title: Switching
datafile: networking
---
Simply put, switching is what happens inside of a network. Whenever packets are exchanged between two devices on the same network, they are exchanged using switching. When packets are exchanged between devices on different networks, it's called routing (but we won't deal with that here).


## Networking Devices

There are several special networking devices inside of a network. Here's a diagram, and we'll go through what each of these devices does:

![Network](img/switching/network.svg "Network")


### Hub / Switch

Network device which takes incoming packets from one port, and puts them out the appropriate ports to reach their destination.


### Gateway Router

Simply put, the _gateway_ is the device which can talk to places that are outside this network. In other words, if a computer wants to send a packet to an IP address that isn't on the same network, it'll send it to the gateway instead (and the gateway will send it where it needs to go from there).


### DNS Server

Simply put, the DNS server translates names (such as `google.com`) into IP addresses (such as `203.0.113.128`). In IP, there's nothing but IP addresses. So before sending a packet to something like `google.com`, your computer contacts the DNS server to retrieve the IP address for that name.

If you need a refresher here, feel free to view the DNS page where this system is explained in more detail.


### DHCP Server

We'll go over this in more detail, but put simply:

* Every device on the network needs to be able to get an IP address once they plug into the network.
* Every device needs to know which gateway and DNS server to use while connected to the network.

The DHCP server does this by telling new computers which IP address they can use, and the addresses of the DNS server and the gateway.

Commonly, a number of these roles will be fulfilled by a single device. For instance, most home modem/routers that ISPs provide act as a switch, a gateway, and a DHCP server (pointing computers on the network to use the ISP's DNS servers).

Now that we've gone through each of the standard roles in a network, let's go into more detail about how each of them works.


## Switching

Within a network, devices have two addresses:

* IP address.
* Hardware address.

The IP address changes every time that the device is plugged into a new network. However, the _hardware address_ always stays the same. Because of this, the hardware address stays the same before the device gets an IP address, while it's negotiating one, and after it's gotten an IP address. Having a single, static address vastly simplifies things for the other devices on the network.

This is very useful, because within networks, this hardware (or _Ethernet_) address is how computers direct traffic towards each other, and towards the gateway.

The normal name used for this hardware address is a MAC address. In other words, on typical network, devices have both a static MAC address (that does not change), and an IP address (that can change).

<div class="advanced">
	<p><strong>MAC addresses</strong></p>
    <p>A MAC address is represented by 12 hexidecimal digits, usually split into groups of two. For example, something like <tt>af:42:7b:c3:d4:19</tt></p>
    <p>In the examples here we'll be using a shortened 4-digit version, both to simplify our diagrams and prevent the explanations from getting bogged-down.</p>
</div>

Now let's talk about how packets get exchanged within a network.

Devices send packets through a hub or a switch with the appropriate MAC/IP addresses, and those devices forward the packets onto their destination.

In terms of physical network ports, hubs and switches are exactly the same. Here's the diagram of a hub/switch:

![Hub / Switch](img/switching/hub-switch.svg "Hub / Switch")

### Hubs

Hubs are essentially the older, simplified cousin of switches. They are simpler to explain, so we'll start with them.

Hubs act on incoming packets. Whenever a hub receives an incoming packet on one port, that packet is send out to every other port. For instance:

![Hub Packet Forwarding](img/switching/hub-packet.svg "Hub Packet Forwarding")

Any devices that get a packet not addressed to them simply drop it without processing it. In this way, hubs deliver packets to their destination within a network.

Essentially, every packet sent through a hub is treated as a broadcast (i.e. it's sent to every device on the network). This does work, and did work fine for a number of years. However, once you get enough computers connected to a network of hubs, performace can be greatly impacted.

Let's take a look at an example network of hubs, and how a packet from Computer A to Computer B gets sent through the network:

![Hub Network](img/switching/hub-network.svg "Hub Network")

The packet from Computer A is sent to every single hub and every single computer on the network. Computer E correctly receives the message, but so does everyone else on the network as well. When every computer starts packets thousands of times a second across the network, errors start happening.

Let's say that Computer D and Computer F send packets one after each other. What ends up happening is that in the middle, the hubs receive both packets at the same time. They try to send both, and they can't. The packet sending fails for both computers, meaning that both of them have to retry sending their packets (which clogs up the network even more). 

The area where these sort of packet collisions can occur is also called the _collision domain_. With hubs, all of their ports (and connected hubs/devices) are a part of the same collision domain. Here's what the collision domains look like on a network that uses hubs:

![Hub Collision Domains](img/switching/hub-collision-domains.svg "Hub Collision Domains")

This is a big problem, and particularly as the number of computers / traffic grows, packets start colliding at an alarming rate (which slows the whole network down).


### Switches

Switches were created in response to the collision-domain issues present with hubs. On a switch, every single port is a separate collision domain, so if it receives to packets at the same time from different computers, it can handle both.

Let's take another look at the basic layout of a switch:

![Hub / Switch](img/switching/hub-switch.svg "Hub / Switch")

Now each port can be connected to one or more devices (one if a device is connected directly, multiple if a hub/switch is plugged into one of the ports). Packets are addressed to a specific MAC/IP address. When a switch sees a packet come in through a port, the switch stores the MAC address and the port it came in on. Then, it know something like "MAC address XYZ is on port 3".

Whenever a packet comes in, the switch looks at the destination MAC address of that packet. If it knows which port that MAC address is connected to, it only sends the packet out that port.

Here's a diagram showing a switch routing a packet, along with a display of it showing which MAC addresses it knows:

![Switch Packet Forwarding](img/switching/switch-packet.svg "Switch Packet Forwarding")

The switch sees the incoming packet with the destination MAC address `5b:3a`. It knows that this MAC address is on Port 1, so it only sends it out that port. At the same time, it also gets the source MAC address from the packet and records that MAC for port 6.

If the switch doesn't recognise the destination MAC address, it'll just send it out everywhere (similar to a hub) until it learns which port that address is behind.

Since the sending is very directed with switches, messages will only be sent through the switches and to the computers that need to get it, rather than everyone on the same network.

With hubs, we talked about collision domains. Let's show a quick example of that same network above but with switches, and the resulting collision domains:

![Switch Collision Domains](img/switching/switch-collision-domains.svg "Switch Collision Domains")

In this topology (network layout) there's one collision domain per link. This means a much lower chance of packet collisions, and they do happen they won't affect nearly as many computers, and as a result the network as a whole can be much faster.


## Sending traffic

There are two different places that devices will want to send data:

* Inside the network.
* Outside the network.

Let's go through how devices send packets to each of those places.


### Sending traffic inside the network

When sending traffic inside the network, you can either send it to a specific device, or to everyone in a broadcast.

To send a packet to a specific other machine, you need their MAC (hardware) address.

However, to start off with you don't know the MAC address of any other machines. In order to figure out the MAC address of a given machine from their IP, your computer sends out a broadcast essentially asking _"Who does IP x.x.x.x belong to?"_. The machine with that IP then responds with a packet -- and that reply contains their MAC address. This is also known as an "ARP Request".

Once your machine has the MAC address of the machine it wants to send data to, it simply sends packets out with that machine in the "Destination MAC" field.

Computers can also send messages to everyone as a broadcast. There are certain situations where this is needed, for instance:

* Contacting the DHCP server after first being plugged into the network (so that it can be given an IP address).
* Discovering the MAC address of a machine it only knows the IP of.

If a machine needs to broadcast to all clients on the network, it will send a packet to the MAC address `ff:ff:ff:ff:ff:ff` (or in binary, all `1`'s).


### Sending traffic outside the network

If a machine needs to send traffic to an IP address that's outside its current network, it can't just send an ARP request and find out -- this is where the gateway comes in.

When a device needs to send a packet outside its' current network, what it does is:

* Fill out the destination IP with the remote IP it wants to contact.
* In the "Destination MAC" field, put the MAC address of its' gateway.

This means that the gateway will receive this packet. Once the gateway gets this packet, it will notice that it's intended for outside the network and pass it to other routers outside the current network, sending it off towards its destination.

## Connecting to the network

Upon first connecting to the network, a machine:

1. Sends a DHCP request (as a broadcast).
2. Waits for the DHCP server on the network to give it an IP address, gateway, and DNS details.

The DHCP server keeps track of which IP addresses are in use on a network, and which ones are free. When this server gets a new request, it replies with a new IP address for the machine to use, as well as the IP addresses of both the gateway and DNS servers to use. The client can, of course, ignore the DNS servers given to it and use custom ones instead.

Once the machine receives its' IP address, gateway and DNS servers, it has everything it needs to connect and successfully use the network!


## Overview

There are several roles in a network:

* **Gateway Router**: Acts as the gateway to other networks (such as the internet).
* **DHCP Server**: Keeps track of the IP addresses in use, and allocates new IP addresses when requests come in.
* **DNS Server**: Given a name, returns the IP address associated with it.
* **Switch**: Given a packet on one of its' ports, sends it out towards the destination.

As well as some concepts:

* On a hub, the entire hub is a single collision domain.
* On a switch, each port is a separate collision domain.

And some terms:

* _Unicast traffic_ is traffic going from a single machine to a single machine.
* _Broadcast traffic_ is traffic going from a single machine to the entire network.

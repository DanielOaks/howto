---
layout: guide
title: UDP and TCP
datafile: networking
---
What are UDP and TCP? Essentially, UDP and TCP build upon IP to provide a way for application data to actually be sent between machines. Let's take another look at the IP model:

![IP model](img/ip/ip-model.svg "IP model")

IP provides addresses, and uses packet switching in order to direct packets between machines. UDP and TCP take those raw packets and create the notion of flows and connections out of them.

Since UDP and TCP are both based on IP, a UDP or TCP packet will also contain everything an IP packet does. You'll commonly hear the term "TCP/IP" which shows how related the two technologies are.


## Port Numbers

One thing that you'll see with both UDP and TCP are the concept of 'port numbers'.

One issue with IP is how can you have multiple connections between the same two machines? This is the problem that port numbers are designed to solve.

Essentially, port numbers are a random number chosen from 0–65535 that is designed to differentiate connections (and have a way for computers to provide access to specific services in standard ways).

A standard UDP or TCP connection is defined by the source and destination IP addresses, as well as the source and destination port numbers. Which destination port is chosen changes which program the traffic is sent to. For instance, if you send traffic to _port 80_ on a machine, that traffic will go to that machine's web server. Similarly, if you send traffic to port 6667, that traffic will go to that machine's IRC server (if it's running one).

Port numbers are used in both UDP and TCP and accomplish the same task. However, UDP ports and TCP ports are considered separate. For instance, the program running on UDP port 53 and TCP port 53 do not necessarily need to be the same program. Different services 'listen on' UDP or TCP ports depending on how they work, and which protocol they require to transmit data.


## UDP

UDP is very simple. UDP contains the 'source port', the 'destination port', and basically nothing else.

You can think of UDP like a paper airplane. Once you send a UDP packet, it might get to its destination or it might not. If there's an error along the way or it doesn't get delivered, UDP won't do any corrections or resend any data. If the data arrives out-of-order or some is missing, the application is expected to pick up the pieces and fix it.

Let's take a look at a UDP packet:

![UDP Packet](img/udptcp/udp-packet.svg "UDP Packet")

Here, you can see the IP header (which contains addresses), source and destination port, and... that's about it.

Since UDP doesn't need to do any sort of error correction, re-ordering packets or re-sending them, UDP does not need any further information. It simply contains the data, and then at the other side that data is given to the application.

Because there's no overhead from those other sorts of features, UDP is typically used when speed is required over data integrity. For instance, streaming video, video / voice chat, and gaming all commonly use UDP. In these cases, speed is prioritised above all else. If you miss one microsecond of audio in a voice call, you don't want your program to waste three microseconds trying to re-send that block of data – it makes more sense to just get the newer data and ignore the issue.

UDP also has no notion of a 'connection' built-in. Every UDP packet is considered, by UDP, to be separate to any other one. A connection in UDP is established and managed by the protocol using UDP, and not by UDP itself.


## TCP

TCP is the more complex transport protocol in use today. TCP does error-correction, re-sends packets if they are lost along the way, and has the notion of a TCP connection. If the data arrives out-of-order or some is missing, the TCP protocol will fix it before it's sent to the application.

Most programs out there including your web browser and email use TCP. Speed isn't as important as making sure the data is correct for them, so the slight slowdown is worth it.

We'll go over each of the features provided by TCP one at a time, but here's what a TCP packet looks like for reference:

![TCP Packet](img/udptcp/tcp-packet.svg "TCP Packet")

As you can see, the TCP packet is a lot more complex than the UDP one. At the end we'll go over what each part of the packet is used for, but for now let's give a brief overview of each feature TCP offers.


### Connections

TCP has the notion of a connection between two machines. That is, a bi-directional data stream going between them. Here's a simplified example of what it looks like:

![TCP Connection](img/udptcp/tcp-connection.svg "TCP Connection")

Data can be sent from Alice to Bob, or from Bob to Alice.

This connection is virtual – The underlying packets can be lost, corrupted, not delivered in the right order, but TCP will correct these errors and provide applications with this simplified model of a direct connection.

To establish and keep these sort of connections running, TCP uses many separate features. I'll describe them here.


### Confirmation and ACK

Every time a packet of application data is sent from Alice to Bob, Bob must send Alice a confirmation that they got the packet. If Alice doesn't get that confirmation, they'll re-send the packet until Bob receives it. 

In TCP/IP, this confirmation is called an acknowledgement (which is simplified to just ACK).

Because an ACK is required for every packet that's sent, TCP requires more data and has a larger packet size than UDP. The good thing is, every packet can also contain an ACK, so generally you don't need a great deal more packets to be sent.

We'll go further into this with the handshake diagram.


### Sequence Numbers

In order to track which packets have been sent and have been acknowledged, TCP uses something called a sequence number. Every packet is given a sequence number as an identifier. An ACK is essentially _"I've received the packet with the sequence number '12253'"_.

How are sequence numbers on packets decided? Well, whatever the sequence number of the last packet was, plus one. How do they generate the first sequence number for a connection? They pick a random number and start at that. Why the sequence numbers don't just start at zero isn't that important, and dives into some deeper design decisions.

Here is an example of an ACK exchange looks like:

![ACK Exchange](img/udptcp/ack-exchange.svg "ACK Exchange")

Alice sends Bob a data packet with the sequence number 145. Bob sends an ACK to Alice's packet 145 and at the same time his data packet 32. Alice sends an ACK to Bob's packet 32 and her data packet 146.

This is an example of how TCP generally works. Let's look at a 'handshake', and how it works here.


### TCP Handshake

Every TCP connection starts with three packets. The first part of the connection, this setup process, is called the TCP handshake.

The handshake has a few purposes:

* Confirm that Alice can talk to Bob, and that Bob can talk to Alice.
* Let Alice and Bob setup their sequence numbers, and make sure they know each others' starting sequence numbers.

There's another type of packet we haven't gone over yet, which is used in the handshake. This packet is called a 'Synchronise' (SYN) packet, and it means that the client wants to open a connection with whoever they send it to. The SYN packet is how the two sides first 'synchronise' on what their sequence numbers are.

Let's say that Alice wants to create a connection with Bob. Here's how the TCP Handshake would go:

![TCP Handshake](img/udptcp/tcp-handshake.svg "TCP Handshake")

The first packet is a SYN packet, sent from Alice to Bob. This packet gives Alice's details to Bob.

The second packet is a SYN-ACK packet, sent from Bob to Alice. This packet confirms that Bob saw Alice's SYN packet, and that Bob also wants to start the connection. This packet also gives Bob's details to Alice. 

The third packet is an ACK packet, sent from Alice to Bob. This packet confirms that Alice saw Bob's SYN packet, and that Alice also wants to start the connection.

This three-way handshake always remains the same, no matter what TCP connection you're setting up. After this handshake has been performed, both sides can send data as they like.


### TCP Windowing

If you had to wait for a confirmation after sending every single packet before sending the next one, things would be very slow. That is, if you had to wait for the exact process displayed up in the 'sequence numbers' section above, it would mean that you could only have one data packet on the wire at a time.

TCP solves this problem with a feature known as TCP windowing. Essentially, TCP keeps track of which packets have been ACKed and which have not. The 'window' controls the maximum number of packets that can be in transit to the destination, not yet ACKed, before the client will just wait for ACKs.

The larger the TCP window is, the more data your computer can send before it needs to wait for confirmation. This can speed up the connection, but if the window is too large it can cause congestion issues and other related problems that ultimately end up slowing your connection.


### Packet Structure

Now that we've gone through each of TCP's major features, let's take another look at the TCP packet and what each part means.

![TCP Packet](img/udptcp/tcp-packet.svg "TCP Packet")

* The IP header contains the IP information (IP addresses).
* The source and destination ports are used in similar ways to the UDP port numbers.
* The sequence number is an incrementing counter of which packet this one is in the connection (used to order them correctly at the destination).
* The ACK number represents an acknowledgement for a packet sent to it.
* Window size refers to how many packets the client is willing to have in transit without being ACKed.
* Flags are used to denote the type of packet this is.
    * **SYN** means synchronise (used in the three-way handshake).
    * **ACK** means this packet contains an acknowledgement to a packet sent by the destination.
    * **RST** means that the client wishes to terminate the TCP connection or that the client doesn't recognise the TCP connection.
    * **FIN** means the client is cleanly closing the TCP connection.
* The checksum is used to validate that the packet is correct and has been transmitted without issues.
* The data is the actual application data being transmitted, and is reconstructed at the remote end.


---


## Overview

* UDP and TCP are both built on top of IP, and include IP's packet header (technically, both UDP and TCP packets are contained within the IP packet's 'data' section).
* UDP and TCP both use port numbers to differentiate services, and let multiple connections exist between two machines.
* **UDP** is the much simpler, faster, but unreliable transport protocol.
* **TCP** is the more comprehensive, slower, but reliable transport protocol.
* UDP and TCP can be treated differently by ISPs. So even though technically UDP is faster, your ISP may only slow one or the other down, or only when they're over a specific port.

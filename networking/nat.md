---
layout: guide
title: NAT
datafile: networking
---
PAT (or as we generally know it, NAT) is used to place multiple devices behind a single public IP address. Here, we'll go through the difference between public/private networks and exactly how PAT/NAT operates.

<div class="note">
	<p>NATs are a very strange, in-depth concept. If you don't get them at first or they take some time to understand, that's perfectly normal.</p>
    <p>In this article, when we say NAT we will be talking about traditional NATs – the devices that actually translate 1:1 between two blocks of address space. For what's typically referred to as a "NAT" today, we'll be using the more specific term PAT (port address translation). We'll explain the naming differences later on in the article, so keep this in mind if you get confused about what we say NATs do in here.</p>
</div>


## Public vs Private IP Addresses

Networks can either use public IP addresses or private IP addresses. Essentially, this affects how they can be used on the wider internet, and how unique these addresses are.

Here, we'll give a quick overview of each type of address.


### Public IPs

Public IP addresses are unique across the entire globe. For instance, there can only be one host in the world using the IP address `8.8.8.8`, as `8.8.8.8` is a public IP address.

It makes sense that public IP addresses need to be unique, since they're the only thing that routers pay attention to when sending packets across the internet.

Unless specifically stated otherwise, all IP addresses are public IPs.


### Private IPs

There are a few networks that are specifically designated as "Private IP addresses". Here's a list of the ranges, in IPv4 and IPv6, which are considered private addresses:

- `10.0.0.0/8`
- `172.16.0.0/12`
- `192.168.0.0/16`
- `fd00::/8`

Private IPs are not routable on the internet, and any packet with a private IP address as either the source or destination that's sent out to the internet is dropped.


### Public vs Private

Typically, businesses used to setup their entire network to use public IP addresses given to them by their ISP. In other words, a typical exchange would go like this:

```
Business: Hi ISP, can I please get addresses to use?

ISP: The address space 143.15.2.0/24 is assigned to you.
```

After this, the business would go and setup their machines to use the IP addresses `143.15.2.1-254`.

This is all well and good. However, the issue that business ran into was that if they had to change ISPs, they had to renumber their entire network to use the new address space assigned to them. Having to change the addresses assigned to every computer inside your network is a pain, so NAT was developed to resolve this.


## What is a NAT?

NAT stands for "Network Address Translation". NATs were initially created to solve the problem: If I'm using a private IP addresses inside my network, how can I convert those into public IP addresses?

What a standard NAT device does is have two ports -- one as the outside (public) interface, and one for the inside (private) interface. The private and public address ranges are specified, and the NAT converts the addresses as appropriate when sending packets in/out. Here's an example network making use of a NAT device:

![NAT diagram](img/nat/nat.svg "NAT diagram")

The NAT device doesn't exactly act like a router. It does translate IP addresses, but doesn't act as a router hop on the network. Essentially, it behaves similarly to a switch if all the devices inside the private network were numbered from `143.15.2.1-254`

Let's say that the devices in this diagram have the following addresses:

- **Computer A**: `192.168.3.2`
- **Computer B**: `192.168.3.3`
- **Computer C**: `192.168.3.4`

With this setup, **Computer A** can also be referred to from the public IP address `143.15.2.2`, **Computer B** can also be referred to as `143.15.2.3` and **Computer C** is also `143.15.2.4`.

What the NAT does is:

- On packets coming from the external network, it changes the source/destination addresses from `143.15.2.x` to `192.168.3.x`.
- On packets coming from the internal network, it changes the source/destination addresses from `192.168.3.x` to `143.15.2.x`.

Let's say that the router has the address `143.15.2.1` -- in this network, the computers behind the NAT would see and talk to this router as `192.168.3.1`.


### NAT Overview

Now that's a complicated setup. However, it does give us what we need. This network has the following properties:

- Computers behind the NAT can use private IP addresses.
- When the public network (`143.15.2.0/14`) changes, the computers behind the NAT can keep the same addresses.

Hooray!

NAT has a 1:1 address space requirement. That is, the internal and external network must be the same size. In this example, both are `/24` networks, so that's true.

Let's move on to PAT, and why that was created.


## What is PAT?

One day, a good number of years ago, the designers of the internet noticed a problem. Notably, that with the rise of home computers, people were using more and more addresses inside their houses. If there were five devices in someone's house, the ISP needed to provide them with five public IP addresses to use.

Now this doesn't sound too bad, but when you're dealing with millions of new homes connecting to the Internet, addresses start to get used up very quickly.

For NAT, for every private address you use, you need one public address. PAT reduces the number of required public addresses, and makes it so that for every public address, you can have thousands of machines on private addresses.

Let's take a look at an example network using PAT:

![PAT diagram](img/nat/pat.svg "PAT diagram")

Whereas NAT doesn't act like a router, PAT explicitly happens on a router. The devices on the internal network send their traffic to the router, and the router changes the source internal IP address to the public IP address `143.15.2.176`. When traffic comes in from external networks, the router changes the destination IP address from `143.15.2.176` to the appropriate internal address, and sends it on to the internal network.

The question now is: When packets come in destined to the public IP `143.15.2.176`, how does the router know which internal device the packet is meant to be sent to?

The process that packets go through here is port address translation (PAT).


### How Port-Address-Translation Works

Let's take a look specifically at how PAT changes incoming and outgoing traffic. The diagram below is meant to represent a connection between the host `192.168.0.3` and the server `8.8.8.8`:

![PAT](img/nat/pat-connection.svg "PAT")


#### Outgoing Traffic

When the PAT gateway gets a packet from the internal network destined for outside, the gateway looks at the source IP address and source port of that packet.

For that source IP/port, the gateway generates a random UDP/TCP port on the public IP address to represent that connection, and stores it in an internal list. If it already has an entry in its' list for that internal IP/port, it uses that existing public port.

The PAT gateway switches the source IP address from the internal IP to its' public IP, and the source port from the original port to the public port it allocated for that connection.

For example, let's say that a packet comes from `192.168.0.3:13845` and is being sent to `8.8.8.8:80`. The router says "I don't have an entry for packets coming from `192.168.0.3:13845`" and allocates public port `5432` for it. Whenever the router sees a packet from `192.168.0.3:13845`, it will change the source IP address to `143.15.2.176`, change the source port to `5432`, and send the packet on its' way.


#### Incoming Traffic

When a packet comes in to its' public IP, it checks the destination port. If it has an existing public port - internal IP/port mapping in its list, it changes the addresses and sends it through.

Continuing from our example above, let's say that a packet comes from `8.8.8.8:80` being sent to `143.15.2.176:5432`. In this case, the router has a record that public port `5432` means the internal IP/port `192.168.0.3:13845`. As such, it changes the destination IP address to `192.168.0.3`, changes the destination port to `13845`, and then sends the packet to the internal network.


### PAT Overview

So a PAT network has the following properties:

- Computers behind the PAT can use private IP addresses
- The entire network behind the PAT can use one public IP address for connectivity to the Internet.

This is much better than NAT in terms of reducing the number of public addresses in use.

Whereas NAT requires one public address per address on the internal network, PAT requires one public port per connection from an internal IP+port.

<div class="advanced">
	<p><strong>Larger PAT Devices and Carrier-Grade NAT</strong></p>
    <p>Larger PAT devices can also use more than one external IP address. These devices act in exactly the same way as described here, but extend the PAT translation table to store both <strong>Internal IP/Port</strong> and <strong>Public IP/Port</strong>.</p>
    <p>Many ISPs also implement something called "Carrier-Grade NAT", or CGN. What the ISP does is run a PAT device themselves, and then only provide private IP addresses to their clients. You will see this especially often with 3G/4G phone connections, where if you dig into it you're generally provided a private <tt>10.X.X.X</tt> address directly from your carrier.</p>
</div>


#### Security

A PAT device acts as an unintentional firewall. Basically, having a PAT in the way means that almost all ports on the public IP address won't be able to reach an actual computer on the internal network. In this way, PAT prevents the majority of bad stuff out on the internet from trying to reach the devices on the internal network.


#### Port Forwarding

Let's say that `192.168.0.3` wants to host a public server. By default, it can't. This is because there is no static, public IP that goes to it.

However, PAT devices let you add 'forwarded ports'. Essentially, you can manually add an entry to the PAT translation table that is always present. So if you add a port-forwardng entry into the router for:
```
 Internal IP/Port  |  Public Port
-------------------|--------------
  192.168.0.3:80   |      80
```
then sending a packet to `143.15.2.176:80` always results in it being sent to `192.168.0.3:80`, meaning that internal machine can host a publicly-accessible server on that port!

<div class="advanced">
	<p><strong>Bypassing PAT</strong></p>
    <p>PAT restricts you in that you can't host a publicly-accessible server. As such, things PAT breaks a lot of programs that depend on being able to send P2P traffic (often used in audio/video calls such as Skype). This is because P2P traffic goes directly between two client machines – one or both of which may be behind a NAT.</p>
    <p>Because PAT breaks P2P traffic, there have been workarounds created to get around it. Generally, a public server sits between the two devices who want to connect directly. Each of them contacts the public server, which creates a link between the public port and their internal IP/Port and the public port.</p>
    <p>Let's take the example of Computer A and Computer B, both behind PAT devices, that want to communicate with each other. Computer A can't reach out to Computer B because it's behind a PAT, and vice-versa.</p>
    <p>However, both of them can reach the public server in the middle, and the public server will see the public IP/port that does directly to each machine that contacts it. Both machines contact the server, and the server now has the public IPs/ports of both machines, as well as an open connection to each.</p>
    <p>The public server tells computer A the public IP/Port it uses to contact computer B, and tells computer B the public IP/Port it uses to contact computer A.</p>
    <p>After this, both machines simply start sending traffic towards the public IP/port of the other machine, and can now communicate P2P despite the fact that they're both behind NATs. Neat, huh?</p>
</div>


### Why is PAT called NAT today?

Simply put, PAT is a type of NAT. PAT translates network addresses based on the port numbers on either side of the device, whereas traditional NAT translates network addresses based purely on the IP addresses on either side of the device.

However, PAT is also the most widely-used form of NAT today. Because of that, when people say NAT, most of the time they're referring specifically to PAT.

So that's why PAT is often just called NAT. Although, most people that aren't network engineers simply don't care about this distinction.


## Overview

- Traditional NATs aren't used that often today.
- What's typically in use today is a specific type of NAT called PAT.
- When people say NAT, they are almost always talking about systems that do port address translation.

- **NATs** were developed to translate between two blocks of IP addresses that are the same size.
- **PATs** were developed to let a whole network of devices share one public IP address.


#### PAT

- PAT routers store a list of internal IP/port to public ports.
- When the first instance of an IP/port goes out a PAT device, it allocates a specific public port to be translated to that internal IP/port.
- When packets go through a PAT device, the source/destination IP and port are adjusted to suit.

#### Port Forwarding

- Port forwarding ensures that a specific public port is always forwarded to a specific internal IP/port.
- If a device is behind a PAT, it will not be able to host public servers unless there is a port forwarded for it.

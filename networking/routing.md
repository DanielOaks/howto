---
layout: guide
title: Routing
datafile: networking
---
Where switching deals with what happens inside of a single network, routing is how traffic is exchanged between different networks.

A router itself is similar to a switch. However, every port of the router contains a separate network. The router remembers which network is reachable on each of its ports, and knows which port to send it out to deliver it.

Let's take a look at a typical router. Here, the diagram is an oval simply because on diagrams, that's how routers are differentiated from switches:

![Router](img/routing/router-diagram.svg "Router")

Every port on the router is connected to a different network -- and some to several networks. Routers can either be:

* Connected directly to that other network (such as with home modem/routers).
* Connected to another router (that is connected to its own networks and routers).

When routers connect to each other, they exchange their "routes", or which networks they're able to connect to. Let's take a look at two routers here:

![Two routers](img/routing/two-routers.svg "Two routers")
 
In this diagram, if Router A has a packet to send to `8.8.8.8`, it knows that it doesn't have that network itself. However, it knows that Router B can contact that network (that is, Router B has a route to `8.0.0.0/8`). So, Router A would send the packet to Router B, and Router B would continue sending the packet further towards its destination.


## Links between routers

When two routers establish a link between each other, there are some details that affect the connection:

* **Physical hardware**: Ethernet, fibre-optic cable, coaxial cable, etc. What is physically connecting them together?
* **Routing protocol**: There are a number of routing protocols -- the protocols that control how routes are exchanged between the two routers, the priority of those routes, and how link capacity and issues are detected.


### Physical hardware

Where ordinary computers typically just use ethernet or wifi, routers can use all sorts of connections. Ethernet, fibre-optics, coaxial cable, undersea cable, WAN links using satellite dishes... routers have been equipped to use many different types of physical hardware to exchange information.

### Routing protocols

Put simply, the routing protocol in use controls:

* How routes are exchanged.
* How routes on various routers are 'graded' or the priority that is applied to them -- particularly as a given route passes through multiple routers.

When exchanging routes, most protocols exchange two pieces of information:

* The route itself (IP network that is contactable, e.g. `8.0.0.0/8`).
* How many 'hops' away from the original network the router sending this route is.

For hops, this number starts out at "1" for the initial gateway router, and every router that gets and rebroadcasts the route increments the number of hops. This means that if a router has a route with a hop  count of "3", it's three hops (routers) away from the original network. This means that if using that route, a packet will need to go across three routers before it reaches the destination network.

Most routing protocols assign priority based on the number of hops. If a router has two routes to a network (say that two ports advertise it can reach that network), the router will select the route with the lowest hop count as it assumes that extra hops mean a larger delay.

Of course, hop count isn't a great indicator. If you have one route that's one hop over a slow satellite link, or another route that's three hops over fibre-optic cable, the three-hop route is actually the faster of the two. In reality, this doesn't typically affect much. And where it does (say that all your traffic to Youtube is inadvertently going over a satellite link), network staff at those routers can manually fix the priorities to force it to use the faster link.

<div class="advanced">
	<p><strong>Routing Protocols - BGP, OSPF and EIGRP</strong></p>
    <p>The three largest routing protocols out there are BGP, OSPF and EIGRP. Here's a rough overview of them:</p>
    <p><strong>BGP</strong> is the Border Gateway Protocol, and is used between the core routers of the internet (and generally, from companies' routers to their ISP's routers). It's the most widely-deployed one, and it bases its priorities purely off hop counts.</p>
    <p><strong>OSPF</strong> and <strong>EIGRP</strong> are typically deployed inside of organisations and internal networks. They can do all sorts of things and base their route priorities off hop count as well as other information exchanged between their routers.</p>
    <p>This section is hardly long enough to go into further details about these protocols and how routing works in-depth, but there is a whole world of information to explore if you're interested in how this works further.</p>
</div>


## Preventing loops

Routers can often be connected in meshy topologies (layouts), such as the one below. Some routing protocols -- particularly those inside corporate networks -- shut down the duplicate links to prevent loops. However, when you get to a scale like the Internet, you can't do that. Connections between routers go up and down every minute, and redundancy is good.

The main thing routers on the Internet do to prevent loops is try to keep choosing the route it knows with the lowest hop count (that isn't the port the packet came in on). However, in some situations, even with this rule route loops can be created. This is typically because a neighbour (a directly adjacent, connected router) hasn't been notified of a routing change, because there's an undetected fault, or because the routing protocol's become momentarily confused.

For instance, here's a simplified example of a router loop:

![Routing Loop](img/routing/routing-loop.svg "Routing Loop")

There is a field on IP packets that holds a number called the "Time To Live", or put simply the **TTL**. The TTL starts at 64, and every time the packet transits (goes through) a router, that router reduces the TTL on the packet by one. If the TTL is zero, the packet is silently discarded. The diagram above shows the TTL starting at 53 from the first displayed router, the decrementing for each router it goes through. This TTL would continue being decremented until the it reaches zero, at which point the packet is assumed to be unroutable and is dropped.

Through decrementing and monitoring the TTL, even if a loop does happen the affected packet will be quickly squashed (by which time the route loop has hopefully been resolved).


## What is the Internet?

The Internet is the massive, worldwide series of thousands of routers connected to each other -- and similarly, the networks behind those routers all connected together. It's called the Internet because it's the inter-network, or the network that connects all other networks.

When you're connected to the Internet you're not connected to a single thing that is "the Internet", just a series of hundreds of thousands of routers out there connecting almost every network out there together into one massive blob. That's part of what makes the internet so special, a connection point anywhere lets you access almost any other public part of it without issue.


## Types of routers

There are different classes of routers out there, intended for different uses. Here, we give a quick overview of a few of them.


### Core Routers

When you start talking about Internet-scale routing, one item that comes up is a "core router". Simply put, a core router is one of the routers in the backbone of the internet -- say the connection between the U.S. and Europe, or sitting in a Silicon Valley datacenter between Google and Facebook.

These routers are typically massive installations, often near the size of a small car and much more power-hungry. While these routers _can_ do all sorts of in-depth processing, most of this is generally disabled in favor of giving the fastest possible routing of incoming packets.

You probably won't deal with core routers yourself but they make up a very important part of the backbone of the Internet.


### Home Routers

Home routers (particularly modem/routers) are unique in that they contain both a router and a switch. Typically there are two 'router ports' -- one going off to the internet (through ADSL / cable / etc) and one to your internal network -- but the one going to your internal network also has a switch in front of it.

These routers are typically fairly small (at least, compared to business and core routers), and contain more general features for home users such as DHCP servers. These routers generally have all sorts of features built-in, anything from basic firewalling capabilities to NAT and DNS. Because these routers don't need to process packets as quickly and face regular users, they typically run more nice end-user features such as a web configuration interface, the inbuilt switch to simplify connection, and integrated wifi.


## Overview

* Where switches move packets inside a single network, routers move packets between multiple networks.
* Routers can be connected with a very wide variety of hardware.
* When connected, routers automatically exchange routing information so each side knows which networks its neighbours can contact.
* The routing protocol in use must be the same on both sides of a link, for those routers to be able to establish a connection and appropriately exchange links.
* "Hop count" is used as the primary metric for which link to choose by most routers and routing protocols.
* The IP packet TTL ensures that packets do not loop forever in the internet, and are killed after some time.
* The Internet itself is simply a massive, worldwide series of routers connecting most of the worlds' networks together.
* Home routers also incorporate many other features and functionality into them.

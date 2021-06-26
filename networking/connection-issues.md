---
layout: guide
title: Speed and Connection Issues
datafile: networking
---
When using networks, particularly across the internet, there are many issues that can affect the speed and quality of connections. Among the main issues are high latency, high packet loss, and other similar troubles.

Let's go over each of the main issues people run into, and explain them in some more detail.


## High Latency

Sometimes, specific links are slow. Whether it goes over a satellite connection, it uses a particularly long section of fibre, or it goes over an undersea cable with tens or hundreds of repeaters in the middle, certain connections and links between routers are slow. If, in the middle of your connection to another machine, you go over one of these very slow links, your connection can seem to slow to a crawl.

This issue is called having _high latency_, and results in a connection that looks slower than usual.

![Latency](img/connection-issues/latency.svg "Latency")


## Packet Loss

Similarly, certain connections can be low-quality. Perhaps the cable connecting the two sides together isn't entirely plugged in, or has been bent one too many times, and now 10% of the packets that go through it end up corrupted (and similarly, end up getting dropped). Sometimes that connection is simply overtaxed and can't transmit all the data being pushed to it -- and coincidentally drops the incoming packets instead.

This issue is called _packet loss_, and results in a connection that looks slow and in some cases simply can't connect at all.

![Bad Link](img/connection-issues/packet-loss.svg "Bad Link")


## Bad Routing

Routers on the internet use BGP as their primary routing protocol. While routing staff make manual corrections, the only method BGP uses to decide routes is hop counts. Often, what looks like the shortest path actually isn't the shortest, or what is the **shortest** path isn't the **fastest**, which results in bad routes being selected.

For instance, when I connect to the Philippines from Australia (the country directly above us), usually my connection uses the fast route of undersea cable directly to them. However, sometimes my connection bounces through Sydney, the U.S., the U.K., India, and then finally gets to the Philippines. And at the same time, someone in the Philippines who talks to me has a connection that goes from the Philippines directly to Australia via undersea cable. Sometimes the routing is only bad in one connection, and fine in the other.


### Routing Loops

This is a specific issue that occurs when the routing algorithm is simply confused or setup incorrectly. Router A will think "Where should I send this packet? Router B!", and send it off. Router B will ask "Where should I send it? Router C!", and Router C will think the best place for it is Router A.

The result of this issue is generally just packets getting dropped and delivery issues. This issue doesn't happen too often, and routing protocols try to correct for this, but when it does happen it can prove fairly irritating.

![Routing Loop](img/connection-issues/routing-loop.svg "Routing Loop")


### Bad TTL

The TTL controls how many hops a packet can go over before it's dropped. Usually, the default maximum of 64 hops is enough -- however, there are some very weird networks out there with very strange routing. Occasionally either the default maximum isn't enough to reach specific areas, or for some reason a device is using a value below the default.

The good thing here is that the fix is simply manually increasing the TTL that your device uses on outgoing packets. It's generally configurable somewhere, if you look hard enough.

![Bad TTL](img/connection-issues/bad-ttl.svg "Bad TTL")


## Bad MTU

Each link has something called an MTU -- a Maximum Transmission Unit, or in other words the maximum length of a packet that can go over that link. For instance, you don't want to send a six-gigabyte packet through anything, as it would cause the link to be taken up for hours sending just a single packet. This is an extreme example, but conveys the principle.

Generally the maximum length of a single packet is 1500 bytes (and this is the MTU of most consumer routers). If a packet is longer than the MTU of the link, the router will actually split the packet into separate chunks, each one the size of the MTU, before sending it over the link (that is, the router will _fragment_ the packet). How these fragments are reassembled depends on the protocol in use (UDP vs TCP), but this reassembly is done at the destination.

Most links have reasonable MTUs that reduce fragmentation. However, some links are either configured incorrectly or run into issues while fragmenting packets. Generally, the two issues around bad MTU settings are:

* Packets getting unnecessarily fragmented.
* Packets getting fragmented incorrectly (and subsequently, becoming corrupted).

As well, certain protocols in use on the wire (such as PPPoE which is used for ADSL connections) wrap packets in its' own information. This means that even if a device has an MTU of 1500 bytes, but there's 30 bytes of overhead being added to each packet, that the actual amount of data that can be sent per packet turns out to be 1470.

Bad MTU issues are luckily quite solvable in manu cases. Generally your router will have a way (in some deep, dark, advanced configuration page) to modify the MTU that it uses. Adjusting it up or down to best match your ISP's preferred setting and the Internet at large can prove very helpful.


## Fixes

How likely you are to be able to fix these issues depends on where they're occuring. If your ISP's router is having packet loss, you can ring your ISP and talk to them about it. If some server off in the core of the internet is having issues... good luck. If it's very close to the end of the path (very close to the site you're communicating with), talking with that site's network engineers can be very helpful.

Sometimes the issue is resolved by manually selecting another hop, mitigating a DDoS that's putting high load on devices, or fixing a cable. However, often you're not in a position to fix these troubles yourself, and have to hope that either your ISP or the target site's networking people are close enough to the source to fix it.

There are issues such as bad MTUs or TTLs, where you can in most cases simply fix the issue on your side. Even when specific links are bad, occasionally you can also select different routes to resolve the issue.


## Overview

The main issues affecting network connections include:

* High latency.
* Packet loss.
* Bad routing.
* Bad MTU.

Sometimes these issues are fixable by the groups on either end of the connection -- either your ISP or the destination. However, sometimes they happen in the middle of the internet somewhere, meaning that unless you're able to contact that routing team in India there isn't much you can do.

Generally, the ones you can fix are:

* Bad TTLs.
* Bad MTU.

As well, using something like a VPN or adjusting the specific destination host, you can change which routers your traffic flows through and bypass specific routers/links that are having trouble.

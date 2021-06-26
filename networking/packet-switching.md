---
layout: guide
title: Packet Switching and History
datafile: networking
---
History is very useful when it comes to the internet and understanding how it works. In this, we go over packet switching and some other general history of the Internet.


## Packet Switching

Packet switching is one of the fundamental ideas behind the internet. The advent of packet switching guided how the internet was designed and changed how communication networks have been built ever since.

To fully understand IP and the internet, you should understand packet switching (at least at a high level).

First off, we'll go over two of the precursor technologies to packet switching – leased lines and circuit switching – and then go into packet switching.


### Direct Circuits

Phone lines used to work by directly connecting metal wires together. If you wanted to make a call from phone A to phone B, you had to have a direct copper line connecting those two. This is also how things like the [Telegraph system](https://en.wikipedia.org/wiki/Electrical_telegraph) worked.

There isn't a proper name for this layout, but I call it a direct-circuit network. An example layout for a network like this is shown below.

![Direct Circuits](img/packet-switching/direct-circuit.svg "Direct Circuits")

In this layout, phone A can call phone C, but phone A can't call phone E (since they don't have a direct connection).


### Circuit Switching

With the advent of telephones, this became an extremely expensive and unwieldy layout to use. So, a new sort of layout for connecting telephones was devised.

Instead of having a dedicated copper line between phones, why not have a dedicated copper line between each phone and a single building. Inside that building, each phone line can come out at a plug, and then you can plug shorter copper wires between the plugs as appropriate in order to create a dedicated copper connection between those two phones.

This sort of a system is known as [circuit switching](https://en.wikipedia.org/wiki/Circuit_switching), and was how the telephone system worked for a long while (and still does, in many areas). Originally there were human _operators_ connecting those plugs together, but these days there are electronic systems that swap and switch the lines as appropriate.

An example layout for this system is shown below.

![Circuit Switching](img/packet-switching/circuit-switching.svg "Circuit Switching")

In this layout, in order for phone A to call phone G, a cable must be connected on the switchboard inside the hub. After that cable is connected, phones A and G have a direct circuit to each other.


### Packet Switching

The primary advantage of the leased-line and circuit-switching systems is that there is a 100% dedicated connection between those two endpoints. You will always be able to transmit data (or voice) between those two systems.

When the designers of the internet were thinking about how computers should communicate, they came across one thought: Does there really need to be a direct line between the two computers that need to communicate? For most purposes, the answer to this question is no. What really needs to go between the two machines is just the data.

What you can do is split up the internet traffic into a series of discrete 'packets'. On each packet, you have the computer that it's coming from and the computer that it should go to. Each of those packets can then be sent to the destination computer without a direct link between the two machines.

Here's a simple example of a packet-switched network, and how communication works with a packet-switched system.

![Packet Switching](img/packet-switching/packet-switching.svg "Packet Switching")

In this example, computer B is communicating with computers D, H, and F. The central hub receives each piece of data separately, checks to see who it's for, and then sends it to the right computer.

Some of the upsides of packet switching are that it vastly simplifies communication between lots of hosts. In addition, anyone can talk to anyone else at any time – where circuit switching requires you to disconnect the old connection to create a new one, with packet switching everything flows through a single connection to the end machine.


---


## RFCs and the IETF

While creating the internet, the designers would send each other design notes, proposals, and specifications. They called these series of documents 'requests for comment', basically asking the other designers to give them feedback on their proposals.

The practice of creating these documents has continued to this day, and are now called RFCs. Many details about the internet's design and operation is detailed in RFCs, and they are generally considered the reference material detailing how various aspects of the internet work.

RFCs can contain protocol information, experimental ideas, discussion pieces or anything else which is deemed useful to people creating network-based technology. If you really want to dig deep into how a protocol or a part of the internet works, the RFCs are the core documentation used by the people who design and write it.

Honestly, you don't need to read RFCs or other standards – for everyday use they usually go too in-depth to be useful. However, they can be very useful if you want to take a deeper dive into a specific topic and find out exactly how it works.

Here are a few examples of RFCs if you're interested in them:

* [RFC 862](https://tools.ietf.org/html/rfc862): Echo Protocol
* [RFC 1413](https://tools.ietf.org/html/rfc1413): Identification Protocol
* [RFC 1796](https://tools.ietf.org/html/rfc1796): Not All RFCs are Standards
* [RFC 2026](https://tools.ietf.org/html/rfc2026): The Internet Standards Process -- Revision 3
* [RFC 3439](https://tools.ietf.org/html/rfc3439): Some Internet Architectural Guidelines and Philosophy

The IETF (or the Internet Engineering Taskforce) is the group that manages the creation of new RFCs, and plays a large part in the creation of new internet technologies.


---


## Overview

### Packet Switching

* Any-to-any communications without direct links.
* Multiple communications are able to go over a single line.
* Much cheaper than leased lines or circuit switching.
* Packets are routed from hop-to-hop independently of each other.

### RFCs

* Can contain protocol information, ideas, or discussion pieces.
* Contain the standards that make up the majority of the internet.
* Useful for a deeper dive into specific topics.

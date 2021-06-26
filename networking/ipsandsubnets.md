---
layout: guide
title: IPs and Subnets
datafile: networking
---
What is a network? A network, in our terms, is a set of computers and other devices, connected via ethernet (internet cables) or wifi, with a consistent set of addresses.

What is a consistent set of addresses, and what really is a network? Let's go over those, and then we can talk about routing.


## IP Addresses

An IP address represents a specific host (device) on a specific network. There are two parts of an IP address – the part which represents the specific network, and the part which represents the specific host. Respectively, these are called the network portion and the host portion.

Let's take a look at some example IP addresses and how they are organised.

---

At home, you probably have a modem which gives you internet access. If you do, you may have seen addresses like this in the past (primarily when configuring your modem):

    192.168.0.x
    192.168.1.x
    10.0.0.x

Where `'x'` is 1-255.

Each of these is a separate network. The `192.168.0.x` network contains the addresses `192.168.0.1` to `192.168.0.254`, and the `192.168.1.x` network contains the addresses `192.168.1.1` to `192.168.1.254`.

There are two parts that make up a network – the address and the subnet mask. Let's go through 


### Subnet Masks

A subnet mask is essentially something that goes over the IP address, to show which parts of it refer to the network, and which parts of it refer to one specific device (or _host_) on the network.

Let's take a look at a simplified example. Let's have an IP address of `5.23.152.22`, and a matching subnet mask of `255.255.255.0`. Here they are, both in decimal and in binary:

    == Decimal ==
     IP address:   5. 23.152. 22
    Subnet mask: 255.255.255.000

    == Binary ==
     IP address: 00000101 00010111 10011000 00010110
    Subnet mask: 11111111 11111111 11111111 00000000

Let's look at the binary information for now.

Where there's a `1` in the binary subnet mask, this means that the above digit in the IP address is part of the network portion of the address. Similarly, where there's a `0` in the binary subnet mask, the digit above is part of the address of the host.

Similarly, the `1`'s in a subnet mask can be called the _network bits_, and the `0`'s in the mask can be called _host bits_. In subnet masks, the network bits always come first and are followed by the host bits.

The more network bits there are in the subnet mask, the more separate networks can be represented, and there are fewer individual addresses in each of those networks. For instance, for an IP / subnet like this one, there are three bits for addresses information:

    == Decimal ==
     IP address:   5. 23.152. 22
    Subnet mask: 255.255.255.248

    == Binary ==
     IP address: 00000101 00010111 10011000 00010110
    Subnet mask: 11111111 11111111 11111111 11111000

There are three host bits on this subnet mask. This means that in this network, there are eight individual IP addresses available (since three binary digits can represent eight separate values).


### Network Addresses

Let's go back to that first example and work out exactly what it means. 

    == Decimal ==
     IP address:   5. 23.152. 22
    Subnet mask: 255.255.255.000

    == Binary ==
     IP address: 00000101 00010111 10011000 00010110
    Subnet mask: 11111111 11111111 11111111 00000000

There are eight bits available for host information. This means that there are 256 possible addresses (i.e. from `00000000` to `11111111`, or 0 to 255).

However, the first and last address in every network is treated as a special address. In this example those are `5.23.152.0` and `5.23.152.255`. Let's go through what those mean:

1. The first available address represents what's called the _network address_. This is a special address that represents the IP network as a whole, and is not available for actual clients to use.

2. The last address in a network represents what's called the _broadcast address_. This address is special in that every packet sent to this address is sent to everyone on the network (i.e. that packet is _broadcasted_). As such, this address isn't available for actual clients to use. 

Taking out those two special addresses, that means there are 254 addresses that can actually be used on this network, from `5.23.152.1` to `5.23.152.254`.

Putting together all this information we've calculated, we can get this information from that initial IP and subnet mask:

    IP address: 5.23.152.22
    Subnet mask: 255.255.255.000

    Network address: 5.23.152.0
    Broadcast address: 5.23.152.255

    IP address range: 5.23.152.1-254

This means that if I was on this network, I could have the IP address `5.23.152.13`, `5.23.152.67`, `5.23.152.138`. Anything within the IP address range. And my computer, once connected, would use both the network address and broadcast address during regular, automatic communications with your router and the rest of the network.


### Complex Address Splits

Sometimes,the subnet mask doesn't stop neatly on one of the 8-bit breaks. Sometimes there are only 22 network bits, or as in our first example there may be 29 network bits. The main thing to understand is that the IP address doesn't really represent four separate numbers -- it's simply an easy way to represent that whole series of bits.

For instance, on a network with 18 network bits, the network address can be `192.168.0.0` with the broadcast address `192.168.63.255`. And in this network, all the addresses in the middle (including addresses like `192.168.16.0` and `192.168.16.255`) are free for clients to use. In other words, don't assume that just because an address ends in '0' or '255' that it's a network or broadcast address.

Especially as you start getting into more complex setups, these sort of not-entirely-aligned splits become common. An easy way to check for this is to see whether any values in the subnet mask are not `0` or `255`.

<div class="advanced">
	<p><strong>CIDR</strong></p>
    <p>The only real information that a subnet mask conveys are how many network bits there are. The subnet mask <tt>255.0.0.0</tt> conveys 8 network bits, <tt>255.255.255.0</tt> conveys 24 network bits, and so on.</p>
    <p>Because this is the only info the mask conveys, there is a more compact way to specify it. Particularly as you get further into networking, this notation is fairly commonly-used.</p>
    <p>To use CIDR notation, at the end of a network address simply put a forward slash and the number of network bits that exist. For instance:</p>
    <p><tt>192.168.0.0/24</tt></p>
    <p>This example means that there are 24 network bits, or that it has the subnet mask <tt>255.255.255.0</tt>.</p>
    <p>This is just an alternate to specifying the IP address and subnet mask (and is the only method of specifying this info for IPv6 addresses).</p>
    <p>Also, you may sometimes hear people talking about "slash 8" or "slash 24" networks -- those are simply referring to the length of the subnet mask in CIDR notation.</p>
</div>


## Overview

The two main properties of a network are the network address and the subnet mask. That is, any IP address in that network and the number of network bits. From those details we can get the broadcast address, allowed IP range, and start communicating on the network.

Below's a quick overview of the information we've gone over here.

* The first and last IP addresses in a network are reserved for the network address and the broadcast address.
* The network address is a way to refer to the network as a whole.
* The broadcast address is used when sending information to every device on that network.
* Subnet masks tell you how much of the address is for network information, and how much is for hosts.
* The two segments of an IP address are the _network bits_ and the _host bits_.
* CIDR is an alternative notation to using subnet masks, and is what IPv6 uses by default.

---
layout: guide
title: DNS
display: DNS and Domain Names
datafile: networking
---
What is DNS, and how does it work? DNS stands for the **Domain Name System**, and is how your computer converts hostname (such as `example.com`) into IP addresses (such as `128.46.5.1`).


## Names vs Numbers

Every piece of data that travels through the Internet uses IP addresses. Every machine on the Internet has an IP address, and data is sent between two IP addresses.

However, IP addresses are long and difficult to remember. Here are examples of several IPv4 and IPv6 addresses:

    192.168.23.39
    192.0.2.46
    198.51.100.67
    203.0.113.128

    2001:db8::d7:46e:94a
    fd1e:c93c:4044::94d:e453:2034

These numbers are extremely hard to remember. As well, if the IP address changes, you need to give everyone the new address.

Name are much easier to remember and recognise. A name like `google.com` is easier to remember than `198.51.100.67`.

In addition, even if the IP address changes, the name can stay the same (and it will just point towards the new IP address). This is why names have stuck around as the primary way to access websites, point to IP space, and access other machines – because of their flexibility and simplicity.


## Service Info

DNS uses port 53, and is sent over [UDP](udptcp).

A standard DNS lookup consists of two portions:

1. Request - a domain name is sent from the client to the DNS server.
2. Response - a DNS response is sent from the server back to the client (typically containing the IP address associated with that name).

<div class="advanced">
	<p><strong>DNS Records</strong></p>
    <p>For each domain name, there are a number of 'DNS Records' for it. These records can hold many details, including:</p>
    <p>
        <ul>
            <li>IP addresses.</li>
            <li>How to send emails to that domain.</li>
            <li>Authentication details.</li>
        </ul>
    </p>
    <p>There are a number of DNS records types, but the most-used ones are <tt>A</tt> and <tt>AAAA</tt> records – holding IPv4 and IPv6 addresses, respectively.</p>
    <p>In addition, each record also has a separate expiry time (time when DNS servers in the middle should throw the record away and get a new value directly from the source).</p>
</div>


## DNS Servers

How do computers get IP addresses from names using DNS? Computers send the name they have to a DNS server, and the DNS server sends back a matching IP address.

How exactly DNS works goes fairly in-depth (more than most need to know), but essentially:

* Some home modem/routers act as a DNS server.
* Your ISP also usually provides you with a DNS server you can use.
* There are public DNS servers available for anyone to access, like [Google's DNS servers](https://developers.google.com/speed/public-dns) or [`1.1.1.1`](https://1.1.1.1/dns/).
* Some companies have their own DNS server inside the company. This is so that they can direct a custom name like `internal-resources.example.com` to an internal IP address.

There are a number of DNS servers which are called the "root DNS servers". These servers know every name on the internet – or at least how to get the IP address (records) for that name.

If your DNS server doesn't know a name, it asks the root DNS servers and then gives you the answer it gets from the root DNS servers (and stores the answer for a while, so if you ask for that name again it can answer you straight away).

However, the DNS server in your home modem/router usually talks to another public DNS server such as your ISP's DNS servers (and your ISP's DNS servers talk to the root DNS servers).

<div class="advanced">
	<p><strong>Name Servers</strong></p>
    <p>Technically, what happens is that the root servers hold the IP addresses of each domain's 'name servers'.</p>
    <p>A name server is essentially <emph>the</emph> authoritative DNS server for a domain. The name server always holds the absolute latest up-to-date information on a domain.</p>
    <p>Some DNS servers return the IP of the name server and let the client chase up the result with that server, and most DNS servers go chase it up themselves. It's not really important which one happens, they result in the same end result of the client getting the latest info for that domain.</p>
</div>


### Security and Monitoring

Having access to someone's DNS lookups gives you a lot of power. If you can see someone's DNS traffic, you can see when they lookup (and presumably try to access) websites.

Here's an example DNS log:

```
2016-10-20 08:04:24 - IP 192.168.23.648 looked up dealing-with-xyz-problem.medicalsite.com
2016-10-20 08:04:24 - IP 203.0.113.128 looked up plshelpmewith.somegame.org
2016-10-20 08:04:24 - IP 192.168.23.12 looked up badsite.info
```

ISPs can keep a close eye on what their customers lookup, and can store this information to give it to whoever asks.


## Overview

* IP addresses are difficult to remember.
* Names are much easier to remember.
* DNS works on port 53, and usually over UDP.
* `A` and `AAAA` records store IPv4 and IPv6 addresses, respectively (advanced).
* Your DNS server talks to its upstream DNS servers, until it gets to the root DNS servers to get an answer.
* Seeing someone's DNS traffic can give you lots of information about them.

---
layout: guide
title: Secure Connections
datafile: networking
---
Secure connections are commonly used when talking about computer security. Here, we go through what a secure connection is, how it works, and the attacks that a properly secured connection prevents.

Generally, secure connections should be:

- **Authenticated**: Both machines should be sure that they're talking to the right person.
- **Confidential**: The only machines that can read the data should be the machines at either end.
- **Unmodified**: The data should not be able to be modified or replaced in the middle of the connection (also called 'data integrity').

Let's go over each of these properties, and why each is necessary for establishing secure communications.

<div class="note">
	<p><strong>Alice, Bob and Eve</strong></p>
    <p>In the following examples, I'm going to be using three names: Alice, Bob, and Eve.</p>
    <p>In security, the names "Alice" and "Bob" represent two people communicating. The names "Eve" and "Mallory" are typically used to represent bad actors, trying to compromise the security of Alice and/or Bob in some way.</p>
</div>

## Authentication

Both machines need to be sure of who they're talking to. For instance:

![Authenticated Session](img/secure-connections/authenticated.svg "Authenticated Session")

If the identity of each end is not authenticated, someone can sit in the middle and pretend to be either end:

![Unauthenticated Session](img/secure-connections/unauthenticated.svg "Unauthenticated Session")

In this scenario, Alice thinks that she's talking to Bob, and Bob thinks that he's talking to Alice. Eve can see (and modify) everything that Alice and Bob are sending between each other.

## Confidentiality

Both machines need to make sure that nobody else can read the information being sent between them. To do this, the information is _encrypted_ in some way before being sent, and then _decrypted_ (or _unencrypted_) at the remote end before being read.

Here's an example of an encrypted, confidential link:

![Encrypted Link](img/secure-connections/encrypted.svg "Encrypted Link")

Because the link is encrypted, Eve cannot read any of the data Alice and Bob are sending to each other.

In this example, the data is not encrypted, and in turn isn't confidential:

![Unencrypted Link](img/secure-connections/unencrypted.svg "Unencrypted Link")

Since the data isn't protected in any way, Eve can see everything being sent over the link.

## Integrity

The data needs to be unmodifiable. That is, if it's modified in transit, each end must know that it's been modified and be able to throw out the data as necessary.

Here's an example of Eve changing the recipient of a money transfer and it (correctly) being detected:

![Verified Message](img/secure-connections/verified.svg "Verified Message")

Eve replaces Bob's account with herself in the money transfer, to try to get the money transferred to her own account instead of Bob's. However, the verification code no longer matches and the bank is able to detect the tampering.

In this example, the bank is not able to detect message tampering:

![Tampered Message](img/secure-connections/tampered.svg "Tampered Message")

Because there is no verification that the message was sent correctly, unmodified, Eve is able to trick the bank into sending money to her own account.

## Overview

A communication channel can be secure if it has:

- **Authentication**: Both sides can be sure of who they're talking to.
- **Confidentiality**: Nobody can spy and discover what's being said in the middle.
- **Integrity**: Nobody can replace, replay, or tamper with messages in the middle.

If any of these properties are missing, it's generally not a secured connection.

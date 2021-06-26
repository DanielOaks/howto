---
layout: guide
title: Binary and Number Systems
datafile: networking
---
Having a good idea of how binary works is the first step to understanding how IP addresses really operate.

Here, we'll go over some core concepts of binary, how it compares to our usual numbering system (decimal), and some easy ways to understand how it works.

First off, let's go over how decimal works deep-down.


## Decimal

In our regular counting system, decimal, we use the digits `0-9` to represent the numbers zero to nine.


### Counting

Let's use this three-digit counter as an example. On the right, we'll state the actual _value_ that's represented by the digits on the left.

    000     - zero

To count up, we increment (go up by one each time) from `0` to `1`, `1` to `2`, etc. Let's count up to nine:

    000     - zero
    001     - one
    002     - two
    003     - three
    004     - four
    005     - five
    006     - six
    007     - seven
    008     - eight
    009     - nine

However, there are no digits after `9`. To continue counting up to ten, we need to increment the next column and reset the rightmost one.

Let's count up from 9:

    009     - nine
    010     - ten

So we changed the middle digit from `0` to `1`, and reset the right digit from `9` back to `0`.

To continue counting up from ten, we do exactly the same with the rightmost number:

    010     - ten
    011     - eleven
    012     - twelve
    013     - thirteen
    014     - fourteen
    015     - fifteen
    016     - sixteen
    017     - seventeen
    018     - eighteen
    019     - nineteen

And to count up to twenty, we do the same:

    019     - nineteen
    020     - twenty

This is how decimal works, and specifically how counting works in decimal

Decimal can also be called "base 10" because it uses ten digits to represent values (`0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, and `9`).


## Binary

Binary is similar to decimal, except that it uses a base-2 system (just the digits `0` and `1`).

Let's keep the same three-digit counter, starting from zero:

    000     - zero

Counting up to one is simple:

    000     - zero
    001     - one

However, going up to two requires us to increment the next digit and reset the rightmost one. In other words, because there aren't any digits after `1`, we need to go to the next column.

    001     - one
    010     - two

Let's count up as far as we can:

    010     - two
    011     - three
    100     - four
    101     - five
    110     - six
    111     - seven

Computers use binary because it meshes well with how they work deep down. Computers are based on electrical signals, and those signals can either be high (`1`), or low (`0`). Because of this, using a number system with only two values for each column makes sense.


### Bits and Bytes

Sometimes when using binary, you'll see the term "bits". Bit simply stands for binary digit, and it used as a shorthand when talking about computers in particular. Up until now, our counter has used three bits, and four/eight bits are typical sizes used a lot when working with computers.

Collections of different numbers of bits can also have names. For instance, eight bits are called a byte, and four bits are called a nibble. As an example:

    bit    =  0
    nibble =  0000
    byte   =  0000 0000

When working with binary, bytes are sometimes written as groups of four bits. This just makes it easier to read, and easy to convert to other number systems (as you'll see later).


## Base 10 vs Base 2

With base 10 (decimal), if we count all the way up, 3 digits lets us represent these values:

    *** decimal ***
    000     - zero
    ...
    999     - nine-hundred and ninety-nine

Or in other words, one thousand separate values.

---

With base 2 (binary), if we do the same we can represent these values:

    *** binary ***
    000     - zero
    ...
    111     - seven

Or, eight separate values.

---

In a single column, you can represent the base number of digits that number system has (two for binary, ten for decimal). With each new column, the number of values you can represent is simply multiplied by the base. For example:

    *** decimal ***
    9     one digit, ten values
    99    two digits, one hundred values
    999   three digits, one thousand values

    *** binary ***
    1     one digit, two values
    11    two digits, four values
    111   three digits, eight values

This is useful to keep in mind when working with binary, particularly when working out network addresses.


## Converting 

To get the value from a binary number, you can count up how large each column is based on whether it's a `0` or a `1`.

As an example, let's get the value from the binary number `1011`. The top line shows the value each column represents.

    1011 = 1 0 1 1 (split into columns)

    values:  8 | 4 | 2 | 1
    binary:  1 | 0 | 1 | 1

             8 + 0 + 2 + 1  =  eleven

So the binary number `1011` represents eleven, or:

    1011 in base 2  =  11 in base 10

Being able to convert binary numbers to real values is very useful, and in the next section we'll be going over IP addresses and subnets.

Try going through some of these examples on a piece of paper, to see whether you're able to convert them to the proper values. Once you've finished, try cross-checking your answers with an online converter or Google:

    1001 = ?      00101101 = ?      11111100 = ?      00010000 = ?
    0110 = ?      11011101 = ?      00011111 = ?      00110001 = ?


## Base 16

There is also a similar number system that's often used in computing -- "base 16", or hexidecimal. It uses these 16 digits:

    0 1 2 3 4 5 6 7 8 9 A B C D E F

The useful thing with base 16 is that each column can represent 16 separate values. Similarly, four columns of binary can also represent 16 separate values. Because of this, hexidecimal can easily -- and very compactly -- represent binary digits.

Here's a chart of values represented in Binary, Hex, and Decimal, which can be useful when converting between them:

![Binary Chart](img/binary/values-chart.svg "Binary Chart")


## Overall

* Decimal uses ten digits (`0-9`) in each column to represent values, and because of this it's called "base 10".
* Binary uses two digits (`0,1`) in each column to represent values, and it's called "base 2".
* Hexidecimal uses sixteen digits (`0-9,A-F`) in each column to represent values, and it's called "base 16".
* Counting, based on columns, work the same way in decimal as it does in binary (as it also does in hexidecimal).

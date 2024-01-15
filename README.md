# Luxonis task

## Prolog

The people we are looking for should always strive to understand why things work, why
things happen. They must posses (or strive to acquire) essential knowledge about the technologies they work with. When
that 's the case - its visible in the work they do.

## Test task

Using a language of choice from the following:  - Rust -
Typescript - Python - C/C++ Without using external libraries (unless necessary), write two applications. These
applications will be a client and a server app. They will communicate over a TCP socket and the exact protocol on
top of that is up to you. Note: using just utf8 strings will have a negative impact on the judgement (hint - custom
binary protocol is expected). The game flow is as follows:  . Optional/bonus: offer a website that displays the progress
of all the matches, for a third
party to observe. JUDGEMENT:  The following things play role for passing to the interview
stage:  - Understanding of both the technologies used and the language chosen. - Complexity of the chosen solution. -
Efficiency of the custom communication protocol. - Instructions to run the test task provided -> we will evaluate it on
freshly installed Ubuntu 22.04.

## Client specifics

Client specifics: Must be able to connect to either Unix socket or a TCP port. RUNTIME:  Both the
client and the server must run on Linux, specifically Ubuntu 22.04, without any containers or virtualization. It will be
tested on x86 64bit architecture system.

## Server specifics

Server specifics: Must offer both Unix socket and a TCP
port for client connection

## Communication

Upon connection - the server must send a message to the client - initiating the
communication. Client upon receiving it - answers to the server with a password. This initial exchange then ends with
server either disconnecting the client (wrong password) or assigning the client an ID and sending the ID back to the
client. At this moment, the server answers to any requests the client sends to the server. For unknown requests, the
server must respond as well, such that client can identify it as an error. The main function of the server at this
moment - is to facilitate game of **"Guess a word"** between two clients.

## Game flow

1. Client A requests a list of possible opponents (IDs)
2. Server responds with a list of possible opponents (IDs)
3. Client A requests a match with opponent (ID), specifying a word to guess
4. Server either confirms this or rejects with an error
   code
5. The target client - client B - is informed of the match, and can begin guesses
6. Client A is informed of the
   progress of Client B (attempts)
7. Client A can write an arbitrary text (a hint) that is sent to and displayed by ClientB
8. Match ends when Client B guesses the word, or gives up

## Protocol design

I've decided to use simple binary protocol for transferring messages between client and server applications.

My protocol takes transferred message and splits it into two parts -

- messageType - Type of transferred message. Number between 0 and 15 => 1-4 bits are used.
- messageContent - Content of given message. Content is separated from message type by a single space. Either string,
  number or boolean value can be sent. Can also be empty. Multiple values can be transferred. Parts of message content
  are divided by a single space.

Idea behind this protocol came from observation that almost all messages have very simple structure only containing one
data element. Message type also has to be provided for appropriate message routing. Messages can be decoded by splitting
encoded message by spaces and parsing each part as expected type (see [message-utils.ts](app/utils/message-utils.ts)).

### Example - List of opponents

Message type has value of 4 (see [MessageTypeEnum](app/model/message-types.ts)).
Message content is a list of numbers (IDs) separated by spaces.

    100 11001 10011100 1001110

    messageType === 4
    messageContent === [25, 156, 78]

### Idea for improvement

This protocol heavily relies on possibility of using spaces as separator for different parts of message.
If using spaces as separators isn't possible protocol would have to change a bit. Instead of using only necessary amount
of bits set bit count would have to be used for every message part e.g. 4 bits for type, 10 bits for number (since only
transferred numbers are IDs which are from range <0, 1000>) and 32 bits for every string character (since UTF-8
characters can be 4 bytes). This way messages can be decoded by reading fixed number of bits for each primitive type and
spaces would not be needed as separators. Using this approach would however significantly increase average message size,
since a lot of values would have to be padded in order to achieve expected lengths. That's why I decided to go with
spaces as separators in first place.

## How to run

This project has minimal dependencies. It only depends on `TypeScript` & `@types/node`. `tsx` is also used as a simple
ways of running both applications locally. In order to use this application do following steps

1. `npm install` - install dependencies
2. `npm run run-server` - Run server application. Server application requires no interactions and simply runs.
3. `npm run run-client` - Run client application. Use `help` command to get instructions on how to use client app.

